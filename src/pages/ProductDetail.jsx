// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useWishlist } from "../context/WishlistContext";

const PLACEHOLDER_SVG = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
  <rect width='100%' height='100%' fill='%23f8f9fa'/>
  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23888' font-family='Arial, Helvetica, sans-serif' font-size='28'>No image available</text>
</svg>`;

export default function ProductDetail() {
  const { id } = useParams();
  const p = products.find((x) => String(x.id) === String(id));
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { toggleWishlist, items: wishlistItems } = useWishlist();
  const isWishlisted = !!wishlistItems.find(
    (i) => String(i.id) === String(p.id)
  );

  // debug: show what product/images the component sees
  useEffect(() => {
    console.group("[ProductDetail] Debug");
    console.log("route id:", id);
    console.log("product found:", p);
    console.log("product.images:", p?.images);
    console.groupEnd();
  }, [id, p]);

  const images = Array.isArray(p?.images) && p.images.length ? p.images : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!p)
    return (
      <div className="container py-5">
        <h3>Product not found</h3>
        <Link to="/collections">Back to Collections</Link>
      </div>
    );

  // Use the image path exactly as provided (no modifications)
  const chosen = images[selectedIndex] || null;
  const imgSrc = chosen || PLACEHOLDER_SVG;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3" style={{ borderRadius: 8, overflow: "hidden" }}>
            <img
              src={imgSrc}
              alt={p.name}
              style={{
                width: "100%",
                height: 420,
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                console.warn(
                  "[ProductDetail] image failed to load, falling back to placeholder:",
                  imgSrc
                );
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER_SVG;
              }}
            />
          </div>

          {images.length > 1 && (
            <div className="d-flex gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  className={`p-0 border ${
                    selectedIndex === i ? "border-primary" : "border-light"
                  }`}
                  style={{
                    width: 80,
                    height: 60,
                    overflow: "hidden",
                    borderRadius: 6,
                  }}
                  aria-label={`Select image ${i + 1}`}
                >
                  <img
                    src={imgSrc}
                    alt={p.name}
                    className="img-fluid rounded"
                    style={{
                      width: "100%",
                      maxHeight: 520,
                      objectFit: "cover",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER_SVG;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h3>{p.name}</h3>
          <div className="small-muted mb-2">{p.category}</div>
          <h4 className="text-warning">₹{p.price}</h4>
          <p>{p.desc}</p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-warning"
              onClick={() => {
                addToCart(p, 1);
                showToast(`Added "${p.name}" to cart`, "success");
              }}
            >
              Add to Cart
            </button>

            <button
              className={`btn ${
                isWishlisted ? "btn-danger" : "btn-outline-secondary"
              }`}
              onClick={() => {
                toggleWishlist(p);
                if (isWishlisted)
                  showToast(`Removed "${p.name}" from wishlist`, "warning");
                else showToast(`Saved "${p.name}" to wishlist`, "success");
              }}
            >
              {isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
