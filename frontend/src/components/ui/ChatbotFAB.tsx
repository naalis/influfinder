"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

interface ChatbotFABProps {
  /** Position from bottom in pixels */
  bottomOffset?: number;
  /** Show notification dot */
  showNotification?: boolean;
}

export default function ChatbotFAB({
  bottomOffset = 96,
  showNotification = true,
}: ChatbotFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const quickReplies = [
    "¿Cómo funciona Influfinder?",
    "¿Cómo conecto mis redes?",
    "¿Cómo recibo pagos?",
  ];

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-gray-950 border border-gray-800 shadow-2xl shadow-black/50 overflow-hidden"
          style={{ bottom: bottomOffset + 72 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-purple to-brand-magenta p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Asistente InfluFinder</h3>
                  <p className="text-xs text-white/70">Powered by AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {/* Welcome message */}
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-purple/20">
                <Sparkles className="h-4 w-4 text-brand-purple" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-gray-900 p-3 max-w-[80%]">
                <p className="text-sm text-gray-300">
                  ¡Hola! Soy el asistente de InfluFinder. ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 ml-11">Preguntas frecuentes:</p>
              <div className="flex flex-wrap gap-2 ml-11">
                {quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMessage(reply)}
                    className="rounded-full bg-gray-800 px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 rounded-full bg-gray-900 border border-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-brand-purple focus:outline-none"
              />
              <button
                disabled={!message.trim()}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  message.trim()
                    ? "bg-brand-purple text-white hover:bg-brand-purple/80"
                    : "bg-gray-800 text-gray-600"
                }`}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-gray-800 rotate-0"
            : "bg-gray-900/90 backdrop-blur-sm border border-gray-800 hover:scale-110 hover:bg-gray-800"
        } active:scale-95`}
        style={{ bottom: bottomOffset }}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat de ayuda"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6 text-white" />
            {/* Notification dot */}
            {showNotification && (
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-brand-magenta border-2 border-gray-900 animate-pulse" />
            )}
          </>
        )}
      </button>
    </>
  );
}
