// ===============================
// AI.JS
// ===============================

import express      from "express";
import { ChatGroq } from "@langchain/groq";

const router = express.Router();

// ===============================
// CONSTANTS
// ===============================

const GROQ_KEY = "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";

// ===============================
// GROQ AI SETUP
// ===============================

const chat = new ChatGroq({
  apiKey:      GROQ_KEY,
  model:       "llama-3.3-70b-versatile",
  temperature: 0.7
});

// ===============================
// AI EXPENSE ANALYZER
// ===============================

router.post("/analyze", async (req, res) => {
  try {
    const expenseData = req.body;

    const prompt = `
You are an advanced AI financial advisor.
Analyze the user's expenses and give insights.

Expense Data: ${JSON.stringify(expenseData, null, 2)}

Provide:
1. Spending Summary
2. Overspending areas
3. Top savings suggestions
4. Budget improvement tips
5. Smart financial habits

Be concise, practical, and use bullet points.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, analysis: response.content });

  } catch (error) {
    console.log("Analyze error:", error);
    res.json({ success: false, message: "AI Analysis Failed" });
  }
});

// ===============================
// AI FINANCIAL CHAT  (/chat and /ai both work)
// ===============================

async function chatHandler(req, res) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ success: false, message: "Message required" });
    }

    const prompt = `
You are ExpenseAI, a friendly personal finance assistant.

User question: ${message}

Give smart, practical financial advice. Use bullet points when helpful. Keep it friendly and concise.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, reply: response.content });

  } catch (error) {
    console.log("Chat error:", error);
    res.json({ success: false, message: "AI Chat Failed" });
  }
}

router.post("/chat", chatHandler);
router.post("/ai",   chatHandler);

// ===============================
// TRAVEL BUDGET PLANNER
// ===============================

router.post("/travelPlanner", async (req, res) => {
  try {
    const { destination, budget, days } = req.body;

    const prompt = `
Create a smart travel budget plan.
Destination: ${destination}
Budget: Rs.${budget}
Days: ${days}

Give: accommodation, food, transport, activities budgets and saving tips.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, plan: response.content });

  } catch (error) {
    console.log("Travel planner error:", error);
    res.json({ success: false, message: "Travel Planner Failed" });
  }
});

// ===============================
// SAVINGS GOAL
// ===============================

router.post("/savingGoal", async (req, res) => {
  try {
    const { income, expenses, target } = req.body;

    const prompt = `
Monthly Income: Rs.${income}
Monthly Expenses: Rs.${expenses}
Savings Target: Rs.${target}

Analyze: monthly savings capacity, time to reach goal, expense reduction strategy, and practical budgeting plan.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, advice: response.content });

  } catch (error) {
    console.log("Savings goal error:", error);
    res.json({ success: false, message: "Savings Analysis Failed" });
  }
});

// ===============================
// MONTHLY REPORT
// ===============================

router.post("/monthlyReport", async (req, res) => {
  try {
    const reportData = req.body;

    const prompt = `
Generate a professional monthly financial report.
Data: ${JSON.stringify(reportData, null, 2)}

Include: summary, expense breakdown, savings analysis, health score out of 10, and top 5 recommendations.
`;

    const response = await chat.invoke(prompt);
    res.json({ success: true, report: response.content });

  } catch (error) {
    console.log("Monthly report error:", error);
    res.json({ success: false, message: "Monthly Report Failed" });
  }
});

export default router;