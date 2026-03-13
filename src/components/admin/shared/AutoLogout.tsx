"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

// CONFIGURAÇÃO DO TEMPO (em milissegundos)
// 15 minutos = 15 * 60 * 1000
const INACTIVITY_LIMIT = 15 * 60 * 1000; 

export function AutoLogout() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Função que desloga o usuário
    const doLogout = () => {
      // Redireciona para a home ou login após sair
      signOut({ callbackUrl: "/admin/login" }); 
    };

    // Função que reseta o cronômetro quando o usuário mexe
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(doLogout, INACTIVITY_LIMIT);
    };

    // Eventos que consideram o usuário "ativo"
    const events = [
      "mousedown", // Clicou
      "mousemove", // Mexeu o mouse
      "keydown",   // Digitou algo
      "scroll",    // Rolou a página
      "touchstart" // Tocou na tela (celular)
    ];

    // Inicia o timer pela primeira vez
    resetTimer();

    // Adiciona os ouvintes de evento
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Limpeza quando o componente desmontar
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);

  // Esse componente não mostra nada na tela, ele é invisível
  return null;
}