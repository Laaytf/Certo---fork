import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, PieChart, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useAnalytics } from '@/hooks/use-analytics'

// Função para ajustar automaticamente cores duplicadas com variações de luminosidade
function adjustDuplicateColors(categories: Array<{ color: string; [key: string]: any }>) {
  const colorMap = new Map<string, number>()

  return categories.map((category) => {
    const baseColor = category.color
    const count = colorMap.get(baseColor) || 0
    colorMap.set(baseColor, count + 1)

    // Se não há duplicata, usa a cor original
    if (count === 0) {
      return { ...category, chartColor: baseColor }
    }

    // Aplica variação de luminosidade para duplicatas
    // Converte hex para RGB, ajusta luminosidade, retorna novo hex
    const hex = baseColor.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    // Fator de ajuste: cada duplicata fica progressivamente mais escura
    const factor = 1 - (count * 0.15)
    const newR = Math.round(r * factor)
    const newG = Math.round(g * factor)
    const newB = Math.round(b * factor)

    const adjustedColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`

    return { ...category, chartColor: adjustedColor }
  })
}

export default function Analytics() {
  const {
    loading,
    monthlyData,
    periodComparison,
    categorySpending,
    totals,
    dailyAverage,
    topCategory,
  } = useAnalytics()

  // Insights dinâmicos baseados em dados reais
  const insights = [
    {
      title: 'Economia Total',
      value: `R$ ${totals.balance.toFixed(2)}`,
      change: totals.savingsRate > 0 ? `${totals.savingsRate.toFixed(1)}%` : '0%',
      trend: totals.balance >= 0 ? 'up' : 'down',
      description: totals.savingsRate > 0
        ? `Você economizou ${totals.savingsRate.toFixed(0)}% da sua receita total`
        : 'Suas despesas superaram as receitas',
      icon: TrendingUp,
      color: totals.balance >= 0 ? 'text-emerald-600' : 'text-red-600',
      bgColor: totals.balance >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10',
    },
    {
      title: 'Média de Gastos',
      value: `R$ ${dailyAverage.toFixed(2)}`,
      change: periodComparison.change.expense !== 0
        ? `${periodComparison.change.expense > 0 ? '+' : ''}${periodComparison.change.expense.toFixed(1)}%`
        : 'Sem mudanças',
      trend: periodComparison.change.expense < 0 ? 'down' : periodComparison.change.expense > 0 ? 'up' : 'neutral',
      description: periodComparison.change.expense < 0
        ? 'Gasto médio diário reduziu em comparação ao mês passado'
        : periodComparison.change.expense > 0
        ? 'Gasto médio diário aumentou em comparação ao mês passado'
        : 'Gasto médio diário manteve-se estável',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Maior Categoria',
      value: topCategory?.name || 'Nenhuma',
      change: topCategory ? `${topCategory.percentage.toFixed(0)}% do total` : '0%',
      trend: 'neutral',
      description: topCategory
        ? 'Categoria com maior volume de gastos'
        : 'Adicione transações para ver estatísticas',
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ]

  const maxValue = monthlyData.length > 0
    ? Math.max(...monthlyData.map(d => Math.max(d.income, d.expense)))
    : 1

  if (loading) {
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
          <TabsTrigger value="trends">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Monthly Comparison Chart */}
          <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Receitas vs Despesas (Últimos 6 meses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyData.length === 0 || monthlyData.every(d => d.income === 0 && d.expense === 0) ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Adicione transações para visualizar o histórico mensal</p>
                </div>
              ) : (
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
                                style={{ width: `${maxValue > 0 ? (data.income / maxValue) * 100 : 0}%` }}
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
                                style={{ width: `${maxValue > 0 ? (data.expense / maxValue) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <span className={`font-semibold w-20 text-right ${data.balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {data.balance >= 0 ? '+' : ''}R$ {data.balance.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Balance Trend */}
          <Card className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <CardHeader>
              <CardTitle className="font-heading">Resumo Financeiro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-lg ${
                  totals.balance >= 0
                    ? 'bg-emerald-500/10'
                    : 'bg-red-500/10'
                }`}>
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Total</p>
                    <p className={`text-3xl font-bold ${
                      totals.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      R$ {totals.balance.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className={`h-12 w-12 ${
                    totals.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Receitas</p>
                    <p className="text-xl font-bold text-emerald-600">R$ {totals.income.toFixed(2)}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Despesas</p>
                    <p className="text-xl font-bold text-red-600">R$ {totals.expense.toFixed(2)}</p>
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
              {categorySpending.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Adicione despesas com categorias para visualizar a distribuição</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Pie Chart Representation */}
                  <div className="flex items-center justify-center p-8">
                    <div className="relative w-48 h-48">
                      {adjustDuplicateColors(categorySpending.slice(0, 5)).map((category, index) => {
                        // Pegar a categoria original para acessar percentage
                        const originalCategory = categorySpending.slice(0, 5)[index]
                        const totalBefore = categorySpending.slice(0, index).reduce((sum, c) => sum + c.percentage, 0)
                        const rotation = (totalBefore / 100) * 360
                        const strokeDasharray = `${originalCategory.percentage} ${100 - originalCategory.percentage}`

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
                              stroke={category.chartColor}
                              strokeWidth="3"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset="0"
                              transform={`rotate(${rotation} 18 18)`}
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
                    {categorySpending.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors animate-slide-up"
                        style={{ animationDelay: `${index * 100 + 500}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2 rounded-lg text-xl flex items-center justify-center"
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            {category.icon}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R$ {category.amount.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}% do total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {/* Period Comparison */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="font-heading">Comparação: Mês Atual vs Mês Anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Current vs Previous Month */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Mês Atual</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Receitas</span>
                        <span className="font-semibold text-emerald-600">
                          R$ {periodComparison.currentMonth.income.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Despesas</span>
                        <span className="font-semibold text-red-600">
                          R$ {periodComparison.currentMonth.expense.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Saldo</span>
                        <span className={`font-bold ${
                          periodComparison.currentMonth.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          R$ {periodComparison.currentMonth.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Mês Anterior</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Receitas</span>
                        <span className="font-semibold text-emerald-600">
                          R$ {periodComparison.previousMonth.income.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Despesas</span>
                        <span className="font-semibold text-red-600">
                          R$ {periodComparison.previousMonth.expense.toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-semibold">Saldo</span>
                        <span className={`font-bold ${
                          periodComparison.previousMonth.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          R$ {periodComparison.previousMonth.balance.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Percentage Changes */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-muted-foreground">Variação Percentual</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <span className="text-sm">Receitas</span>
                      <div className="flex items-center gap-2">
                        {periodComparison.change.income > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        ) : periodComparison.change.income < 0 ? (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        ) : null}
                        <span className={`font-semibold ${
                          periodComparison.change.income > 0 ? 'text-emerald-600' :
                          periodComparison.change.income < 0 ? 'text-red-600' :
                          'text-muted-foreground'
                        }`}>
                          {periodComparison.change.income > 0 ? '+' : ''}
                          {periodComparison.change.income.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <span className="text-sm">Despesas</span>
                      <div className="flex items-center gap-2">
                        {periodComparison.change.expense > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        ) : periodComparison.change.expense < 0 ? (
                          <ArrowDownRight className="h-4 w-4 text-emerald-600" />
                        ) : null}
                        <span className={`font-semibold ${
                          periodComparison.change.expense > 0 ? 'text-red-600' :
                          periodComparison.change.expense < 0 ? 'text-emerald-600' :
                          'text-muted-foreground'
                        }`}>
                          {periodComparison.change.expense > 0 ? '+' : ''}
                          {periodComparison.change.expense.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                      <span className="font-semibold">Saldo</span>
                      <div className="flex items-center gap-2">
                        {periodComparison.change.balance > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                        ) : periodComparison.change.balance < 0 ? (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        ) : null}
                        <span className={`font-bold ${
                          periodComparison.change.balance > 0 ? 'text-emerald-600' :
                          periodComparison.change.balance < 0 ? 'text-red-600' :
                          'text-muted-foreground'
                        }`}>
                          {periodComparison.change.balance > 0 ? '+' : ''}
                          {periodComparison.change.balance.toFixed(1)}%
                        </span>
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
