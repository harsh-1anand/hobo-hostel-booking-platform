import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Global Error Interceptor for Authentication
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);

// Dynamic Query String compiling for Advanced Search
export const getHostels = (params = {}) => {
  const query = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      if (Array.isArray(params[key])) {
         params[key].forEach(val => query.append(key, val));
      } else {
         query.append(key, params[key]);
      }
    }
  });
  return API.get(`/hostels?${query.toString()}`);
};

export const getHostel = (id) => API.get(`/hostels/${id}`);
export const addHostel = (data) => API.post('/hostels', data);
export const createBooking = (data) => API.post('/bookings', data);
export const getMyBookings = () => API.get('/bookings/my');
export const getOwnerBookings = () => API.get('/bookings/owner/all');
export const getBookingById = (id) => API.get(`/bookings/${id}`);
export const updateBookingPayment = (id, data) => API.patch(`/bookings/${id}/payment`, data);
export const markCheckout = (id) => API.patch(`/bookings/${id}/checkout`);
export const cancelBooking = (id) => API.put(`/bookings/${id}/cancel`);

// New Endpoints
export const getMyNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.patch(`/notifications/${id}/read`);

export const checkAvailability = (id, checkIn, checkOut) => API.get(`/hostels/${id}/availability?checkIn=${checkIn}&checkOut=${checkOut}`);

export const addReview = (data) => API.post('/reviews', data);
export const getHostelReviews = (id) => API.get(`/reviews/hostel/${id}`);

export const getPendingHostels = () => API.get('/admin/hostels/pending');
export const approveHostel = (id) => API.patch(`/admin/hostels/${id}/approve`);
export const rejectHostel = (id) => API.patch(`/admin/hostels/${id}/reject`);

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return API.get(`/admin/users?${query}`);
};
export const getAdminOwners = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return API.get(`/admin/owners?${query}`);
};
export const getAdminHostels = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return API.get(`/admin/hostels?${query}`);
};

export const getOwnerStats = () => API.get('/owner/stats');
export const getOwnerHostels = () => API.get('/owner/hostels');

export const getUserProfile = () => API.get('/users/me');
export const updateProfile = (data) => API.put('/users/me', data);
export const getMyBookingsCategorized = () => API.get('/users/me/bookings');
export const getWishlist = () => API.get('/users/wishlist');
export const toggleWishlist = (id) => API.post(`/users/wishlist/${id}`);
