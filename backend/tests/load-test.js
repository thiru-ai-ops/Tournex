/**
 * TourNex Backend Load Test — OPTIMIZED
 * ======================================
 * 400 iterations: 40 VUs x 10 iters (shared-iterations = fastest)
 * handleSummary() exports JSON — replaces deprecated --summary-export flag.
 */

import http from 'k6/http';
import { check, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.2/index.js';

// ─── Custom Metrics ───────────────────────────────────────────────────────────
const successfulChecks = new Counter('successful_checks');
const failedChecks     = new Counter('failed_checks');
const authSuccessRate  = new Rate('auth_success_rate');
const apiErrorRate     = new Rate('api_error_rate');
const loginDuration    = new Trend('login_duration_ms',    true);
const profileDuration  = new Trend('profile_duration_ms',  true);
const toursDuration    = new Trend('tours_duration_ms',    true);
const bookingsDuration = new Trend('bookings_duration_ms', true);
const expensesDuration = new Trend('expenses_duration_ms', true);
const messagesDuration = new Trend('messages_duration_ms', true);

// ─── Options: 40 VUs x 10 iters = 400 total, no sleep ───────────────────────
export const options = {
  scenarios: {
    tournex_load_400: {
      executor:    'shared-iterations',
      vus:         40,
      iterations:  400,
      maxDuration: '3m',
    },
  },
  thresholds: {
    http_req_failed:   ['rate<0.05'],
    http_req_duration: ['p(95)<3000'],
    auth_success_rate: ['rate>0.90'],
    api_error_rate:    ['rate<0.10'],
    successful_checks: ['count>=380'],
  },
};

const BASE_URL = 'http://localhost:5000/api';
const JSON_HDR = { 'Content-Type': 'application/json' };

function chk(res, assertions) {
  const ok = check(res, assertions);
  ok ? successfulChecks.add(1) : failedChecks.add(1);
  apiErrorRate.add(!ok);
  return ok;
}

// ─── Setup: register shared test user ────────────────────────────────────────
export function setup() {
  http.post(
    `${BASE_URL}/auth/register`,
    JSON.stringify({ name: 'k6 Bot', email: 'test.user@tournex.com', password: 'k6pass123' }),
    { headers: JSON_HDR }
  );
}

// ─── Default (no sleep — pure throughput) ────────────────────────────────────
export default function () {
  // 1. Login
  let token = null;
  group('Auth — Login', () => {
    const res = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({ email: 'test.user@tournex.com', password: 'k6pass123' }),
      { headers: JSON_HDR }
    );
    loginDuration.add(res.timings.duration);
    const ok = chk(res, {
      'login 200':   (r) => r.status === 200,
      'login token': (r) => { try { return !!JSON.parse(r.body).data.token; } catch(_) { return false; } },
    });
    authSuccessRate.add(ok);
    if (ok) { try { token = JSON.parse(res.body).data.token; } catch(_) {} }
  });

  if (!token) return;

  const auth = { headers: { ...JSON_HDR, Authorization: `Bearer ${token}` } };

  // 2. Profile
  group('Auth — Profile', () => {
    const res = http.get(`${BASE_URL}/auth/profile`, auth);
    profileDuration.add(res.timings.duration);
    chk(res, { 'profile 200': (r) => r.status === 200 });
  });

  // 3. Tours
  group('Tours — List', () => {
    const res = http.get(`${BASE_URL}/tours`, auth);
    toursDuration.add(res.timings.duration);
    chk(res, {
      'tours 200':      (r) => r.status === 200,
      'tours has body': (r) => r.body.length > 0,
    });
  });

  // 4. Bookings
  group('Bookings — Create + List', () => {
    const post = http.post(
      `${BASE_URL}/bookings`,
      JSON.stringify({ tourId: 'mock-1', tourName: 'k6 Tour', dates: 'Jul 20-27', price: 9999, status: 'UPCOMING', bookingId: 'BK-' + __ITER + '-' + Math.floor(Math.random() * 1000000) }),
      auth
    );
    bookingsDuration.add(post.timings.duration);
    chk(post, { 'booking not 500': (r) => r.status !== 500 });

    const list = http.get(`${BASE_URL}/bookings/my-bookings`, auth);
    bookingsDuration.add(list.timings.duration);
    chk(list, { 'booking list 200': (r) => r.status === 200 });
  });

  // 5. Expenses
  group('Expenses — Create + List', () => {
    const post = http.post(
      `${BASE_URL}/expenses`,
      JSON.stringify({ description: `Expense-${__ITER}`, amount: 1500, paidBy: 'Arjun', splitWith: ['Arjun','Priya'], category: 'Food', date: new Date().toISOString().split('T')[0] }),
      auth
    );
    expensesDuration.add(post.timings.duration);
    chk(post, { 'expense not 500': (r) => r.status !== 500 });

    const list = http.get(`${BASE_URL}/expenses`, auth);
    expensesDuration.add(list.timings.duration);
    chk(list, { 'expense list 200': (r) => r.status === 200 });
  });

  // 6. Messages
  group('Messages — Send + List', () => {
    const post = http.post(
      `${BASE_URL}/messages`,
      JSON.stringify({ text: `Hello from iter ${__ITER}`, sender: 'user', time: '12:00 PM' }),
      auth
    );
    messagesDuration.add(post.timings.duration);
    chk(post, { 'msg not 500': (r) => r.status !== 500 });

    const list = http.get(`${BASE_URL}/messages`, auth);
    messagesDuration.add(list.timings.duration);
    chk(list, { 'msg list 200': (r) => r.status === 200 });
  });

  // 7. Health
  group('Health Check', () => {
    const res = http.get('http://localhost:5000/api/test');
    chk(res, { 'health 200': (r) => r.status === 200 });
  });
}

// ─── handleSummary: modern replacement for --summary-export ──────────────────
// Writes JSON to backend/reports/k6-summary.json (path relative to k6 CWD)
// and prints the standard text table to stdout.
export function handleSummary(data) {
  return {
    'backend/reports/k6-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
