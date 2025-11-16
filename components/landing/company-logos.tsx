"use client";

import { motion } from "framer-motion";

const companies = [
  { name: "Türk Telekom", width: "w-36" },
  { name: "Sabancı Holding", width: "w-40" },
  { name: "Koç Holding", width: "w-32" },
  { name: "Akbank", width: "w-28" },
  { name: "Garanti BBVA", width: "w-36" },
  { name: "Arçelik", width: "w-28" },
  { name: "Anadolu Grubu", width: "w-36" },
  { name: "Eczacıbaşı", width: "w-32" },
];

export function CompanyLogos() {
  return (
    <div className="w-full py-16 bg-slate-50">
      <div className="container mx-auto">
        <p className="text-center text-base font-bold text-black mb-8">
          Dünya çapında önde gelen kuruluşların güvendiği platform
        </p>
        <div className="relative overflow-hidden">
          <motion.div
            className="flex gap-16 items-center"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {[...companies, ...companies, ...companies].map((company, idx) => (
              <div
                key={idx}
                className={`${company.width} flex-shrink-0 flex items-center justify-center`}
              >
                <div className="text-xl font-semibold text-slate-400">
                  {company.name}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
