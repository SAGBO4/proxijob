import { Search, ShieldCheck, Wrench, MapPin, Star, Clock, UserCheck, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header Soft UI */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-client text-white shadow-soft">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-client">PROXI</span>
              <span className="text-xl font-bold tracking-tight text-jobber">JOB</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#services" className="transition-colors hover:text-client">Services</a>
            <a href="#proximite" className="transition-colors hover:text-client">Recherche locale</a>
            <a href="#confiance" className="transition-colors hover:text-client">ProxyTrust</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
              Connexion
            </button>
            <button className="inline-flex items-center justify-center rounded-xl bg-client px-4 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-client-hover active:scale-[0.98] transition-all">
              Publier une demande
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-client-light/40 to-background">
          <div className="container mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-client/20 bg-white px-3.5 py-1.5 text-xs font-semibold text-client shadow-soft mb-6">
              <ShieldCheck className="h-4 w-4 text-trust" />
              <span>Plateforme certifiée — Artisans vérifiés au Bénin</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight">
              Trouvez un artisan qualifié <br />
              <span className="text-client">au coin de votre rue</span>
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
              Plomberie, électricité, menuiserie, froid ou maçonnerie. Contactez directement des prestataires de confiance à Cotonou, Calavi et Porto-Novo sans carte interactive lourde.
            </p>

            {/* Moteur de recherche de proximité textuel (Sans Carte V1) */}
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-border bg-white p-3 shadow-soft-md sm:p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-xl border border-input px-3.5 py-2.5 text-left focus-within:border-client">
                  <Wrench className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Métier (ex: Électricien)"
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-input px-3.5 py-2.5 text-left focus-within:border-client">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Ville / Quartier (ex: Fidjrossè)"
                    className="w-full text-sm outline-none placeholder:text-slate-400"
                  />
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-jobber px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-soft hover:bg-jobber-hover active:scale-[0.98] transition-all">
                  <Search className="h-4 w-4" />
                  <span>Rechercher</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-medium">Populaire :</span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700">Plombier Cotonou</span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700">Climatisation Calavi</span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 text-slate-700">Électricien Akpakpa</span>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs Soft UI */}
        <section id="confiance" className="py-16 sm:py-20">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:shadow-soft-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-client-light text-client">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Hyper-proximité sans carte</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Repères réels, quartiers et arrondissements pour économiser la data et trouver l&apos;artisan le plus proche de chez vous.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:shadow-soft-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-jobber-surface text-jobber-dark">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Avis 100% vérifiés</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Seuls les clients ayant finalisé une mission peuvent laisser une évaluation pour garantir une réputation irréprochable.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-white p-6 shadow-soft transition-all hover:shadow-soft-md">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-trust-light text-trust">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Label ProxyTrust</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Vérification de l&apos;identité et des qualifications des professionnels pour une sécurité d&apos;intervention maximale.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer épuré */}
      <footer className="border-t border-border bg-white py-8 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} PROXIJOB Bénin. Tous droits réservés. Framework Soft UI & Clean Design.</p>
      </footer>
    </div>
  );
}
