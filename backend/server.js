// ===============================
// SERVER.JS
// ===============================

import express      from "express";
import cors         from "cors";
import mongoose     from "mongoose";
import bcrypt       from "bcryptjs";
import jwt          from "jsonwebtoken";
import { ChatGroq } from "@langchain/groq";

// ===============================
// CONSTANTS  —  edit these directly
// ===============================

const PORT       = 5000;
const MONGO_URI  = "mongodb://127.0.0.1:27017/expenseAI";
const JWT_SECRET = "expense_secret_key";
const GROQ_KEY   = "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";

// ===============================
// APP SETUP
// ===============================

const app = express();
app.use(cors());
app.use(express.json());

// ===============================
// MONGODB
// ===============================

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// ===============================
// MODELS
// ===============================

const UserSchema = new mongoose.Schema({
  name:     { type: String },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

const ExpenseSchema = new mongoose.Schema({
  userId:    { type: String, default: "" },
  amount:    { type: Number, required: true },
  category:  { type: String, required: true },
  date:      { type: String, required: true },
  note:      { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});
const Expense = mongoose.model("Expense", ExpenseSchema);

// ===============================
// GROQ AI
// ===============================

const chat = new ChatGroq({
  apiKey:      GROQ_KEY,
  model:       "llama-3.3-70b-versatile",
  temperature: 0.7
});

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.json({ message: "ExpenseAI Backend Running" });
});

// ===============================
// SIGNUP
// ===============================

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: "Signup Successful" });

  } catch (error) {
    console.log("Signup error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// LOGIN
// ===============================

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ success: true, token, message: "Login Successful" });

  } catch (error) {
    console.log("Login error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// ADD EXPENSE
// ===============================

app.post("/addExpense", async (req, res) => {
  try {
    const { amount, category, date, note, userId } = req.body;

    if (!amount || !category || !date) {
      return res.json({ success: false, message: "Amount, category and date are required" });
    }

    const newExpense = new Expense({ amount, category, date, note, userId });
    await newExpense.save();

    res.json({ success: true, message: "Expense Added" });

  } catch (error) {
    console.log("Add expense error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// GET ALL EXPENSES
// ===============================

app.get("/expenses", async (req, res) => {
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

app.delete("/deleteExpense/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Expense Deleted" });
  } catch (error) {
    console.log("Delete expense error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// CATEGORY ANALYTICS
// ===============================

app.get("/categoryAnalytics", async (req, res) => {
  try {
    const results = await Expense.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);
    res.json({ success: true, analytics: results });
  } catch (error) {
    console.log("Analytics error:", error);
    res.json({ success: false, message: "Server Error" });
  }
});

// ===============================
// AI EXPENSE ANALYSIS
// ===============================

app.post("/analyze", async (req, res) => {
  try {
    const expenseData = req.body;

    const prompt = `
You are an advanced AI financial advisor.

Analyze the user's expenses and provide personalized insights.

User Expense Data:
${JSON.stringify(expenseData, null, 2)}

Please provide:
1. Overall spending summary
2. Overspending areas (if any)
3. Top 3 savings suggestions
4. Budget improvement tips
5. Smart financial habits to adopt

Keep the response concise, practical, and friendly. Use bullet points.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, analysis: response.content });

  } catch (error) {
    console.log("AI Analyze error:", error);
    res.json({ success: false, message: "AI Analysis Failed" });
  }
});

// ===============================
// AI CHAT  (registered as /chat AND /ai)
// ===============================

async function handleChat(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ success: false, message: "Message is required" });
    }

    const prompt = `
You are ExpenseAI, a friendly and intelligent personal finance assistant.

User's question: ${message}

Give smart, practical budgeting advice, savings tips, and financial planning help.
Keep your response friendly, clear, and concise. Use bullet points when helpful.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, reply: response.content });

  } catch (error) {
    console.log("AI Chat error:", error);
    res.json({ success: false, message: "AI Chat Failed" });
  }
}

app.post("/chat", handleChat);
app.post("/ai",   handleChat);

// ===============================
// AI TRAVEL PLANNER
// ===============================

app.post("/travelPlanner", async (req, res) => {
  try {
    const { destination, budget, days } = req.body;

    const prompt = `
Create a smart travel budget plan.

Destination: ${destination}
Total Budget: Rs.${budget}
Number of Days: ${days}

Provide a breakdown for:
1. Accommodation budget
2. Food and dining budget
3. Transport budget
4. Activities and sightseeing budget
5. Shopping and misc budget
6. Money-saving tips for this trip
7. Is this trip feasible within the budget?

Be realistic and practical.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, plan: response.content });

  } catch (error) {
    console.log("Travel planner error:", error);
    res.json({ success: false, message: "Travel Planner Failed" });
  }
});

// ===============================
// AI SAVINGS GOAL
// ===============================

app.post("/savingGoal", async (req, res) => {
  try {
    const { income, expenses, target } = req.body;

    const prompt = `
Analyze the user's savings potential.

Monthly Income: Rs.${income}
Monthly Expenses: Rs.${expenses}
Savings Target: Rs.${target}

Provide:
1. Monthly savings capacity
2. Time required to reach the goal
3. Expense reduction strategies
4. Smart investment suggestions
5. Practical budgeting plan
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, advice: response.content });

  } catch (error) {
    console.log("Savings goal error:", error);
    res.json({ success: false, message: "Savings Analysis Failed" });
  }
});

// ===============================
// AI MONTHLY REPORT
// ===============================

app.post("/monthlyReport", async (req, res) => {
  try {
    const reportData = req.body;

    const prompt = `
Generate a professional monthly financial report.

Data: ${JSON.stringify(reportData, null, 2)}

Include:
- Executive Summary
- Expense Category Breakdown
- Savings Analysis
- Overspending Alerts
- Financial Health Score (out of 10)
- Goals for Next Month
- Top 5 Recommendations
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, report: response.content });

  } catch (error) {
    console.log("Monthly report error:", error);
    res.json({ success: false, message: "Monthly Report Failed" });
  }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});