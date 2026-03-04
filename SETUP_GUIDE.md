# Smart OPD Queue System - SETUP & RUN GUIDE

## Prerequisites

- **Node.js**: v14.0.0 or higher
- **Python**: v3.8.0 or higher
- **MySQL**: v5.7.0 or higher
- **Git**: For version control (optional)

## Quick Start

### Step 1: Database Setup

1. **Open MySQL** (using MySQL Workbench or MySQL Command Line):
   ```bash
   mysql -u root -p
   ```

2. **Create Database**:
   ```sql
   CREATE DATABASE IF NOT EXISTS opd_system;
   USE opd_system;
   ```

3. **Run Schema File** (from d:\opd2\database\opd_system_schema.sql):
   ```sql
   SOURCE "d:/opd2/database/opd_system_schema.sql";
   ```

   Or copy-paste the entire SQL schema from the file.

---

### Step 2: Backend Setup (Node.js)

1. **Open Command Prompt** and navigate to backend:
   ```bash
   cd d:\opd2\backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create .env File**:
   ```bash
   copy .env.example .env
   ```

4. **Edit .env** file with your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=opd_system
   JWT_SECRET=your_secret_key_here
   PORT=5000
   PYTHON_AI_URL=http://localhost:5001
   ```

5. **Start Backend Server**:
   ```bash
   npm start
   ```

   You should see:
   ```
   ✅ MySQL Connected Successfully
   🚀 Smart OPD Queue System Backend running on port 5000
   ```

---

### Step 3: AI Model Setup (Python)

1. **Open New Command Prompt** and navigate to ai-model:
   ```bash
   cd d:\opd2\ai-model
   ```

2. **Create Virtual Environment**:
   ```bash
   python -m venv venv
   ```

3. **Activate Virtual Environment**:
   ```bash
   venv\Scripts\activate
   ```

4. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Start AI Server**:
   ```bash
   python app.py
   ```

   You should see:
   ```
   🚀 AI Waiting Time Prediction Model running on port 5001
   ```

---

### Step 4: Frontend Setup (Next.js)

1. **Open New Command Prompt** and navigate to frontend:
   ```bash
   cd d:\opd2\frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Create .env.local** (Optional):
   ```bash
   echo NEXT_PUBLIC_API_URL=http://localhost:5000/api > .env.local
   ```

4. **Start Frontend Development Server**:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ▲ Next.js started
   ✔ Ready in 5.2s
   ○ Local: http://localhost:3000
   ```

---

## 🌐 Access the Application

After all services are running, open your browser:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **AI Model**: http://localhost:5001/api

---

## 🧪 Testing the System

### 1. Test Patient Registration

1. Go to http://localhost:3000
2. Click "Get Started" under "For Patients"
3. Fill in the registration form:
   - Name: John Doe
   - Phone: 9876543210
   - Age: 30
   - Gender: Male
   - Email: john@example.com
   - Password: password123
   - Medical ID: MED001

4. Click "Register"

### 2. Test Patient Login

1. Enter email: john@example.com
2. Enter password: password123
3. Click "Login"

### 3. Test Appointment Booking

1. From patient dashboard, click "Book Appointment"
2. Select a doctor from the dropdown
3. Choose a date
4. Select a time slot
5. Enter reason for visit
6. Click "Book Appointment"

### 4. Test AI Waiting Time Prediction

Using Postman or cURL:

```bash
curl -X POST http://localhost:5001/api/predict-waiting-time \
  -H "Content-Type: application/json" \
  -d '{
    "patients_in_queue": 10,
    "avg_consultation_time": 15,
    "current_position": 5
  }'
```

Expected response:
```json
{
  "status": "success",
  "waiting_time_minutes": 71,
  "patients_ahead": 4,
  "predicted_time": "14:35:42"
}
```

---

## 📊 Test Data

### Add Test Doctor (via Postman)

```
POST http://localhost:5000/api/doctor/register
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "Dr. Rajesh Singh",
  "email": "rajesh@hospital.com",
  "password": "password123",
  "phone": "9876543211",
  "department": "Cardiology",
  "specialization": "Heart Specialist",
  "experience": 10,
  "availability": "09:00-17:00"
}
```

### Add Test Bed (via Postman)

```
POST http://localhost:5000/api/bed/add
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "bed_number": "ICU-001",
  "bed_type": "ICU",
  "department": "Critical Care",
  "status": "available"
}
```

---

## 🔧 Troubleshooting

### MySQL Connection Failed

**Error**: `Database connection failed`

**Solution**:
- Check if MySQL is running
- Verify database credentials in .env
- Ensure database `opd_system` exists

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

### Module Not Found

**Error**: `Cannot find module 'express'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Python Virtual Environment Not Activated

**Solution**:
```bash
# Make sure to activate venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

---

## 📁 File Structure

```
d:\opd2\
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   ├── .env.example
│   └── .env (create this)
│
├── frontend/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── store/
│   ├── utils/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── ai-model/
│   ├── app.py
│   ├── requirements.txt
│   └── venv/ (created after pip install)
│
├── database/
│   └── opd_system_schema.sql
│
└── README.md
```

---

## 🚀 Production Deployment

### Backend (Heroku)

```bash
cd backend
heroku login
heroku create opd-backend
heroku config:set DB_HOST=your_mysql_host
git push heroku main
```

### Frontend (Vercel)

```bash
cd frontend
npm install -g vercel
vercel
```

### AI Model (Heroku)

```bash
cd ai-model
heroku login
heroku create opd-ai-model
git push heroku main
```

---

## 📚 API Documentation

See `README.md` for detailed API endpoints and examples.

---

## ⚡ Performance Tips

1. **Enable Query Caching** in MySQL:
   ```sql
   SET GLOBAL query_cache_size = 262144;
   SET GLOBAL query_cache_type = 1;
   ```

2. **Use Database Indexing** (Already configured in schema)

3. **Enable Gzip Compression** (Already configured in Express)

4. **Use CDN** for frontend static assets (Vercel does this automatically)

---

## 🆘 Need Help?

1. Check logs in each terminal window
2. Review error messages carefully
3. Ensure all prerequisites are installed
4. Check file paths are correct
5. Verify ports are not blocked

---

**Last Updated**: March 2024
