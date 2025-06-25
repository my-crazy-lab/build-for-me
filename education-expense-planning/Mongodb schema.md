# 📦 MongoDB Schema Design – Education Finance Dashboard (12-Year Plan)

This schema system is designed to support a family dashboard where parents can plan, track, and analyze education-related expenses for each child across 12 years of schooling.

---

## 🧩 1. User Schema – Parents / Account Holder

```js
User {
  _id: ObjectId,
  email: String, // unique
  passwordHash: String,
  name: String,
  theme: "light" | "dark",
  createdAt: Date
}

---

## 🧩 2. Student Schema – Child Profile

```js
Student {
  _id: ObjectId,
  userId: ObjectId, // ref: User
  name: String,
  birthYear: Number,
  entryYear: Number, // School starting year
  currentGrade: Number, // 1–12
  schoolType: "public" | "private" | "international",
  avatarUrl: String,
  notes: String
}

```

---

## 🧩 3. Plan Schema – Annual Expense Plan

```js
Plan {
  _id: ObjectId,
  studentId: ObjectId, // ref: Student
  grade: Number, // 1–12
  schoolYear: String, // e.g., "2025–2026"
  inflationRate: Number, // optional, %
  budgetCap: Number, // optional

  plannedExpenses: [{
    category: String, // e.g., "tuition", "books"
    amount: Number
  }]
}
```

---

## 🧩 4. Expense Schema – Actual Monthly/Ad-Hoc Spending

```js
Expense {
  _id: ObjectId,
  studentId: ObjectId, // ref: Student
  planId: ObjectId, // optional
  date: Date,
  category: String,
  amount: Number,
  note: String,
  tags: [String], // e.g., ["essential", "optional"]
  receiptImageUrl: String
}

```

---

## 🧩 5. Reminder Schema – Alerts and Warnings

```js
Reminder {
  _id: ObjectId,
  userId: ObjectId,
  studentId: ObjectId,
  message: String,
  type: "warning" | "info" | "monthly",
  dueDate: Date,
  isRead: Boolean
}

```

---

## 🧩 6. ShareAccess Schema – Plan Sharing with Others

```js
ShareAccess {
  _id: ObjectId,
  ownerUserId: ObjectId,
  sharedWithEmail: String,
  studentId: ObjectId,
  permission: "view" | "edit",
  createdAt: Date
}

```

---

## 🧩 7. (Optional) Goal Schema – Annual Savings or Purchase Goals

```js
Goal {
  _id: ObjectId,
  studentId: ObjectId,
  year: Number,
  description: String,
  targetAmount: Number,
  deadline: Date,
  isAchieved: Boolean
}

```

---

## 🧩 8. (Optional) CategoryPreset or Config Schema – Editable List of Expense Categories
 
```js
CategoryPreset {
  _id: ObjectId,
  userId: ObjectId,
  label: String,
  defaultAmount: Number,
  isSystem: Boolean
}

```

---

## 🧩 9. (Optional) ActivityLog Schema – Tracking User Actions

```js
ActivityLog {
  _id: ObjectId,
  userId: ObjectId,
  action: String, // e.g., "create_plan", "edit_expense"
  details: Object,
  timestamp: Date
}

```

---

## 🔖 Suggested Default Categories

```js
[
  "tuition",
  "books",
  "uniform",
  "tutoring",
  "devices",
  "transport",
  "meals",
  "extracurricular",
  "summerCamp",
  "examFees",
  "misc"
]
```
