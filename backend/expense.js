// ===============================
// EXPENSE.JS
// ===============================

import express  from "express";
import mongoose from "mongoose";

const router = express.Router();

// ===============================
// EXPENSE MODEL
// ===============================

const ExpenseSchema = new mongoose.Schema({
  userId:   { type: String, default: "" },
  amount:   { type: Number, required: true },
  category: { type: String, required: true },
  date:     { type: String, required: true },
  note:     { type: String, default: "" },
  createdAt:{ type: Date, default: Date.now }
});

const Expense = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);

// ===============================
// ADD EXPENSE
// ===============================

router.post("/addExpense", async (req, res) => {
  try {
    const { amount, category, date, note, userId } = req.body;

    if (!amount || !category || !date) {
      return res.json({ success: false, message: "Amount, category and date required" });
    }

    const newExpense = new Expense({ amount, category, date, note, userId });
    await newExpense.save();

    res.json({ success: true, message: "Expense Added Successfully" });

  } catch (error) {
    console.log("Add expense error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// GET ALL EXPENSES
// ===============================

router.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json({ success: true, expenses });
  } catch (error) {
    console.log("Get expenses error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// DELETE EXPENSE
// ===============================

router.delete("/deleteExpense/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Expense Deleted" });
  } catch (error) {
    console.log("Delete expense error:", error);
    res.json({ success: false, message: "Delete Failed" });
  }
});

// ===============================
// UPDATE EXPENSE
// ===============================

router.put("/updateExpense/:id", async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    await Expense.findByIdAndUpdate(req.params.id, { amount, category, date, note });
    res.json({ success: true, message: "Expense Updated" });
  } catch (error) {
    console.log("Update expense error:", error);
    res.json({ success: false, message: "Update Failed" });
  }
});

// ===============================
// MONTHLY TOTAL
// ===============================

router.get("/monthlyTotal", async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    res.json({ success: true, total: result[0]?.total || 0 });
  } catch (error) {
    console.log("Monthly total error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// CATEGORY ANALYTICS
// ===============================

router.get("/categoryAnalytics", async (req, res) => {
  try {
    const analytics = await Expense.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);
    res.json({ success: true, analytics });
  } catch (error) {
    console.log("Analytics error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

export default router;