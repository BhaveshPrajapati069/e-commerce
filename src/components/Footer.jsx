// src/components/Footer.jsx
import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-dark text-light py-4 mt-4">
      <div className="container d-flex justify-content-between small">
        <div>© {new Date().getFullYear()} CraftVista</div>
        <div>Privacy • Terms</div>
      </div>
    </footer>
  )
}
