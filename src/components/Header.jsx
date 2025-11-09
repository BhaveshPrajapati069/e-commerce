

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
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);

  const mobileSearchRef = useRef(null);
  const skipInitialNavigate = useRef(true); // prevents initial redirect

  // Debounce user typing
  useEffect(() => {
    if (String(q || "").trim() !== String(debouncedQ || "").trim()) {
      setSearching(true);
    }
    const handler = setTimeout(() => setDebouncedQ(q.trim()), 300);
    return () => clearTimeout(handler);
  }, [q, debouncedQ]);

  // Handle navigation when search query changes
  useEffect(() => {
    if (skipInitialNavigate.current) {
      skipInitialNavigate.current = false;
      const t = setTimeout(() => setSearching(false), 120);
      return () => clearTimeout(t);
    }

    const trimmed = (debouncedQ || "").trim();
    if (trimmed) {
      navigate(`/collections?q=${encodeURIComponent(trimmed)}`, {
        replace: false,
      });
    } else {
      // only navigate to collections if already on collections
      if (location.pathname.startsWith("/collections")) {
        navigate("/collections", { replace: false });
      }
    }

    const t = setTimeout(() => setSearching(false), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlQ = params.get("q") || "";
    if (urlQ !== q) setQ(urlQ);
    setOpen(false);
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
      {/* Header Row */}
      <div className="container py-2 d-flex align-items-center justify-content-between flex-wrap header-inner">
        {/* Left: Brand + Hamburger */}
        <div
          className="d-flex align-items-center gap-2 left-block"
          style={{ minWidth: 0 }}
        >
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
            <svg
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="20" height="2" rx="1" fill="#333" />
              <rect y="6" width="20" height="2" rx="1" fill="#333" />
              <rect y="12" width="20" height="2" rx="1" fill="#333" />
            </svg>
          </button>

          <Link
            to="/"
            className="text-decoration-none text-dark brand flex-shrink-1 text-truncate"
            style={{ maxWidth: "60vw" }}
          >
            Craft<span className="text-warning">Vista</span>
          </Link>
        </div>

        {/* Desktop nav (visible on md+) */}
        <nav className="d-none d-md-flex align-items-center gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-decoration-none fw-bold"
                : "text-decoration-none text-dark"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/collections"
            className={({ isActive }) =>
              isActive
                ? "text-decoration-none fw-bold"
                : "text-decoration-none text-dark"
            }
          >
            Collections
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-decoration-none fw-bold"
                : "text-decoration-none text-dark"
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive
                ? "text-decoration-none fw-bold"
                : "text-decoration-none text-dark"
            }
          >
            Contact Us
          </NavLink>
        </nav>

        {/* Right: Controls */}
        <div
          className="d-flex align-items-center gap-2 right-block"
          style={{ minWidth: 0 }}
        >
          {/* Desktop Search */}
          <div
            className="d-none d-md-flex align-items-center"
            style={{ position: "relative" }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="form-control form-control-sm"
              style={{ width: 220 }}
              placeholder="Search products"
              aria-label="Search products"
            />
            {searching && (
              <span
                className="spinner-border spinner-border-sm ms-2"
                role="status"
                aria-hidden="true"
              />
            )}

            {q && (
              <button
                type="button"
                onClick={handleClear}
                className="btn btn-sm btn-outline-secondary ms-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="d-flex d-md-none align-items-center gap-2 mobile-icons">
            {!searchOpen && (
              <button
                className="btn btn-light p-0 icon-btn"
                onClick={openMobileSearch}
                aria-label="Open search"
                title="Search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="#333"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            <Link
              to="/wishlist"
              onClick={() => {
                setOpen(false);
                setSearchOpen(false);
              }}
              aria-label={`Wishlist (${wishlistCount})`}
              className="btn btn-light p-0 icon-btn position-relative"
              title="Wishlist"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.8 6.6a4.6 4.6 0 0 0-6.5 0L12 8.9l-2.3-2.3a4.6 4.6 0 0 0-6.5 6.5L12 21.1l8.8-8.8a4.6 4.6 0 0 0 0-6.5z"
                  stroke="#d6333e"
                  strokeWidth="0"
                  fill="#fff"
                />
                <path
                  d="M12 21.1L3.2 12.3a4.6 4.6 0 0 1 6.5-6.5L12 6.9l2.3-0.98a4.6 4.6 0 0 1 6.5 6.5L12 21.1z"
                  fill="#d6333e"
                />
              </svg>
              {wishlistCount > 0 && (
                <span className="icon-badge">{wishlistCount}</span>
              )}
            </Link>

            <Link
              to="/cart"
              onClick={() => {
                setOpen(false);
                setSearchOpen(false);
              }}
              aria-label={`Cart (${totalCount})`}
              className="btn btn-warning p-0 icon-btn position-relative"
              title="Cart"
            >
              <span aria-hidden="true" style={{ fontSize: 16 }}>
                🛒
              </span>
              {totalCount > 0 && (
                <span className="icon-badge inverse">{totalCount}</span>
              )}
            </Link>
          </div>

          {/* Desktop wishlist/auth/cart */}
          <Link
            to="/wishlist"
            className="btn btn-outline-danger btn-sm me-1 d-none d-md-inline"
          >
            ♥ {wishlistCount}
          </Link>

          {user ? (
            <>
              <div className="small text-muted d-none d-md-block">
                Hi, <strong>{user.name}</strong>
              </div>
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
            <Link
              to="/login"
              className="btn btn-outline-secondary btn-sm d-none d-md-inline"
            >
              Login
            </Link>
          )}

          <Link
            to="/cart"
            className="btn btn-warning btn-sm d-none d-md-inline-flex align-items-center justify-content-center"
            style={{
              whiteSpace: "nowrap",
              minWidth: 36,
              padding: "0.35rem 0.55rem",
              gap: 6,
            }}
            aria-label="Cart"
          >
            <span className="d-none d-md-inline">Cart ({totalCount})</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {searchOpen && (
        <div
          className="mobile-search-drawer"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="mobile-search-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="input-with-close">
              <input
                ref={mobileSearchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleMobileSearchKeyDown}
                className="form-control form-control-lg"
                placeholder="Search products"
                aria-label="Search products"
              />
              <button
                className="btn-close-input"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-2 small text-muted d-flex align-items-center justify-content-between">
              <div>Try: terracotta, vase, brass</div>
              {searching && (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="mobile-search-actions mt-3">
              <button
                className="btn btn-outline-secondary w-100 mb-2"
                onClick={() => {
                  setQ("");
                  setDebouncedQ("");
                  navigate("/collections");
                  setSearchOpen(false);
                }}
              >
                Clear
              </button>
              <button
                className="btn btn-warning w-100"
                onClick={() => doImmediateSearch(q)}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile collapsible menu */}
      {open && (
        <div className="d-md-none border-top bg-white">
          <div className="container py-3">
            <nav className="d-flex flex-column mb-2">
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="py-2 text-dark text-decoration-none"
              >
                Home
              </Link>
              <Link
                to="/collections"
                onClick={() => setOpen(false)}
                className="py-2 text-dark text-decoration-none"
              >
                Collections
              </Link>
              <Link
                to="/about"
                onClick={() => setOpen(false)}
                className="py-2 text-dark text-decoration-none"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="py-2 text-dark text-decoration-none"
              >
                Contact Us
              </Link>
            </nav>
            <div className="mt-3">
              {user ? (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    logout();
                    showToast("Logged out", "success");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
