/**
 * k6 Load Test for MAGNUS Production Readiness
 * 
 * Run: k6 run --env API_URL=https://your-strapi.railway.app load-test.js
 * 
 * Acceptance Criteria:
 * - P95 reads < 900ms
 * - Error rate < 0.5%
 * - No DB connection exhaustion
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const feedLatency = new Trend('feed_latency');
const detailLatency = new Trend('detail_latency');

export const options = {
    stages: [
        { duration: '1m', target: 20 },   // Ramp up to 20 users
        { duration: '3m', target: 50 },   // Ramp up to 50 users
        { duration: '5m', target: 100 },  // Hold at 100 users
        { duration: '1m', target: 0 },    // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<900'],  // 95% of requests under 900ms
        http_req_failed: ['rate<0.005'],   // Error rate under 0.5%
        errors: ['rate<0.01'],             // Custom error rate under 1%
    },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:1337';

export default function () {
    // Test 1: Optimized Feed Endpoint
    const feedStart = Date.now();
    const feedRes = http.get(`${BASE_URL}/api/feed/articles?page=1&pageSize=10`);
    feedLatency.add(Date.now() - feedStart);

    const feedOk = check(feedRes, {
        'feed status is 200': (r) => r.status === 200,
        'feed has data': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.data && body.data.length > 0;
            } catch {
                return false;
            }
        },
        'feed has pagination': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.meta && body.meta.pagination;
            } catch {
                return false;
            }
        },
    });

    errorRate.add(!feedOk);
    sleep(1);

    // Test 2: Standard articles endpoint (fallback)
    const articlesRes = http.get(`${BASE_URL}/api/articles?pagination[limit]=5`);
    check(articlesRes, {
        'articles status is 200': (r) => r.status === 200,
    });
    sleep(0.5);

    // Test 3: Health check
    const healthRes = http.get(`${BASE_URL}/api/healthz`);
    check(healthRes, {
        'health check returns 200': (r) => r.status === 200,
        'health check shows healthy': (r) => {
            try {
                const body = JSON.parse(r.body);
                return body.status === 'healthy';
            } catch {
                return false;
            }
        },
    });
    sleep(0.5);

    // Test 4: Article detail (if we have articles)
    try {
        const feedBody = JSON.parse(feedRes.body);
        if (feedBody.data && feedBody.data.length > 0) {
            const slug = feedBody.data[0].slug;
            if (slug) {
                const detailStart = Date.now();
                const detailRes = http.get(
                    `${BASE_URL}/api/articles?filters[slug][$eq]=${slug}&populate[hero_image][fields]=url&populate[category][fields]=name,slug`
                );
                detailLatency.add(Date.now() - detailStart);

                check(detailRes, {
                    'detail status is 200': (r) => r.status === 200,
                });
            }
        }
    } catch {
        // Ignore parse errors
    }

    sleep(1);
}

export function handleSummary(data) {
    return {
        'stdout': textSummary(data, { indent: ' ', enableColors: true }),
        'load-test-results.json': JSON.stringify(data, null, 2),
    };
}

function textSummary(data, options) {
    const checks = data.metrics.checks;
    const httpDuration = data.metrics.http_req_duration;
    const httpFailed = data.metrics.http_req_failed;

    return `
╔══════════════════════════════════════════════════════════════╗
║                    MAGNUS LOAD TEST RESULTS                  ║
╠══════════════════════════════════════════════════════════════╣
║ HTTP Request Duration (P95): ${httpDuration?.values?.['p(95)']?.toFixed(2) || 'N/A'} ms
║ HTTP Request Duration (Avg): ${httpDuration?.values?.avg?.toFixed(2) || 'N/A'} ms
║ HTTP Request Failed Rate:    ${((httpFailed?.values?.rate || 0) * 100).toFixed(2)}%
║ Checks Passed:               ${((checks?.values?.rate || 0) * 100).toFixed(2)}%
╠══════════════════════════════════════════════════════════════╣
║ PASS CRITERIA:                                               ║
║   ✓ P95 < 900ms: ${(httpDuration?.values?.['p(95)'] || 0) < 900 ? '✅ PASS' : '❌ FAIL'}
║   ✓ Error rate < 0.5%: ${(httpFailed?.values?.rate || 0) < 0.005 ? '✅ PASS' : '❌ FAIL'}
╚══════════════════════════════════════════════════════════════╝
`;
}
