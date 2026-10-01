import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [users, jobbers, requests, verifications, categories] = await Promise.all([
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
    ]);

    const stats = {
      totalUsers: users.length,
      totalJobbers: jobbers.length,
      totalRequests: requests.length,
      pendingVerifications: verifications.filter((v) => v.status === "PENDING").length,
      verifiedJobbers: jobbers.filter((j) => j.isVerified).length,
    };

    return NextResponse.json({
      success: true,
      stats,
      users: users.map((u) => ({
        id: u.id,
        name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim(),
        email: u.email,
        phone: u.phone,
        role: u.role,
        activeRole: u.activeRole,
        city: u.city,
        quarter: u.quarter,
        isActive: u.isActive,
        createdAt: u.createdAt.toISOString().slice(0, 10),
        creditBalance: u.creditAccount?.balance ?? 0,
      })),
      verifications: verifications.map((v) => ({
        id: v.id,
        jobberId: v.jobberId,
        jobberName: v.jobber.user.name || "Artisan",
        jobberPhone: v.jobber.user.phone || "",
        jobberCity: v.jobber.city || v.jobber.user.city || "Cotonou",
        type: v.type,
        status: v.status,
        documentUrl: v.documentUrl,
        documentNumber: v.documentNumber,
        comment: v.comment,
        createdAt: v.createdAt.toISOString().slice(0, 10),
      })),
      requests: requests.map((r) => ({
        id: r.id,
        title: r.title,
        clientName: r.client.name || "Client",
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
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        servicesCount: c._count.services,
        requestsCount: c._count.requests,
      })),
    });
  } catch (error) {
    console.error("Erreur api/admin:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données d'administration." },
      { status: 500 }
    );
  }
}
