import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from './use-toast'

export interface Transaction {
  id: string
  user_id: string
  category_id: string | null
  type: 'income' | 'expense'
  description: string
  amount: number
  date: string
  created_at: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  // Buscar transações
  const fetchTransactions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar transações',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Criar transação
  const createTransaction = async (
    type: 'income' | 'expense',
    description: string,
    amount: number,
    categoryId: string | null,
    date: string
  ) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          description,
          amount,
          category_id: categoryId,
          date,
        })
        .select()
        .single()

      if (error) throw error

      setTransactions([data, ...transactions])
      toast({
        title: 'Transação criada!',
        description: `${type === 'income' ? 'Receita' : 'Despesa'} de R$ ${amount.toFixed(2)} adicionada.`,
      })
      return data
    } catch (error: any) {
      toast({
        title: 'Erro ao criar transação',
        description: error.message,
        variant: 'destructive',
      })
      return null
    }
  }

  // Atualizar transação
  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setTransactions(transactions.map((txn) => (txn.id === id ? data : txn)))
      toast({
        title: 'Transação atualizada!',
        description: 'As alterações foram salvas.',
      })
      return data
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar transação',
        description: error.message,
        variant: 'destructive',
      })
      return null
    }
  }

  // Deletar transação
  const deleteTransaction = async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setTransactions(transactions.filter((txn) => txn.id !== id))
      toast({
        title: 'Transação excluída!',
        description: 'A transação foi removida.',
      })
      return true
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir transação',
        description: error.message,
        variant: 'destructive',
      })
      return false
    }
  }

  useEffect(() => {
    fetchTransactions()

    // Inscrever-se em mudanças em tempo real
    const channel = supabase
      .channel('transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchTransactions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  return {
    transactions,
    loading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  }
}
