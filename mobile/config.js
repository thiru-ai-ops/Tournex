// Configuration for resolving the Tournex Node.js Express Backend
// IMPORTANT: Replace the IP address below with your host machine's local network IP address
// (e.g. 192.168.1.XX) so that physical devices or emulators running Expo Go can reach the API.
export const BACKEND_IP = process.env.BACKEND_IP || "10.89.142.100"; 
export const BACKEND_PORT = 5000;
export const API_BASE_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/api`;
