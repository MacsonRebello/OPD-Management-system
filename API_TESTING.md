# Smart OPD Queue System - API Testing Guide

## Testing with Postman or cURL

### 1. Patient Registration

**Endpoint**: `POST /api/patient/register`

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

**Response**:
```json
{
  "message": "Patient registered successfully",
  "patient_id": 1
}
```

---

### 2. Patient Login

**Endpoint**: `POST /api/patient/login`

```bash
curl -X POST http://localhost:5000/api/patient/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "message": "Login successful",
  "patient_id": 1,
  "name": "John Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get Patient Profile

**Endpoint**: `GET /api/patient/profile/:id`

```bash
curl -X GET http://localhost:5000/api/patient/profile/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response**:
```json
{
  "patient_id": 1,
  "name": "John Doe",
  "phone": "9876543210",
  "age": 30,
  "gender": "Male",
  "email": "john@example.com",
  "medical_id": "MED001",
  "created_at": "2024-03-04T10:00:00.000Z"
}
```

---

### 4. Register Doctor (Admin)

**Endpoint**: `POST /api/doctor/register`

```bash
curl -X POST http://localhost:5000/api/doctor/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "name": "Dr. Rajesh Singh",
    "email": "rajesh@hospital.com",
    "password": "password123",
    "phone": "9876543211",
    "department": "Cardiology",
    "specialization": "Heart Specialist",
    "experience": 10,
    "availability": "09:00-17:00"
  }'
```

**Response**:
```json
{
  "message": "Doctor added successfully",
  "doctor_id": 1
}
```

---

### 5. Doctor Login

**Endpoint**: `POST /api/doctor/login`

```bash
curl -X POST http://localhost:5000/api/doctor/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@hospital.com",
    "password": "password123"
  }'
```

**Response**:
```json
{
  "message": "Login successful",
  "doctor_id": 1,
  "name": "Dr. Rajesh Singh",
  "department": "Cardiology",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 6. Get Available Doctor Time Slots

**Endpoint**: `GET /api/appointment/available-slots?doctor_id=1&appointment_date=2024-03-15`

```bash
curl -X GET "http://localhost:5000/api/appointment/available-slots?doctor_id=1&appointment_date=2024-03-15"
```

**Response**:
```json
{
  "date": "2024-03-15",
  "available_slots": [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00"
  ],
  "total_slots": 17,
  "booked_count": 0
}
```

---

### 7. Book Appointment

**Endpoint**: `POST /api/appointment/book`

```bash
curl -X POST http://localhost:5000/api/appointment/book \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -d '{
    "patient_id": 1,
    "doctor_id": 1,
    "appointment_date": "2024-03-15",
    "appointment_time": "10:00",
    "reason": "Regular checkup"
  }'
```

**Response**:
```json
{
  "message": "Appointment booked successfully",
  "appointment_id": 1,
  "token_number": 1,
  "appointment_date": "2024-03-15",
  "appointment_time": "10:00"
}
```

---

### 8. Get Queue Status

**Endpoint**: `GET /api/appointment/queue-status?doctor_id=1&appointment_date=2024-03-15`

```bash
curl -X GET "http://localhost:5000/api/appointment/queue-status?doctor_id=1&appointment_date=2024-03-15"
```

**Response**:
```json
{
  "doctor_id": 1,
  "date": "2024-03-15",
  "queue_count": 3,
  "patients": [
    {
      "token_number": 1,
      "appointment_time": "10:00",
      "status": "in_progress",
      "name": "John Doe",
      "appointment_id": 1
    },
    {
      "token_number": 2,
      "appointment_time": "10:30",
      "status": "scheduled",
      "name": "Jane Smith",
      "appointment_id": 2
    }
  ]
}
```

---

### 9. Add Bed (Admin)

**Endpoint**: `POST /api/bed/add`

```bash
curl -X POST http://localhost:5000/api/bed/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "bed_number": "ICU-001",
    "bed_type": "ICU",
    "department": "Critical Care",
    "status": "available"
  }'
