export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          budget: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          budget?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          budget?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          type: 'income' | 'expense'
          description: string
          amount: number
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          type: 'income' | 'expense'
          description: string
          amount: number
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          type?: 'income' | 'expense'
          description?: string
          amount?: number
          date?: string
          created_at?: string
        }
      }
    }
  }
}
