# 🚀 Smart OPD System - Quick Reference Guide

## 📍 Project Location
```
d:\opd2\
```

## ⚡ Quick Start (Choose Your Platform)

### Windows Users
```bash
cd d:\opd2
start-all.bat
```

### Mac/Linux Users
```bash
cd d:\opd2
chmod +x start-all.sh
./start-all.sh
```

### Manual Start (3 Terminals)

**Terminal 1 - Backend:**
```bash
cd d:\opd2\backend
npm install
npm start
# Runs on http://localhost:5000
```

**Terminal 2 - AI Model:**
```bash
cd d:\opd2\ai-model
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5001
```

**Terminal 3 - Frontend:**
```bash
cd d:\opd2\frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 🔐 Default Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | john@example.com | password123 |
| Admin | admin@hospital.com | admin123 |

---

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api |
| AI Model | http://localhost:5001/api |
| Health Check | http://localhost:5000/api/health |

---

## 📋 Most Important Files

```
d:\opd2\
├── SETUP_GUIDE.md ← Read this first!
├── API_TESTING.md ← API examples
├── README.md ← Full documentation
├── PROJECT_VERIFICATION.md ← What's included
│
├── backend/server.js ← Start backend from here
├── ai-model/app.py ← Start AI from here
└── frontend/pages/ ← Frontend pages
```

---

## 🗄️ Database Setup

```sql
-- Login to MySQL
mysql -u root -p

-- Run schema
SOURCE d:/opd2/database/opd_system_schema.sql;

-- Or import file directly
mysql -u root -p opd_system < d:\opd2\database\opd_system_schema.sql
```

---

## 🧪 Quick API Test

### Test Patient Registration
```bash
curl -X POST http://localhost:5000/api/patient/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"9876543210","age":30,"gender":"Male","email":"test@example.com","password":"pass123","medical_id":"MED001"}'
```

### Test AI Prediction
```bash
curl -X POST http://localhost:5001/api/predict-waiting-time \
  -H "Content-Type: application/json" \
  -d '{"patients_in_queue":10,"avg_consultation_time":15,"current_position":5}'
```

---

## 🎯 Key Features at a Glance

✅ Patient Registration & Login
✅ Appointment Booking with Token
✅ Real-time Queue Management
✅ AI Waiting Time Prediction
✅ Doctor Dashboard
✅ Hospital Admin Panel
✅ Bed Management & Allocation
✅ Analytics & Reports

---

## ⚙️ Common Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm start           # Start server
npm run dev         # Start with auto-reload
```

### Frontend
```bash
cd frontend
npm install         # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm start          # Start production server
```

### AI Model
```bash
cd ai-model
python -m venv venv        # Create virtual env
venv\Scripts\activate      # Activate (Windows)
pip install -r requirements.txt
python app.py             # Start server
```

---

## 🔧 Environment Configuration

### Backend (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=opd_system
JWT_SECRET=your_secret_key
PORT=5000
PYTHON_AI_URL=http://localhost:5001
```

### Frontend (.env.local - Optional)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## 📊 User Workflows

### Patient Journey
1. Register at `/patient/register`
2. Login at `/patient/login`
3. View dashboard
4. Click "Book Appointment"
5. Select doctor, date, time
6. Get token number
7. Check queue status at `/patient/queue-status`

### Doctor Workflow
1. Login at `/doctor/login`
2. See patient queue on dashboard
3. Click "Call Next Patient"
4. Complete consultation
5. Click "Complete" button

### Admin Workflow
1. Login at `/admin/login`
2. View dashboard summary
3. Monitor statistics
4. Manage beds/doctors
5. View analytics

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database error | Check MySQL is running: `mysql -u root -p` |
| Port 5000 in use | Kill process or change port in .env |
| Module not found | Run `npm install` in that directory |
| Token error | Include `-H "Authorization: Bearer TOKEN"` |
| Frontend won't load | Clear `.next` folder: `rm -rf .next` |

---

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| README.md | Full project overview |
| SETUP_GUIDE.md | Step-by-step installation |
| API_TESTING.md | API endpoints & examples |
| IMPLEMENTATION_SUMMARY.md | Technical details |
| PROJECT_VERIFICATION.md | Completion checklist |
| This file | Quick reference |

---

## 🚀 Deployment Checklist

- [ ] Test all features locally
- [ ] Update database credentials
- [ ] Change JWT secret key
- [ ] Deploy backend to Heroku
- [ ] Deploy frontend to Vercel
- [ ] Deploy AI model to Heroku
- [ ] Configure domain name
- [ ] Setup SSL certificate
- [ ] Test in production

---

## 📞 Quick Support

1. Check SETUP_GUIDE.md for installation issues
2. Check API_TESTING.md for API issues
3. Check logs in terminal windows
4. Clear cache: Delete .next, node_modules, venv
5. Reinstall: `npm install` and `pip install -r requirements.txt`

---

## 💡 Tips & Tricks

1. **Use Postman** for easier API testing
2. **Keep terminals open** to see live logs
3. **Check console** in browser for frontend errors
4. **Use localhost** instead of IP for development
5. **Backup database** before testing deletions

---

## 📈 Performance Tips

- Enable query caching in MySQL
- Use indexes (already done in schema)
- Monitor API response times
- Cache doctor/bed lists on frontend
- Use CDN for static assets in production

---

## 🎓 Learning Path

1. Start with SETUP_GUIDE.md
2. Run the application
3. Test features using API_TESTING.md
4. Read README.md for deep dive
5. Check IMPLEMENTATION_SUMMARY.md for architecture
6. Explore code in IDE

---

## 📞 System Status

### Services Checklist
- [ ] MySQL running
- [ ] Backend running (port 5000)
- [ ] AI Model running (port 5001)
- [ ] Frontend running (port 3000)
- [ ] Database schema created

### Verification Steps
```bash
# Check MySQL
mysql -u root -p -e "SHOW DATABASES;"

# Check Backend
curl http://localhost:5000/api/health

# Check AI Model
curl http://localhost:5001/api/health

# Check Frontend
curl http://localhost:3000
```

---

## 🎯 Next Steps After Setup

1. **Create test data** using API examples in API_TESTING.md
2. **Book an appointment** to test end-to-end flow
3. **Check waiting time prediction** using AI endpoint
4. **View admin dashboard** for analytics
5. **Test all user roles** (Patient, Doctor, Admin)

---

## 📝 Important Notes

- All credentials are case-sensitive
- Tokens expire after 24 hours
- Database must be created before starting backend
- Use different terminals for each service
- Clear browser cache if UI looks broken
- Keep .env file out of git (already in .gitignore)

---

## 🌟 What Makes This System Special

✨ Full-stack implementation with all components
✨ AI-powered waiting time prediction
✨ Real-time queue management
✨ Production-ready code
✨ Comprehensive documentation
✨ Easy to deploy and scale

---

## 📄 Quick Links to Key Files

- [Installation Guide](SETUP_GUIDE.md)
- [API Documentation](API_TESTING.md)
- [Main README](README.md)
- [Implementation Details](IMPLEMENTATION_SUMMARY.md)
- [Project Checklist](PROJECT_VERIFICATION.md)

---

**Last Updated**: March 4, 2024
**Version**: 1.0.0 Complete
**Status**: ✅ Production Ready

---

**Questions?** Check the documentation or review the code comments!

**Ready to Launch?** Follow the Quick Start section above! 🚀
