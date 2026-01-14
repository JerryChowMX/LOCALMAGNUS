/**
 * Cron Tasks with Atomic Leader Election
 * 
 * CRITICAL FIX: Uses SET NX for atomic leader acquisition.
 * Fails CLOSED when Redis is unavailable - no cron runs on any instance.
 * This prevents duplicate execution and missed runs.
 */

import { tryAcquireLeadership, isRedisConnected } from '../src/utils/redis';

const LEADER_KEY = 'cron:leader';
const LEADER_TTL = 90; // 90 seconds - allows quick failover

// Unique identifier for this instance
const instanceId = process.env.RAILWAY_REPLICA_ID
    || process.env.HOSTNAME
    || `instance-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Attempt to become or confirm leadership using atomic SET NX.
 * Returns true if this instance should run cron jobs.
 * 
 * FAIL CLOSED: If Redis is unavailable, NO instance runs cron.
 * This is safer than having all instances run (duplicate work).
 */
async function isLeader(): Promise<boolean> {
    return await tryAcquireLeadership(LEADER_KEY, instanceId, LEADER_TTL);
}

export default {
    /**
     * Cron job to publish scheduled articles.
     * Runs every 5 minutes - ONLY ON LEADER INSTANCE.
     * 
     * Idempotent: Each article is only published once (state check).
     */
    '*/5 * * * *': async ({ strapi }) => {
        const leader = await isLeader();

        if (!leader) {
            // Either not the leader, or Redis is down (fail closed)
            if (!isRedisConnected()) {
                strapi.log.warn(`[Cron] Redis unavailable - skipping scheduled-publish on ${instanceId}`);
            } else {
                strapi.log.debug(`[Cron] Not leader - skipping scheduled-publish (instance: ${instanceId})`);
            }
            return;
        }

        strapi.log.info(`[Cron] Running scheduled-publish as leader (instance: ${instanceId})`);

        try {
            const now = new Date();

            // Find articles that are scheduled and ready to publish
            // IDEMPOTENT: Only selects articles with state='scheduled'
            const articlesToPublish = await strapi.entityService.findMany('api::article.article', {
                filters: {
                    state: 'scheduled',
                    publishedAt: { $lte: now.toISOString() }
                },
                limit: 50, // Process in batches to avoid timeout
            });

            if (articlesToPublish.length > 0) {
                strapi.log.info(`[Cron] Found ${articlesToPublish.length} scheduled articles to publish.`);

                for (const article of articlesToPublish) {
                    try {
                        await strapi.entityService.update('api::article.article', article.id, {
                            data: {
                                state: 'published'
                            }
                        });
                        strapi.log.info(`[Cron] Published article: ${article.title} (ID: ${article.id})`);
                    } catch (updateErr) {
                        strapi.log.error(`[Cron] Failed to publish article ${article.id}:`, updateErr);
                        // Continue with other articles
                    }
                }
            }
        } catch (err) {
            strapi.log.error('[Cron] Error in scheduled publishing:', err);
        }
    },

    /**
     * Leadership heartbeat - refresh leader claim every 30 seconds.
     * Shorter interval than TTL ensures smooth leader transition if leader dies.
     */
    '*/30 * * * * *': async ({ strapi }) => {
        const leader = await isLeader();
        if (leader) {
            strapi.log.debug(`[Cron] Leader heartbeat confirmed (instance: ${instanceId})`);
        }
    },
};
