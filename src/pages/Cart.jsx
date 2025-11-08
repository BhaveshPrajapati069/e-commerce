// src/pages/Cart.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, updateQty, totalPrice, clearCart } = useCart()

  function handleQtyChange(id, e) {
    const v = Math.max(1, parseInt(e.target.value || '1', 10))
    updateQty(id, v)
  }

  if (!items || items.length === 0) {
    return (
      <div className="container py-5">
        <h3>Your cart is empty</h3>
        <p className="text-muted">Looks like you haven't added anything yet.</p>
        <Link to="/collections" className="btn btn-primary mt-2">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <h3 className="mb-4">Your Cart</h3>

      <div className="list-group mb-4">
        {items.map(it => (
          <div key={it.id} className="list-group-item d-flex flex-column flex-md-row align-items-start gap-3">
            <div className="d-flex align-items-center gap-3" style={{minWidth: 0}}>
              <img
                src={it.images?.[0] || '/assets/images/placeholder.jpg'}
                alt={it.name}
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }}
              />
              <div style={{minWidth: 0}}>
                <div className="fw-bold text-truncate" style={{maxWidth: 400}}>{it.name}</div>
                <div className="small text-muted">₹{it.price}</div>
                <div className="small text-muted">{it.category}</div>
              </div>
            </div>

            <div className="ms-auto d-flex align-items-center gap-2">
              <div className="d-flex align-items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={it.qty}
                  onChange={(e) => handleQtyChange(it.id, e)}
                  style={{ width: 72 }}
                  className="form-control form-control-sm"
                />
                <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(it.id)}>Remove</button>
              </div>

              <div className="text-end ms-3">
                <div className="small text-muted">Subtotal</div>
                <div className="fw-bold">₹{(it.price * (it.qty || 0)).toFixed(0)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={clearCart}>Clear cart</button>
          <Link to="/collections" className="btn btn-light">Continue shopping</Link>
        </div>

        <div className="text-end">
          <div className="small text-muted">Total</div>
          <div className="fw-bold fs-5">₹{totalPrice.toFixed(0)}</div>
          <button className="btn btn-success mt-2">Checkout</button>
        </div>
      </div>
    </div>
  )
}
