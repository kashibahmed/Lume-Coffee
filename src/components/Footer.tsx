import React from "react";
import Link from "next/link";
import { Instagram, MapPin, Mail, Phone, Clock, ArrowUpRight } from "lucide-react";
import Logo from "./Logo";
import DecorativeSun from "./DecorativeSun";

export default function Footer() {
  return (
    <footer className="bg-brand-olive-dark text-brand-cream relative overflow-hidden">
      {/* Decorative Sunburst in Corner */}
      <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 pointer-events-none opacity-20">
        <DecorativeSun size={360} color="#FFF9F2" variant="burst" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-12 relative z-10">
        {/* Top Grid: Brand & Information Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-brand-cream/20">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Logo
              className="h-12 w-auto"
              variant="light"
            />
            <p className="text-brand-cream/80 text-sm leading-relaxed max-w-sm">
              Lume Coffee Co. is an independent specialty coffee sanctuary dedicated to good beans, bright energy, and the quiet beauty of everyday rituals.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://www.instagram.com/lumecoffeeco?exln=MWd4cjNubWp3OW56dA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-brand-cream/10 hover:bg-brand-cream hover:text-brand-olive-dark transition-all duration-300 flex items-center justify-center border border-brand-cream/20"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/lumecoffeeco?exln=MWd4cjNubWp3OW56dA=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider text-brand-cream/70 hover:text-brand-cream uppercase transition-colors"
              >
                @lumecoffeeco
              </a>
            </div>
          </div>

          {/* Navigation Links (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-headline text-xl text-brand-cream uppercase tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream/80">
              <li>
                <a href="#home" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Home
                </a>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Signature Menu
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Our Coffee & Sourcing
                </a>
              </li>
              <li>
                <a href="#visit" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Visit Us
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Location (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-headline text-xl text-brand-cream uppercase tracking-wide">
              Lume Café
            </h4>
            <div className="space-y-3 text-sm text-brand-cream/80">
              <a
                href="https://www.google.com/maps/search/?api=1&query=2874+King+St+SE+Suite+D%2C+Smyrna%2C+GA+30080"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4 text-brand-peach flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="underline-offset-2 group-hover:underline">2874 King St. SE, Suite D, Smyrna, GA 30080</span>
              </a>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-peach flex-shrink-0 mt-0.5" />
                <div>
                  <p>Monday – Friday: 7:00 AM – 6:00 PM</p>
                  <p>Saturday – Sunday: 8:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter / Contact (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-headline text-xl text-brand-cream uppercase tracking-wide">
              Say Hello
            </h4>
            <div className="space-y-2.5 text-xs text-brand-cream/80">
              <a
                href="mailto:alex@lumecoffeeco.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-brand-peach" />
                <span>alex@lumecoffeeco.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-brand-peach" />
                <span>(555) 749-LUME</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Statement Banner */}
        <div className="py-12 text-center">
          <p className="font-headline text-5xl sm:text-7xl md:text-8xl tracking-tight text-brand-cream/90 select-none">
            GOOD COFFEE. BRIGHTER DAYS.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Credits */}
        <div className="pt-8 border-t border-brand-cream/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-cream/60">
          <p>© {new Date().getFullYear()} Lume Coffee Co. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-brand-cream transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-brand-cream transition-colors cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:text-brand-cream transition-colors cursor-pointer">
              Ethical Sourcing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

