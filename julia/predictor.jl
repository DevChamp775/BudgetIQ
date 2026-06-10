# =========================================
# PREDICTOR.JL
# Smart Expense Prediction System
# =========================================

using Statistics
using Dates
using Random


# =========================================
# SAMPLE MONTHLY EXPENSE DATA
# =========================================

months = [

    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun"

]

expenses = [

    22000,
    25000,
    27000,
    30000,
    32000,
    35000

]


# =========================================
# BASIC ANALYTICS
# =========================================

println("\n=================================")
println("SMART EXPENSE ANALYSIS")
println("=================================\n")

println("Monthly Expenses:")
println(expenses)

println("\nAverage Expense:")
println(mean(expenses))

println("\nMaximum Expense:")
println(maximum(expenses))

println("\nMinimum Expense:")
println(minimum(expenses))

println("\nTotal Expense:")
println(sum(expenses))


# =========================================
# EXPENSE GROWTH RATE
# =========================================

growth_rates = []

for i in 2:length(expenses)

    growth =
    (
        expenses[i] - expenses[i-1]
    ) / expenses[i-1] * 100

    push!(growth_rates, growth)

end

println("\nMonthly Growth Rates (%):")
println(round.(growth_rates, digits=2))


# =========================================
# FUTURE EXPENSE PREDICTION
# =========================================

average_growth =
mean(growth_rates)

last_expense =
expenses[end]

predicted_next_month =
last_expense *
(1 + average_growth / 100)

println("\n=================================")
println("NEXT MONTH PREDICTION")
println("=================================\n")

println(
    "Predicted Expense Next Month: ₹",
    round(predicted_next_month, digits=2)
)


# =========================================
# SAVINGS ANALYSIS
# =========================================

monthly_budget = 50000

remaining_amount =
monthly_budget - predicted_next_month

println("\n=================================")
println("BUDGET ANALYSIS")
println("=================================\n")

println("Monthly Budget: ₹", monthly_budget)

println(
    "Predicted Remaining Amount: ₹",
    round(remaining_amount, digits=2)
)

if remaining_amount > 10000

    println(
        "\nExcellent Savings Prediction!"
    )

elseif remaining_amount > 5000

    println(
        "\nModerate Savings Expected."
    )

else

    println(
        "\nHigh Spending Detected."
    )

end


# =========================================
# CATEGORY EXPENSE ANALYSIS
# =========================================

categories = [

    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Entertainment"

]

category_expenses = [

    12000,
    7000,
    5000,
    4000,
    3000,
    6000

]

println("\n=================================")
println("CATEGORY ANALYSIS")
println("=================================\n")

for i in 1:length(categories)

    percentage =
    (
        category_expenses[i]
        / sum(category_expenses)
    ) * 100

    println(

        categories[i],

        " => ₹",

        category_expenses[i],

        " (",

        round(percentage, digits=2),

        "% )"

    )

end


# =========================================
# HIGHEST SPENDING CATEGORY
# =========================================

max_index =
argmax(category_expenses)

println("\nHighest Spending Category:")

println(

    categories[max_index],

    " => ₹",

    category_expenses[max_index]

)


# =========================================
# AI STYLE SMART SUGGESTIONS
# =========================================

println("\n=================================")
println("SMART FINANCIAL SUGGESTIONS")
println("=================================\n")

if category_expenses[max_index] > 10000

    println(
        "- Your spending on ",
        categories[max_index],
        " is very high."
    )

    println(
        "- Try reducing unnecessary expenses."
    )

end

if average_growth > 10

    println(
        "- Your monthly expenses are increasing rapidly."
    )

    println(
        "- Consider creating stricter budget limits."
    )

end

if remaining_amount < 5000

    println(
        "- Your expected savings are low."
    )

    println(
        "- Reduce entertainment and shopping expenses."
    )

else

    println(
        "- Your financial health looks stable."
    )

end


# =========================================
# RANDOMIZED FUTURE FORECAST
# =========================================

println("\n=================================")
println("6 MONTH FUTURE FORECAST")
println("=================================\n")

future_predictions = []

future_expense =
predicted_next_month

for i in 1:6

    random_growth =
    rand(-3.0:0.5:8.0)

    future_expense =
    future_expense *
    (1 + random_growth / 100)

    push!(
        future_predictions,
        round(future_expense, digits=2)
    )

end

for i in 1:6

    println(

        "Month ",

        i,

        " Prediction => ₹",

        future_predictions[i]

    )

end


# =========================================
# FINANCIAL HEALTH SCORE
# =========================================

println("\n=================================")
println("FINANCIAL HEALTH SCORE")
println("=================================\n")

score = 100

if average_growth > 10
    score -= 20
end

if remaining_amount < 5000
    score -= 25
end

if category_expenses[max_index] > 12000
    score -= 15
end

println("Your Financial Score: ", score, "/100")

if score >= 80

    println(
        "Excellent Financial Management!"
    )

elseif score >= 60

    println(
        "Good Financial Condition."
    )

else

    println(
        "Needs Better Expense Control."
    )

end


# =========================================
# FINAL SUMMARY
# =========================================

println("\n=================================")
println("FINAL AI SUMMARY")
println("=================================\n")

println(
"""
Your expenses show a gradual increase
over recent months.

The predicted expense for next month is ₹$(round(predicted_next_month,digits=2)).

Your highest spending category is $(categories[max_index]).

Maintaining better control over
high spending categories can improve
your monthly savings significantly.

Overall financial score: $score/100
"""
)

println("\n=================================")
println("ExpenseAI Julia Prediction Completed")
println("=================================\n")