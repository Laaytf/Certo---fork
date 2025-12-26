import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function Dashboard() {
  // Dados mockados
  const stats = [
    {
      title: 'Saldo Total',
      value: 'R$ 12.450,00',
      change: '+12,5%',
      trend: 'up',
      icon: Wallet,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Receitas',
      value: 'R$ 8.200,00',
      change: '+8,2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-600/10',
    },
    {
      title: 'Despesas',
      value: 'R$ 4.750,00',
      change: '-3,1%',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-600/10',
    },
    {
      title: 'Cartão de Crédito',
      value: 'R$ 2.380,00',
      change: '48% do limite',
      trend: 'neutral',
      icon: CreditCard,
      color: 'text-blue-600',
      bgColor: 'bg-blue-600/10',
    },
  ]

  const recentTransactions = [
    { id: 1, description: 'Salário', amount: 5000, type: 'income', category: 'Trabalho', date: '15/12/2025' },
    { id: 2, description: 'Supermercado', amount: -320, type: 'expense', category: 'Alimentação', date: '14/12/2025' },
    { id: 3, description: 'Freelance', amount: 1500, type: 'income', category: 'Extra', date: '13/12/2025' },
    { id: 4, description: 'Conta de Luz', amount: -180, type: 'expense', category: 'Contas', date: '12/12/2025' },
    { id: 5, description: 'Netflix', amount: -55, type: 'expense', category: 'Lazer', date: '10/12/2025' },
  ]

  const categorySpending = [
    { name: 'Alimentação', amount: 1200, percentage: 35, color: 'bg-emerald-500' },
    { name: 'Transporte', amount: 800, percentage: 25, color: 'bg-blue-500' },
    { name: 'Lazer', amount: 600, percentage: 20, color: 'bg-purple-500' },
    { name: 'Contas', amount: 450, percentage: 15, color: 'bg-orange-500' },
    { name: 'Outros', amount: 200, percentage: 5, color: 'bg-gray-500' },
  ]

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
          <Card key={index} className="animate-slide-up hover:shadow-lg transition-shadow duration-300" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                {stat.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                <p className={`text-xs ${
                  stat.trend === 'up' ? 'text-emerald-600' :
                  stat.trend === 'down' ? 'text-red-600' :
                  'text-muted-foreground'
                }`}>
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
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}R$ {Math.abs(transaction.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Spending */}
        <Card className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="font-heading">Gastos por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorySpending.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">R$ {category.amount.toFixed(2)}</span>
                  </div>
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full ${category.color} transition-all duration-500 animate-scale-in`}
                      style={{
                        width: `${category.percentage}%`,
                        animationDelay: `${index * 100 + 600}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
