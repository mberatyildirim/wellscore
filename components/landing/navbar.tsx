"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Building2, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className={`text-lg sm:text-xl font-bold ${scrolled ? 'text-white' : 'text-gray-900'}`}>
            WellScore
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-3">
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

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              className={`${scrolled ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link 
                href="/hr/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Building2 className="w-5 h-5 text-orange-600" />
                <span className="text-base font-medium text-gray-900">İK Paneli</span>
              </Link>
              <Link 
                href="/employee/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg bg-orange-600 hover:bg-orange-700 transition-colors"
              >
                <User className="w-5 h-5 text-white" />
                <span className="text-base font-medium text-white">Çalışan Girişi</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
