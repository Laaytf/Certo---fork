import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Analytics() {
  // Dados mockados para gráficos
  const monthlyData = [
    { month: 'Jan', income: 5200, expense: 3800 },
    { month: 'Fev', income: 5500, expense: 4100 },
    { month: 'Mar', income: 5300, expense: 3900 },
    { month: 'Abr', income: 6000, expense: 4200 },
    { month: 'Mai', income: 5800, expense: 4500 },
    { month: 'Jun', income: 6200, expense: 4300 },
  ]

  const categoryDistribution = [
    { name: 'Alimentação', value: 35, amount: 1200, color: 'bg-emerald-500' },
    { name: 'Transporte', value: 25, amount: 800, color: 'bg-blue-500' },
    { name: 'Lazer', value: 20, amount: 600, color: 'bg-purple-500' },
    { name: 'Contas', value: 15, amount: 450, color: 'bg-orange-500' },
    { name: 'Outros', value: 5, amount: 200, color: 'bg-gray-500' },
  ]

  const insights = [
    {
      title: 'Economia do Mês',
      value: 'R$ 1.450,00',
      change: '+15,3%',
      trend: 'up',
      description: 'Você economizou 23% da sua receita este mês',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Média de Gastos',
      value: 'R$ 158,33',
      change: '-5,2%',
      trend: 'down',
      description: 'Gasto médio diário reduziu em comparação ao mês passado',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Maior Categoria',
      value: 'Alimentação',
      change: '35% do total',
      trend: 'neutral',
      description: 'Categoria com maior volume de gastos',
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ]

  const maxValue = Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Análise Financeira</h1>
        <p className="text-muted-foreground mt-1">Insights detalhados sobre suas finanças</p>
      </div>

      {/* Insights Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index} className="animate-slide-up hover:shadow-lg transition-shadow" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {insight.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                <insight.icon className={`h-4 w-4 ${insight.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insight.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {insight.trend === 'up' && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                {insight.trend === 'down' && <ArrowDownRight className="h-4 w-4 text-red-600" />}
                <p className={`text-xs ${
                  insight.trend === 'up' ? 'text-emerald-600' :
                  insight.trend === 'down' ? 'text-red-600' :
                  'text-muted-foreground'
                }`}>
                  {insight.change}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Monthly Comparison Chart */}
          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Receitas vs Despesas (6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((data, index) => (
                  <div key={index} className="space-y-2 animate-scale-in" style={{ animationDelay: `${index * 100 + 400}ms` }}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium w-12">{data.month}</span>
                      <div className="flex-1 flex gap-2 mx-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-600">Receita</span>
                            <span className="font-medium">R$ {data.income.toFixed(0)}</span>
                          </div>
                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${(data.income / maxValue) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-red-600">Despesa</span>
                            <span className="font-medium">R$ {data.expense.toFixed(0)}</span>
                          </div>
                          <div className="h-3 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-500 rounded-full transition-all duration-500"
                              style={{ width: `${(data.expense / maxValue) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-primary w-20 text-right">
                        +R$ {(data.income - data.expense).toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Balance Trend */}
          <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="font-heading">Evolução do Saldo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Atual</p>
                    <p className="text-3xl font-bold text-emerald-600">R$ 12.450,00</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-emerald-600" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Crescimento</p>
                    <p className="text-xl font-bold text-primary">+R$ 2.340</p>
                    <p className="text-xs text-muted-foreground mt-1">Últimos 6 meses</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Média Mensal</p>
                    <p className="text-xl font-bold text-primary">+R$ 390</p>
                    <p className="text-xs text-muted-foreground mt-1">Economia média</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {/* Category Distribution */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="font-heading">Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pie Chart Representation */}
                <div className="flex items-center justify-center p-8">
                  <div className="relative w-48 h-48">
                    {categoryDistribution.map((category, index) => {
                      const totalBefore = categoryDistribution.slice(0, index).reduce((sum, c) => sum + c.value, 0)
                      const rotation = (totalBefore / 100) * 360
                      const strokeDasharray = `${category.value} ${100 - category.value}`

                      return (
                        <svg
                          key={index}
                          className="absolute inset-0 animate-scale-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                          viewBox="0 0 36 36"
                        >
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={category.color.replace('bg-', '')}
                            strokeWidth="3"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset="0"
                            transform={`rotate(${rotation} 18 18)`}
                            className={category.color.replace('bg-', 'stroke-')}
                            opacity="0.8"
                          />
                        </svg>
                      )
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold">100%</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Details */}
                <div className="space-y-3">
                  {categoryDistribution.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 100 + 500}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${category.color}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">R$ {category.amount.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{category.value}% do total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Financial Goals */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="font-heading">Metas Financeiras</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: 'Fundo de Emergência', target: 10000, current: 6500, color: 'emerald' },
                  { name: 'Viagem de Férias', target: 5000, current: 2800, color: 'blue' },
                  { name: 'Novo Notebook', target: 3500, current: 2100, color: 'purple' },
                ].map((goal, index) => {
                  const percentage = (goal.current / goal.target) * 100
                  return (
                    <div key={index} className="space-y-2 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{goal.name}</p>
                          <p className="text-sm text-muted-foreground">
                            R$ {goal.current.toFixed(2)} de R$ {goal.target.toFixed(2)}
                          </p>
                        </div>
                        <span className={`text-lg font-bold text-${goal.color}-600`}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Predictions */}
          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="font-heading">Projeções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">Economia Projetada</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Baseado no seu padrão atual, você pode economizar R$ 4.680,00 até o final do ano
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Progress value={65} className="flex-1 h-2" />
                        <span className="text-sm font-medium">65%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
