import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { appointmentAPI, doctorAPI } from '@/utils/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function BookAppointment() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    doctor_id: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  });

  useEffect(() => {
    if (!token) {
      router.push('/patient/login');
      return;
    }

    fetchDoctors();
  }, [token]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const handleDoctorChange = async (doctorId: string) => {
    setForm((prev) => ({ ...prev, doctor_id: doctorId, appointment_time: '' }));
    
    if (form.appointment_date) {
      await fetchAvailableSlots(doctorId, form.appointment_date);
    }
  };

  const handleDateChange = async (date: string) => {
    setForm((prev) => ({ ...prev, appointment_date: date, appointment_time: '' }));
    
    if (form.doctor_id) {
      await fetchAvailableSlots(form.doctor_id, date);
    }
  };

  const fetchAvailableSlots = async (doctorId: string, date: string) => {
    try {
      const response = await appointmentAPI.getAvailableSlots(parseInt(doctorId), date);
      setAvailableSlots(response.data.available_slots);
    } catch (error) {
      toast.error('Failed to fetch available slots');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await appointmentAPI.bookAppointment({
        patient_id: user?.id,
        doctor_id: parseInt(form.doctor_id),
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        reason: form.reason,
      });

      toast.success(`Appointment booked! Token: ${response.data.token_number}`);
      router.push('/patient/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Book Appointment</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Select Doctor</label>
            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={(e) => handleDoctorChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor: any) => (
                <option key={doctor.doctor_id} value={doctor.doctor_id}>
                  Dr. {doctor.name} - {doctor.department}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Appointment Date</label>
            <input
              type="date"
              name="appointment_date"
              value={form.appointment_date}
              onChange={(e) => handleDateChange(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Appointment Time</label>
            <select
              name="appointment_time"
              value={form.appointment_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Select time</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Reason for Visit</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for visit"
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
