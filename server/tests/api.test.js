// server/tests/api.test.js
import assert from 'node:assert';
import http from 'node:http';
import app from '../app.js';
import { isDbConnected } from '../config/db.js';

let server;
let baseUrl;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let data;
          try {
            data = JSON.parse(raw);
          } catch {
            data = raw;
          }
          resolve({ status: res.statusCode, body: data });
        });
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('\n=============================================');
  console.log('  ScamShield  AI — BACKEND & AI PIPELINE TESTS');
  console.log('=============================================\n');

  // Start test server on random port
  server = app.listen(0);
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
  console.log(`[INIT] Test server running on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`• ${name}... `);
      await fn();
      console.log('PASSED ✓');
      passed++;
    } catch (err) {
      console.log(`FAILED ✗\n  Error: ${err.message}`);
      failed++;
    }
  }

  // TEST 1: Normal message
  await test('Test 1: Normal message analysis (Low Risk, no false positives)', async () => {
    const res = await request('POST', '/api/analyze/message', {
      message: 'Hi team, the project sync is scheduled for 10 AM tomorrow in Conference Room B. Please review the quarterly slides beforehand.',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.riskLevel, 'LOW');
    assert.ok(res.body.riskScore < 25, `Expected score < 25, got ${res.body.riskScore}`);
    assert.strictEqual(res.body.analysisType, 'message');
    assert.ok(Array.isArray(res.body.indicators));
  });

  // TEST 2: Obvious phishing-style message
  await test('Test 2: Obvious phishing message (High/Critical Risk with explainable indicators)', async () => {
    const res = await request('POST', '/api/analyze/message', {
      message: 'URGENT: Your bank account has been suspended due to suspicious activity. Verify credentials immediately to avoid permanent closure. Share your 6-digit OTP code: http://secure-bankverify.xyz/confirm',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(['HIGH', 'CRITICAL'].includes(res.body.riskLevel), `Expected HIGH or CRITICAL, got ${res.body.riskLevel}`);
    assert.ok(res.body.riskScore >= 50, `Expected riskScore >= 50, got ${res.body.riskScore}`);
    assert.ok(res.body.indicators.length >= 2, 'Expected multiple detected indicators');
    assert.ok(typeof res.body.explanation === 'string' && res.body.explanation.length > 10);
    assert.ok(typeof res.body.recommendedAction === 'string' && res.body.recommendedAction.length > 10);
  });

  // TEST 3: Empty message validation
  await test('Test 3: Empty message input validation (HTTP 400 Bad Request)', async () => {
    const res = await request('POST', '/api/analyze/message', {
      message: '   ',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.message.includes('cannot be empty'));
  });

  // TEST 4: Normal URL
  await test('Test 4: Normal benign URL analysis (Low Risk)', async () => {
    const res = await request('POST', '/api/analyze/url', {
      url: 'https://www.wikipedia.org/wiki/Computer_security',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.riskLevel, 'LOW');
    assert.ok(res.body.riskScore < 25, `Expected score < 25, got ${res.body.riskScore}`);
    assert.strictEqual(res.body.analysisType, 'url');
  });

  // TEST 5: Suspicious URL
  await test('Test 5: Suspicious URL analysis (High/Critical risk with heuristic flags)', async () => {
    const res = await request('POST', '/api/analyze/url', {
      url: 'http://paypal-security-login-update.account-verification.xyz:8080/confirm?redirect=http://attacker.com',
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(['HIGH', 'CRITICAL'].includes(res.body.riskLevel), `Expected HIGH or CRITICAL, got ${res.body.riskLevel}`);
    assert.ok(res.body.indicators.length >= 2, 'Expected multiple URL indicators');
    assert.ok(res.body.riskScore >= 50);
  });

  // TEST 6: Invalid URL validation
  await test('Test 6: Malformed / Invalid URL handling (HTTP 400 Bad Request)', async () => {
    const res = await request('POST', '/api/analyze/url', {
      url: 'not-a-valid-domain',
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.error === 'Malformed URL' || res.body.message.includes('valid URL'));
  });

  // TEST 7: Database failure handling & API resilience
  await test('Test 7: Database failure handling & In-Memory Fallback verification', async () => {
    const health = await request('GET', '/api/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.body.status, 'healthy');
    assert.ok(health.body.database.storageEngine.length > 0);

    const casesRes = await request('GET', '/api/cases');
    assert.strictEqual(casesRes.status, 200);
    assert.strictEqual(casesRes.body.success, true);
    assert.ok(Array.isArray(casesRes.body.data));
    assert.ok(casesRes.body.data.length > 0, 'Cases retrieved even if MongoDB is in fallback mode');

    const statsRes = await request('GET', '/api/dashboard/stats');
    assert.strictEqual(statsRes.status, 200);
    assert.strictEqual(statsRes.body.success, true);
    assert.ok(typeof statsRes.body.data.totalAnalyses === 'number');
  });

  server.close();
  console.log('\n---------------------------------------------');
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('---------------------------------------------\n');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  if (server) server.close();
  process.exit(1);
});
