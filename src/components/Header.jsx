

// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalCount } = useCart();
  const { totalCount: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const urlParams = new URLSearchParams(location.search);
  const initialQ = urlParams.get("q") || "";

  const [q, setQ] = useState(initialQ);
  const [debouncedQ, setDebouncedQ] = useState(initialQ);
  const [open, setOpen] = useState(false); // mobile menu open
  const [searchOpen, setSearchOpen] = useState(false); // mobile overlay
  const [searching, setSearching] = useState(false);

  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (String(q || "").trim() !== String(debouncedQ || "").trim()) {
      setSearching(true);
    }
    const handler = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(handler);
  }, [q, debouncedQ]);

  useEffect(() => {
    const trimmed = (debouncedQ || "").trim();
    if (trimmed)
      navigate(`/collections?q=${encodeURIComponent(trimmed)}`, {
        replace: false,
      });
    else navigate("/collections", { replace: false });
    const t = setTimeout(() => setSearching(false), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQ = params.get("q") || "";
    if (urlQ !== q) setQ(urlQ);
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => mobileSearchRef.current?.focus?.(), 60);
    }
  }, [searchOpen]);

  function doImmediateSearch(rawQ) {
    const trimmed = String(rawQ || "").trim();
    setSearching(true);
    if (trimmed)
      navigate(`/collections?q=${encodeURIComponent(trimmed)}`, {
        replace: false,
      });
    else navigate("/collections", { replace: false });
    setOpen(false);
    setSearchOpen(false);
    setQ(trimmed);
    setDebouncedQ(trimmed);
    setTimeout(() => setSearching(false), 150);
  }

  function handleMobileSearchKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      doImmediateSearch(q);
    }
  }

  function handleClear() {
    setQ("");
    setDebouncedQ("");
    navigate("/collections");
  }

  function openMobileSearch() {
    setSearchOpen(true);
    setOpen(false);
  }

  return (
    <header className="border-bottom">
      {/* primary header row */}
      <div className="container py-2 d-flex align-items-center justify-content-between flex-wrap header-inner">
        {/* LEFT: hamburger + brand */}
        <div className="d-flex align-items-center gap-2 left-block" style={{ minWidth: 0 }}>
          <button
            className="btn btn-light d-md-none p-0"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              borderRadius: 8,
              width: 36,
              height: 36,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="20" height="2" rx="1" fill="#333" />
              <rect y="6" width="20" height="2" rx="1" fill="#333" />
              <rect y="12" width="20" height="2" rx="1" fill="#333" />
            </svg>
          </button>

          <Link to="/" className="text-decoration-none text-dark brand flex-shrink-1 text-truncate" style={{ maxWidth: "60vw" }}>
            Craft<span className="text-warning">Vista</span>
          </Link>
        </div>

        {/* RIGHT: controls (search, wishlist, auth, cart) */}
        <div className="d-flex align-items-center gap-2 right-block" style={{ minWidth: 0 }}>
          {/* Desktop search only (md+) */}
          <div className="d-none d-md-flex align-items-center" style={{ position: "relative" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: 220 }}
              placeholder="Search products"
              aria-label="Search products"
            />
            {searching && (
              <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />
            )}
            {q ? (
              <button type="button" onClick={handleClear} className="btn btn-sm btn-outline-secondary ms-2">
                Clear
              </button>
            ) : (
              <button type="button" onClick={() => navigate("/collections")} className="btn btn-sm btn-outline-secondary ms-2">
                Collections
              </button>
            )}
          </div>

          {/* mobile: magnifier icon (opens overlay) */}
          {!searchOpen && (
            <button
              className="btn btn-light d-md-none p-0"
              onClick={openMobileSearch}
              aria-label="Open search"
              title="Search"
              style={{
                width: 36,
                height: 36,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-4.35-4.35" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* desktop wishlist */}
          <Link to="/wishlist" className="btn btn-outline-danger btn-sm me-1 d-none d-md-inline">
            ♥ {wishlistCount}
          </Link>

          {/* desktop auth */}
          {user ? (
            <>
              <div className="small text-muted d-none d-md-block">Hi, <strong>{user.name}</strong></div>
              <button
                className="btn btn-outline-secondary btn-sm d-none d-md-inline"
                onClick={() => {
                  logout();
                  showToast("Logged out", "success");
                  navigate("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-outline-secondary btn-sm d-none d-md-inline">
              Login
            </Link>
          )}

          {/* Cart: icon on mobile, text on md+ */}
          <Link
            to="/cart"
            className="btn btn-warning btn-sm d-flex align-items-center justify-content-center"
            style={{
              whiteSpace: "nowrap",
              minWidth: 36,
              padding: "0.35rem 0.55rem",
              gap: 6,
            }}
          >
            {/* mobile-only icon */}
            <span className="d-md-none" aria-hidden="true" style={{ fontSize: 16 }}>🛒</span>
            {/* md+ visible text */}
            <span className="d-none d-md-inline">Cart ({totalCount})</span>
          </Link>
        </div>
      </div>

      {/* Mobile collapsible area (no inline search here) */}
      {open && (
        <div className="d-md-none border-top bg-white">
          <div className="container py-3">
            <div className="d-flex flex-column">
              <nav className="d-flex flex-column mb-2">
                <Link to="/" onClick={() => setOpen(false)} className="py-2 text-dark text-decoration-none">Home</Link>
                <Link to="/collections" onClick={() => setOpen(false)} className="py-2 text-dark text-decoration-none">Collections</Link>
                <Link to="/about" onClick={() => setOpen(false)} className="py-2 text-dark text-decoration-none">About</Link>
              </nav>

              <div className="d-flex gap-2 mt-3">
                <Link to="/wishlist" onClick={() => setOpen(false)} className="btn btn-outline-danger btn-sm">♥ Wishlist ({wishlistCount})</Link>
                {user ? (
                  <button className="btn btn-outline-secondary btn-sm" onClick={() => { logout(); showToast("Logged out", "success"); navigate("/"); }}>
                    Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline-secondary btn-sm">Login</Link>
                )}
                <Link to="/cart" onClick={() => setOpen(false)} className="btn btn-warning btn-sm ms-auto">Cart ({totalCount})</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile full-screen search overlay */}
      {searchOpen && (
        <div
          className="mobile-search-overlay"
          data-overlay="true"
          onClick={(e) => { if (e.target.dataset.overlay === "true") setSearchOpen(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="mobile-search-panel">
            <div className="d-flex align-items-center gap-2 mb-3">
              <input
                ref={mobileSearchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleMobileSearchKeyDown}
                className="form-control form-control-lg"
                placeholder="Search products"
                aria-label="Search products"
              />
              <button className="btn btn-light" onClick={() => setSearchOpen(false)} aria-label="Close search">✕</button>
            </div>

            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="small text-muted">Try: terracotta, vase, brass</div>
              {searching && <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true" />}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary" onClick={() => { setQ(""); setDebouncedQ(""); setSearchOpen(false); navigate("/collections"); }}>Clear</button>
              <button className="btn btn-warning" onClick={() => doImmediateSearch(q)}>Search</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
