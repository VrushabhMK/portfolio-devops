import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import api from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, password })
      if (response.data && response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('username', response.data.user.username)
        navigate('/admin')
      } else {
        setError('Invalid credentials or authentication failed.')
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-card border border-border shadow-elegant glass relative">
        <Link 
          to="/" 
          className="absolute top-6 left-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Site
        </Link>

        <div className="text-center mt-6 mb-8">
          <h2 className="text-3xl font-bold">
            Admin <span className="text-gradient">Login</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Access the portfolio administration dashboard
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-medium hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
