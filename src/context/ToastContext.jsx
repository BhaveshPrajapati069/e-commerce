// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()
export function useToast() { return useContext(ToastContext) }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', duration = 2000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 2000 }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast align-items-center text-bg-${t.type} border-0 fade show mb-2 shadow`}
            role="alert"
            style={{
              minWidth: '240px',
              animation: 'slideInRight 0.4s ease'
            }}
          >
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple inline animation for smooth entry */}
      <style>
        {`
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </ToastContext.Provider>
  )
}
