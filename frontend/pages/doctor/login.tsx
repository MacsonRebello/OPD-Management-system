import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { doctorAPI } from '@/utils/api';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function DoctorLogin() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await doctorAPI.login(form.email, form.password);
      
      if (!response.data.is_active) {
        toast.error('Your profile is pending admin approval. Please wait for approval.');
        setLoading(false);
        return;
      }

      const { doctor_id, name, token } = response.data;

      login({ id: doctor_id, name, email: form.email, role: 'doctor', token }, token);

      toast.success('Login successful!');
      router.push('/doctor/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Doctor Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="doctor@hospital.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Not registered yet?{' '}
          <a href="/doctor/register" className="text-green-600 font-bold hover:underline">
            Register here
          </a>
        </p>

        <p className="mt-4 text-center text-gray-600 text-sm">
          <a href="/" className="text-gray-600 font-bold hover:underline">
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
