import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, ShoppingCart, Car, Home, Utensils, Film, Briefcase, Heart, TrendingUp, Edit2, Trash2, FolderOpen } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useCategories } from '@/hooks/use-categories'
import { useTransactions } from '@/hooks/use-transactions'

const iconMap: Record<string, typeof ShoppingCart> = {
  'Alimentação': Utensils,
  'Transporte': Car,
  'Lazer': Film,
  'Contas': Home,
  'Compras': ShoppingCart,
  'Trabalho': Briefcase,
  'Saúde': Heart,
  'Investimentos': TrendingUp,
}

export default function Categories() {
  const { categories, loading, createCategory, deleteCategory } = useCategories()
  const { transactions } = useTransactions()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Formulário de criação
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryBudget, setNewCategoryBudget] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6')

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const budget = parseFloat(newCategoryBudget) || 0
    await createCategory(newCategoryName, newCategoryColor, budget)

    // Limpar formulário
    setNewCategoryName('')
    setNewCategoryBudget('')
    setNewCategoryColor('#3B82F6')
    setIsCreateDialogOpen(false)
  }

  // Calcular gastos por categoria
  const getCategorySpent = (categoryId: string) => {
    return transactions
      .filter((t) => t.category_id === categoryId && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const getCategoryTransactionCount = (categoryId: string) => {
    return transactions.filter((t) => t.category_id === categoryId).length
  }

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + getCategorySpent(cat.id), 0)
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground mt-1">Organize e controle seus gastos por categoria</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="font-heading">Criar Categoria</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCategory} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Categoria</Label>
                <Input
                  id="name"
                  placeholder="Ex: Educação"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Orçamento Mensal</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newCategoryBudget}
                  onChange={(e) => setNewCategoryBudget(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2 flex-wrap">
                  {['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#A855F7', '#EC4899', '#6B7280'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategoryColor(color)}
                      className={`h-10 w-10 rounded-lg hover:scale-110 transition-transform ${
                        newCategoryColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">Criar Categoria</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Overview */}
      {categories.length > 0 && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="font-heading">Resumo do Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Gasto Total</p>
                <p className="text-2xl font-bold">R$ {totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Orçamento Total</p>
                <p className="text-2xl font-bold text-muted-foreground">R$ {totalBudget.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Utilizado</span>
                <span className="font-medium">{percentageUsed.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(percentageUsed, 100)} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Disponível</p>
                <p className="text-lg font-bold text-emerald-600">
                  R$ {(totalBudget - totalSpent).toFixed(2)}
                </p>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <p className="text-sm text-muted-foreground">Economia</p>
                <p className="text-lg font-bold text-blue-600">
                  {totalBudget > 0 ? ((1 - percentageUsed / 100) * 100).toFixed(1) : '0.0'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {categories.length === 0 && (
        <Card className="animate-slide-up">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria criada</h3>
            <p className="text-sm text-muted-foreground mb-6">Crie sua primeira categoria para começar</p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Categoria
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      {categories.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category, index) => {
            const spent = getCategorySpent(category.id)
            const percentage = category.budget > 0 ? (spent / category.budget) * 100 : 0
            const isOverBudget = percentage > 100
            const Icon = iconMap[category.name] || ShoppingCart

            return (
              <Card
                key={category.id}
                className="animate-scale-in hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 50 + 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Transações</p>
                      <p className="text-sm font-semibold">{getCategoryTransactionCount(category.id)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Orçamento: R$ {category.budget.toFixed(2)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={isOverBudget ? 'text-red-600 font-semibold' : 'text-foreground'}>
                        R$ {spent.toFixed(2)}
                      </span>
                      <span className={`font-medium ${
                        percentage > 80 ? 'text-red-600' :
                        percentage > 60 ? 'text-orange-600' :
                        'text-muted-foreground'
                      }`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-red-600' : ''}`}
                    />
                  </div>

                  {isOverBudget && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                      <p className="text-xs text-red-600 font-medium">
                        Orçamento excedido em R$ {(spent - category.budget).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {!isOverBudget && category.budget > 0 && (
                    <div className="bg-secondary rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">
                        Restam R$ {(category.budget - spent).toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
