import { useMemo } from 'react'
import { useTransactions } from './use-transactions'
import { useCategories } from './use-categories'

interface MonthlyData {
  month: string
  income: number
  expense: number
  balance: number
}

interface CategorySpending {
  name: string
  amount: number
  percentage: number
  color: string
}

interface PeriodComparison {
  currentMonth: {
    income: number
    expense: number
    balance: number
  }
  previousMonth: {
    income: number
    expense: number
    balance: number
  }
  change: {
    income: number
    expense: number
    balance: number
  }
}

export function useAnalytics() {
  const { transactions, loading } = useTransactions()
  const { categories } = useCategories()

  // Calcular dados mensais (últimos 6 meses)
  const monthlyData = useMemo((): MonthlyData[] => {
    const months: MonthlyData[] = []
    const now = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStr = date.toLocaleDateString('pt-BR', { month: 'short' })
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date)
        return tDate >= monthStart && tDate <= monthEnd
      })

      const income = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expense = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      months.push({
        month: monthStr.charAt(0).toUpperCase() + monthStr.slice(1, 3),
        income,
        expense,
        balance: income - expense,
      })
    }

    return months
  }, [transactions])

  // Comparação mês atual vs mês anterior
  const periodComparison = useMemo((): PeriodComparison => {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

    const currentMonthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate >= currentMonthStart
    })

    const previousMonthTransactions = transactions.filter((t) => {
      const tDate = new Date(t.date)
      return tDate >= previousMonthStart && tDate <= previousMonthEnd
    })

    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentExpense = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const previousIncome = previousMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const previousExpense = previousMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = currentIncome - currentExpense
    const previousBalance = previousIncome - previousExpense

    return {
      currentMonth: {
        income: currentIncome,
        expense: currentExpense,
        balance: currentBalance,
      },
      previousMonth: {
        income: previousIncome,
        expense: previousExpense,
        balance: previousBalance,
      },
      change: {
        income: previousIncome > 0 ? ((currentIncome - previousIncome) / previousIncome) * 100 : 0,
        expense: previousExpense > 0 ? ((currentExpense - previousExpense) / previousExpense) * 100 : 0,
        balance: previousBalance !== 0 ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100 : 0,
      },
    }
  }, [transactions])

  // Gastos por categoria
  const categorySpending = useMemo((): CategorySpending[] => {
    const spending = categories
      .map((category) => {
        const amount = transactions
          .filter((t) => t.category_id === category.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0)
        return {
          name: category.name,
          amount,
          color: category.color,
        }
      })
      .filter((cat) => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount)

    const totalSpending = spending.reduce((sum, cat) => sum + cat.amount, 0)

    return spending.map((cat) => ({
      ...cat,
      percentage: totalSpending > 0 ? (cat.amount / totalSpending) * 100 : 0,
    }))
  }, [transactions, categories])

  // Totais gerais
  const totals = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
    }
  }, [transactions])

  // Média de gastos diários (mês atual)
  const dailyAverage = useMemo(() => {
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const currentMonthExpenses = transactions
      .filter((t) => {
        const tDate = new Date(t.date)
        return t.type === 'expense' && tDate >= currentMonthStart
      })
      .reduce((sum, t) => sum + t.amount, 0)

    const daysInMonth = now.getDate() // Dias decorridos no mês atual
    return daysInMonth > 0 ? currentMonthExpenses / daysInMonth : 0
  }, [transactions])

  // Maior categoria de gastos
  const topCategory = useMemo(() => {
    if (categorySpending.length === 0) return null
    return categorySpending[0]
  }, [categorySpending])

  return {
    loading,
    monthlyData,
    periodComparison,
    categorySpending,
    totals,
    dailyAverage,
    topCategory,
  }
}
