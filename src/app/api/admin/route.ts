import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin
 * Récupère en direct depuis Neon PostgreSQL :
 * - Les statistiques globales réelles
 * - La liste des utilisateurs réels
 * - Les demandes de vérification ProxyTrust en attente/traitées
 * - Les demandes de services
 * - Le journal d'audit de modération réel (ModerationLog)
 */
export async function GET() {
  try {
    const [users, jobbers, requests, verifications, categories, auditLogs] = await Promise.all([
      prisma.user.findMany({
        include: {
          jobberProfile: true,
          creditAccount: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobberProfile.findMany({
        include: {
          user: true,
          verifications: true,
          reviews: true,
          services: { include: { category: true } },
        },
      }),
      prisma.serviceRequest.findMany({
        include: {
          client: true,
          category: true,
          proposals: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.proxyTrustVerification.findMany({
        include: {
          jobber: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        include: {
          _count: {
            select: { services: true, requests: true },
          },
        },
      }),
      prisma.moderationLog.findMany({
        include: {
          admin: true,
          targetUser: true,
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    const stats = {
      totalUsers: users.length,
      totalJobbers: jobbers.length,
      totalRequests: requests.length,
      pendingVerifications: verifications.filter((v: { status: string }) => v.status === "PENDING").length,
      verifiedJobbers: jobbers.filter((j: { isVerified: boolean }) => j.isVerified).length,
      suspendedUsers: users.filter((u: { isActive: boolean }) => !u.isActive).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      users: users.map((u: (typeof users)[number]) => ({
        id: u.id,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Utilisateur",
        email: u.email,
        phone: u.phone,
        role: u.role,
        activeRole: u.activeRole,
        city: u.city || "Cotonou",
        quarter: u.quarter || "Non renseigné",
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString().slice(0, 10),
        creditBalance: u.creditAccount?.balance ?? 0,
      })),
      verifications: verifications.map((v: (typeof verifications)[number]) => ({
        id: v.id,
        jobberId: v.jobberId,
        jobberName: v.jobber?.user?.name || `${v.jobber?.user?.firstName || ""} ${v.jobber?.user?.lastName || ""}`.trim() || "Artisan",
        jobberPhone: v.jobber?.user?.phone || "",
        jobberCity: v.jobber?.city || v.jobber?.user?.city || "Cotonou",
        type: v.type,
        status: v.status,
        documentUrl: v.documentUrl,
        documentNumber: v.documentNumber || "Non spécifié",
        comment: v.comment,
        createdAt: v.createdAt.toISOString().slice(0, 10),
      })),
      requests: requests.map((r: (typeof requests)[number]) => ({
        id: r.id,
        title: r.title,
        clientName: r.client.name || `${r.client.firstName || ""} ${r.client.lastName || ""}`.trim() || "Client",
        clientPhone: r.client.phone,
        city: r.city,
        quarter: r.quarter,
        category: r.category.name,
        status: r.status,
        estUrgent: r.estUrgent,
        budgetIndicatif: r.budgetIndicatif,
        proposalsCount: r.proposals.length,
        createdAt: r.createdAt.toISOString().slice(0, 10),
      })),
      categories: categories.map((c: (typeof categories)[number]) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        servicesCount: c._count.services,
        requestsCount: c._count.requests,
      })),
      auditLogs: auditLogs.map((log: (typeof auditLogs)[number]) => ({
        id: log.id,
        action: log.action,
        motif: log.motif,
        targetId: log.targetId,
        targetType: log.targetType,
        adminName: log.admin.name || "Modérateur",
        targetUserName: log.targetUser?.name || null,
        createdAt: log.createdAt.toLocaleDateString("fr-BJ", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  } catch (error) {
    console.error("Erreur api/admin GET:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données réelles d'administration." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin
 * Exécute une action réelle de modération persistée dans Neon PostgreSQL
 */
export async function POST(request: Request) {
  try {
    const session = await getCurrentUser();
    // Trouver un ID admin réel
    let adminId = session?.id;
    if (!adminId) {
      const defaultAdmin = await prisma.user.findFirst({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
      });
      adminId = defaultAdmin?.id || "usr_admin_01";
    }

    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case "APPROVE_VERIFICATION": {
        const { verificationId } = payload;
        const verification = await prisma.proxyTrustVerification.update({
          where: { id: verificationId },
          data: {
            status: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: adminId,
          },
          include: { jobber: { include: { user: true } } },
        });

        // Mise à jour de l'artisan comme vérifié
        await prisma.jobberProfile.update({
          where: { id: verification.jobberId },
          data: {
            isVerified: true,
            trustBadge: "LEVEL_3_EXPERT",
          },
        });

        // Journalisation de modération dans Neon
        await prisma.moderationLog.create({
          data: {
            adminId,
            action: "APPROVE_VERIFICATION",
            motif: `Validation officielle de la pièce ${verification.type} (N° ${verification.documentNumber || "N/A"})`,
            targetId: verification.id,
            targetType: "VERIFICATION",
            targetUserId: verification.jobber.userId,
          },
        });

        return NextResponse.json({ success: true, message: "Pièce d'identité validée avec succès !" });
      }

      case "REJECT_VERIFICATION": {
        const { verificationId, motif } = payload;
        const verification = await prisma.proxyTrustVerification.update({
          where: { id: verificationId },
          data: {
            status: "REJECTED",
            comment: motif || "Document illisible ou non conforme aux normes béninoises.",
            verifiedAt: new Date(),
            verifiedBy: adminId,
          },
          include: { jobber: true },
        });

        await prisma.moderationLog.create({
          data: {
            adminId,
            action: "REJECT_VERIFICATION",
            motif: motif || "Pièce rejetée : non conforme",
            targetId: verification.id,
            targetType: "VERIFICATION",
            targetUserId: verification.jobber.userId,
          },
        });

        return NextResponse.json({ success: true, message: "Pièce rejetée et notifiée au Jobeur." });
      }

      case "TOGGLE_USER_ACTIVE": {
        const { userId, isActive } = payload;
        const user = await prisma.user.update({
          where: { id: userId },
          data: { isActive },
        });

        await prisma.moderationLog.create({
          data: {
            adminId,
            action: isActive ? "WARN_USER" : "SUSPEND_USER",
            motif: isActive
              ? "Levée de suspension administrative"
              : "Suspension du compte pour non respect des conditions d'utilisation",
            targetId: user.id,
            targetType: "USER",
            targetUserId: user.id,
          },
        });

        return NextResponse.json({
          success: true,
          message: isActive ? "Compte réactivé avec succès." : "Compte suspendu avec succès.",
        });
      }

      case "MODERATE_REQUEST": {
        const { requestId, reason } = payload;
        const req = await prisma.serviceRequest.update({
          where: { id: requestId },
          data: { status: "CANCELLED" },
        });

        await prisma.moderationLog.create({
          data: {
            adminId,
            action: "WARN_USER",
            motif: reason || "Demande annulée par la modération",
            targetId: req.id,
            targetType: "REQUEST",
            targetUserId: req.clientId,
          },
        });

        return NextResponse.json({ success: true, message: "Demande modérée et clôturée." });
      }

      default:
        return NextResponse.json({ error: "Action non reconnue." }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur api/admin POST:", error);
    return NextResponse.json(
      { error: "Impossible d'exécuter l'action de modération." },
      { status: 500 }
    );
  }
}
