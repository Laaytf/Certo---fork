import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTransactions } from '@/hooks/use-transactions'
import { useCategories } from '@/hooks/use-categories'

export default function Transactions() {
  const { transactions, loading, createTransaction } = useTransactions()
  const { categories } = useCategories()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Formulário de criação
  const [newDescription, setNewDescription] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newType, setNewType] = useState<'income' | 'expense'>('expense')
  const [newCategoryId, setNewCategoryId] = useState<string>('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])

  const handleCreateTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(newAmount)
    if (isNaN(amount) || amount <= 0) return

    await createTransaction(newType, newDescription, amount, newCategoryId || null, newDate)

    // Limpar formulário
    setNewDescription('')
    setNewAmount('')
    setNewType('expense')
    setNewCategoryId('')
    setNewDate(new Date().toISOString().split('T')[0])
    setIsCreateDialogOpen(false)
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    return matchesSearch && matchesType
  })

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  // Mapear category_id para nome da categoria
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Sem categoria'
    const category = categories.find((c) => c.id === categoryId)
    return category?.name || 'Sem categoria'
  }

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
          <h1 className="text-3xl font-heading font-bold text-foreground">Transações</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas receitas e despesas</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-heading">Adicionar Transação</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTransaction} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  placeholder="Ex: Supermercado"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={newType} onValueChange={(value) => setNewType(value as 'income' | 'expense')}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {newType === 'expense' && (
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={newCategoryId || undefined} onValueChange={setNewCategoryId}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Sem categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Adicionar Transação</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="animate-slide-up">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Receitas
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              R$ {totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Despesas
            </CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10">
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {totalExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar transações..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={filterType === 'income' ? 'default' : 'outline'}
                onClick={() => setFilterType('income')}
                size="sm"
              >
                Receitas
              </Button>
              <Button
                variant={filterType === 'expense' ? 'default' : 'outline'}
                onClick={() => setFilterType('expense')}
                size="sm"
              >
                Despesas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <CardHeader>
          <CardTitle className="font-heading">Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhuma transação encontrada</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-accent transition-all duration-200 animate-scale-in"
                  style={{ animationDelay: `${index * 50 + 400}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryName(transaction.category_id)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
