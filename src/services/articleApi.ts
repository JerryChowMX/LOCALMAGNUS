import { strapiClient } from "../api/strapiClient";
import type { StrapiArticleAttributes, StrapiCollectionResponse, StrapiData, StrapiArticle } from "../types/strapi";

// Helper to normalize Strapi response to frontend-friendly format
function normalizeArticle(data: any): StrapiArticle {
  if (!data) {
    return {
      documentId: 'unknown',
      title: 'Untitled Article',
      slug: 'untitled',
      excerpt: '',
      publishedAt: new Date().toISOString(),
      reading_time: 0,
    } as StrapiArticle;
  }

  // Strapi v5 - Data is flat, no "attributes" key for main fields
  // Check if we are dealing with v4 style (has attributes) or v5 (flat)
  const attrs = data.attributes || data;
  const id = data.documentId || data.id?.toString();

  return {
    documentId: id,
    title: attrs.title || 'Untitled',
    slug: attrs.slug || 'untitled',
    excerpt: attrs.excerpt || '',
    publishedAt: attrs.publishedAt,
    reading_time: attrs.reading_time || 0,
    hero_image: attrs.hero_image ? {
      url: attrs.hero_image.url || attrs.hero_image.data?.attributes?.url,
      alternativeText: attrs.hero_image.alternativeText || attrs.hero_image.data?.attributes?.alternativeText
    } : undefined,
    author: attrs.author ? {
      name: attrs.author.name || attrs.author.data?.attributes?.name,
      slug: attrs.author.slug || attrs.author.data?.attributes?.slug,
      profile_picture: (attrs.author.profile_picture || attrs.author.data?.attributes?.profile_picture) ? {
        url: attrs.author.profile_picture?.url || attrs.author.data?.attributes?.profile_picture?.data?.attributes?.url
      } : undefined
    } : undefined,
    category: attrs.category ? {
      name: attrs.category.name || attrs.category.data?.attributes?.name,
      slug: attrs.category.slug || attrs.category.data?.attributes?.slug,
      color: attrs.category.color || attrs.category.data?.attributes?.color
    } : undefined,
    tags: (attrs.tags || attrs.tags?.data)?.map((tag: any) => ({
      slug: tag.slug || tag.attributes?.slug
    })) || [],
    blocks: attrs.blocks || attrs.content || attrs.content_blocks || [],
    summary: attrs.summary || attrs.excerpt || '',
    audioUrl: attrs.audio?.url || attrs.audio_url || undefined,
    executive_summary: attrs.executive_summary || undefined,
    audio_summary: attrs.audio_summary ? {
      audio_file: (attrs.audio_summary.audio_file || attrs.audio_summary.audio_file?.data) ? {
        url: attrs.audio_summary.audio_file?.url || attrs.audio_summary.audio_file?.data?.attributes?.url
      } : undefined,
      duration_seconds: attrs.audio_summary.duration_seconds,
      voice: attrs.audio_summary.voice,
      transcript: attrs.audio_summary.transcript,
      generated_at: attrs.audio_summary.generated_at,
      file_size: attrs.audio_summary.file_size
    } : undefined,
    relatedArticles: (attrs.related_articles || attrs.related_articles?.data)?.map((item: any) => {
      const ra = item.attributes || item;
      return {
        title: ra.title,
        slug: ra.slug,
        hero_image: ra.hero_image ? {
          url: ra.hero_image.url || ra.hero_image.data?.attributes?.url
        } : undefined,
        category: ra.category ? {
          name: ra.category.name || ra.category.data?.attributes?.name
        } : undefined
      };
    }) || []
  };
}

export const articleApi = {
  async getArticles(page = 1, pageSize = 10, date?: string): Promise<{ articles: StrapiArticle[] }> {
    // Strapi REST API with proper query string format
    const params = new URLSearchParams({
      'populate': '*',
      'sort[0]': 'publishedAt:desc',
      'pagination[page]': page.toString(),
      'pagination[pageSize]': pageSize.toString()
    });

    // Add Date Filtering if provided (YYYY-MM-DD)
    if (date) {
      // Start of day (Monterrey/Mexico Time -06:00)
      const startDate = `${date}T00:00:00.000-06:00`;
      // End of day (Local Time -06:00)
      const endDate = `${date}T23:59:59.999-06:00`;

      params.append('filters[publishedAt][$gte]', startDate);
      params.append('filters[publishedAt][$lte]', endDate);
    }

    const response = await strapiClient.get<StrapiCollectionResponse<StrapiArticleAttributes>>(
      `/articles?${params.toString()}`
    );

    // For V5, data is the array directly or in .data
    // const validArticles = response.data?.filter(item => item && item.attributes) || []; // Old V4 Check
    const rawData = response.data || [];
    // @ts-ignore
    return { articles: rawData.map(normalizeArticle) };
  },

  async getArticleBySlug(slug: string): Promise<StrapiArticle | null> {
    const params = new URLSearchParams({
      'filters[slug][$eq]': slug,
      'populate[content_blocks][on][content.single-image][populate]': '*',
      'populate[content_blocks][on][content.illustrations][populate]': '*',
      'populate[content_blocks][on][content.infographics][populate]': '*',
      'populate[content_blocks][on][content.audio][populate]': '*',
      'populate[content_blocks][on][content.gallery][populate]': '*',
      'populate[content_blocks][on][content.quote][populate]': '*',
      'populate[content_blocks][on][content.rich-text][populate]': '*',
      'populate[executive_summary][populate]': '*',
      'populate[audio_summary][populate]': '*',
      'populate[hero_image][fields][0]': 'url',
      'populate[hero_image][fields][1]': 'alternativeText',
      'populate[hero_image][fields][2]': 'caption',
      'populate[hero_image][fields][3]': 'width',
      'populate[hero_image][fields][4]': 'height',
      'populate[author][populate]': '*',
      'populate[category][populate]': '*',
      'populate[tags][populate]': '*',
      'populate[related_articles][populate][0]': 'hero_image',
      'populate[related_articles][populate][1]': 'category'
    });

    const response = await strapiClient.get<StrapiCollectionResponse<StrapiArticleAttributes>>(
      `/articles?${params.toString()}`
    );

    return response.data?.[0] ? normalizeArticle(response.data[0]) : null;
  }
};
