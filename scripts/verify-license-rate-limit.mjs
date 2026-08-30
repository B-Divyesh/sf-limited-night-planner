const endpoint = 'https://api.sociobot.in/api/v1/products/limited-night-planner/verify?license=';
const productOrigin = 'https://limited-night-planner.sociobot.in';
const requestCount = Number(process.env.LICENSE_RATE_LIMIT_REQUESTS ?? 300);

if (!Number.isInteger(requestCount) || requestCount < 2) {
  throw new Error('LICENSE_RATE_LIMIT_REQUESTS must be an integer of at least 2.');
}

const runId = `rate-limit-regression-${Date.now()}`;
const corsProbe = await fetch(`${endpoint}${runId}-preflight`, {
  method: 'OPTIONS',
  headers: {
    Origin: productOrigin,
    'Access-Control-Request-Method': 'GET',
  },
});

if (corsProbe.status !== 200
  || corsProbe.headers.get('access-control-allow-origin') !== productOrigin
  || !corsProbe.headers.get('access-control-allow-methods')?.includes('GET')) {
  console.error(JSON.stringify({
    corsStatus: corsProbe.status,
    allowOrigin: corsProbe.headers.get('access-control-allow-origin'),
    allowMethods: corsProbe.headers.get('access-control-allow-methods'),
  }, null, 2));
  throw new Error('Expected the billing verification endpoint to allow the deployed planner origin to make GET requests.');
}

const responses = await Promise.all(Array.from({ length: requestCount }, async (_, index) => {
  const response = await fetch(`${endpoint}${runId}-${index}`);
  const body = response.status === 200 ? await response.json().catch(() => null) : null;
  return { status: response.status, retryAfter: response.headers.get('retry-after'), body };
}));

const statusCounts = Object.fromEntries([...new Set(responses.map(({ status }) => status))]
  .sort((left, right) => left - right)
  .map((status) => [status, responses.filter((response) => response.status === status).length]));
const rateLimited = responses.filter((response) => response.status === 429);
const readableInvalidResponse = responses.find((response) => response.status === 200
  && response.body?.valid === false && response.body?.reason === 'invalid');

if (!readableInvalidResponse || !rateLimited.length || rateLimited.some(({ retryAfter }) => !retryAfter)) {
  console.error(JSON.stringify({
    requestCount,
    statusCounts,
    readableInvalidResponse: Boolean(readableInvalidResponse),
    retryAfterOnEvery429: rateLimited.length > 0 && rateLimited.every(({ retryAfter }) => Boolean(retryAfter)),
  }, null, 2));
  throw new Error('Expected a readable invalid-token response and HTTP 429 with Retry-After during the rapid-request burst.');
}

console.log(JSON.stringify({
  requestCount,
  cors: {
    status: corsProbe.status,
    allowOrigin: corsProbe.headers.get('access-control-allow-origin'),
  },
  statusCounts,
  readableInvalidResponse: Boolean(readableInvalidResponse),
  rateLimited: rateLimited.length,
  retryAfterValues: [...new Set(rateLimited.map(({ retryAfter }) => retryAfter))],
}, null, 2));
