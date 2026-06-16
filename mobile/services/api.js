import { API_BASE_URL } from '../config';

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
  };
};

export async function request(method, path, data) {
  const options = {
    method,
    headers: getHeaders()
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, options);
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.message || 'Request failed');
    }
    return json;
  } catch (error) {
    console.error(`Fetch API Error (${method} ${path}):`, error.message);
    throw new Error(error.message || 'Network connectivity issue. Please check host IP.');
  }
}

export const api = {
  login: async (email, password) => {
    const res = await request('POST', '/auth/login', { email, password });
    if (res.success && res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },
  register: (userData) => request('POST', '/auth/register', userData),
  getProfile: () => request('GET', '/users/profile'),
  getExpenses: () => request('GET', '/expenses'),
  getBookings: () => request('GET', '/bookings/my-bookings'),
  logout: () => {
    setAuthToken(null);
  }
};
