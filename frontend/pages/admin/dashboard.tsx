import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { analyticsAPI } from '@/utils/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dailyCount, setDailyCount] = useState<any>(null);
  const [waitingTime, setWaitingTime] = useState<any>(null);
  const [doctorWorkload, setDoctorWorkload] = useState<any>(null);
  const [departmentStats, setDepartmentStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/admin/login');
      return;
    }

    loadDashboardData();
  }, [token]);

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data...');
      console.log('Token:', token);

      // Load dashboard summary
      try {
        console.log('Fetching dashboard summary...');
        const summary = await analyticsAPI.getDashboardSummary();
        console.log('Summary data:', summary.data);
        setDashboardData(summary.data);
      } catch (error: any) {
        console.error('Failed to load dashboard summary:', error.response?.data || error.message);
      }

      // Load daily count
      try {
        console.log('Fetching daily count...');
        const daily = await analyticsAPI.getDailyCount();
        console.log('Daily count data:', daily.data);
        setDailyCount(daily.data);
      } catch (error: any) {
        console.error('Failed to load daily count:', error.response?.data || error.message);
      }

      // Load waiting time
      try {
        console.log('Fetching waiting time...');
        const waiting = await analyticsAPI.getWaitingTime();
        console.log('Waiting time data:', waiting.data);
        setWaitingTime(waiting.data);
      } catch (error: any) {
        console.error('Failed to load waiting time:', error.response?.data || error.message);
      }

      // Load doctor workload
      try {
        console.log('Fetching doctor workload...');
        const workload = await analyticsAPI.getDoctorWorkload();
        console.log('Workload data:', workload.data);
        setDoctorWorkload(workload.data);
      } catch (error: any) {
        console.error('Failed to load doctor workload:', error.response?.data || error.message);
      }

      // Load department stats
      try {
        console.log('Fetching department stats...');
        const depts = await analyticsAPI.getDepartmentStats();
        console.log('Department stats:', depts.data);
        setDepartmentStats(depts.data);
      } catch (error: any) {
        console.error('Failed to load department stats:', error.response?.data || error.message);
      }

      toast.success('Dashboard data loaded');
    } catch (error: any) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard data');
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
      <nav className="bg-red-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button onClick={handleLogout} className="hover:bg-red-700 px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-bold mb-2">TODAY'S APPOINTMENTS</h3>
            <p className="text-3xl font-bold text-blue-600">{dashboardData?.today_appointments || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-bold mb-2">TOTAL DOCTORS</h3>
            <p className="text-3xl font-bold text-green-600">{dashboardData?.total_doctors || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-bold mb-2">TOTAL PATIENTS</h3>
            <p className="text-3xl font-bold text-purple-600">{dashboardData?.total_patients || 0}</p>
          </div>
        </div>

        {/* Daily Count Stats */}
        {dailyCount && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Daily Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded p-4">
                <p className="text-gray-600 text-sm font-medium">Total Patients Today</p>
                <p className="text-2xl font-bold text-blue-600">{dailyCount?.total_patients || 0}</p>
              </div>
              <div className="bg-green-50 rounded p-4">
                <p className="text-gray-600 text-sm font-medium">Date</p>
                <p className="text-lg font-bold text-green-600">{dailyCount?.date || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Waiting Time Analytics */}
        {waitingTime && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Waiting Time Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded p-4">
                <p className="text-gray-600 text-sm font-medium">Average Wait Time</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(waitingTime?.average_waiting_time || 0)} min</p>
              </div>
              <div className="bg-indigo-50 rounded p-4">
                <p className="text-gray-600 text-sm font-medium">Total Consultations</p>
                <p className="text-2xl font-bold text-indigo-600">{waitingTime?.total_consultations || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Doctor Workload */}
        {doctorWorkload && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Doctor Workload</h3>
            <div className="space-y-4">
              {doctorWorkload?.doctors?.map((doctor: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                  <div>
                    <p className="font-bold text-gray-700">Dr. {doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.department}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Appointments</p>
                      <p className="text-2xl font-bold text-blue-600">{doctor.total_patients || 0}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-600">{doctor.completed_consultations || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Department Statistics */}
        {departmentStats && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Department Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departmentStats?.departments?.map((dept: any, idx: number) => (
                <div key={idx} className="p-4 bg-gray-50 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-bold text-gray-700">{dept.department}</p>
                    <span className="text-sm text-gray-600">{dept.doctors_available || 0} doctors</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <p className="text-gray-600 text-xs">Appointments: {dept.total_appointments || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Completed: {dept.completed_appointments || 0}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs">Unique Patients: {dept.unique_patients || 0}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <a href="/admin/approve-doctors" className="bg-blue-600 text-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <h4 className="font-bold text-lg">Manage Doctors</h4>
            <p className="text-sm mt-2">Approve and manage doctors</p>
          </a>
        </div>
      </div>
    </div>
  );
}
