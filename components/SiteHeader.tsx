"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  ["How it works", "/#how-it-works"],
  ["Support", "/#services"],
  ["Examples", "/samples"],
  ["Articles", "/blog"],
  ["Guide", "/#pricing"],
  ["FAQ", "/#faq"],
  ["Pricing", "/pricing"],
  ["Report", "/report"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <div className="topline">
        <div className="container topline__inner">
          <span>Academic support, centered on your learning</span>
          <a href="/#quote-form">Start a conversation <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link className="brand" href="/" aria-label="Northstar Academic home" onClick={() => setMenuOpen(false)}>
            <span className="brand__mark" aria-hidden="true">N</span>
            <span className="brand__name">
              <strong>Northstar</strong>
              <span>Academic</span>
            </span>
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            className={`primary-navigation${menuOpen ? " primary-navigation--open" : ""}`}
            id="primary-navigation"
            aria-label="Main navigation"
          >
            {navigation.map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            <a className="button button--primary nav-cta" href="/#quote-form" onClick={() => setMenuOpen(false)}>
              Request a quote <span aria-hidden="true">↗</span>
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
