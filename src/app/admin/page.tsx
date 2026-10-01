"use client";

import React, { useState, useEffect } from "react";
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
  RotateCcw,
  CheckCircle2,
  RefreshCw,
  Phone,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useRole } from "@/context/RoleContext";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  activeRole: string;
  city: string;
  quarter: string;
  isActive: boolean;
  createdAt: string;
  creditBalance: number;
}

interface AdminVerification {
  id: string;
  jobberId: string;
  jobberName: string;
  jobberPhone: string;
  jobberCity: string;
  type: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  documentUrl: string;
  documentNumber: string;
  comment: string | null;
  createdAt: string;
}

interface AdminRequest {
  id: string;
  title: string;
  clientName: string;
  clientPhone: string | null;
  city: string;
  quarter: string;
  category: string;
  status: string;
  estUrgent: boolean;
  budgetIndicatif: number | null;
  proposalsCount: number;
  createdAt: string;
}

interface AdminAuditLog {
  id: string;
  action: string;
  motif: string;
  targetId: string;
  targetType: string;
  adminName: string;
  targetUserName: string | null;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalJobbers: number;
  totalRequests: number;
  pendingVerifications: number;
  verifiedJobbers: number;
  suspendedUsers: number;
}

export default function AdminPage() {
  const { currentRole, isAdmin, user } = useRole();

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"verifications" | "users" | "requests" | "audit">("verifications");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Données 100% réelles chargées depuis Neon PostgreSQL
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalJobbers: 0,
    totalRequests: 0,
    pendingVerifications: 0,
    verifiedJobbers: 0,
    suspendedUsers: 0,
  });
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Chargement des données réelles
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin");
      if (!res.ok) {
        throw new Error("Erreur de récupération");
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setVerifications(data.verifications || []);
        setUsers(data.users || []);
        setRequests(data.requests || []);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error("Erreur de chargement admin:", err);
      setErrorMessage("Impossible de synchroniser avec la base de données Neon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Actions de modération réelles
  const handleExecuteAction = async (action: string, payload: Record<string, unknown>) => {
    try {
      setActionLoading(`${action}_${JSON.stringify(payload)}`);
      setSuccessMessage(null);
      setErrorMessage(null);

      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "L'action a échoué.");
        return;
      }

      setSuccessMessage(data.message || "Action exécutée avec succès.");
      // Rafraîchir les données réelles en base
      await fetchAdminData();
    } catch {
      setErrorMessage("Erreur de communication avec le serveur.");
    } finally {
      setActionLoading(null);
    }
  };

  // 1. Contrôle d'accès strict (RBAC) - Zéro bouton de simulation
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4">
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
            Cette console est strictement réservée aux administrateurs et modérateurs habilités. Votre compte actif{" "}
            {user?.email ? (
              <strong className="text-slate-900 font-semibold">({user.email})</strong>
            ) : null}{" "}
            ne dispose pas des privilèges nécessaires.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/connexion"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-client px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all"
            >
              <Lock className="h-4 w-4" />
              <span>Se connecter avec un compte Administrateur</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-input px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* En-tête Console */}
      <div className="border-b border-border bg-white sticky top-14 sm:top-16 z-30 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white shadow-soft">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Console d'Administration & Modération
                </h1>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200">
                  Neon DB En Direct
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Supervision régalienne, validation des pièces CIP/ANIP et contrôle de conformité.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchAdminData}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-soft active:scale-95 transition-all"
                title="Actualiser les données Neon"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {successMessage && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
              <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-600 hover:text-red-800">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Onglets navigation */}
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setActiveTab("verifications")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                activeTab === "verifications"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>Vérifications ProxyTrust</span>
              {stats.pendingVerifications > 0 && (
                <span className="rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-[10px] font-black">
                  {stats.pendingVerifications}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                activeTab === "users"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <Users className="h-4 w-4" />
              <span>Utilisateurs & Jobeurs ({stats.totalUsers})</span>
            </button>

            <button
              onClick={() => setActiveTab("requests")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                activeTab === "requests"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Demandes de Services ({stats.totalRequests})</span>
            </button>

            <button
              onClick={() => setActiveTab("audit")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-3 py-2 text-xs font-bold whitespace-nowrap transition-colors",
                activeTab === "audit"
                  ? "border-client text-client"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              )}
            >
              <History className="h-4 w-4" />
              <span>Journal d'Audit ({auditLogs.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Métriques Clés Réelles */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <span className="text-xs font-semibold text-slate-500">Total Utilisateurs</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{stats.totalUsers}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">En base</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <span className="text-xs font-semibold text-slate-500">Jobeurs Enregistrés</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{stats.totalJobbers}</span>
              <span className="text-[10px] text-client font-bold bg-blue-50 px-2 py-0.5 rounded">
                {stats.verifiedJobbers} certifiés
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <span className="text-xs font-semibold text-slate-500">Demandes de Prestation</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{stats.totalRequests}</span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">Bourse</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <span className="text-xs font-semibold text-slate-500">Vérifications en attente</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{stats.pendingVerifications}</span>
              <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">À auditer</span>
            </div>
          </div>
        </div>

        {/* 1. ONGLET : VÉRIFICATIONS PROXYTRUST (CIP/CNI/IFU) */}
        {activeTab === "verifications" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Dossiers de Vérification d'Identité</span>
                <span className="text-xs font-normal text-slate-500">({verifications.length} dossiers réels)</span>
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-border">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-client" />
                <p className="text-sm font-medium">Chargement des dossiers depuis Neon...</p>
              </div>
            ) : verifications.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-border text-slate-500 text-xs">
                Aucun dossier de vérification trouvé en base de données.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verifications.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase px-2 py-0.5 rounded border",
                              v.type === "CIP"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : v.type === "CNI"
                                ? "bg-purple-50 text-purple-800 border-purple-200"
                                : "bg-slate-100 text-slate-800 border-slate-200"
                            )}
                          >
                            Pièce : {v.type}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base mt-2">{v.jobberName}</h3>
                          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {v.jobberCity}
                            </span>
                            {v.jobberPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {v.jobberPhone}
                              </span>
                            )}
                          </div>
                        </div>

                        <span
                          className={cn(
                            "text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full",
                            v.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : v.status === "REJECTED"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800 animate-pulse"
                          )}
                        >
                          {v.status === "APPROVED" ? "Validé" : v.status === "REJECTED" ? "Rejeté" : "En attente"}
                        </span>
                      </div>

                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">N° d'identification :</span>
                          <span className="font-mono font-bold text-slate-800">{v.documentNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Date de soumission :</span>
                          <span className="text-slate-700">{v.createdAt}</span>
                        </div>
                        {v.comment && (
                          <div className="pt-1.5 border-t border-slate-200 text-slate-600 italic">
                            « {v.comment} »
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
                      <a
                        href={v.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-client hover:underline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Consulter le document</span>
                      </a>

                      <div className="flex items-center gap-2">
                        {v.status !== "APPROVED" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleExecuteAction("APPROVE_VERIFICATION", { verificationId: v.id })
                            }
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft transition-colors active:scale-95 disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Valider</span>
                          </button>
                        )}

                        {v.status !== "REJECTED" && (
                          <button
                            type="button"
                            onClick={() =>
                              handleExecuteAction("REJECT_VERIFICATION", {
                                verificationId: v.id,
                                motif: "Document non conforme ou illisible.",
                              })
                            }
                            disabled={actionLoading !== null}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors active:scale-95 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Rejeter</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. ONGLET : GESTION DES UTILISATEURS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Liste des Utilisateurs Enregistrés dans Neon
            </h2>

            <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-soft">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-border text-slate-600 uppercase font-bold">
                  <tr>
                    <th className="p-3">Utilisateur</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Rôle</th>
                    <th className="p-3">Localité</th>
                    <th className="p-3">Statut</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-[11px] text-slate-400">Inscrit le {u.createdAt}</div>
                      </td>
                      <td className="p-3 text-slate-600">
                        <div>{u.email || "Sans email"}</div>
                        <div className="font-mono text-[11px]">{u.phone || "Sans tél"}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            u.role === "ADMIN"
                              ? "bg-slate-900 text-white"
                              : u.role === "JOBBER"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-client"
                          )}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">
                        {u.city} ({u.quarter})
                      </td>
                      <td className="p-3">
                        {u.isActive ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Actif
                          </span>
                        ) : (
                          <span className="text-red-700 font-bold flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Suspendu
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleExecuteAction("TOGGLE_USER_ACTIVE", {
                              userId: u.id,
                              isActive: !u.isActive,
                            })
                          }
                          disabled={actionLoading !== null || u.role === "ADMIN"}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all disabled:opacity-40",
                            u.isActive
                              ? "border border-red-200 text-red-700 hover:bg-red-50"
                              : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          )}
                        >
                          {u.isActive ? "Suspendre" : "Réactiver"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. ONGLET : DEMANDES DE SERVICES */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Demandes de Prestations en Bourse
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((r) => (
                <div key={r.id} className="rounded-2xl border border-border bg-white p-4 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-client bg-blue-50 px-2 py-0.5 rounded">
                        {r.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5">{r.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Posté par {r.clientName} • {r.city} ({r.quarter})
                      </p>
                    </div>

                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                        r.status === "OPEN"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "CANCELLED"
                          ? "bg-slate-100 text-slate-600 line-through"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {r.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{r.proposalsCount} devis reçus</span>

                    {r.status !== "CANCELLED" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleExecuteAction("MODERATE_REQUEST", {
                            requestId: r.id,
                            reason: "Clôture administrative pour non-conformité",
                          })
                        }
                        className="text-red-600 hover:text-red-800 font-bold hover:underline"
                      >
                        Modérer & Clôturer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. ONGLET : JOURNAL D'AUDIT DE MODÉRATION RÉEL */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Journal d'Audit Immuable (Neon PostgreSQL)
            </h2>

            {auditLogs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-border text-slate-500 text-xs">
                Aucune action de modération n'a encore été enregistrée en base.
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-white shadow-soft divide-y divide-border overflow-hidden">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/50 text-xs">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 shrink-0">
                      <History className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span className="text-[11px] text-slate-400">{log.createdAt}</span>
                      </div>
                      <p className="mt-1 text-slate-600">{log.motif}</p>
                      <div className="mt-1 text-[11px] text-slate-400">
                        Opéré par : <span className="font-semibold text-slate-700">{log.adminName}</span>
                        {log.targetUserName && (
                          <span> • Cible : <span className="font-semibold text-slate-700">{log.targetUserName}</span></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
