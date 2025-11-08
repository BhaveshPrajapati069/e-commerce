// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { showToast } = useToast()

  // 🟡 Prefilled demo credentials
  const [email, setEmail] = useState('demo@craftvista.com')
  const [password, setPassword] = useState('demo1234')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // redirect to where user came from or to home
  const from = location.state?.from || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login({ email, password })
      showToast('Logged in successfully', 'success')
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
      showToast(err.message || 'Login failed', 'warning')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: 480 }}>
        <h2 className="mb-3 text-center text-warning fw-bold">Login to CraftVista</h2>
        <p className="text-muted text-center mb-4">
          Use demo credentials below to explore the site instantly.
        </p>

        <form onSubmit={handleSubmit} className="border rounded p-4 bg-white shadow-sm">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter password (min 4 chars)"
              required
              minLength={4}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button type="submit" className="btn btn-warning w-100" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="small text-muted mb-1">Demo Login Credentials:</p>
          <div className="bg-light border rounded p-2 small">
            <strong>Email:</strong> demo@craftvista.com<br />
            <strong>Password:</strong> demo1234
          </div>
        </div>

        <p className="text-center text-muted mt-4 small">
          <Link to="/collections" className="text-decoration-none">← Back to Collections</Link>
        </p>
      </div>
    </div>
  )
}
