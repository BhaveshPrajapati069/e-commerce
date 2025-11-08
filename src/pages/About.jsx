// src/pages/About.jsx
import React from 'react'

export default function About() {
  return (
    <section className="container py-5">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-warning">About CraftVista</h2>
        <p className="text-muted mb-0">Where tradition meets modern craftsmanship</p>
      </div>

      <div className="mx-auto" style={{ maxWidth: '800px' }}>
        <p className="text-muted">
          <strong>CraftVista</strong> is a celebration of India’s rich heritage and timeless artistry.
          We bring together skilled artisans from across the country to create handcrafted home décor,
          traditional idols, eco-friendly gifts, and lifestyle pieces that blend culture with contemporary design.
        </p>

        <p className="text-muted">
          Each product at CraftVista is made with care — using sustainable materials, thoughtful craftsmanship,
          and a deep respect for the stories behind every creation. Our mission is to make authentic handmade treasures
          accessible to modern homes, while supporting the artisans who keep these beautiful traditions alive.
        </p>

        <p className="text-muted">
          At <strong>CraftVista</strong>, we believe your home deserves art that tells a story —
          a story of skill, culture, and heart.
        </p>
      </div>
    </section>
  )
}
