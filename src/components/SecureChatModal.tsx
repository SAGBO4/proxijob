"use client";

import React, { useState } from "react";
import { X, Send, Lock, Unlock, ShieldAlert, CheckCheck, User, Phone } from "lucide-react";
import type { Conversation, ChatMessage } from "@/lib/mock-data";
import { maskSensitiveContacts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface SecureChatModalProps {
  conversation: Conversation;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage?: (content: string) => void;
  onUnlockContacts?: () => void;
}

export function SecureChatModal({
  conversation,
  isOpen,
  onClose,
  onSendMessage,
  onUnlockContacts,
}: SecureChatModalProps) {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
  const [isContactUnlocked, setIsContactUnlocked] = useState(conversation.isContactUnlocked);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const { filteredText, isMasked } = maskSensitiveContacts(inputText, isContactUnlocked);

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: "current_user",
      senderRole: "client",
      contentOriginal: inputText,
      contentFiltered: filteredText,
      isMasked,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMsg]);
    onSendMessage?.(inputText);
    setInputText("");
  };

  const handleDemoUnlock = () => {
    setIsContactUnlocked(true);
    // Démasquer les anciens messages
    setMessages(
      messages.map((m) => ({
        ...m,
        contentFiltered: m.contentOriginal,
        isMasked: false,
      }))
    );
    onUnlockContacts?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-xl h-[620px] rounded-2xl bg-white shadow-soft-lg border border-border overflow-hidden">
        {/* En-tête du Chat */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={conversation.jobberAvatar}
                alt={conversation.jobberName}
                className="h-10 w-10 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{conversation.jobberName}</h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px]">
                {conversation.requestTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isContactUnlocked ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                <Unlock className="h-3 w-3" />
                <span>Contacts Débloqués</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900">
                <Lock className="h-3 w-3" />
                <span>Contacts Protégés</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bannière de réassurance contractuelle (ACC-06 & ACC-07) */}
        <div
          className={cn(
            "p-3 text-xs border-b flex items-start gap-2.5 transition-colors",
            isContactUnlocked
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-blue-50/90 text-blue-900 border-blue-200"
          )}
        >
          {isContactUnlocked ? (
            <>
              <Unlock className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Devis validé !</strong> Les numéros de téléphone et coordonnées sont désormais visibles en clair pour organiser le rendez-vous.
              </div>
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 text-client shrink-0 mt-0.5" />
              <div className="flex-1">
                <span>
                  <strong>🔒 Sécurité mutuelle :</strong> Tout numéro de téléphone, email ou lien WhatsApp est automatiquement masqué avant l'acceptation d'un devis.
                </span>
                <button
                  type="button"
                  onClick={handleDemoUnlock}
                  className="block mt-1 font-bold text-client underline hover:text-client-hover"
                >
                  [Simuler l'acceptation du devis pour débloquer les contacts]
                </button>
              </div>
            </>
          )}
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {messages.map((msg) => {
            const isMe = msg.senderRole === "client";
            return (
              <div
                key={msg.id}
                className={cn("flex flex-col max-w-[80%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2.5 text-xs sm:text-sm shadow-soft leading-relaxed",
                    isMe
                      ? "bg-client text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-border rounded-bl-none"
                  )}
                >
                  <p>{msg.contentFiltered}</p>

                  {msg.isMasked && !isContactUnlocked && (
                    <div className="mt-1.5 pt-1.5 border-t border-white/20 flex items-center gap-1 text-[10px] text-amber-200">
                      <ShieldAlert className="h-3 w-3" />
                      <span>Coordonnées masquées selon la règle ACC-06</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="h-3 w-3 text-client" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre de saisie */}
        <form onSubmit={handleSend} className="p-3 border-t border-border bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder={
              isContactUnlocked
                ? "Écrivez votre message..."
                : "Échangez ici (ex: précisions sur la panne, disponibilité...)"
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 rounded-xl border border-input px-3.5 py-2.5 text-sm outline-none focus:border-client"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-client text-white shadow-soft hover:bg-client-hover disabled:opacity-40 disabled:hover:bg-client transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
