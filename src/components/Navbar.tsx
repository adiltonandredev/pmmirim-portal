"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar({ settings }: { settings?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Instituição", href: "/sobre" },
    { label: "Notícias", href: "/noticias" },
    { label: "Projetos", href: "/projetos" },
    { label: "Fale Conosco", href: "/contato" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            {settings?.logoUrl ? (
              <div className="relative w-32 h-10">
                <Image
                  src={settings.logoUrl}
                  alt={settings.siteName || "PMMIRIM"}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="text-xl font-bold uppercase tracking-wider text-slate-900">
                {settings?.siteName || "PMMIRIM"}
              </span>
            )}
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-blue-600 text-slate-600"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <UserCircle className="h-4 w-4" />
              Área Restrita
            </Button>
          </Link>
        </nav>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4">Área Restrita</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}