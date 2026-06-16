import API_BASE_URL from "../lib/apiConfig";

const API_BASE = `${API_BASE_URL}/api`;

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function request(method: string, path: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: getHeaders(),
  };
  if (data) {
    options.body = JSON.stringify(data);
  }

  const res = await fetch(`${API_BASE}${path}`, options);
  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }
  return json;
}

export const api = {
  login: (credentials: any) => request("POST", "/auth/login", credentials),
  register: (userData: any) => request("POST", "/auth/register", userData),
  getProfile: () => request("GET", "/users/profile"),
  updateProfile: (profileData: any) => request("PUT", "/users/profile", profileData),
  
  getExpenses: () => request("GET", "/expenses"),
  addExpense: (expense: any) => request("POST", "/expenses", expense),
  deleteExpense: (id: string) => request("DELETE", `/expenses/${id}`),
  clearExpenses: () => request("DELETE", "/expenses/all/clear"),

  getBookings: () => request("GET", "/bookings/my-bookings"),
  addBooking: (booking: any) => request("POST", "/bookings", booking),

  getMessages: () => request("GET", "/messages"),
  addMessage: (message: any) => request("POST", "/messages", message),
  clearMessages: () => request("DELETE", "/messages/all/clear"),
};
