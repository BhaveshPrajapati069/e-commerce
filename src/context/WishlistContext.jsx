// src/context/WishlistContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext()
export function useWishlist() { return useContext(WishlistContext) }

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cv_wishlist')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem('cv_wishlist', JSON.stringify(items)) } catch {}
  }, [items])

  function addToWishlist(product) {
    setItems(prev => {
      if (prev.find(i => String(i.id) === String(product.id))) return prev
      return [...prev, { ...product }]
    })
  }

  function removeFromWishlist(productId) {
    setItems(prev => prev.filter(i => String(i.id) !== String(productId)))
  }

  function toggleWishlist(product) {
    const exists = items.find(i => String(i.id) === String(product.id))
    if (exists) removeFromWishlist(product.id)
    else addToWishlist(product)
  }

  function clearWishlist() {
    setItems([])
  }

  const totalCount = items.length

  return (
    <WishlistContext.Provider value={{
      items, addToWishlist, removeFromWishlist, toggleWishlist, clearWishlist, totalCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}
