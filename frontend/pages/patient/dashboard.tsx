import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { patientAPI } from '@/utils/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function PatientDashboard() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/patient/login');
      return;
    }

    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const profileRes = await patientAPI.getProfile(user?.id!);
      setProfile(profileRes.data);

      const appointmentsRes = await patientAPI.getAppointmentHistory(user?.id!);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">OPD System</h1>
          <div className="flex gap-4">
            <button onClick={handleLogout} className="hover:bg-blue-700 px-4 py-2 rounded">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome, {profile?.name}!</h2>
          <p className="text-gray-600 mt-2">Medical ID: {profile?.medical_id}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link href="/patient/book-appointment">
            <button className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition">
              Book Appointment
            </button>
          </Link>
          <Link href="/patient/queue-status">
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              Check Queue Status
            </button>
          </Link>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">My Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Token</th>
                    <th className="px-4 py-2 text-left">Doctor</th>
                    <th className="px-4 py-2 text-left">Department</th>
                    <th className="px-4 py-2 text-left">Date & Time</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt.appointment_id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 font-bold">{apt.token_number}</td>
                      <td className="px-4 py-2">Dr. {apt.doctor_name}</td>
                      <td className="px-4 py-2">{apt.department}</td>
                      <td className="px-4 py-2">{apt.appointment_date} {apt.appointment_time}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 rounded text-white text-sm font-bold ${
                          apt.status === 'completed' ? 'bg-green-500' :
                          apt.status === 'cancelled' ? 'bg-red-500' :
                          apt.status === 'in_progress' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}>
                          {apt.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
