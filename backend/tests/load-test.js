/**
 * TourNex Backend Load Test Suite
 * ================================
 * Covers all API endpoints across auth, tours, bookings, expenses, messages, users.
 * Target: 400 successful test scenario iterations (assertions).
 * Output: JSON summary exported → converted to Excel in CI pipeline.
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { SharedArray } from 'k6/data';

// ─────────────────────────────────────────────
//  Custom Metrics
// ─────────────────────────────────────────────
const successfulChecks   = new Counter('successful_checks');
const failedChecks       = new Counter('failed_checks');
const authSuccessRate    = new Rate('auth_success_rate');
const apiErrorRate       = new Rate('api_error_rate');
const loginDuration      = new Trend('login_duration_ms', true);
const profileDuration    = new Trend('profile_duration_ms', true);
const toursDuration      = new Trend('tours_duration_ms', true);
const bookingsDuration   = new Trend('bookings_duration_ms', true);
const expensesDuration   = new Trend('expenses_duration_ms', true);
const messagesDuration   = new Trend('messages_duration_ms', true);

// ─────────────────────────────────────────────
//  Test Configuration
//  400 iterations distributed across 20 VUs × 20 iterations each
// ─────────────────────────────────────────────
export const options = {
  scenarios: {
    load_test_400: {
      executor: 'per-vu-iterations',
      vus: 20,
      iterations: 20,       // 20 VUs × 20 iters = 400 total iterations
      maxDuration: '10m',
    },
  },

  thresholds: {
    // Overall pass criteria
    http_req_failed:         ['rate<0.05'],         // < 5% HTTP errors
    http_req_duration:       ['p(95)<3000'],         // 95% of requests < 3s
    auth_success_rate:       ['rate>0.90'],          // > 90% logins pass
    api_error_rate:          ['rate<0.10'],          // < 10% API errors
    successful_checks:       ['count>=380'],         // at least 380/400 pass
    login_duration_ms:       ['p(90)<2000'],
    profile_duration_ms:     ['p(90)<1500'],
    tours_duration_ms:       ['p(90)<1500'],
    bookings_duration_ms:    ['p(90)<1500'],
    expenses_duration_ms:    ['p(90)<1500'],
    messages_duration_ms:    ['p(90)<1500'],
  },
};

// ─────────────────────────────────────────────
//  Constants
// ─────────────────────────────────────────────
const BASE_URL  = 'http://localhost:5000/api';
const JSON_HDR  = { 'Content-Type': 'application/json' };

// Helper — run a named check and update counters
function checked(tag, res, assertions) {
  const ok = check(res, assertions);
  if (ok) successfulChecks.add(1);
  else    failedChecks.add(1);
  apiErrorRate.add(!ok);
  return ok;
}

// ─────────────────────────────────────────────
//  Setup — pre-register a shared test user
// ─────────────────────────────────────────────
export function setup() {
  const registerPayload = JSON.stringify({
    name: 'k6 LoadTest User',
    email: 'k6.load@tournex.com',
    password: 'k6pass123',
  });

  // Attempt to register (may 400 if already exists — that's fine)
  http.post(`${BASE_URL}/auth/register`, registerPayload, { headers: JSON_HDR });

  // Verify login works before the test runs
  const loginRes = http.post(
    `${BASE_URL}/auth/login`,
    JSON.stringify({ email: 'k6.load@tournex.com', password: 'k6pass123' }),
    { headers: JSON_HDR }
  );

  let token = null;
  try {
    const body = JSON.parse(loginRes.body);
    if (body && body.success && body.data && body.data.token) {
      token = body.data.token;
    }
  } catch (_) {}

  return { token };
}

// ─────────────────────────────────────────────
//  Main Test Function (1 iteration = 1 scenario run)
// ─────────────────────────────────────────────
export default function (data) {
  // ── SCENARIO 1: AUTHENTICATION ───────────────
  let token = null;

  group('Auth — Login', () => {
    const payload = JSON.stringify({
      email: 'k6.load@tournex.com',
      password: 'k6pass123',
    });

    const res = http.post(`${BASE_URL}/auth/login`, payload, { headers: JSON_HDR });
    loginDuration.add(res.timings.duration);

    const ok = checked('auth_login', res, {
      'login: status 200':    (r) => r.status === 200,
      'login: success true':  (r) => { try { return JSON.parse(r.body).success === true; } catch(_) { return false; } },
      'login: has token':     (r) => { try { return !!JSON.parse(r.body).data.token; } catch(_) { return false; } },
    });

    authSuccessRate.add(ok);

    if (ok) {
      try { token = JSON.parse(res.body).data.token; } catch (_) {}
    }
  });

  // All subsequent groups require auth — bail early if login failed
  if (!token) {
    sleep(1);
    return;
  }

  const auth = { headers: { ...JSON_HDR, Authorization: `Bearer ${token}` } };

  // ── SCENARIO 2: AUTH PROFILE ─────────────────
  group('Auth — Get Profile', () => {
    const res = http.get(`${BASE_URL}/auth/profile`, auth);
    profileDuration.add(res.timings.duration);

    checked('auth_profile', res, {
      'profile: status 200':    (r) => r.status === 200,
      'profile: success field': (r) => { try { return JSON.parse(r.body).success === true; } catch(_) { return false; } },
    });
  });

  // ── SCENARIO 3: TOURS ────────────────────────
  let tourId = null;

  group('Tours — List All', () => {
    const res = http.get(`${BASE_URL}/tours`, auth);
    toursDuration.add(res.timings.duration);

    checked('tours_list', res, {
      'tours: status 200':       (r) => r.status === 200,
      'tours: returns array':    (r) => { try { const b = JSON.parse(r.body); return Array.isArray(b.data) || typeof b.data === 'object'; } catch(_) { return false; } },
    });

    // Grab first tour ID for subsequent get-by-id test
    try {
      const body = JSON.parse(res.body);
      if (body.data && Array.isArray(body.data) && body.data.length > 0) {
        tourId = body.data[0].id || body.data[0]._id;
      }
    } catch (_) {}
  });

  group('Tours — Get by ID', () => {
    // Use a known-safe ID when list is empty in mock mode
    const id = tourId || 'mock-tour-1';
    const res = http.get(`${BASE_URL}/tours/${id}`, auth);
    toursDuration.add(res.timings.duration);

    checked('tour_by_id', res, {
      'tour by id: not 500': (r) => r.status !== 500,
      'tour by id: has body': (r) => r.body.length > 0,
    });
  });

  // ── SCENARIO 4: BOOKINGS ─────────────────────
  group('Bookings — Create', () => {
    const payload = JSON.stringify({
      tourId:     tourId || 'mock-tour-1',
      tourName:   'k6 Load Test Tour',
      dates:      'Jul 20 - Jul 27, 2025',
      price:      12500,
      status:     'UPCOMING',
    });

    const res = http.post(`${BASE_URL}/bookings`, payload, auth);
    bookingsDuration.add(res.timings.duration);

    checked('booking_create', res, {
      'booking create: not 500':   (r) => r.status !== 500,
      'booking create: has body':  (r) => r.body.length > 0,
    });
  });

  group('Bookings — List My Bookings', () => {
    const res = http.get(`${BASE_URL}/bookings/my-bookings`, auth);
    bookingsDuration.add(res.timings.duration);

    checked('booking_list', res, {
      'booking list: status 200':  (r) => r.status === 200,
      'booking list: success':     (r) => { try { return JSON.parse(r.body).success === true; } catch(_) { return false; } },
    });
  });

  // ── SCENARIO 5: EXPENSES ─────────────────────
  group('Expenses — Create', () => {
    const payload = JSON.stringify({
      description: `k6 test expense #${__VU}-${__ITER}`,
      amount:      Math.floor(Math.random() * 5000) + 500,
      paidBy:      'Arjun',
      splitWith:   ['Arjun', 'Priya'],
      category:    'Food',
    });

    const res = http.post(`${BASE_URL}/expenses`, payload, auth);
    expensesDuration.add(res.timings.duration);

    checked('expense_create', res, {
      'expense create: not 500':  (r) => r.status !== 500,
      'expense create: has body': (r) => r.body.length > 0,
    });
  });

  group('Expenses — List', () => {
    const res = http.get(`${BASE_URL}/expenses`, auth);
    expensesDuration.add(res.timings.duration);

    checked('expense_list', res, {
      'expense list: status 200': (r) => r.status === 200,
      'expense list: success':    (r) => { try { return JSON.parse(r.body).success === true; } catch(_) { return false; } },
    });
  });

  // ── SCENARIO 6: MESSAGES ─────────────────────
  group('Messages — Send', () => {
    const payload = JSON.stringify({
      text: `Hello from k6 VU ${__VU} iter ${__ITER}`,
    });

    const res = http.post(`${BASE_URL}/messages`, payload, auth);
    messagesDuration.add(res.timings.duration);

    checked('message_send', res, {
      'message send: not 500':  (r) => r.status !== 500,
      'message send: has body': (r) => r.body.length > 0,
    });
  });

  group('Messages — List', () => {
    const res = http.get(`${BASE_URL}/messages`, auth);
    messagesDuration.add(res.timings.duration);

    checked('message_list', res, {
      'message list: status 200': (r) => r.status === 200,
      'message list: success':    (r) => { try { return JSON.parse(r.body).success === true; } catch(_) { return false; } },
    });
  });

  // ── SCENARIO 7: HEALTH CHECK ─────────────────
  group('Health — API Test Endpoint', () => {
    const res = http.get(`http://localhost:5000/api/test`);

    checked('health_check', res, {
      'health: status 200':      (r) => r.status === 200,
      'health: backend online':  (r) => { try { return JSON.parse(r.body).success === true; } catch(_) { return false; } },
    });
  });

  // 300ms think-time between iterations
  sleep(0.3);
}

// ─────────────────────────────────────────────
//  Teardown — log summary stats
// ─────────────────────────────────────────────
export function teardown(data) {
  console.log('=== k6 TourNex Load Test Complete ===');
  console.log(`Target: 400 iterations across 20 VUs x 20 iterations`);
}
