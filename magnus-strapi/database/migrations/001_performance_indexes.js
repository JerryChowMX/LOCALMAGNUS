'use strict';

module.exports = {
  async up(knex) {
    const queries = [
      // Articles table indexes
      `CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);`,
      `CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);`,
      `CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);`,
      `CREATE INDEX IF NOT EXISTS idx_articles_state ON articles(state);`,
      `CREATE INDEX IF NOT EXISTS idx_articles_scheduled_publish ON articles(state, published_at) WHERE state = 'scheduled';`,

      // Videos table indexes
      `CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);`,
      `CREATE INDEX IF NOT EXISTS idx_videos_category_id ON videos(category_id);`,

      // Podcasts table indexes
      `CREATE INDEX IF NOT EXISTS idx_podcasts_published_at ON podcasts(published_at DESC);`,
      `CREATE INDEX IF NOT EXISTS idx_podcasts_episode_date ON podcasts(episode_date DESC);`,

      // E-papers table indexes
      `CREATE INDEX IF NOT EXISTS idx_epapers_issue_date ON epapers(issue_date DESC);`,

      // Comments table indexes
      `CREATE INDEX IF NOT EXISTS idx_comments_article_id ON comments(article_id);`,
      `CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);`,
      `CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);`,

      // User lookup indexes
      `CREATE INDEX IF NOT EXISTS idx_users_email ON up_users(email);`,
      `CREATE INDEX IF NOT EXISTS idx_users_username ON up_users(username);`,
    ];

    for (const query of queries) {
      try {
        await knex.raw(query);
      } catch (error) {
        // Log error but allow continuation if it's just index already exists (though IF NOT EXISTS handles that)
        // or if table doesn't exist yet, we might want to warn.
        console.warn(`Warning running query: ${query}`);
        console.warn(error.message);
      }
    }
  },

  async down(knex) {
    // Optional: Drop indexes to revert
    // We can leave this empty or implement simple drops if needed.
  }
};
