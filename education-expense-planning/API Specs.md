# 📘 API Specification – Education Expense Dashboard

---

## 🧑‍🎓 Student Management

### `GET /students`
> Get list of students for current user

### `POST /students`
> Create a new student profile  

**Request Body:**

```json
{
  "name": "An",
  "birthYear": 2017,
  "entryYear": 2023,
  "schoolType": "public",
  "currentGrade": 3,
  "notes": "Học trường công, định hướng thi chuyên toán"
}
```

### `PATCH /students/:id`
> Update student profile

### `DELETE /students/:id`
> Delete student profile

---

## 📊 Plan (Expense Planning per Year)

### `GET /students/:id/plans`
> Get all plans for a student (Grades 1–12)

### `GET /plans/:planId`
> Get details of a specific plan

### `POST /students/:id/plans`
> Create plan for a specific grade  

**Request Body:**

```json
{
  "grade": 5,
  "schoolYear": "2025–2026",
  "inflationRate": 3,
  "budgetCap": 25000000,
  "plannedExpenses": [
    { "category": "tuition", "amount": 12000000 },
    { "category": "books", "amount": 1500000 }
  ]
}
```

### `PATCH /plans/:id`
> Update plan values (e.g., update expenses)

### `DELETE /plans/:id`
> Delete a plan (by grade)

---

## 💸 Expense Tracking

### `GET /students/:id/expenses`
> Get all expenses for a student (optional filters by month, year)

### `POST /students/:id/expenses`
> Add a new actual expense  

**Request Body:**

```json
{
  "date": "2025-08-02",
  "category": "books",
  "amount": 200000,
  "note": "Mua sách toán nâng cao",
  "tags": ["optional"]
}
```

### `PATCH /expenses/:id`
> Edit expense

### `DELETE /expenses/:id`
> Delete expense

---

## 📌 Reminders

### `GET /reminders`
> Get all upcoming reminders (across all students)

### `POST /students/:id/reminders`
> Create a reminder  

**Request Body:**

```json
{
  "message": "Nộp học phí kỳ 1",
  "dueDate": "2025-09-01",
  "type": "warning"
}
```

### `PATCH /reminders/:id`
> Mark as read / update reminder

---

## 📤 Sharing Access

### `POST /students/:id/share`
> Share student data with another email  

**Request Body:**

```json
{
  "sharedWithEmail": "ba@example.com",
  "permission": "view"
}
```

### `GET /shared`
> Get all plans shared with current user

---

## 🎯 Annual Goals (Optional)

### `POST /students/:id/goals`

**Request Body:**

```json
{
  "year": 2026,
  "description": "Mua máy tính cho con",
  "targetAmount": 15000000,
  "deadline": "2026-08-01"
}
```

---

## 🧾 Category Config (Optional)

### `GET /categories`
> Get all available categories for planning/spending

### `POST /categories/custom`
> Add a custom category for user

---

## 🔐 Auth (basic example)

### `POST /auth/register`

**Request Body:**

```json
{
  "email": "me@example.com",
  "password": "123456",
  "name": "Phụ huynh Nguyễn"
}
```

### `POST /auth/login`

**Request Body:**

```json
{
  "email": "me@example.com",
  "password": "123456"
}
```

---

## 📦 Response Format Suggestion

**Success:**

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message"
}
```

**Error:**

```json
{
  "success": false,
  "error": "Invalid input",
  "code": 400
}
```

---
