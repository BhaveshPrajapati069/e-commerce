// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const featured = products.slice(0, 8);
  return (
    <div>
      <section className="hero-image py-5">
        <div className="container d-flex flex-column flex-md-row gap-4 align-items-center">
          <div className="flex-fill">
            <h1 className="display-6 fw-bold">Handmade Indian Handicrafts</h1>
            <p className="lead">Curated pieces for home, puja, and gifting.</p>
            <div className="mt-3">
              <Link to="/collections" className="btn btn-warning me-2">
                Shop Collections
              </Link>
              <Link to="/about" className="btn btn-outline-secondary">
                About Us
              </Link>
            </div>
          </div>
          <div
            style={{ width: 420, height: 300, overflow: "hidden" }}
            className="rounded shadow-sm"
          >
            <img
              src="/assets/images/hero.png"
              alt="CraftVista Hero"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4">Featured Products</h2>
          <Link to="/collections" className="small">
            View all
          </Link>
        </div>
        <div className="row g-3">
          {featured.map((p) => (
            <div className="col-6 col-md-3" key={p.id}>
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
