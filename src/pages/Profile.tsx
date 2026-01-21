import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { User, Calendar, Shield, Moon, Globe } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useProfile } from '@/hooks/use-profile'
import { useTransactions } from '@/hooks/use-transactions'
import { useCategories } from '@/hooks/use-categories'
import { supabase } from '@/lib/supabase'

export default function Profile() {
  const { theme, setTheme } = useTheme()
  const { profile, loading, updateProfile } = useProfile()
  const { transactions } = useTransactions()
  const { categories } = useCategories()

  const [editName, setEditName] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // 🔐 estados senha
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) return

    const result = await updateProfile(editName.trim())
    if (result) {
      setIsEditing(false)
      setEditName('')
    }
  }

  const handleChangePassword = async () => {
    setPasswordError(null)
    setPasswordMessage(null)

    if (newPassword.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    try {
      setPasswordLoading(true)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setPasswordMessage('Senha alterada com sucesso!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setPasswordError(err.message || 'Erro ao alterar senha')
    } finally {
      setPasswordLoading(false)
    }
  }

  const daysActive = profile
    ? Math.floor(
        (new Date().getTime() - new Date(profile.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0

  const stats = [
    { label: 'Transações', value: transactions.length.toString() },
    { label: 'Categorias', value: categories.length.toString() },
    { label: 'Dias Ativos', value: daysActive.toString() },
  ]

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Erro ao carregar perfil</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-heading font-bold">Perfil</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar */}
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarFallback className="text-2xl">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Preferências */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferências
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label>Tema escuro</Label>
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(v) => setTheme(v ? 'dark' : 'light')}
                />
              </div>
            </CardContent>
          </Card>

          {/* 🔐 Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nova senha</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label>Confirmar nova senha</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}

              {passwordMessage && (
                <p className="text-sm text-green-600">{passwordMessage}</p>
              )}

              <Button
                onClick={handleChangePassword}
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Alterando...' : 'Alterar senha'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

