// src/pages/Wishlist.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'

export default function Wishlist(){
  const { items, removeFromWishlist, clearWishlist } = useWishlist()

  if (!items || items.length === 0) {
    return (
      <div className="container py-5">
        <h3>Your wishlist is empty</h3>
        <p className="text-muted">Add items you love and find them here later.</p>
        <Link to="/collections" className="btn btn-primary mt-2">Browse products</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h3 className="mb-4">Your Wishlist</h3>

      <div className="row g-3 mb-4">
        {items.map(it => (
          <div key={it.id} className="col-6 col-md-3">
            <div className="card h-100 shadow-sm">
              <div style={{height:140, overflow:'hidden'}}>
                <img src={it.images?.[0] || '/assets/images/placeholder.jpg'} alt={it.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
              </div>
              <div className="card-body d-flex flex-column">
                <div className="fw-bold text-truncate" title={it.name}>{it.name}</div>
                <div className="small text-muted">₹{it.price}</div>
                <div className="mt-auto d-flex gap-2">
                  <Link to={`/product/${it.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromWishlist(it.id)}>Remove</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => clearWishlist()}>Clear wishlist</button>
          <Link to="/collections" className="btn btn-light">Continue shopping</Link>
        </div>

        <div className="text-end">
          <div className="small text-muted">Saved items</div>
          <div className="fw-bold">{items.length}</div>
        </div>
      </div>
    </div>
  )
}
