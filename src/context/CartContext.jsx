// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cv_cart')
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('cv_cart', JSON.stringify(items))
    } catch (e) { /* ignore write errors */ }
  }, [items])

  function addToCart(product, qty = 1) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === product.id)
      if (idx !== -1) {
        // increment quantity
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty }
        return copy
      }
      return [...prev, { ...product, qty }]
    })
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.id !== productId))
  }

  function updateQty(productId, qty) {
    setItems(prev => prev.map(i => i.id === productId ? { ...i, qty } : i))
  }

  function clearCart() {
    setItems([])
  }

  const totalCount = items.reduce((s, it) => s + (it.qty || 0), 0)
  const totalPrice = items.reduce((s, it) => s + (it.qty || 0) * (it.price || 0), 0)

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQty, clearCart, totalCount, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}
