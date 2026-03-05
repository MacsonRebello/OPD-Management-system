import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { appointmentAPI, doctorAPI } from '@/utils/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import axios from 'axios';

interface WaitingTimeData {
  waiting_time_minutes: number;
  predicted_time: string;
  patients_ahead: number;
}

interface Doctor {
  doctor_id: number;
  name: string;
}

export default function QueueStatus() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [queueData, setQueueData] = useState<any>(null);
  const [waitingTime, setWaitingTime] = useState<WaitingTimeData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/patient/login');
    } else {
      fetchDoctors();
    }
  }, [token]);

  const fetchDoctors = async () => {
    try {
      const response = await doctorAPI.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setDoctorId(selectedId);
  };

  const handleCheckQueue = async () => {
    if (!doctorId || !date) {
      toast.error('Please select doctor and date');
      return;
    }

    setLoading(true);
    try {
      const response = await appointmentAPI.getQueueStatus(parseInt(doctorId), date);
      setQueueData(response.data);

      const patients = response.data.patients || [];

      // Find current patient's position in time-sorted queue (appointment_time ASC)
      let patientPosition = 1;
      const currentPatientId = Number(user?.id);
      const patientIndex = patients.findIndex((p: any) => Number(p.patient_id) === currentPatientId);

      if (patientIndex >= 0) {
        patientPosition = patientIndex + 1;
      }

      // Extract opening time (e.g., "09:00")
      const openingTime = response.data.opening_time || '09:00';

      // Call AI model with proper position
      const aiResponse = await axios.post('http://localhost:5001/api/predict-waiting-time', {
        patients_in_queue: response.data.queue_count,
        avg_consultation_time: 15,
        current_position: patientPosition,
        opening_time: openingTime,
      });

      setWaitingTime(aiResponse.data);
      toast.success('Queue status updated');
    } catch (error) {
      toast.error('Failed to fetch queue status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Queue Status Tracker</h1>
          <button
            onClick={() => router.push('/patient/dashboard')}
            className="hover:bg-blue-700 px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Selection Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Check Queue Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Doctor</label>
              <select
                value={doctorId}
                onChange={handleDoctorChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleCheckQueue}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Check Queue'}
              </button>
            </div>
          </div>
        </div>

        {/* Waiting Time Prediction */}
        {waitingTime && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Waiting Time Prediction</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-600 text-sm">Estimated Wait Time</p>
                <p className="text-3xl font-bold text-green-600">{waitingTime.waiting_time_minutes} mins</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-600 text-sm">Patients Ahead</p>
                <p className="text-3xl font-bold text-blue-600">{waitingTime.patients_ahead}</p>
              </div>

              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-600 text-sm">Predicted Call Time</p>
                <p className="text-2xl font-bold text-purple-600">{waitingTime.predicted_time}</p>
              </div>
            </div>
          </div>
        )}

        {/* Queue Details */}
        {queueData && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Queue for Dr. {queueData.doctor_name} - {new Date(queueData.date).toLocaleDateString()} (Total: {queueData.queue_count})
            </h3>
            {queueData.patients.length === 0 ? (
              <p className="text-gray-600">No patients in queue</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Position</th>
                      <th className="px-4 py-2 text-left">Token</th>
                      <th className="px-4 py-2 text-left">Patient Name</th>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queueData.patients.map((patient: any, index: number) => (
                      <tr key={patient.appointment_id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 font-bold">#{index + 1}</td>
                        <td className="px-4 py-2 bg-yellow-100 font-bold">{patient.token_number}</td>
                        <td className="px-4 py-2">{patient.name}</td>
                        <td className="px-4 py-2">{patient.appointment_time}</td>
                        <td className="px-4 py-2">
                          <span className={`px-3 py-1 rounded text-white text-sm font-bold ${
                            patient.status === 'in_progress' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}>
                            {patient.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
