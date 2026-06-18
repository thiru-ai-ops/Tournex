import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
};

const BASE_URL = 'http://localhost:5000/api';

export default function () {
  const loginPayload = JSON.stringify({
    email: 'test.user@tournex.com',
    password: 'pass123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // 1. Authenticate and retrieve token
  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);
  
  const loginOk = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'has token': (r) => {
      try {
        const body = JSON.parse(r.body);
        return !!(body.success && body.data && body.data.token);
      } catch (e) {
        return false;
      }
    },
  });

  if (!loginOk) {
    sleep(1);
    return;
  }

  let token;
  try {
    token = JSON.parse(loginRes.body).data.token;
  } catch (e) {
    sleep(1);
    return;
  }

  const authParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  // 2. Fetch User Profile
  const profileRes = http.get(`${BASE_URL}/users/profile`, authParams);
  check(profileRes, {
    'profile status is 200': (r) => r.status === 200,
  });

  // 3. Fetch Expenses
  const expensesRes = http.get(`${BASE_URL}/expenses`, authParams);
  check(expensesRes, {
    'expenses status is 200': (r) => r.status === 200,
  });

  // 4. Fetch Bookings
  const bookingsRes = http.get(`${BASE_URL}/bookings/my-bookings`, authParams);
  check(bookingsRes, {
    'bookings status is 200': (r) => r.status === 200,
  });

  // 1 second think-time between iterations
  sleep(1);
}
