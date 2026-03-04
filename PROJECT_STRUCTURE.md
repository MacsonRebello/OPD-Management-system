# 📁 Complete Project Directory Structure

```
d:\opd2\
│
├── 📄 README.md                          (Main project documentation)
├── 📄 SETUP_GUIDE.md                     (Step-by-step setup instructions)
├── 📄 API_TESTING.md                     (API endpoints & testing guide)
├── 📄 IMPLEMENTATION_SUMMARY.md           (Technical implementation details)
├── 📄 PROJECT_VERIFICATION.md             (Project completion checklist)
├── 📄 QUICK_REFERENCE.md                 (Quick start guide)
├── 📄 PROJECT_STRUCTURE.md                (This file)
├── 📄 .gitignore                         (Git ignore patterns)
├── 📄 start-all.sh                       (Linux/Mac startup script)
├── 📄 start-all.bat                      (Windows startup script)
│
├── 📁 backend/                           (Node.js Backend API)
│   │
│   ├── 📄 server.js                      (Main Express server)
│   ├── 📄 db.js                          (MySQL database connection)
│   ├── 📄 package.json                   (npm dependencies)
│   ├── 📄 .env.example                   (Environment template)
│   │
│   ├── 📁 controllers/                   (Business logic)
│   │   ├── patientController.js          (Patient operations)
│   │   ├── appointmentController.js      (Appointment management)
│   │   ├── doctorController.js           (Doctor operations)
│   │   ├── bedController.js              (Bed management)
│   │   └── analyticsController.js        (Analytics & reporting)
│   │
│   ├── 📁 routes/                        (API endpoints)
│   │   ├── patientRoutes.js              (Patient endpoints)
│   │   ├── appointmentRoutes.js          (Appointment endpoints)
│   │   ├── doctorRoutes.js               (Doctor endpoints)
│   │   ├── bedRoutes.js                  (Bed endpoints)
│   │   └── analyticsRoutes.js            (Analytics endpoints)
│   │
│   └── 📁 middleware/
│       └── auth.js                       (JWT authentication)
│
├── 📁 frontend/                          (Next.js React App)
│   │
│   ├── 📄 package.json                   (npm dependencies)
│   ├── 📄 next.config.js                 (Next.js configuration)
│   ├── 📄 tailwind.config.js             (Tailwind CSS config)
│   ├── 📄 postcss.config.js              (PostCSS config)
│   │
│   ├── 📁 pages/                         (Application pages)
│   │   ├── 📄 index.tsx                  (Homepage)
│   │   │
│   │   ├── 📁 patient/
│   │   │   ├── register.tsx              (Patient registration)
│   │   │   ├── login.tsx                 (Patient login)
│   │   │   ├── dashboard.tsx             (Patient dashboard)
│   │   │   ├── book-appointment.tsx      (Appointment booking)
│   │   │   └── queue-status.tsx          (Queue tracker)
│   │   │
│   │   ├── 📁 doctor/
│   │   │   ├── login.tsx                 (Doctor login)
│   │   │   └── dashboard.tsx             (Doctor dashboard)
│   │   │
│   │   └── 📁 admin/
│   │       ├── login.tsx                 (Admin login)
│   │       └── dashboard.tsx             (Admin dashboard)
│   │
│   ├── 📁 components/                    (Reusable components)
│   │   └── (Ready for custom components)
│   │
│   ├── 📁 styles/
│   │   └── globals.css                   (Global styles)
│   │
│   ├── 📁 store/
│   │   └── auth.ts                       (Zustand auth store)
│   │
│   └── 📁 utils/
│       └── api.ts                        (API client & endpoints)
│
├── 📁 ai-model/                          (Python AI Model)
│   │
│   ├── 📄 app.py                         (Flask server & ML model)
│   ├── 📄 requirements.txt                (Python dependencies)
│   │
│   └── 📁 venv/                          (Virtual environment - auto created)
│
├── 📁 database/                          (Database schema)
│   └── 📄 opd_system_schema.sql          (Complete database schema)
│
└── 📁 node_modules/                      (Auto-created dependencies)
    └── (Backend and Frontend dependencies)
```

---

## 📊 File Statistics

### Backend Files
- **Controllers**: 5 files (~500 lines each)
- **Routes**: 5 files (~20-30 lines each)
- **Middleware**: 1 file (~30 lines)
- **Config**: 3 files (server.js, db.js, package.json)
- **Total**: ~2,500+ lines of code

### Frontend Files
- **Pages**: 10 files (~100-150 lines each)
- **Utilities**: 2 files (~200 lines)
- **Config**: 4 files (next.config.js, tailwind.config.js, etc.)
- **Styles**: 1 file
- **Total**: ~1,500+ lines of code

### AI Model Files
- **App**: 1 file (~300 lines)
- **Config**: 1 file
- **Total**: ~300+ lines of code

### Database
- **Schema**: 1 file (~400 lines with comments)
- **Total**: 9 tables with indexes

### Documentation
- **Guides**: 6 files (~500+ lines)
- **Total**: ~500+ lines

---

## 🔍 Key Files to Modify

### For Database Configuration
- `backend/.env` - Update with your MySQL credentials

