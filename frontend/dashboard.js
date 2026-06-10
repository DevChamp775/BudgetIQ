// DASHBOARD.JS

// ==========================
// CHART SECTION
// ==========================

const ctx = document.getElementById("expenseChart");

const expenseChart = new Chart(ctx, {
  type: "doughnut",

  data: {
    labels: [
      "Food",
      "Travel",
      "Shopping",
      "Bills",
      "Health"
    ],

    datasets: [{
      label: "Expenses",

      data: [
        12000,
        8000,
        5000,
        3000,
        2000
      ],

      backgroundColor: [
        "#6366f1",
        "#06b6d4",
        "#8b5cf6",
        "#14b8a6",
        "#f43f5e"
      ],

      borderWidth: 0
    }]
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            size: 14
          }
        }
      }
    }
  }
});


// ==========================
// ADD EXPENSE
// ==========================

const addExpenseBtn = document.querySelector(".expense-form button");

addExpenseBtn.addEventListener("click", addExpense);

async function addExpense() {

  const amount =
    document.querySelector(
      '.expense-form input[type="number"]'
    ).value;

  const category =
    document.querySelector(
      ".expense-form select"
    ).value;

  const date =
    document.querySelector(
      '.expense-form input[type="date"]'
    ).value;

  if (!amount || !date) {
    alert("Please fill all fields");
    return;
  }

  const expenseData = {
    amount,
    category,
    date
  };

  try {

    const response = await fetch(
      "http://localhost:5000/addExpense",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(expenseData)
      }
    );

    const data = await response.json();

    if (data.success) {

      alert("Expense Added Successfully");

      addTransaction(category, amount);

      updateChart(category, amount);

    } else {
      alert("Failed To Add Expense");
    }

  } catch (error) {

    console.log(error);

  }

}


// ==========================
// UPDATE TRANSACTION TABLE
// ==========================

function addTransaction(category, amount) {

  const table = document.querySelector("table");

  const row = document.createElement("tr");

  row.innerHTML = `
  
    <td>${category}</td>
    <td>₹${amount}</td>
  
  `;

  table.appendChild(row);

}


// ==========================
// UPDATE CHART
// ==========================

function updateChart(category, amount) {

  const chartLabels = expenseChart.data.labels;

  const chartData =
    expenseChart.data.datasets[0].data;

  const index =
    chartLabels.indexOf(category);

  if (index !== -1) {

    chartData[index] += Number(amount);

  } else {

    chartLabels.push(category);

    chartData.push(Number(amount));

  }

  expenseChart.update();

}


// ==========================
// AI ANALYSIS
// ==========================

const aiButton =
  document.querySelector(".ai-btn");

aiButton.addEventListener(
  "click",
  analyzeExpenses
);

async function analyzeExpenses() {

  const aiText =
    document.querySelector(".ai-box p");

  aiText.innerHTML =
    "Analyzing expenses with AI...";

  try {

    const response = await fetch(
      "http://localhost:5000/analyze",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          food: 12000,
          travel: 8000,
          shopping: 5000,
          bills: 3000,
          health: 2000,
          budget: 50000
        })
      }
    );

    const data = await response.json();

    aiText.innerHTML =
      data.analysis;

  } catch (error) {

    aiText.innerHTML =
      "AI Analysis Failed";

    console.log(error);

  }

}


// ==========================
// DASHBOARD ANIMATION
// ==========================

const cards =
  document.querySelectorAll(".card");

cards.forEach((card, index) => {

  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";

  setTimeout(() => {

    card.style.transition = "0.5s";

    card.style.opacity = "1";

    card.style.transform =
      "translateY(0px)";

  }, index * 200);

});


// ==========================
// LIVE DATE
// ==========================

const today = new Date();

console.log(
  "Dashboard Loaded : ",
  today.toDateString()
);