// src/pages/Collections.jsx
import React from 'react'
import { useLocation } from 'react-router-dom'
import products from '../data/products'
import ProductCard from '../components/ProductCard'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function Collections(){
  const query = useQuery()
  const qRaw = query.get('q') || ''
  // show the raw query in the UI (but normalize for filtering)
  const q = qRaw.trim().toLowerCase()

  const filtered = q
    ? products.filter(p =>
        String(p.name).toLowerCase().includes(q) ||
        String(p.short || '').toLowerCase().includes(q) ||
        String(p.category || '').toLowerCase().includes(q) ||
        String(p.id || '').toLowerCase().includes(q)
      )
    : products

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4">All Products</h2>
        {q ? (
          <div className="small text-muted">Search results for <strong>"{qRaw}"</strong> — {filtered.length} item{filtered.length !== 1 ? 's' : ''}</div>
        ) : (
          <div />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="alert alert-warning">
          No products found for <strong>"{qRaw}"</strong>. Try different keywords.
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(p => (
            <div key={p.id} className="col-6 col-md-3">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
