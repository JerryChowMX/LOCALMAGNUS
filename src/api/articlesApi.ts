import { strapiClient } from "./strapiClient";
import type { ArticleStandard } from "../types/articles";
import { normalizeContentBlocks } from "../utils/articleMapper";

/**
 * Maps Strapi Article response to ArticleStandard
 * Handles both Strapi v4 (attributes wrapper) and Strapi v5 (flat)
 */
function mapStrapiArticleToStandard(one: any): ArticleStandard {
    if (!one) throw new Error("Article data is null");



    // Strapi v5 compatibility check: Flatten attributes if needed
    const attributes = one.attributes || one;
    const id = one.id || one.documentId;

    const {
        title,
        slug,
        dek,
        layout_type,
        publishedAt,
        read_time_minutes,

        content_blocks,
        isSpecial,
        // Summaries
        audio_summary,
        video_summary,
        ppt_summary,
        infographic_summary,
        // TTS
        tts_status,
        tts_audio,
        tts_metadata
    } = attributes;

    // Handle Relations/Media which might also be flat or wrapped in .data.attributes

    // Cover Image
    let coverImage = undefined;
    const rawCover = attributes.hero_image || attributes.cover_image;
    if (rawCover) {
        // v5 might be direct object or v4 .data.attributes
        const imgData = rawCover.data?.attributes || rawCover.data || rawCover;
        if (imgData && imgData.url) {
            coverImage = {
                url: imgData.url,
                alt: imgData.alternativeText || title,
                caption: imgData.caption
            };
        }
    }

    // Hero Image Caption
    const heroImageCaption = attributes.hero_image_caption || null;

    // Category
    let category = { id: 0, name: "Sin categoría", slug: "sin-categoria" };
    const rawCat = attributes.category;
    if (rawCat) {
        const catData = rawCat.data?.attributes || rawCat.data || rawCat;
        if (catData) {
            category = {
                id: rawCat.data?.id || rawCat.id || 0,
                name: catData.name,
                slug: catData.slug
            };
        }
    }

    // Author
    let author: ArticleStandard['author'] = { id: 0, name: "Redacción Magnus", slug: "redaccion" };
    const rawAuthor = attributes.author;
    if (rawAuthor) {
        const authorData = rawAuthor.data?.attributes || rawAuthor.data || rawAuthor;
        if (authorData) {
            author = {
                id: rawAuthor.data?.id || rawAuthor.id || 0,
                name: authorData.name,
                slug: authorData.slug,
                // Avatar might be deep nested
                avatarUrl: authorData.profile_picture?.data?.attributes?.url || authorData.profile_picture?.url
            };
        }
    }

    // Tags
    const tags: any[] = [];
    const rawTags = attributes.tags;
    if (rawTags) {
        const tagsList = Array.isArray(rawTags) ? rawTags : (rawTags.data || []);
        tagsList.forEach((t: any) => {
            const tData = t.attributes || t;
            if (tData) {
                tags.push({
                    id: t.id,
                    name: tData.name,
                    slug: tData.slug
                });
            }
        });
    }

    // Content Blocks Normalization
    const rawBlocks = content_blocks || attributes.blocks || attributes.content || [];
    const normalizedBlocks = normalizeContentBlocks(rawBlocks);

    return {
        id: id,
        layoutType: layout_type || "standard-one",
        isSpecial: isSpecial || false,
        title: title || "Untitled",
        dek: dek || null,
        slug: slug,
        publishedAt: publishedAt || new Date().toISOString(),
        readTimeMinutes: read_time_minutes || 0,
        coverImage,
        heroImageCaption,
        category,
        tags,
        author,
        audioUrl: attributes.audioUrl || attributes.audio?.url || undefined,
        contentBlocks: normalizedBlocks,
        relatedArticles: [], // Populated by separate fetch

        // Pass through raw summary data (normalized if needed, but keeping simple for now)
        audio_summary: audio_summary ? {
            episode_label: audio_summary.episode_label,
            podcast_title: audio_summary.podcast_title,
            audio_file: audio_summary.audio_file?.data ? { url: audio_summary.audio_file.data.attributes.url } : (audio_summary.audio_file ? { url: audio_summary.audio_file.url } : undefined)
        } : undefined,
        video_summary: video_summary ? {
            video_file: video_summary.video_file?.data ? { url: video_summary.video_file.data.attributes.url } : (video_summary.video_file ? { url: video_summary.video_file.url } : undefined),
            thumbnail: video_summary.thumbnail?.data ? { url: video_summary.thumbnail.data.attributes.url } : (video_summary.thumbnail ? { url: video_summary.thumbnail.url } : undefined),
            duration_seconds: video_summary.duration_seconds
        } : undefined,
        ppt_summary: ppt_summary ? {
            ppt_file: ppt_summary.ppt_file?.data ? { url: ppt_summary.ppt_file.data.attributes.url } : (ppt_summary.ppt_file ? { url: ppt_summary.ppt_file.url } : undefined),
            slide_count: ppt_summary.slide_count
        } : undefined,
        infographic_summary: infographic_summary ? {
            image_file: infographic_summary.image_file?.data ? { url: infographic_summary.image_file.data.attributes.url } : (infographic_summary.image_file ? { url: infographic_summary.image_file.url } : undefined)
        } : undefined,

        tts_status,
        tts_audio: tts_audio?.data ? { url: tts_audio.data.attributes.url } : (tts_audio ? { url: tts_audio.url } : undefined),
        tts_metadata: tts_metadata?.data ? { url: tts_metadata.data.attributes.url } : (tts_metadata ? { url: tts_metadata.url } : undefined)
    };
}