### For API URLs
- `frontend/.env.local` - Update API URL if needed

### For Deployment
- `backend/server.js` - Update PORT for deployment
- `frontend/next.config.js` - Update API URL for production

### For Customization
- `frontend/pages/*` - Customize UI
- `backend/controllers/*` - Customize business logic
- `ai-model/app.py` - Customize AI model

---

## 📦 Dependencies Tree

### Backend
```
express/
├── body-parser
├── cors
├── mysql2
├── bcryptjs
├── jsonwebtoken
├── dotenv
└── axios
```

### Frontend
```
next/
├── react
├── react-dom
├── axios
├── zustand
├── tailwindcss
├── autoprefixer
├── postcss
└── react-hot-toast
```

### AI Model
```
flask/
├── flask-cors
├── numpy
├── scikit-learn
├── pandas
├── joblib
├── requests
└── python-dotenv
```

---

## 🔐 Sensitive Files (in .gitignore)

```
.env              - Database credentials
.env.local        - Frontend configuration
node_modules/     - Dependencies
venv/             - Python virtual environment
.next/            - Build files
dist/             - Production build
*.log             - Log files
.DS_Store         - Mac files
```

---

## 📝 File Purposes

### Root Level Files
| File | Purpose |
|------|---------|
| README.md | Main documentation |
| SETUP_GUIDE.md | Installation instructions |
| API_TESTING.md | API testing guide |
| QUICK_REFERENCE.md | Quick start reference |
| .gitignore | Git configuration |
| start-all.sh | Linux/Mac startup |
| start-all.bat | Windows startup |

### Backend Essential Files
| File | Purpose |
|------|---------|
| server.js | Main app entry point |
| db.js | Database connection |
| package.json | Dependencies |
| controllers/* | Business logic |
| routes/* | API endpoints |
| middleware/auth.js | Authentication |

### Frontend Essential Files
| File | Purpose |
|------|---------|
| pages/* | UI pages |
| store/auth.ts | State management |
| utils/api.ts | API client |
| next.config.js | Configuration |
| tailwind.config.js | Styling config |

### AI Essential Files
| File | Purpose |
|------|---------|
| app.py | Flask server & ML |
| requirements.txt | Dependencies |

---

## 🚀 Workflow Architecture

```
Frontend (Next.js)
    ↓ (API calls)
Backend (Express.js)
    ↓ (Queries)
MySQL Database
    
Frontend ↔ AI Model (Python)
    ↓
Waiting Time Predictions
```

---

## 📂 How to Navigate

### To Edit Patient Logic
→ Go to `backend/controllers/patientController.js`

### To Change Patient UI
→ Go to `frontend/pages/patient/dashboard.tsx`

### To Add New API Endpoint
→ Create in `backend/controllers/newController.js`
→ Create route in `backend/routes/newRoutes.js`
→ Add to `backend/server.js`

### To Change Database Structure
→ Edit `database/opd_system_schema.sql`
→ Re-import to MySQL

### To Customize AI Model
→ Edit `ai-model/app.py`
→ Restart Python server

---

## ✨ File Organization Summary

```
Code Files
├── Backend (Controllers, Routes, Middleware)
├── Frontend (Pages, Components, Utils)
└── AI Model (Flask App)

Configuration Files
├── package.json (Backend & Frontend)
├── .env files
├── next.config.js
└── tailwind.config.js

Documentation Files
├── README.md
├── SETUP_GUIDE.md
├── API_TESTING.md
├── QUICK_REFERENCE.md
└── PROJECT_VERIFICATION.md

Database Files
└── opd_system_schema.sql

Startup Scripts
├── start-all.sh
└── start-all.bat
```

---

## 🔄 Development Workflow

1. **Modify Code** → Backend/Frontend/AI files
2. **Save Changes** → Auto-reload in dev mode
3. **Test Changes** → Use API_TESTING.md examples
4. **Check Results** → View logs in terminals
5. **Commit Changes** → Use git (follows .gitignore)

---

## 📊 Quick Stats

- **Total Files**: 50+
- **Lines of Code**: 4,200+
- **Controllers**: 5
- **Routes**: 5
- **Pages**: 10+
- **Database Tables**: 9
- **Documentation Files**: 6
- **Configuration Files**: 4

---

## 🎯 File Dependencies

```
Frontend Pages
    ↓
API Utils (api.ts)
    ↓
Backend Routes
    ↓
Backend Controllers
    ↓
Database (MySQL)
    
AI Model (Standalone)
```

---

## 🆘 Finding Files

### If you need to...
| Task | File Location |
|------|---------------|
| Add patient feature | `backend/controllers/patientController.js` |
| Modify UI | `frontend/pages/patient/*` |
| Change database | `database/opd_system_schema.sql` |
| Update API | `backend/routes/*Routes.js` |
| Configure server | `backend/server.js` |
| Setup frontend | `frontend/package.json` |
| Customize AI | `ai-model/app.py` |

---

**Last Updated**: March 4, 2024
**Version**: 1.0.0 Complete
**All Files Documented**: ✅

This project structure is clean, organized, and production-ready!

---
