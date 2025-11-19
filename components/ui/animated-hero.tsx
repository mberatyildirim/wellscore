"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PhoneCall } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["sağlıklı", "mutlu", "güçlü", "dengeli", "verimli"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full bg-gradient-to-b from-orange-50/50 to-background">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-orange-600 font-bold">WellScore</span>
              <span className="text-gray-900 dark:text-gray-100"> ile daha</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold text-orange-600"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
              <span className="text-gray-900 dark:text-gray-100">bir işgücü yaratın</span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center text-balance">
              Çalışan iyi oluşunu 8 boyutta ölçün. Verileri AI destekli önerilerle aksiyona dönüştürün 
              ve organizasyonel mükemmelliği yakalayın.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4 bg-orange-600 hover:bg-orange-700 text-white" asChild>
              <a href="mailto:info@wellscore.co?subject=Demo Talep Ediyorum&body=Merhaba,%0D%0A%0D%0AWellScore platformu hakkında demo talep etmek istiyorum.%0D%0A%0D%0AŞirket Adı:%0D%0AYetkili Kişi:%0D%0ATelefon:%0D%0A%0D%0ATeşekkürler.">
                Demo talep edin <PhoneCall className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