// Helper to map a Strapi article entry to a simple recommendation item
function mapToRecommendation(item: any): any {
    const attrs = item.attributes || item; // v5 flat
    const imgData = attrs.hero_image?.data?.attributes || attrs.hero_image?.data || attrs.hero_image;

    return {
        title: attrs.title,
        category: attrs.category?.data?.attributes?.name || attrs.category?.name || "General",
        slug: attrs.slug,
        image: imgData ? imgData.url : undefined
    };
}

export async function fetchStandardArticle(slug: string): Promise<ArticleStandard | null> {
    // Explicit populate - only what we need (NO populate=*)
    const params = new URLSearchParams({
        'filters[slug][$eq]': slug,
        // Hero image
        'populate[hero_image][fields]': 'url,alternativeText,caption,width,height',
        // Category
        'populate[category][fields]': 'name,slug,isSpecial',
        // Author with avatar
        'populate[author][fields]': 'name,slug',
        'populate[author][populate][profile_picture][fields]': 'url',
        // Tags
        'populate[tags][fields]': 'name,slug',
        // Content blocks need deep populate for media
        'populate[content_blocks][populate]': '*',
        // Audio/Video summaries
        'populate[audio_summary][populate]': '*',
        'populate[video_summary][populate]': '*',
        'populate[tts_audio][fields]': 'url',
        'populate[tts_metadata]': '*',
    });

    try {
        const data: any = await strapiClient.get(`/articles?${params.toString()}`);

        const items = data.data || [];
        if (items.length === 0) return null;

        const mainArticle = mapStrapiArticleToStandard(items[0]);

        // Fetch Recommended Articles (Real Data)
        // Strat: Get 3 latest articles excluding current
        try {
            const recParams = new URLSearchParams({
                'filters[slug][$ne]': slug, // Exclude current
                'sort': 'publishedAt:desc',
                'pagination[limit]': '3',
                'populate[0]': 'hero_image',
                'populate[1]': 'category'
            });

            const recData: any = await strapiClient.get(`/articles?${recParams.toString()}`);
            const recItems = recData.data || [];

            mainArticle.relatedArticles = recItems.map(mapToRecommendation);

        } catch (recError) {
            console.warn("Failed to fetch recommended articles:", recError);
            // Fallback to empty array if fetch fails, do NOT mock
            mainArticle.relatedArticles = [];
        }

        return mainArticle;

    } catch (error) {
        console.error("Error fetching standard article:", error);
        return null;
    }
}

export async function fetchStandardArticles(page = 1, pageSize = 10, date?: string): Promise<{ articles: ArticleStandard[], meta: any }> {
    const params = new URLSearchParams();

    // Populate required fields for the card view
    params.append('populate[hero_image][fields]', 'url,alternativeText');
    params.append('populate[category][fields]', 'name,slug');
    params.append('populate[author][fields]', 'name,slug');

    // Sorting and pagination
    params.append('sort[0]', 'publishedAt:desc');
    params.append('pagination[page]', page.toString());
    params.append('pagination[pageSize]', pageSize.toString());

    // Add Date Filtering if provided (YYYY-MM-DD)
    if (date) {
        // Start of day (Monterrey/Mexico Time -06:00)
        const startDate = `${date}T00:00:00.000-06:00`;
        // End of day (Local Time -06:00)
        const endDate = `${date}T23:59:59.999-06:00`;

        params.append('filters[publishedAt][$gte]', startDate);
        params.append('filters[publishedAt][$lte]', endDate);
    }

    try {
        const response: any = await strapiClient.get(`/articles?${params.toString()}`);
        const rawData = response.data || [];
        const meta = response.meta || {};

        const articles = rawData.map(mapStrapiArticleToStandard);
        return { articles, meta };
    } catch (error) {
        console.error("Error fetching articles:", error);
        return { articles: [], meta: {} };
    }
}
