import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const patientAPI = {
  register: (data: any) => api.post('/patient/register', data),
  login: (email: string, password: string) => api.post('/patient/login', { email, password }),
  getProfile: (patientId: number) => api.get(`/patient/profile/${patientId}`),
  updateProfile: (patientId: number, data: any) => api.put(`/patient/profile/${patientId}`, data),
  getAppointmentHistory: (patientId: number) => api.get(`/patient/appointments/${patientId}`),
};

export const appointmentAPI = {
  bookAppointment: (data: any) => api.post('/appointment/book', data),
  getAvailableSlots: (doctorId: number, date: string) =>
    api.get('/appointment/available-slots', { params: { doctor_id: doctorId, appointment_date: date } }),
  getQueueStatus: (doctorId: number, date: string) =>
    api.get('/appointment/queue-status', { params: { doctor_id: doctorId, appointment_date: date } }),
  cancelAppointment: (appointmentId: number) => api.put(`/appointment/cancel/${appointmentId}`),
};

export const doctorAPI = {
  login: (email: string, password: string) => api.post('/doctor/login', { email, password }),
  getAllDoctors: () => api.get('/doctor/all'),
  getDoctorById: (doctorId: number) => api.get(`/doctor/${doctorId}`),
  addDoctor: (data: any) => api.post('/doctor/register', data),
  updateDoctor: (doctorId: number, data: any) => api.put(`/doctor/${doctorId}`, data),
  getDoctorPatients: (doctorId: number, date?: string) => 
    api.get(`/doctor/${doctorId}/patients`, { params: date ? { appointment_date: date } : {} }),
  callNextPatient: (doctorId: number, data: any) => api.put(`/doctor/${doctorId}/call-next`, data),
  completeConsultation: (appointmentId: number) => api.put(`/doctor/complete-consultation/${appointmentId}`),
};

export const bedAPI = {
  getAllBeds: () => api.get('/bed/all'),
  getBedAvailability: () => api.get('/bed/availability'),
  allocateBed: (data: any) => api.post('/bed/allocate', data),
  releaseBed: (data: any) => api.put('/bed/release', data),
};

export const analyticsAPI = {
  getDailyCount: (date?: string) => api.get('/analytics/daily-count', { params: { date } }),
  getWaitingTime: (date?: string) => api.get('/analytics/waiting-time', { params: { date } }),
  getDoctorWorkload: (date?: string) => api.get('/analytics/doctor-workload', { params: { date } }),
  getBedUtilization: () => api.get('/analytics/bed-utilization'),
  getDepartmentStats: () => api.get('/analytics/department-stats'),
  getMonthlyReport: (year: number, month: number) =>
    api.get('/analytics/monthly-report', { params: { year, month } }),
  getDashboardSummary: () => api.get('/analytics/dashboard-summary'),
};

export const adminAPI = {
  login: (email: string, password: string) => api.post('/admin/login', { email, password }),
  register: (data: any) => api.post('/admin/register', data),
  getAll: () => api.get('/admin/all'),
  getById: (adminId: number) => api.get(`/admin/${adminId}`),
  update: (adminId: number, data: any) => api.put(`/admin/${adminId}`, data),
};

export default api;
