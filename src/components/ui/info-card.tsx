// src/components/ui/info-card.tsx
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  text: string;
  variant?: "blue" | "green" | "red" | "yellow";
}

export function InfoCard({ icon: Icon, title, text, variant = "blue" }: InfoCardProps) {
  
  const variants = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    red: "bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white",
    yellow: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white",
  };

  return (
    <div className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${variants[variant]}`}>
        <Icon size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-3 uppercase tracking-tight group-hover:text-blue-900 transition-colors">
        {title}
      </h3>
      
      <p className="text-slate-600 leading-relaxed text-sm flex-grow group-hover:text-slate-700">
        {text}
      </p>
    </div>
  );
}