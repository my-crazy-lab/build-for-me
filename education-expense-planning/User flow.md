# 🧑‍💻 User Flow – Education Expense Dashboard

---

## 1. User Registration & Authentication

- User opens app → Chooses “Register” or “Login”  
- If Register → Enters email, password, name → Submits → Account created → Redirect to Dashboard  
- If Login → Enters credentials → Authenticated → Redirect to Dashboard  
- Forgotten password flow (optional)  

---

## 2. Dashboard Overview

- Upon login, user sees main dashboard with:  
  - List of students  
  - Quick summary of total planned expenses vs actual spending per student  
  - Alerts & reminders overview  
  - Buttons to add new student or view detailed reports  

---

## 3. Student Management

- User clicks “Add Student” → Enters student info (name, birth year, school type, current grade, notes) → Saves  
- Student appears in list on dashboard  
- User can select a student to:  
  - View or edit student details  
  - Delete student (with confirmation)  
  - Manage shared access  

---

## 4. Expense Planning (Per Student)

- User selects a student → Navigates to “Plans” tab/page  
- Views existing yearly plans (grade 1 to 12) in a list or timeline view  
- User clicks “Add Plan” or selects a year to edit plan  
- Enters/edit planned expenses by category, budget cap, inflation rate  
- Saves plan → System validates inputs and confirms success  
- User can duplicate plan from previous year and adjust  

---

## 5. Actual Expense Tracking

- User selects a student → Navigates to “Expenses” tab/page  
- Views list of actual expenses with filters by month/year/category  
- User clicks “Add Expense” → Enters date, category, amount, note, tags → Saves  
- User can edit or delete existing expenses  
- System automatically aggregates expenses and shows comparisons with plans  

---

## 6. Viewing Reports & Alerts

- User selects a student → Navigates to “Reports” tab/page  
- Views summary charts:  
  - Planned vs Actual expenses by year and category  
  - Budget usage and remaining budget  
  - Alerts if spending exceeds plan or budget cap  
- User clicks on alert for details and possible actions  

---

## 7. Reminders & Notifications

- User navigates to “Reminders” or sees reminders on dashboard  
- Creates new reminder with message, due date, type  
- Views list of upcoming and past reminders  
- Marks reminders as completed or deletes them  
- Receives notifications based on reminder settings  

---

## 8. Sharing & Permissions

- User selects a student → Navigates to “Sharing” tab/page  
- Adds email addresses to share read-only access  
- Views list of shared users and permissions  
- Removes shared access if needed  

---

## 9. Settings & Customization

- User navigates to “Settings”  
- Manages account info, password, notification preferences  
- Manages custom expense categories  
- Adjusts default inflation rates or budget templates  

---

# Notes

- All actions should have feedback (success or error messages).  
- Data input forms must validate inputs (e.g., non-negative numbers, valid dates).  
- Navigation should be intuitive and responsive (mobile-friendly).  
- Consider onboarding/tutorial for first-time users.  

---
