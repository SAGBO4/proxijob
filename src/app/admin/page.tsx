"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  FileText,
  Check,
  X,
  Eye,
  Clock,
  AlertTriangle,
  History,
  Lock,
} from "lucide-react";
import {
  MOCK_VERIFICATIONS,
  MOCK_AUDIT_LOGS,
  VerificationRequest,
  ModerationAuditLog,
} from "@/lib/mock-data";

export default function AdminPage() {
  const [verifications, setVerifications] = useState<VerificationRequest[]>(MOCK_VERIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<ModerationAuditLog[]>(MOCK_AUDIT_LOGS);

  const pendingVerifications = verifications.filter((v) => v.status === "PENDING");

  const handleApprove = (id: string) => {
    const item = verifications.find((v) => v.id === id);
    if (!item) return;

    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "VERIFIED" as const } : v))
    );

    const newLog: ModerationAuditLog = {
      id: `log_${Date.now()}`,
      adminName: "Super Admin ProxiJob",
      action: "APPROVE_VERIFICATION",
      targetType: item.type,
      targetName: `${item.jobberName} (${item.trade})`,
      motif: `Pièce officielle ${item.type} n° ${item.documentNumber} approuvée.`,
      date: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    };

    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleReject = (id: string) => {
    const item = verifications.find((v) => v.id === id);
    if (!item) return;

    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "REJECTED" as const } : v))
    );

    const newLog: ModerationAuditLog = {
      id: `log_${Date.now()}`,
      adminName: "Super Admin ProxiJob",
      action: "REJECT_VERIFICATION",
      targetType: item.type,
      targetName: `${item.jobberName} (${item.trade})`,
      motif: `Document non lisible ou non conforme aux critères d'authenticité.`,
      date: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    };

    setAuditLogs([newLog, ...auditLogs]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* En-tête de la Console Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-client uppercase tracking-wider mb-1">
              <Shield className="h-4 w-4" />
              <span>Console de Surveillance & Modération ProxiJob</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Administration & Conformité Étatique
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Audit des pièces ANIP/CIP, modération des signalements et traçabilité des opérations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 px-3.5 py-2 text-xs font-bold shadow-soft">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Système Opérationnel 99.9%</span>
            </span>
          </div>
        </div>

        {/* KPIs Plateforme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="text-xs text-slate-500 font-semibold block">Artisans Actifs</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">142</span>
            <span className="text-[11px] text-emerald-600 font-medium">94% avec vérification CIP</span>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="text-xs text-slate-500 font-semibold block">Demandes en Cours</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">38</span>
            <span className="text-[11px] text-client font-medium">Grand Cotonou & Calavi</span>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="text-xs text-slate-500 font-semibold block">Certifications en Attente</span>
            <span className="text-3xl font-extrabold text-amber-600 mt-1 block">
              {pendingVerifications.length}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">À traiter sous 24h</span>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="text-xs text-slate-500 font-semibold block">Taux d'Avis Positifs</span>
            <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">4.92 ★</span>
            <span className="text-[11px] text-slate-500 font-medium">Missions vérifiées post-accord</span>
          </div>
        </div>

        {/* 1. FILE DE VÉRIFICATION PROXYTRUST (V3) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Demandes de Certification ProxyTrust en Attente ({pendingVerifications.length})</span>
            </h2>
          </div>

          {pendingVerifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingVerifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={item.jobberAvatar}
                        alt={item.jobberName}
                        className="h-12 w-12 rounded-xl object-cover border"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.jobberName}</h4>
                        <p className="text-xs text-client font-semibold">{item.trade}</p>
                        <span className="inline-block mt-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-700">
                          {item.type}: {item.documentNumber}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                      En attente
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    « {item.comment} »
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <a
                      href={item.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-client font-semibold hover:underline flex items-center gap-1"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspecter le document</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleReject(item.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Rejeter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-emerald-700 transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Valider & Certifier</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
              Toutes les demandes de certification sont à jour.
            </div>
          )}
        </div>

        {/* 2. JOURNAL D'AUDIT DE MODÉRATION (MODULE 09 - TDR) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-700" />
            <span>Journal d'Audit & Traçabilité des Décisions</span>
          </h2>

          <div className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="p-4">Administrateur</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Cible</th>
                    <th className="p-4">Motif / Justification</th>
                    <th className="p-4">Horodatage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 font-bold text-slate-900">{log.adminName}</td>
                      <td className="p-4">
                        <span className="rounded bg-blue-50 text-client px-2 py-0.5 text-[10px] font-bold font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">{log.targetName}</td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">{log.motif}</td>
                      <td className="p-4 text-slate-400">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
