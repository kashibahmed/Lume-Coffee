"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Our Story", href: "#story" },
  { name: "Menu", href: "#menu" },
  { name: "Our Coffee", href: "#philosophy" },
  { name: "Visit Us", href: "#visit" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openCart, totalCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isScrolled
            ? "py-3 bg-brand-blush/95 backdrop-blur-md shadow-md border-b border-brand-peach/80"
            : "py-4 bg-brand-blush/90 backdrop-blur-md shadow-sm border-b border-brand-peach/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link
            href="#home"
            className="group flex items-center transition-transform duration-300 hover:scale-105"
          >
            <Logo
              className="h-9 sm:h-10 w-auto"
              priority
            />
          </Link>

          {/* Center: Desktop Navigation Links (Official Brand Olive Gold) */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative text-sm font-bold tracking-wide text-brand-olive-dark hover:text-brand-espresso transition-colors py-1 group"
              >
                {link.name}
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-olive-dark rounded-full transition-all duration-300 ease-out group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right: Actions (Order Online CTA & Shopping Bag) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full border border-brand-peach/80 hover:border-brand-olive-dark bg-white hover:bg-brand-cream text-brand-espresso transition-all duration-300 group shadow-sm"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110 text-brand-olive-dark" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-olive-dark text-brand-cream text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={openCart}
              className="hidden sm:inline-flex items-center gap-1.5 py-2.5 px-5 rounded-full bg-brand-olive-dark text-brand-cream text-xs font-bold tracking-wider uppercase hover:bg-brand-espresso transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <span>Order Online</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full border border-brand-peach text-brand-espresso bg-white shadow-sm"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-between bg-brand-blush/98 backdrop-blur-xl pt-28 pb-10 px-8 animate-in fade-in duration-300 border-b border-brand-peach">
          <nav className="flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="font-headline text-3xl tracking-wide text-brand-olive-dark hover:text-brand-espresso flex items-center justify-between border-b border-brand-peach/60 pb-3"
              >
                <span>{link.name}</span>
                <ArrowUpRight className="w-5 h-5 opacity-40 text-brand-olive-dark" />
              </a>
            ))}
          </nav>

          <div className="space-y-4 pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openCart();
              }}
              className="w-full py-4 rounded-full bg-brand-olive-dark text-brand-cream font-bold text-sm flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
            >
              <span>Order Online for Pickup</span>
              <ShoppingBag className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-brand-espresso/60 tracking-wider">
              GOOD COFFEE · BRIGHTER DAYS
            </p>
          </div>
        </div>
      )}
    </>
  );
}
