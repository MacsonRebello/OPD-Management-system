# Smart OPD Queue & Hospital Bed Management System

A comprehensive hospital management system that handles patient queues, appointments, doctor scheduling, bed management, and real-time analytics with AI-powered waiting time prediction.

## 🚀 Features

### 1. **Patient Management Module**
- User registration and authentication
- Profile management
- Appointment history tracking
- Real-time queue status

### 2. **Appointment & Token System**
- Book appointments with available doctors
- Automatic token generation (FIFO-based)
- View available time slots
- Appointment cancellation

### 3. **Queue Management**
- Real-time queue tracking
- Token number assignment
- Queue position updates
- Patient calling system

### 4. **AI Waiting Time Prediction**
- Predict waiting time based on queue position
- Crowd level assessment
- Time-of-day multipliers for peak hours
- Batch predictions for multiple patients

### 5. **Doctor Management**
- Doctor registration and login
- Appointment management
- Patient queue viewing
- Consultation tracking

### 6. **Bed Management**
- Real-time bed availability tracking
- Bed allocation to patients
- Bed release and discharge
- Bed type classification (ICU, Emergency, General Ward)

### 7. **Admin Dashboard**
- Hospital-wide analytics
- Daily patient count
- Doctor workload monitoring
- Bed utilization reports
- Monthly and yearly statistics

### 8. **Real-time Analytics**
- Dashboard summary
- Department-wise statistics
- Waiting time analysis
- Doctor performance metrics

## 🏗️ Project Structure

```
opd-system/
├── backend/                    (Node.js/Express API)
│   ├── controllers/           (Business logic)
│   ├── routes/               (API endpoints)
│   ├── middleware/           (Authentication, validation)
│   ├── db.js                 (Database connection)
│   ├── server.js             (Main server file)
│   ├── package.json
│   └── .env.example
│
├── frontend/                  (Next.js React App)
│   ├── pages/               (Application pages)
│   ├── components/          (Reusable components)
│   ├── styles/              (CSS styling)
│   ├── store/              (Zustand state management)
│   ├── utils/              (API calls, helpers)
│   ├── package.json
│   └── next.config.js
│
├── ai-model/                (Python Flask API)
│   ├── app.py              (ML model and API)
│   └── requirements.txt
│
├── database/               (Database schema)
│   └── opd_system_schema.sql
│
└── README.md
```

## 💻 Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

### Frontend
- **Framework**: Next.js with React
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### AI Model
- **Framework**: Flask (Python)
- **Machine Learning**: NumPy, Scikit-learn
- **Data Processing**: Pandas

## 📋 Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🔧 Installation

### 1. Setup Database

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source database/opd_system_schema.sql;
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=opd_system

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Setup AI Model

```bash
cd ai-model

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the AI server
python app.py
```

AI Model will run on `http://localhost:5001`

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local (optional)
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Patient Endpoints

```
POST   /api/patient/register          - Register new patient
POST   /api/patient/login             - Patient login
GET    /api/patient/profile/:id       - Get patient profile
PUT    /api/patient/profile/:id       - Update patient profile
GET    /api/patient/appointments/:id  - Get appointment history
```

### Appointment Endpoints

```
POST   /api/appointment/book              - Book appointment
GET    /api/appointment/available-slots   - Get available time slots
GET    /api/appointment/queue-status      - Get queue status
PUT    /api/appointment/cancel/:id        - Cancel appointment
```

### Doctor Endpoints

```
POST   /api/doctor/register              - Register doctor (admin only)
POST   /api/doctor/login                 - Doctor login
GET    /api/doctor/all                   - Get all doctors
GET    /api/doctor/:id                   - Get doctor details
GET    /api/doctor/:id/patients          - Get doctor's patients
PUT    /api/doctor/:id/call-next         - Call next patient
PUT    /api/doctor/complete/:id          - Complete consultation
```

### Bed Endpoints

```
POST   /api/bed/add                  - Add new bed (admin)
GET    /api/bed/all                  - Get all beds
GET    /api/bed/availability         - Get bed availability
POST   /api/bed/allocate             - Allocate bed to patient (admin)
PUT    /api/bed/release              - Release bed (admin)
PUT    /api/bed/:id/status           - Update bed status (admin)
```

### Analytics Endpoints

```
GET    /api/analytics/daily-count        - Daily patient count
GET    /api/analytics/waiting-time       - Average waiting time
GET    /api/analytics/doctor-workload    - Doctor workload stats
GET    /api/analytics/bed-utilization    - Bed utilization
GET    /api/analytics/department-stats   - Department statistics
GET    /api/analytics/monthly-report     - Monthly report
GET    /api/analytics/dashboard-summary  - Dashboard summary
```

### AI Model Endpoints

```
POST   /api/predict-waiting-time      - Predict waiting time
POST   /api/predict-token-call-time   - Predict token call time
POST   /api/predict-crowd-level       - Predict crowd level
POST   /api/predict-batch             - Batch predictions
GET    /api/health                    - Health check
```

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. User logs in with email and password
2. Server returns JWT token
3. Token is stored in localStorage
4. All subsequent requests include token in Authorization header

```
Authorization: Bearer <token>
```

## 🗄️ Database Schema

The system uses 11 main tables:

1. **patients** - Patient information
2. **doctors** - Doctor details
3. **appointments** - Appointment records
4. **beds** - Hospital bed inventory
5. **admissions** - Patient admission records
6. **queue_status** - Real-time queue info
7. **notifications** - Patient notifications
8. **admins** - Admin users
9. **analytics** - Historical analytics data

## 🧠 AI Model Details

The waiting time prediction model uses:

- **Inputs**: Patients in queue, average consultation time, patient position
- **Algorithm**: Linear calculation with peak-hour multiplier
- **Peak Hours**: 9-11 AM and 2-4 PM (1.2x multiplier)
- **Buffer Time**: 10% additional time for administrative tasks

## 🚀 Deployment

### Backend Deployment (Heroku)

```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
cd frontend
npm install -g vercel
vercel
```

### AI Model Deployment (Heroku)

```bash
cd ai-model
heroku create your-ai-app-name
git push heroku main
```

## 📊 Usage Examples

### Patient Registration

```bash
curl -X POST http://localhost:5000/api/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "age": 30,
    "gender": "Male",
    "email": "john@example.com",
    "password": "password123",
    "medical_id": "MED001"
  }'
```

### Book Appointment

```bash
curl -X POST http://localhost:5000/api/appointment/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2024-03-15",
    "appointment_time": "10:00",
    "reason": "Regular checkup"
  }'
```

### Predict Waiting Time

```bash
curl -X POST http://localhost:5001/api/predict-waiting-time \
  -H "Content-Type: application/json" \
  -d '{
    "patients_in_queue": 10,
    "avg_consultation_time": 15,
    "current_position": 5
  }'
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@opdsystem.com or create an issue in the repository.

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] SMS notifications
- [ ] Email integration
- [ ] Video consultations
- [ ] Prescription management
- [ ] Billing integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

## 👥 Team

- **Developer**: Your Name
- **Contributors**: [List contributors]

---

**Last Updated**: March 2024
