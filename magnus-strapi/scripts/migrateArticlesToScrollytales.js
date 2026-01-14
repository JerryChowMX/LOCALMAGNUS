#!/usr/bin/env node
/**
 * Migration script: Articles -> Scrollytales
 * Usage:
 *  STRAPI_URL=http://localhost:1337 ADMIN_API_TOKEN=xxxxx SLUGS=slug1,slug2 node migrateArticlesToScrollytales.js
 *  or to migrate all published articles matching a tag/category, omit SLUGS and set FILTER query string in `extraQuery` below.
 */
const axios = require('axios');

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const ADMIN_API_TOKEN = process.env.ADMIN_API_TOKEN;
const SLUGS = process.env.SLUGS ? process.env.SLUGS.split(',').map(s => s.trim()) : null;

if (!ADMIN_API_TOKEN) {
  console.error('Error: set ADMIN_API_TOKEN environment variable with a full-access API token.');
  process.exit(1);
}

const client = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    Authorization: `Bearer ${ADMIN_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

async function fetchArticles() {
  // Build populate and filters
  const populate = ['hero_image', 'content_blocks', 'author', 'category', 'tags']
    .map(p => `populate[]=${p}`)
    .join('&');

  let filter = 'filters[state][$eq]=published';
  if (SLUGS && SLUGS.length > 0) {
    const inList = SLUGS.map(s => encodeURIComponent(s)).join(',');
    filter += `&filters[slug][$in]=${inList}`;
  }

  const url = `/api/articles?${filter}&${populate}&pagination[page]=1&pagination[pageSize]=100`;

  const res = await client.get(url);
  return res.data.data || [];
}

function buildSectionsFromArticle(article) {
  const blocks = article.attributes.content_blocks || [];
  const sections = [];

  // Try to create sections from rich-text blocks, pairing with any image block or hero image
  for (const block of blocks) {
    const comp = block.__component;
    if (comp === 'content.rich-text') {
      // find a nearby image block
      const idx = blocks.indexOf(block);
      let mediaId = null;
      let mediaAlt = 'Image';
      // prefer next single-image block
      for (let i = idx + 1; i < Math.min(blocks.length, idx + 4); i++) {
        if (blocks[i].__component === 'content.single-image' && blocks[i].image) {
          mediaId = blocks[i].image.data?.id || null;
          mediaAlt = blocks[i].caption || mediaAlt;
          break;
        }
      }

      // fallback to hero image
      if (!mediaId && article.attributes.hero_image && article.attributes.hero_image.data) {
        mediaId = article.attributes.hero_image.data.id;
        mediaAlt = article.attributes.hero_image_caption || mediaAlt;
      }

      if (mediaId) {
        sections.push({
          __component: 'scrollytale.section',
          title: null,
          subtitle: null,
          content: block.content || '<p></p>',
          media: mediaId,
          mediaAlt,
          mediaPosition: 'full',
          useDarkOverlay: false,
          minHeight: 'auto',
        });
      }
    }
  }

  // Ensure at least 3 sections (schema requires min 3)
  if (sections.length === 0) {
    // try to create 3 identical sections using hero image and excerpt
    if (article.attributes.hero_image && article.attributes.hero_image.data) {
      const mediaId = article.attributes.hero_image.data.id;
      const mediaAlt = article.attributes.hero_image_caption || 'Image';
      const content = article.attributes.excerpt || `<p>${article.attributes.title}</p>`;
      for (let i = 0; i < 3; i++) {
        sections.push({
          __component: 'scrollytale.section',
          title: null,
          subtitle: null,
          content,
          media: mediaId,
          mediaAlt,
          mediaPosition: 'full',
          useDarkOverlay: false,
          minHeight: 'auto',
        });
      }
    }
  }

  // If we have 1-2 sections, duplicate last to reach 3
  while (sections.length > 0 && sections.length < 3) {
    sections.push({ ...sections[sections.length - 1] });
  }

  return sections;
}

async function migrate() {
  const articles = await fetchArticles();
  if (!articles.length) {
    console.log('No articles found for migration.');
    return;
  }

  for (const art of articles) {
    const attrs = art.attributes;
    console.log(`Migrating article ${attrs.slug} (${attrs.title})`);

    const sections = buildSectionsFromArticle(art);
    if (!sections || sections.length < 3) {
      console.warn(`Skipping ${attrs.slug}: not enough media/content to build >=3 sections.`);
      continue;
    }

    const payload = {
      data: {
        title: attrs.title,
        slug: attrs.slug,
        excerpt: attrs.excerpt || (attrs.content_blocks && attrs.content_blocks[0]?.content) || '',
        featuredImage: attrs.hero_image && attrs.hero_image.data ? attrs.hero_image.data.id : null,
        author: attrs.author && attrs.author.data ? attrs.author.data.id : null,
        categories: attrs.category && attrs.category.data ? [attrs.category.data.id] : [],
        tags: (attrs.tags && attrs.tags.data) ? attrs.tags.data.map(t => t.id) : [],
        sections: sections,
        isFeatureFlagged: true,
        layout: 'constrained',
        theme: 'auto',
        publishedAt: attrs.publishedAt || new Date().toISOString(),
      },
    };

    // Clean nulls for relations - Strapi prefers empty arrays or omitted keys
    if (!payload.data.featuredImage) delete payload.data.featuredImage;
    if (!payload.data.author) delete payload.data.author;
    if (!payload.data.categories || payload.data.categories.length === 0) delete payload.data.categories;
    if (!payload.data.tags || payload.data.tags.length === 0) delete payload.data.tags;

    try {
      const res = await client.post('/api/scrollytales', payload);
      console.log(`Created scrollytale: ${res.data.data.attributes.slug}`);
    } catch (err) {
      console.error('Failed to create scrollytale for', attrs.slug, err.response ? err.response.data : err.message);
    }
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
