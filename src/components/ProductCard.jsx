// // src/components/ProductCard.jsx
// import React, { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { useCart } from '../context/CartContext'
// import { useToast } from '../context/ToastContext'

// const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,
// <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
//   <rect width='100%' height='100%' fill='%23f8f9fa'/>
//   <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial, Helvetica, sans-serif' font-size='20'>No image</text>
// </svg>`

// function buildImgUrl(url, w = 600) {
//   if (!url) return null
//   if (typeof url !== 'string') return null
//   if (url.includes("images.unsplash.com") && !url.includes("?")) {
//     return `${url}?auto=format&fit=crop&w=${w}&q=80`
//   }
//   return url
// }

// export default function ProductCard({ p }) {
//   const { addToCart } = useCart()
//   const { showToast } = useToast()
//   const [added, setAdded] = useState(false)

//   const raw = Array.isArray(p.images) && p.images.length ? p.images[0] : null
//   const imgSrc = buildImgUrl(raw, 600)

//   function handleAdd() {
//     addToCart(p, 1)
//     showToast(`Added "${p.name}" to cart`, 'success')
//     setAdded(true)
//     setTimeout(() => setAdded(false), 1000)
//   }

//   return (
//     <div className="card h-100 shadow-sm border-0">
//       <div style={{height: 180, overflow: 'hidden', borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem'}}>
//         <img
//   src={imgSrc || PLACEHOLDER_SVG}
//   alt={p.name}
//   className="img-fluid"
//   style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
//   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_SVG }}
// />
//       </div>

//       <div className="card-body d-flex flex-column">
//         <h6 className="mb-1" title={p.name}>{p.name}</h6>
//         <div className="small-muted">{p.short}</div>
//         <div className="mt-auto d-flex justify-content-between align-items-center pt-2">
//           <div className="fw-bold">₹{p.price}</div>
//           <div>
//             <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline-primary me-2">View</Link>
//             <button
//               className={`btn btn-sm ${added ? 'btn-success' : 'btn-outline-secondary'}`}
//               onClick={handleAdd}
//             >
//               {added ? 'Added' : 'Add'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// src/components/ProductCard.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'>
  <rect width='100%' height='100%' fill='%23f8f9fa'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial, Helvetica, sans-serif' font-size='20'>No image</text>
</svg>`

function buildImgUrl(url, w = 600) {
  if (!url) return null
  if (typeof url !== 'string') return null
  if (url.includes("images.unsplash.com") && !url.includes("?")) {
    return `${url}?auto=format&fit=crop&w=${w}&q=80`
  }
  return url
}

export default function ProductCard({ p }) {
  const { addToCart } = useCart()
  const { showToast } = useToast()
  const [added, setAdded] = useState(false)

  const raw = Array.isArray(p.images) && p.images.length ? p.images[0] : null
  const imgSrc = buildImgUrl(raw, 600)

  function handleAdd() {
    addToCart(p, 1)
    showToast(`Added "${p.name}" to cart`, 'success')
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <div className="card h-100 shadow-sm border-0">
      {/* image */}
      <div className="product-card-image-wrap">
        <img
          src={imgSrc || PLACEHOLDER_SVG}
          alt={p.name}
          className="img-fluid product-card-img"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PLACEHOLDER_SVG }}
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h6 className="mb-1 text-truncate" title={p.name}>{p.name}</h6>
        <div className="small-muted mb-2">{p.short}</div>

        {/* actions: on xs stacked vertically, on sm+ inline */}
        <div className="mt-auto d-flex flex-column flex-sm-row justify-content-between align-items-stretch gap-2 product-card-actions">
          <div className="fw-bold align-self-start align-self-sm-center">₹{p.price}</div>

          <div className="d-flex gap-2 w-100 justify-content-sm-end">
            <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline-primary w-100 w-sm-auto">View</Link>
            <button
              className={`btn btn-sm ${added ? 'btn-success' : 'btn-outline-secondary'} w-100 w-sm-auto`}
              onClick={handleAdd}
              aria-label={`Add ${p.name} to cart`}
            >
              {added ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
