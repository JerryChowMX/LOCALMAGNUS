/**
 * A set of functions called "actions" for `search`
 */

// Spanish Stopwords (common prepositions/articles)
const STOPWORDS = new Set([
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'y', 'e', 'o', 'u',
    'de', 'del', 'al', 'en', 'con', 'por', 'para', 'sin', 'sus', 'su',
    'ante', 'bajo', 'contra', 'desde', 'entre', 'hacia', 'hasta', 'segun', 'sobre', 'tras'
]);

export default {
    async searchArticles(ctx) {
        const { query, filters, pagination } = ctx.request.body;

        // 1. Validation
        if (!query || typeof query !== 'string' || query.trim().length < 2) {
            return ctx.badRequest('Query too short');
        }
        if (query.length > 100) {
            return ctx.badRequest('Query too long');
        }

        // 2. Tokenize & Normaliation
        // normalize('NFD') splits "é" into "e" + accent char.
        // We want to keep valid letters.

        // Step A: Cleaning
        // Remove characters that are NOT letters, numbers, or whitespace.
        // \p{L} matches any unicode letter (including accents).
        // \p{N} matches any number.
        const cleanQuery = query
            .toLowerCase()
            // Note: We use the 'u' flag for unicode property escapes
            .replace(/[^\p{L}\p{N}\s]/gu, ' ');

        // Step B: Split & Filter
        const rawTerms = cleanQuery
            .split(/\s+/)
            .filter(t => t.length >= 3) // Min 3 chars
            .filter(t => !STOPWORDS.has(t));

        // Limit to max 6 terms
        const finalTokens = rawTerms.slice(0, 6);

        if (finalTokens.length === 0) {
            return {
                results: [],
                meta: {
                    total: 0,
                    page: pagination?.page || 1,
                    pageSize: 20,
                    pageCount: 0
                }
            };
        }

        // 3. Build Strapi Filter (Expanded OR / Hybrid Match)
        const andFilters = finalTokens.map(term => {
            const normalized = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const conditions: any[] = [
                { title: { $containsi: term } },
                { excerpt: { $containsi: term } },
                { author: { name: { $containsi: term } } },
                { category: { name: { $containsi: term } } },
                { tags: { name: { $containsi: term } } },
                { search_keywords: { $containsi: term } }
            ];

            // If normalized is different (e.g. "méxico" vs "mexico"), add it too
            if (normalized !== term) {
                conditions.push({ title: { $containsi: normalized } });
                conditions.push({ excerpt: { $containsi: normalized } });
                conditions.push({ author: { name: { $containsi: normalized } } });
                conditions.push({ category: { name: { $containsi: normalized } } });
                conditions.push({ tags: { name: { $containsi: normalized } } });
                conditions.push({ search_keywords: { $containsi: normalized } });
            }

            return { $or: conditions };
        });

        const strapiFilters = {
            $and: andFilters,
            // Add published filter implicitly via status='published' in document service
        };

        // 4. Add User Filters (Placeholder for Phase 2)
        if (filters?.categories && Array.isArray(filters.categories)) {
            // strapiFilters.$and.push({ category: { slug: { $in: filters.categories } } });
        }

        // 5. Query Execution
        const page = pagination?.page ? parseInt(pagination.page) : 1;
        let pageSize = pagination?.limit ? parseInt(pagination.limit) : 20;
        if (pageSize > 50) pageSize = 50; // Hard cap

        const startTime = Date.now();

        try {
            const [results, total] = await Promise.all([
                strapi.entityService.findMany('api::article.article', {
                    filters: strapiFilters,
                    sort: 'publishedAt:desc', // Default sort
                    populate: ['hero_image', 'category', 'author'],
                    start: (page - 1) * pageSize,
                    limit: pageSize,
                    publicationState: 'live',
                } as any),
                strapi.entityService.count('api::article.article', {
                    filters: strapiFilters,
                    publicationState: 'live',
                } as any)
            ]);

            const queryTime = Date.now() - startTime;

            // 6. Logging (Fire and forget)
            // @ts-ignore - Types not generated yet
            strapi.entityService.create('api::search-log.search-log', {
                data: {
                    query,
                    tokens: finalTokens,
                    resultCount: results.length,
                    queryTime,
                    userId: ctx.state.user?.id ? String(ctx.state.user.id) : null,
                } as any
            }).catch(err => strapi.log.error('Search logging failed: ' + JSON.stringify(err)));

            // 7. Return
            return {
                results, // Strapi 5 Documents API returns clean objects
                meta: {
                    total,
                    page,
                    pageSize,
                    pageCount: Math.ceil(total / pageSize),
                    queryTime
                }
            };

        } catch (error) {
            strapi.log.error('Search error details:', error);
            // @ts-ignore
            return ctx.internalServerError('An error occurred during search: ' + (error.message || error));
        }
    },

    /**
     * Search Videos
     * POST /api/search/videos
     */
    async searchVideos(ctx) {
        const { query, pagination } = ctx.request.body;

        // 1. Validation
        if (!query || typeof query !== 'string' || query.trim().length < 2) {
            return ctx.badRequest('Query too short');
        }
        if (query.length > 100) {
            return ctx.badRequest('Query too long');
        }

        // 2. Tokenize & Normalize
        const cleanQuery = query
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, ' ');

        const rawTerms = cleanQuery
            .split(/\s+/)
            .filter(t => t.length >= 3)
            .filter(t => !STOPWORDS.has(t));

        const finalTokens = rawTerms.slice(0, 6);

        if (finalTokens.length === 0) {
            return {
                results: [],
                meta: {
                    total: 0,
                    page: pagination?.page || 1,
                    pageSize: 20,
                    pageCount: 0
                }
            };
        }

        // 3. Build Strapi Filter for video-post
        const andFilters = finalTokens.map(term => {
            const normalized = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const conditions: any[] = [
                { title: { $containsi: term } },
                { dek: { $containsi: term } },
                { slug: { $containsi: term } }
            ];

            if (normalized !== term) {
                conditions.push({ title: { $containsi: normalized } });
                conditions.push({ dek: { $containsi: normalized } });
            }

            return { $or: conditions };
        });

        const strapiFilters = { $and: andFilters };

        // 4. Query Execution
        const page = pagination?.page ? parseInt(pagination.page) : 1;
        let pageSize = pagination?.limit ? parseInt(pagination.limit) : 20;
        if (pageSize > 50) pageSize = 50;

        const startTime = Date.now();

        try {
            const [results, total] = await Promise.all([
                strapi.entityService.findMany('api::video-post.video-post', {
                    filters: strapiFilters,
                    sort: 'publishedAt:desc',
                    populate: ['video', 'poster'],
                    start: (page - 1) * pageSize,
                    limit: pageSize,
                    publicationState: 'live',
                } as any),
                strapi.entityService.count('api::video-post.video-post', {
                    filters: strapiFilters,
                    publicationState: 'live',
                } as any)
            ]);

            const queryTime = Date.now() - startTime;

            return {
                results,
                meta: {
                    total,
                    page,
                    pageSize,
                    pageCount: Math.ceil(total / pageSize),
                    queryTime
                }
            };

        } catch (error) {
            strapi.log.error('Video search error:', error);
            // @ts-ignore
            return ctx.internalServerError('Video search error: ' + (error.message || error));
        }
    },

    /**
     * Search Podcasts
     * POST /api/search/podcasts
     */
    async searchPodcasts(ctx) {
        const { query, pagination } = ctx.request.body;

        // 1. Validation
        if (!query || typeof query !== 'string' || query.trim().length < 2) {
            return ctx.badRequest('Query too short');
        }
        if (query.length > 100) {
            return ctx.badRequest('Query too long');
        }

        // 2. Tokenize & Normalize
        const cleanQuery = query
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, ' ');

        const rawTerms = cleanQuery
            .split(/\s+/)
            .filter(t => t.length >= 3)
            .filter(t => !STOPWORDS.has(t));

        const finalTokens = rawTerms.slice(0, 6);

        if (finalTokens.length === 0) {
            return {
                results: [],
                meta: {
                    total: 0,
                    page: pagination?.page || 1,
                    pageSize: 20,
                    pageCount: 0
                }
            };
        }

        // 3. Build Strapi Filter for podcast
        const andFilters = finalTokens.map(term => {
            const normalized = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const conditions: any[] = [
                { title: { $containsi: term } },
                { info: { $containsi: term } },
                { author: { $containsi: term } },
                { slug: { $containsi: term } }
            ];

            if (normalized !== term) {
                conditions.push({ title: { $containsi: normalized } });
                conditions.push({ info: { $containsi: normalized } });
                conditions.push({ author: { $containsi: normalized } });
            }

            return { $or: conditions };
        });

        const strapiFilters = { $and: andFilters };

        // 4. Query Execution
        const page = pagination?.page ? parseInt(pagination.page) : 1;
        let pageSize = pagination?.limit ? parseInt(pagination.limit) : 20;
        if (pageSize > 50) pageSize = 50;

        const startTime = Date.now();

        try {
            const [results, total] = await Promise.all([
                strapi.entityService.findMany('api::podcast.podcast', {
                    filters: strapiFilters,
                    sort: 'publishedAt:desc',
                    populate: ['audio_file', 'cover_art'],
                    start: (page - 1) * pageSize,
                    limit: pageSize,
                    publicationState: 'live',
                } as any),
                strapi.entityService.count('api::podcast.podcast', {
                    filters: strapiFilters,
                    publicationState: 'live',
                } as any)
            ]);

            const queryTime = Date.now() - startTime;

            return {
                results,
                meta: {
                    total,
                    page,
                    pageSize,
                    pageCount: Math.ceil(total / pageSize),
                    queryTime
                }
            };

        } catch (error) {
            strapi.log.error('Podcast search error:', error);
            // @ts-ignore
            return ctx.internalServerError('Podcast search error: ' + (error.message || error));
        }
    }
};
