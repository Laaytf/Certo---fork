import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Trash2, FolderOpen, MoreVertical, Pencil } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { useCategories, type Category } from '@/hooks/use-categories'
import { useTransactions } from '@/hooks/use-transactions'

// Mapeamento de palavras-chave para sugestão automática de emojis
const emojiSuggestions: Record<string, string> = {
  'alimentação': '🍽️',
  'comida': '🍔',
  'restaurante': '🍽️',
  'supermercado': '🛒',
  'mercado': '🛒',
  'compras': '🛒',
  'transporte': '🚗',
  'carro': '🚗',
  'uber': '🚕',
  'taxi': '🚕',
  'gasolina': '⛽',
  'combustível': '⛽',
  'lazer': '🎮',
  'entretenimento': '🎬',
  'diversão': '🎉',
  'cinema': '🎬',
  'contas': '🧾',
  'conta': '🧾',
  'boleto': '🧾',
  'casa': '🏠',
  'moradia': '🏠',
  'aluguel': '🏠',
  'trabalho': '💼',
  'escritório': '💼',
  'saúde': '💊',
  'médico': '⚕️',
  'hospital': '🏥',
  'farmácia': '💊',
  'remédio': '💊',
  'educação': '🎓',
  'estudo': '📚',
  'curso': '🎓',
  'escola': '🎓',
  'faculdade': '🎓',
  'investimento': '📈',
  'investimentos': '📈',
  'poupança': '💰',
  'economia': '💰',
  'viagem': '✈️',
  'férias': '🏖️',
  'turismo': '✈️',
  'roupa': '👕',
  'vestuário': '👕',
  'beleza': '💄',
  'cosméticos': '💄',
  'pet': '🐾',
  'animal': '🐾',
  'cachorro': '🐕',
  'gato': '🐈',
  'telefone': '📱',
  'celular': '📱',
  'internet': '🌐',
  'energia': '⚡',
  'luz': '💡',
  'água': '💧',
  'academia': '🏋️',
  'esporte': '⚽',
  'presente': '🎁',
  'gift': '🎁',
}

export default function Categories() {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories()
  const { transactions } = useTransactions()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Formulário de criação/edição
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryBudget, setNewCategoryBudget] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6')
  const [newCategoryIcon, setNewCategoryIcon] = useState('📁')

  // Função para sugerir emoji baseado no nome
  const suggestEmoji = (name: string): string => {
    const nameLower = name.toLowerCase().trim()

    // Procurar correspondência exata ou parcial
    for (const [keyword, emoji] of Object.entries(emojiSuggestions)) {
      if (nameLower.includes(keyword)) {
        return emoji
      }
    }

    return '📁' // Emoji padrão
  }

  // Atualizar sugestão de emoji quando o nome mudar
  useEffect(() => {
    if (newCategoryName) {
      const suggested = suggestEmoji(newCategoryName)
      setNewCategoryIcon(suggested)
    }
  }, [newCategoryName])

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const budget = parseFloat(newCategoryBudget) || 0
    await createCategory(newCategoryName, newCategoryColor, budget, newCategoryIcon)

    // Limpar formulário
    setNewCategoryName('')
    setNewCategoryBudget('')
    setNewCategoryColor('#3B82F6')
    setNewCategoryIcon('📁')
    setIsCreateDialogOpen(false)
  }

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return

    const budget = parseFloat(newCategoryBudget) || 0
    await updateCategory(selectedCategory.id, {
      name: newCategoryName,
      color: newCategoryColor,
      budget,
      icon: newCategoryIcon,
    })

    // Limpar formulário
    setNewCategoryName('')
    setNewCategoryBudget('')
    setNewCategoryColor('#3B82F6')
    setNewCategoryIcon('📁')
    setSelectedCategory(null)
    setIsEditDialogOpen(false)
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setNewCategoryName(category.name)
    setNewCategoryBudget(category.budget.toString())
    setNewCategoryColor(category.color)
    setNewCategoryIcon(category.icon || '📁')
    setIsEditDialogOpen(true)
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

            return (
              <Card
                key={category.id}
                className="animate-scale-in hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 50 + 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="p-3 rounded-xl group-hover:scale-110 transition-transform text-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon || '📁'}
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex-1">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteCategory(category.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Apagar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-heading">Editar Categoria</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome da Categoria</Label>
              <Input
                id="edit-name"
                placeholder="Ex: Educação"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-budget">Orçamento Mensal</Label>
              <Input
                id="edit-budget"
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
            <Button type="submit" className="w-full">Salvar Alterações</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
