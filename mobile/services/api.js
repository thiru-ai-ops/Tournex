import { API_BASE_URL } from '../config';

let authToken = null;
let isOfflineFallbackActive = false;

// Seed data for offline/guest mode simulation
let localUser = {
  uid: 'mock-guest-uid',
  name: 'Guest Explorer',
  email: 'explorer.guest@tournex.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
  bio: 'Roaming the architectural gems of India in offline sandbox mode.',
  location: 'New Delhi, India',
  role: 'user',
  tier: 'Explorer Tier',
  joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  statesVisited: 3,
  savedTripsCount: 2,
  reviewsCount: 1,
  savedTotal: 12500,
  level: 1,
  currentXp: 450,
  maxXp: 1000
};

let localExpenses = [
  {
    id: 'expense-seed-1',
    description: 'Amer Fort Ticket Purchase',
    amount: 1600,
    category: 'Activity',
    paidBy: 'Arjun',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'expense-seed-2',
    description: 'Lassi treats at Lassiwala',
    amount: 350,
    category: 'Food',
    paidBy: 'Priya',
    splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
    date: new Date().toISOString().split('T')[0]
  }
];

let localBookings = [
  {
    id: 'booking-seed-1',
    name: 'Amer Fort Fast-Pass Entry',
    status: 'UPCOMING',
    dates: 'Tomorrow • 1 Day Pass',
    price: 200,
    bookingId: 'TNX-PASS-492716',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800'
  }
];

let localMessages = [
  {
    id: 'msg-seed-1',
    sender: 'ai',
    text: "Namaste! I'm your TourNex AI Travel Companion. How can I assist you with your exploration of India today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

export const setAuthToken = (token) => {
  authToken = token;
  if (token === 'mock-guest-token') {
    isOfflineFallbackActive = true;
  } else if (!token) {
    isOfflineFallbackActive = false;
  }
};

const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
    ...(authToken && authToken !== 'mock-guest-token' ? { 'Authorization': `Bearer ${authToken}` } : {})
  };
};

export async function request(method, path, data) {
  // If we are already explicitly using guest token, bypass request immediately
  if (isOfflineFallbackActive) {
    console.log(`[Offline Mode] Intercepted ${method} ${path}`);
    return handleOfflineRequest(method, path, data);
  }

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
    console.warn(`[API Switch] Server down (${error.message}). Switching to Offline Fallback Mode.`);
    isOfflineFallbackActive = true;
    return handleOfflineRequest(method, path, data);
  }
}

// Simulated offline request router
function handleOfflineRequest(method, path, data) {
  if (path === '/auth/login') {
    const email = data?.email || 'guest@tournex.com';
    localUser.email = email;
    localUser.name = email.split('@')[0].replace(/\./g, ' ');
    return {
      success: true,
      data: {
        token: 'mock-guest-token',
        user: localUser
      },
      message: 'User logged in successfully (Offline Simulator)'
    };
  }

  if (path === '/auth/register') {
    if (data) {
      localUser = { ...localUser, ...data, uid: 'mock-guest-uid' };
    }
    return {
      success: true,
      data: {
        user: localUser
      },
      message: 'User registered successfully (Offline Simulator)'
    };
  }

  if (path === '/users/profile') {
    if (method === 'PUT' && data) {
      localUser = { ...localUser, ...data };
      return {
        success: true,
        data: { user: localUser },
        message: 'User profile updated successfully (Offline Simulator)'
      };
    }
    return {
      success: true,
      data: { user: localUser },
      message: 'User profile retrieved successfully (Offline Simulator)'
    };
  }

  if (path === '/expenses') {
    if (method === 'POST' && data) {
      const exp = { ...data, id: data.id || `expense-${Date.now()}` };
      localExpenses.push(exp);
      return { success: true, data: { expense: exp } };
    }
    return {
      success: true,
      data: { expenses: [...localExpenses] }
    };
  }

  if (path.startsWith('/expenses/')) {
    if (method === 'DELETE') {
      if (path.endsWith('/clear')) {
        localExpenses = [];
        return { success: true };
      }
      const id = path.split('/').pop();
      localExpenses = localExpenses.filter(e => e.id !== id);
      return { success: true };
    }
  }

  if (path === '/bookings/my-bookings' || path === '/bookings') {
    if (method === 'POST' && data) {
      const booking = { ...data, id: data.id || `booking-${Date.now()}` };
      localBookings.push(booking);
      return { success: true, data: { booking } };
    }
    return {
      success: true,
      data: { bookings: [...localBookings] }
    };
  }

  if (path === '/messages') {
    if (method === 'POST' && data) {
      const msg = { ...data, id: data.id || `msg-${Date.now()}` };
      localMessages.push(msg);
      return { success: true, data: { message: msg } };
    }
    return {
      success: true,
      data: { messages: [...localMessages] }
    };
  }

  if (path.startsWith('/messages/')) {
    if (method === 'DELETE' && path.endsWith('/clear')) {
      localMessages = [];
      return { success: true };
    }
  }

  return { success: true, message: 'Offline handler stub' };
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
  updateProfile: (profileData) => request('PUT', '/users/profile', profileData),
  
  getExpenses: () => request('GET', '/expenses'),
  addExpense: (expense) => request('POST', '/expenses', expense),
  deleteExpense: (id) => request('DELETE', `/expenses/${id}`),
  clearExpenses: () => request('DELETE', '/expenses/all/clear'),
  
  getBookings: () => request('GET', '/bookings/my-bookings'),
  addBooking: (booking) => request('POST', '/bookings', booking),

  getMessages: () => request('GET', '/messages'),
  addMessage: (message) => request('POST', '/messages', message),
  clearMessages: () => request('DELETE', '/messages/all/clear'),
  
  logout: () => {
    setAuthToken(null);
  },
  isOfflineMode: () => isOfflineFallbackActive
};
