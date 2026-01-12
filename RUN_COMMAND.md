# Run Commands for District Interiors CMS

## 🚀 Development Server (Port 3003)

### PowerShell Command:
```powershell
cd district-interiors
npm run dev
```

The server will start on **http://localhost:3003**

### Access Points:
- **Frontend:** http://localhost:3003
- **Admin Panel:** http://localhost:3003/admin
- **API:** http://localhost:3003/api

---

## 📝 First Time Setup

1. **Navigate to project:**
   ```powershell
   cd district-interiors
   ```

2. **Install dependencies (if not done):**
   ```powershell
   npm install
   ```

3. **Start development server:**
   ```powershell
   npm run dev
   ```

4. **Create first admin user:**
   - Go to http://localhost:3003/admin
   - Follow the setup wizard to create your first admin user

---

## 🔧 Other Useful Commands

### Generate TypeScript Types:
```powershell
npm run generate:types
```

### Build for Production:
```powershell
npm run build
```

### Start Production Server:
```powershell
npm run start
```

### Lint Code:
```powershell
npm run lint
```

---

## ⚙️ Environment Variables

Make sure your `.env` file has:
```
DATABASE_URL=file:./district-interiors.db
PAYLOAD_SECRET=your-secret-key-here
```

---

## 📦 Admin Organization

The admin panel is organized into groups:

### **Site Settings**
- Header
- Footer

### **Pages**
- Home Page (all 13 sections)
- About Page
- Services Page
- Projects Page
- Collection Page
- Contact Page
- Hospitality Page
- Flowers Page
- Styling Page
- Tree Solutions Page

### **Collections**
- Projects
- Services
- Collection Items
- Testimonials
- Client Logos
- Stats
- Media
- Users




