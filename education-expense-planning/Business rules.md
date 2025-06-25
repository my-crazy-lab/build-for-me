# 📋 Business Rules – Education Expense Dashboard

---

## 1. Study Expense Planning (Plan)

- Each student can have **only one expense plan per academic year (grade)**.  
- A plan must include **at least one planned expense item**.  
- Planned expense items must belong to **predefined categories** (e.g., tuition, books, uniforms, etc.).  
- Each planned expense amount must be **≥ 0**.  
- Users can **edit the plan yearly**, including adding, removing, or updating expense items.  
- Users can set an **expected inflation rate** to adjust costs over years automatically.  
- The plan can be customized based on **school type** (public, private, international), which affects tuition and other fees.

---

## 2. Actual Expense Tracking

- Each actual expense must be linked to a **student and the corresponding academic year (grade)**.  
- Every actual expense must have a **date**, **category**, **amount**, and optionally a **note**.  
- Actual expense amounts **cannot be negative**.  
- Users can **add, edit, or delete** actual expenses manually.  
- Actual expenses can have **tags** (e.g., mandatory, optional, extracurricular).  
- Users can **filter expenses** by month, year, or category.

---

## 3. Plan vs. Actual Comparison & Alerts

- The system must **aggregate actual expenses by planned categories** for each year.  
- If actual spending exceeds planned amount by **more than 20%** in any category, the system triggers a **warning alert**.  
- Users can view **reports** showing the difference between planned and actual expenses by year and category.  
- Alerts are also triggered if total actual spending exceeds the **annual budget cap**.

---

## 4. Budget Allocation & Financial Support

- Users can set a **budget cap** for each academic year.  
- The system shows **remaining budget** after subtracting actual expenses from the budget cap.  
- The system encourages users to **allocate budgets reasonably** by percentage or fixed amounts per category.  
- Users can define **financial goals** (e.g., saving for a laptop or extra courses).  
- The system can send **reminders** to help track savings progress or upcoming payments.

---

## 5. Yearly & Grade-Based Adjustments

- Plans and expenses can be managed **year by year, from Grade 1 to Grade 12**.  
- Each academic year can have **different cost structures** (e.g., tuition rises, more tutoring in higher grades).  
- The system allows choosing **school type per year**, which impacts cost estimates automatically.

---

## 6. Student Data Management & Access Control

- Users can only access and manage data for **their own students or students shared with them**.  
- Users can **share read-only access** to student data with family members or others.  
- Shared users have **view-only permissions** and cannot edit data.  
- The owner can **revoke shared access** at any time.

---

## 7. Reminders & Notifications

- Users can create **reminders related to important expenses** (e.g., tuition payment deadlines).  
- Reminders have a **due date** and a **type** (info, warning, critical).  
- The system notifies users **before the due date** (e.g., 7 days prior).  
- Users can mark reminders as **completed** or delete them.

---

## 8. Standardized Categories & Customization

- The system provides a **fixed list of standard expense categories** (tuition, books, uniforms, transportation, meals, extracurricular, tutoring, equipment).  
- Users can add **custom categories** for personal use only.  
- Custom categories do not affect the system-wide category list.

---

# Summary

- These business rules ensure **data integrity, smooth operation, and clear user experience**.  
- Each rule should be covered by **unit and integration tests**.  
- Consider adding **user flows and UI wireframes** alongside these rules for full team alignment.

---

