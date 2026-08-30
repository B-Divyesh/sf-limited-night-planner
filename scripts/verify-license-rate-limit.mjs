const endpoint = 'https://api.sociobot.in/api/v1/products/limited-night-planner/verify?license=';
const requestCount = Number(process.env.LICENSE_RATE_LIMIT_REQUESTS ?? 300);

if (!Number.isInteger(requestCount) || requestCount < 2) {
  throw new Error('LICENSE_RATE_LIMIT_REQUESTS must be an integer of at least 2.');
}

const runId = `rate-limit-regression-${Date.now()}`;
const responses = await Promise.all(Array.from({ length: requestCount }, async (_, index) => {
  const response = await fetch(`${endpoint}${runId}-${index}`);
  return { status: response.status, retryAfter: response.headers.get('retry-after') };
}));

const statusCounts = Object.fromEntries([...new Set(responses.map(({ status }) => status))]
  .sort((left, right) => left - right)
  .map((status) => [status, responses.filter((response) => response.status === status).length]));
const rateLimited = responses.filter((response) => response.status === 429);

if (!rateLimited.length || rateLimited.some(({ retryAfter }) => !retryAfter)) {
  console.error(JSON.stringify({ requestCount, statusCounts, retryAfterOnEvery429: false }, null, 2));
  throw new Error('Expected the billing verification endpoint to return HTTP 429 with Retry-After during the rapid-request burst.');
}

console.log(JSON.stringify({
  requestCount,
  statusCounts,
  rateLimited: rateLimited.length,
  retryAfterValues: [...new Set(rateLimited.map(({ retryAfter }) => retryAfter))],
}, null, 2));