```

**Response**:
```json
{
  "message": "Bed added successfully",
  "bed_id": 1
}
```

---

### 10. Get Bed Availability

**Endpoint**: `GET /api/bed/availability`

```bash
curl -X GET http://localhost:5000/api/bed/availability
```

**Response**:
```json
[
  {
    "bed_type": "ICU",
    "total_beds": 10,
    "available_beds": 7,
    "occupied_beds": 3,
    "utilization_percentage": 30.0
  },
  {
    "bed_type": "Emergency",
    "total_beds": 15,
    "available_beds": 12,
    "occupied_beds": 3,
    "utilization_percentage": 20.0
  }
]
```

---

### 11. AI - Predict Waiting Time

**Endpoint**: `POST /api/predict-waiting-time`

```bash
curl -X POST http://localhost:5001/api/predict-waiting-time \
  -H "Content-Type: application/json" \
  -d '{
    "patients_in_queue": 10,
    "avg_consultation_time": 15,
    "current_position": 5
  }'
```

**Response**:
```json
{
  "status": "success",
  "waiting_time_minutes": 71,
  "patients_ahead": 4,
  "predicted_time": "14:35:42"
}
```

---

### 12. AI - Predict Crowd Level

**Endpoint**: `POST /api/predict-crowd-level`

```bash
curl -X POST http://localhost:5001/api/predict-crowd-level \
  -H "Content-Type: application/json" \
  -d '{
    "patients_in_queue": 12
  }'
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "level": "high",
    "percentage": 100,
    "recommendation": "High crowd. Consider visiting later."
  }
}
```

---

### 13. Dashboard Summary (Admin)

**Endpoint**: `GET /api/analytics/dashboard-summary`

```bash
curl -X GET http://localhost:5000/api/analytics/dashboard-summary \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response**:
```json
{
  "today_appointments": 15,
  "total_doctors": 5,
  "total_patients": 42,
  "bed_availability": {
    "total_beds": 50,
    "available_beds": 22,
    "occupied_beds": 28
  }
}
```

---

### 14. Doctor Workload (Admin)

**Endpoint**: `GET /api/analytics/doctor-workload`

```bash
curl -X GET http://localhost:5000/api/analytics/doctor-workload \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Response**:
```json
{
  "date": "All time",
  "doctors": [
    {
      "doctor_id": 1,
      "name": "Dr. Rajesh Singh",
      "department": "Cardiology",
      "total_patients": 25,
      "completed_consultations": 20
    }
  ]
}
```

---

## Test Data Creation Script

### Postman Collection (JSON)

```json
{
  "info": {
    "name": "Smart OPD System API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Patient Registration",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/patient/register",
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John Doe\", \"phone\": \"9876543210\", \"age\": 30, \"gender\": \"Male\", \"email\": \"john@example.com\", \"password\": \"password123\", \"medical_id\": \"MED001\"}"
        }
      }
    },
    {
      "name": "Patient Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/patient/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"john@example.com\", \"password\": \"password123\"}"
        }
      }
    }
  ]
}
```

---

## Common Errors and Solutions

### Error: Database connection failed

**Cause**: MySQL not running or incorrect credentials

**Solution**:
```bash
# Check MySQL service
mysql -u root -p

# Run schema
SOURCE database/opd_system_schema.sql;
```

### Error: Token not provided

**Solution**: Include Authorization header in request:
```bash
-H "Authorization: Bearer YOUR_TOKEN"
```

### Error: Port already in use

**Solution**:
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F
```

---

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test appointment booking endpoint
ab -n 100 -c 10 -p data.json -T application/json \
  http://localhost:5000/api/appointment/book
```

### Concurrent User Simulation

```bash
# Test with 50 concurrent users
siege -c 50 -r 100 \
  http://localhost:5000/api/patient/login
```

---

## API Response Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict (e.g., duplicate email)
- **500**: Internal Server Error

---

**Last Updated**: March 2024
