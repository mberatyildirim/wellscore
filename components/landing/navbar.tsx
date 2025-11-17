"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Building2, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur ${
        scrolled 
          ? 'bg-slate-800/95 border-slate-700 shadow-lg' 
          : 'bg-background/95 border-border'
      }`}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="WellScore Logo" 
            width={40} 
            height={40}
            className="w-10 h-10"
          />
          <span className={`text-xl font-bold ${scrolled ? 'text-white' : 'text-gray-900'}`}>
            WellScore
          </span>
        </Link>

        <nav className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${scrolled ? 'text-white hover:text-white/80 hover:bg-white/10' : 'text-foreground hover:bg-accent'}`}
            asChild
          >
            <Link href="/hr/dashboard">
              <Building2 className="w-4 h-4 mr-2" />
              İK Paneli
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            asChild
          >
            <Link href="/employee/dashboard">
              <User className="w-4 h-4 mr-2" />
              Çalışan Girişi
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
