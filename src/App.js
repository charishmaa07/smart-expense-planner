import React, { useState, useEffect } from "react";
import "./styles.css";
import { Pie, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function App() {
  const [income, setIncome] = useState("");
const [budget, setBudget] = useState("");
const [started, setStarted] = useState(false);
const [darkMode, setDarkMode] = useState(false);
const resetData = () => {
  localStorage.clear();
  window.location.reload();
};

const [transactions, setTransactions] = useState([]);

const totalTransactions = transactions.length;

const [description, setDescription] = useState("");
const [expenseAmount, setExpenseAmount] = useState("");
const [category, setCategory] = useState("Food");
const [date, setDate] = useState("");

const biggestExpense =
  transactions.length > 0
    ? Math.max(
        ...transactions.map(
          (item) => item.amount
        )
      )
    : 0;

  // Load data
  useEffect(() => {
    const storedTheme = localStorage.getItem("darkMode");
    const storedIncome = localStorage.getItem("income");
    const storedBudget = localStorage.getItem("budget");
    const storedTransactions = JSON.parse(
      localStorage.getItem("transactions") || "[]"
    );

    if (storedTheme) {
      setDarkMode(JSON.parse(storedTheme));
    }

    if (storedIncome) {
      setIncome(storedIncome);
      setStarted(true);
    }

    if (storedBudget) {
      setBudget(storedBudget);
    }

    setTransactions(storedTransactions);
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem("income", income);
    localStorage.setItem("budget", budget);
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );
  }, [income, budget, transactions, darkMode]);

  const startPlanning = () => {
    if (!income || !budget) return;
    setStarted(true);
  };

  const addExpense = () => {
    if (
      !description ||
      !expenseAmount ||
      !category ||
      !date
    ) {
      return;
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: Number(expenseAmount),
      category,
      date,
    };

    setTransactions([newExpense, ...transactions]);

    setDescription("");
    setExpenseAmount("");
    setCategory("Food");
    setDate("");
  };

  const deleteExpense = (id) => {
    setTransactions(
      transactions.filter(
        (item) => item.id !== id
      )
    );
  };

  const totalExpenses = transactions.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  const remaining =
    Number(income) - totalExpenses;

  const savings = remaining * 0.5;
  const emergencyFund = remaining * 0.5;

  const budgetUsage =
    Number(budget) > 0
      ? (totalExpenses / Number(budget)) * 100
      : 0;

  const categoryTotal = (name) =>
    transactions
      .filter((item) => item.category === name)
      .reduce((acc, item) => acc + item.amount, 0);

  const pieData = {
    labels: [
      "Food",
      "Travel",
      "Shopping",
      "Bills",
      "Entertainment",
      "Healthcare",
      "Education",
      "Rent",
    ],
    datasets: [
      {
        data: [
          categoryTotal("Food"),
          categoryTotal("Travel"),
          categoryTotal("Shopping"),
          categoryTotal("Bills"),
          categoryTotal("Entertainment"),
          categoryTotal("Healthcare"),
          categoryTotal("Education"),
          categoryTotal("Rent"),
        ],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#8BC34A",
          "#795548",
        ],
        borderWidth: 2,
      },
    ],
  };

  const lineData = {
    labels: transactions.map(
      (item) => item.date
    ),
    datasets: [
      {
        label: "Expenses",
        data: transactions.map(
          (item) => item.amount
        ),
        borderColor: "#36A2EB",
        tension: 0.3,
      },
    ],
  };

  let topCategory = "None";

  if (transactions.length > 0) {
    const categoryMap = {};

    transactions.forEach((item) => {
      categoryMap[item.category] =
        (categoryMap[item.category] || 0) +
        item.amount;
    });

    topCategory = Object.keys(categoryMap).reduce(
      (a, b) =>
        categoryMap[a] > categoryMap[b]
          ? a
          : b
    );
  }

  if (!started) {
    return (
      <div className="setup-container">
        <h1>💰 Smart Expense Planner</h1>
        <p className="subtitle">
  Track expenses, manage budgets and grow savings smarter.
</p>
<p>
  {new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  )}
</p>

        <input
          type="number"
          placeholder="Monthly Income"
          value={income}
          onChange={(e) =>
            setIncome(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Monthly Budget"
          value={budget}
          onChange={(e) =>
            setBudget(e.target.value)
          }
        />

        <button onClick={startPlanning}>
          Start Planning
        </button>
      </div>
    );
  }

  return (
    <div
      className={
        darkMode
          ? "container dark"
          : "container"
      }
    >
      <h1>💰 Smart Expense Planner</h1>
      <p className="subtitle">
  Track expenses, manage budgets and grow savings smarter.
</p>

      <button
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode
    ? "☀️ Light Mode"
    : "🌙 Dark Mode"}
</button>

<button onClick={resetData}>
  🗑 Reset All Data
</button>

      <div className="summary-grid">
        <div className="card">
          <h3>Income</h3>
          <p>₹{Number(income).toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Expenses</h3>
          <p>₹{Number(totalExpenses).toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Remaining</h3>
          <p>₹{Number(remaining).toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Savings</h3>
          <p>₹{Number(savings).toLocaleString("en-IN")}</p>
        </div>

        <div className="card">
          <h3>Emergency Fund</h3>
          <p>₹{Number(emergencyFund).toLocaleString("en-IN")}</p>
        </div>
      </div>
      <div className="card">
  <h3>📊 Transactions</h3>
  <p>{totalTransactions}</p>
</div>
<div className="card">
  <h3>🔥 Biggest Expense</h3>
  <p>₹{biggestExpense}</p>
</div>

      <div className="card">
        <h2>Add Expense</h2>

        <input
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) =>
            setExpenseAmount(e.target.value)
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Entertainment</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Rent</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <button onClick={addExpense}>
          Add Expense
        </button>
      </div>

      <div className="card">
        <h2>Budget Status</h2>

        {budgetUsage >= 100 && (
          <p>🚨 Budget Exceeded</p>
        )}

        {budgetUsage >= 90 &&
          budgetUsage < 100 && (
            <p>⚠️ 90% Budget Used</p>
          )}

        {budgetUsage >= 80 &&
          budgetUsage < 90 && (
            <p>⚠️ 80% Budget Used</p>
          )}

        <p>
          Used: {budgetUsage.toFixed(1)}%
        </p>
      </div>

      <div className="card">
        <h2>Expense Breakdown</h2>
        <Pie data={pieData} />
      </div>

      <div className="card">
        <h2>Monthly Spending Trend</h2>
        <Line data={lineData} />
      </div>

      <div className="card">
        <h2>Smart Insights</h2>

        <p>
          Most spending category:
          <strong> {topCategory}</strong>
        </p>

        <p>
          Savings Rate:
          <strong>
            {" "}
            {income > 0
              ? (
                  (savings /
                    Number(income)) *
                  100
                ).toFixed(1)
              : 0}
            %
          </strong>
        </p>
      </div>

      <div className="card">
        <h2>Transaction History</h2>

        {transactions.length === 0 ? (
          <p>📊 No expenses recorded yet.
Start tracking your spending today..</p>
        ) : (
          transactions.map((item) => (
            <div
              key={item.id}
              className="transaction"
            >
              <div>
                <strong>
                  {item.description}
                </strong>
                <p>{item.category}</p>
                <small>{item.date}</small>
              </div>

              <div>
                ₹{Number(item.amount).toLocaleString("en-IN")}

                <button
                  onClick={() =>
                    deleteExpense(item.id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;