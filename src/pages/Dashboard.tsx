import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { useTransactions } from '@/hooks/use-transactions'
import { useCategories } from '@/hooks/use-categories'

export default function Dashboard() {
  const { transactions, loading: transactionsLoading } = useTransactions()
  const { categories } = useCategories()

  // Calcular totais
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  // Pegar transações recentes (últimas 5)
  const recentTransactions = transactions.slice(0, 5)

  // Calcular gastos por categoria
  const categorySpending = categories
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
    .slice(0, 5)

  const totalCategorySpending = categorySpending.reduce((sum, cat) => sum + cat.amount, 0)

  // Mapear category_id para nome da categoria
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Sem categoria'
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || 'Sem categoria'
  }

  const stats = [
    {
      title: 'Saldo Total',
      value: `R$ ${balance.toFixed(2)}`,
      change: balance >= 0 ? 'Positivo' : 'Negativo',
      trend: balance >= 0 ? 'up' : 'down',
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Receitas',
      value: `R$ ${totalIncome.toFixed(2)}`,
      change: `${transactions.filter((t) => t.type === 'income').length} transações`,
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10',
    },
    {
      title: 'Despesas',
      value: `R$ ${totalExpense.toFixed(2)}`,
      change: `${transactions.filter((t) => t.type === 'expense').length} transações`,
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
    },
    {
      title: 'Categorias',
      value: `${categories.length}`,
      change: `${categorySpending.length} com gastos`,
      trend: 'neutral',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
  ]

  if (transactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral das suas finanças</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="animate-slide-up hover:shadow-lg transition-shadow duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                {stat.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                <p
                  className={`text-xs ${
                    stat.trend === 'up'
                      ? 'text-emerald-600'
                      : stat.trend === 'down'
                      ? 'text-red-600'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Transactions */}
        <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="font-heading">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma transação ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                        }`}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {getCategoryName(transaction.category_id)} •{' '}
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : ''}R$ {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Spending */}
        <Card className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="font-heading">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categorySpending.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum gasto ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categorySpending.map((category, index) => {
                  const percentage = totalCategorySpending > 0
                    ? (category.amount / totalCategorySpending) * 100
                    : 0

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-muted-foreground">R$ {category.amount.toFixed(2)}</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full transition-all duration-500 animate-scale-in"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: category.color,
                            animationDelay: `${index * 100 + 600}ms`,
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
