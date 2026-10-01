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
  Ban,
  ImageOff,
  CheckCheck,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import {
  MOCK_VERIFICATIONS,
  MOCK_AUDIT_LOGS,
  MOCK_JOBBERS,
  VerificationRequest,
  ModerationAuditLog,
} from "@/lib/mock-data";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

export default function AdminPage() {
  const { currentRole, setRole, isAdmin } = useRole();

  const [verifications, setVerifications] = useState<VerificationRequest[]>(MOCK_VERIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<ModerationAuditLog[]>(MOCK_AUDIT_LOGS);

  // Gestion des statuts de profil pour la modération (ACC-10)
  const [suspendedJobberIds, setSuspendedJobberIds] = useState<string[]>([]);
  const [maskedPortfolioIds, setMaskedPortfolioIds] = useState<string[]>([]);

  // Signalements actifs (ACC-10)
  const [reports, setReports] = useState([
    {
      id: "lit_101",
      jobberName: "Sébastien Dossou",
      trade: "Plomberie sanitaire",
      reporterName: "Client anonyme (Haie Vive)",
      reason: "Tentative de partage de coordonnées directes hors plateforme",
      status: "OPEN" as "OPEN" | "RESOLVED",
      date: "01/10/2026",
    },
    {
      id: "lit_102",
      jobberName: "Yannick Zinsou",
      trade: "Climatisation & Froid",
      reporterName: "Mme Agbodo",
      reason: "Photo portfolio suspectée non représentative du chantier",
      status: "OPEN" as "OPEN" | "RESOLVED",
      date: "30/09/2026",
    },
  ]);

  // Si l'utilisateur n'est pas Admin, affichage strict ACC-12 (HTTP 403 Forbidden)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-red-200 bg-white p-6 sm:p-8 shadow-soft-lg text-center animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 shadow-soft">
            <Lock className="h-8 w-8" />
          </div>

          <span className="rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold px-3 py-1 uppercase tracking-wider">
            HTTP 403 Forbidden • ACC-12
          </span>

          <h2 className="text-xl font-extrabold text-slate-900 mt-3">
            Accès Réservé à l'Administration
          </h2>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Votre session active est actuellement connectée avec le rôle{" "}
            <strong className="text-slate-900 uppercase">« {currentRole} »</strong>. Conformément aux critères de sécurité RBAC des TDR, la console de modération requiert les privilèges Administrateur / Modérateur.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setRole("admin")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-client px-4 py-2.5 text-xs font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>[Simuler l'authentification Admin / Modérateur]</span>
            </button>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-input px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retourner à l'accueil public</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  const handleToggleSuspendJobber = (jobberId: string, name: string) => {
    const isSuspended = suspendedJobberIds.includes(jobberId);
    if (isSuspended) {
      setSuspendedJobberIds(suspendedJobberIds.filter((id) => id !== jobberId));
    } else {
      setSuspendedJobberIds([...suspendedJobberIds, jobberId]);
    }

    const actionText = isSuspended ? "REACTIVATE_PROFILE" : "SUSPEND_PROFILE";
    const motifText = isSuspended
      ? "Réactivation du profil après vérification de conformité"
      : "Suspension préventive suite à un manquement aux règles de la communauté";

    const newLog: ModerationAuditLog = {
      id: `log_${Date.now()}`,
      adminName: "Super Admin ProxiJob",
      action: actionText,
      targetType: "JOBBER_PROFILE",
      targetName: name,
      motif: motifText,
      date: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    };

    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleToggleMaskPortfolio = (portfolioId: string, title: string) => {
    const isMasked = maskedPortfolioIds.includes(portfolioId);
    if (isMasked) {
      setMaskedPortfolioIds(maskedPortfolioIds.filter((id) => id !== portfolioId));
    } else {
      setMaskedPortfolioIds([...maskedPortfolioIds, portfolioId]);
    }

    const actionText = isMasked ? "UNMASK_PORTFOLIO" : "MASK_PORTFOLIO";
    const motifText = isMasked
      ? "Réintégration de la réalisation après contrôle qualité"
      : "Masquage d'une réalisation non conforme (ACC-10)";

    const newLog: ModerationAuditLog = {
      id: `log_${Date.now()}`,
      adminName: "Super Admin ProxiJob",
      action: actionText,
      targetType: "PORTFOLIO_ITEM",
      targetName: title,
      motif: motifText,
      date: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    };

    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleResolveReport = (reportId: string, jobberName: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: "RESOLVED" } : r))
    );

    const newLog: ModerationAuditLog = {
      id: `log_${Date.now()}`,
      adminName: "Super Admin ProxiJob",
      action: "ARBITRATE_DISPUTE",
      targetType: "REPORT",
      targetName: `Signalement #${reportId} (${jobberName})`,
      motif: "Arbitrage clôturé après échange contradictoire avec les parties.",
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
              <span>Console de Surveillance & Modération ProxiJob (RBAC Actif)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Administration & Conformité Étatique
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Audit des pièces ANIP/CIP, modération des signalements et traçabilité des opérations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRole("client")}
              className="text-xs font-semibold text-slate-600 hover:text-client underline"
            >
              [Quitter mode Admin]
            </button>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 px-3.5 py-2 text-xs font-bold shadow-soft">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Opérationnel 99.9%</span>
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
            <span className="text-xs text-slate-500 font-semibold block">Signalements Actifs</span>
            <span className="text-3xl font-extrabold text-red-600 mt-1 block">
              {reports.filter((r) => r.status === "OPEN").length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Sous arbitrage modérateur</span>
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

        {/* 2. MODÉRATION DES PROFILS & LITIGES (ACC-10) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Signalements & Arbitrage des Litiges (ACC-10)</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-soft space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block uppercase">
                      #{report.id} • {report.date}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                      {report.jobberName}{" "}
                      <span className="text-xs font-normal text-slate-500">({report.trade})</span>
                    </h4>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold border",
                      report.status === "OPEN"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    )}
                  >
                    {report.status === "OPEN" ? "À traiter" : "Résolu"}
                  </span>
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-200/80 space-y-1">
                  <span className="text-slate-500 block">
                    Signalé par : <strong>{report.reporterName}</strong>
                  </span>
                  <p className="text-slate-800 font-medium">« {report.reason} »</p>
                </div>

                {report.status === "OPEN" && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => handleToggleSuspendJobber(report.jobberName, report.jobberName)}
                      className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      <span>Suspendre Artisan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolveReport(report.id, report.jobberName)}
                      className="inline-flex items-center gap-1 rounded-xl bg-client px-3 py-1.5 text-xs font-bold text-white shadow-soft hover:bg-client-hover transition-colors"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Clôturer Arbitrage</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. CONTRÔLE DES PROFILS ET PORTFOLIOS (ACC-10) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-client" />
            <span>Gestion des Profils & Portfolios Jobeurs (ACC-10)</span>
          </h2>

          <div className="rounded-2xl border border-border bg-white shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-border">
                  <tr>
                    <th className="p-4">Artisan</th>
                    <th className="p-4">Métier & Zone</th>
                    <th className="p-4">Statut Profil</th>
                    <th className="p-4">Portfolio Avant/Après</th>
                    <th className="p-4 text-right">Actions Modération</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_JOBBERS.slice(0, 4).map((j) => {
                    const isSuspended = suspendedJobberIds.includes(j.id);
                    const portfolioItem = j.portfolio[0];
                    const isPortfolioMasked = portfolioItem && maskedPortfolioIds.includes(portfolioItem.id);

                    return (
                      <tr key={j.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-4 flex items-center gap-2.5">
                          <img
                            src={j.avatar}
                            alt={j.name}
                            className="h-8 w-8 rounded-full object-cover border"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{j.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">#{j.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-slate-800 block">{j.trade}</span>
                          <span className="text-slate-500 text-[11px]">{j.quarter}, {j.city}</span>
                        </td>
                        <td className="p-4">
                          {isSuspended ? (
                            <span className="rounded-full bg-red-100 text-red-800 px-2.5 py-0.5 text-[10px] font-extrabold uppercase">
                              Suspendu
                            </span>
                          ) : (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase">
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          {portfolioItem ? (
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-700 truncate max-w-[140px]">
                                {portfolioItem.title}
                              </span>
                              {isPortfolioMasked && (
                                <span className="rounded bg-amber-100 text-amber-900 text-[9px] font-bold px-1.5 py-0.5">
                                  Masqué
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Aucune</span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {portfolioItem && (
                            <button
                              type="button"
                              onClick={() => handleToggleMaskPortfolio(portfolioItem.id, portfolioItem.title)}
                              className="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors hover:bg-slate-100"
                            >
                              {isPortfolioMasked ? "Démasquer image" : "Masquer image"}
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleSuspendJobber(j.id, j.name)}
                            className={cn(
                              "rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all shadow-soft active:scale-95",
                              isSuspended
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                            )}
                          >
                            {isSuspended ? "Réactiver" : "Suspendre"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. JOURNAL D'AUDIT DE MODÉRATION (MODULE 09 - TDR) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-700" />
            <span>Journal d'Audit & Traçabilité des Décisions (Modération)</span>
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
