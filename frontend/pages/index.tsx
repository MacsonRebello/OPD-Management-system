import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">🏥 Smart OPD System</h1>
          <div className="flex gap-4">
            <Link href="/patient/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Patient Login
              </button>
            </Link>
            <Link href="/doctor/login">
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Doctor Login
              </button>
            </Link>
            <Link href="/admin/dashboard">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Admin Dashboard
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-20 text-white text-center">
        <h2 className="text-5xl font-bold mb-4">Welcome to Smart OPD System</h2>
        <p className="text-xl mb-8">
          Manage patient queues, appointments, and bed availability in real-time
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Patient Card */}
          <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">👤 For Patients</h3>
            <p className="mb-6">Book appointments, track queue position, and get notifications</p>
            <Link href="/patient/register">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Get Started
              </button>
            </Link>
          </div>

          {/* Doctor Card */}
          <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">👨‍⚕️ For Doctors</h3>
            <p className="mb-6">Manage patient queue, consultations, and medical records</p>
            <div className="space-y-3">
              <Link href="/doctor/register">
                <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                  Register
                </button>
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">🔧 For Admins</h3>
            <p className="mb-6">Hospital management, analytics, and bed tracking</p>
            <Link href="/admin/dashboard">
              <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
                Dashboard
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 bg-white text-gray-800 rounded-lg p-8">
          <h3 className="text-3xl font-bold mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <span className="text-3xl mr-4">✓</span>
              <div>
                <h4 className="font-bold mb-2">Token-Based Queue System</h4>
                <p>FIFO queue management with real-time updates</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">✓</span>
              <div>
                <h4 className="font-bold mb-2">AI Waiting Time Prediction</h4>
                <p>Estimate waiting time using machine learning</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">✓</span>
              <div>
                <h4 className="font-bold mb-2">Real-Time Bed Tracking</h4>
                <p>Monitor hospital bed availability and allocations</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">✓</span>
              <div>
                <h4 className="font-bold mb-2">Analytics Dashboard</h4>
                <p>Comprehensive hospital performance reports</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
