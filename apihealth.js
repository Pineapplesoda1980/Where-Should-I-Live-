/**
 * API Health Monitor for Singapore Housing Intelligence Portal
 * Checks and verifies keyless Data.gov.sg endpoints and internal services.
 */

export const MONITORED_ENDPOINTS = [
  {
    id: 'hdb-resale-latest',
    name: 'HDB Resale Prices (Jan 2017 onwards)',
    url: 'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5',
    category: 'Data.gov.sg Datastore',
    validator: (data) => data?.success === true && Array.isArray(data?.result?.records),
  },
  {
    id: 'hdb-resale-filtered',
    name: 'Filtered 4-Room Tampines Transactions',
    url: 'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5&filters=%7B%22town%22%3A%22TAMPINES%22%2C%22flat_type%22%3A%224%20ROOM%22%7D',
    category: 'Data.gov.sg Filtered Query',
    validator: (data) => data?.success === true && Array.isArray(data?.result?.records),
  },
  {
    id: 'hdb-dataset-metadata',
    name: 'Dataset Metadata & Schema Definition',
    url: 'https://api-production.data.gov.sg/v2/public/api/datasets/d_8b84c4ee58e3cfc0ece0d773c8ca6abc/metadata',
    category: 'Data.gov.sg Metadata V2',
    validator: (data) => data?.code === 0 && Boolean(data?.data?.datasetId),
  },
];

export async function checkSingleEndpoint(endpoint, timeoutMs = 6000) {
  const start = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(endpoint.url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'UrbanCivicPrecision/1.0',
      },
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);

    if (!response.ok) {
      return {
        id: endpoint.id,
        name: endpoint.name,
        category: endpoint.category,
        url: endpoint.url,
        status: 'ERROR',
        httpStatus: response.status,
        statusText: response.statusText,
        latencyMs,
        healthy: false,
        lastChecked: new Date().toISOString(),
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const json = await response.json();
    const isValid = endpoint.validator ? endpoint.validator(json) : true;

    return {
      id: endpoint.id,
      name: endpoint.name,
      category: endpoint.category,
      url: endpoint.url,
      status: isValid ? 'HEALTHY' : 'INVALID_PAYLOAD',
      httpStatus: response.status,
      latencyMs,
      healthy: isValid,
      lastChecked: new Date().toISOString(),
      recordCount: json?.result?.records?.length ?? (json?.data ? 1 : 0),
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - start);
    return {
      id: endpoint.id,
      name: endpoint.name,
      category: endpoint.category,
      url: endpoint.url,
      status: 'DOWN',
      httpStatus: 0,
      latencyMs,
      healthy: false,
      lastChecked: new Date().toISOString(),
      error: err.name === 'AbortError' ? 'Timeout exceeded (>6s)' : err.message,
    };
  }
}

export async function checkAllApis() {
  const results = await Promise.all(
    MONITORED_ENDPOINTS.map((ep) => checkSingleEndpoint(ep))
  );

  const allHealthy = results.every((r) => r.healthy);
  const someHealthy = results.some((r) => r.healthy);

  return {
    systemStatus: allHealthy ? 'HEALTHY' : someHealthy ? 'DEGRADED' : 'OUTAGE',
    timestamp: new Date().toISOString(),
    endpoints: results,
    metrics: {
      total: results.length,
      healthy: results.filter((r) => r.healthy).length,
      failing: results.filter((r) => !r.healthy).length,
      averageLatencyMs: Math.round(
        results.reduce((acc, r) => acc + r.latencyMs, 0) / results.length
      ),
    },
  };
}

// CLI direct runner
if (process.argv[1]?.endsWith('apihealth.js')) {
  console.log('\n========================================');
  console.log('📡 Running Singapore Housing API Health Check');
  console.log('========================================\n');

  checkAllApis().then((report) => {
    console.log(`System Status: [${report.systemStatus}] at ${report.timestamp}`);
    console.log(`Summary: ${report.metrics.healthy}/${report.metrics.total} endpoints healthy | Avg Latency: ${report.metrics.averageLatencyMs}ms\n`);

    report.endpoints.forEach((ep) => {
      const icon = ep.healthy ? '✅' : '❌';
      console.log(`${icon} ${ep.name}`);
      console.log(`   Category: ${ep.category}`);
      console.log(`   Status:   ${ep.status} (HTTP ${ep.httpStatus})`);
      console.log(`   Latency:  ${ep.latencyMs}ms`);
      if (ep.error) console.log(`   Error:    ${ep.error}`);
      console.log(`   URL:      ${ep.url}\n`);
    });
  });
}
