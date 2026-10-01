import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const commune = searchParams.get("commune");
    const query = searchParams.get("q");

    // Requête réelle sur Neon PostgreSQL
    const jobberProfiles = await prisma.jobberProfile.findMany({
      include: {
        user: true,
        reviews: {
          include: {
            author: true,
          },
          orderBy: { createdAt: "desc" },
        },
        portfolios: true,
        verifications: true,
        services: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        { averageRating: "desc" },
        { totalReviews: "desc" },
      ],
    });

    const mapped = jobberProfiles.map((j) => {
      const primaryService = j.services[0];
      const categorySlug = primaryService?.category?.slug || "";
      const categoryName = primaryService?.category?.name || "Bâtiment & Artisanat";

      return {
        id: j.id,
        userId: j.userId,
        name:
          j.user.name ||
          `${j.user.firstName || ""} ${j.user.lastName || ""}`.trim() ||
          "Artisan ProxiJob",
        trade: j.headline || categoryName,
        headline: j.headline || "",
        bio: j.bio || "",
        avatar:
          j.user.image ||
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
        phone: j.user.phone || "",
        email: j.user.email || "",
        legalStatus: j.legalStatus,
        companyName: j.companyName,
        ifu: j.ifu,
        city: j.city || j.user.city || "Cotonou",
        quarter: j.quarter || j.user.quarter || "Akpakpa",
        landmark: j.landmark || "",
        latitude: j.latitude || 6.3685,
        longitude: j.longitude || 2.4502,
        serviceZones: j.serviceZones || [],
        isAvailable: j.isAvailable,
        availabilityDetails: j.availabilityDetails || "08h00 - 18h00",
        averageRating: j.averageRating,
        totalReviews: j.totalReviews,
        completedJobs: j.completedJobs,
        responseRate: j.responseRate,
        trustBadge: j.trustBadge,
        isVerified: j.isVerified,
        skills: j.skills || [],
        categorySlug,
        categoryName,
        startingPrice: primaryService?.startingPrice || j.hourlyRate || 3500,
        hourlyRate: j.hourlyRate || 3500,
        portfolios: j.portfolios.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description || "",
          photoUrl: p.photoUrl || p.apresUrl,
          avantUrl: p.avantUrl || "",
          apresUrl: p.apresUrl || "",
          date: p.createdAt.toISOString().slice(0, 10),
          isVerified: p.isVerified,
        })),
        reviews: j.reviews.map((r) => ({
          id: r.id,
          requestId: r.requestId,
          clientName: r.author.name || "Client vérifié",
          clientQuarter: r.author.quarter || "Cotonou",
          rating: r.rating,
          qualite: r.qualite || r.rating,
          ponctualite: r.ponctualite || r.rating,
          prix: r.prix || r.rating,
          communication: r.communication || r.rating,
          date: r.createdAt.toISOString().slice(0, 10),
          comment: r.commentaire,
          jobberReply: r.jobberReply,
          jobberReplyDate: r.jobberReplyAt
            ? r.jobberReplyAt.toISOString().slice(0, 10)
            : undefined,
        })),
        verifications: j.verifications.map((v) => ({
          id: v.id,
          type: v.type,
          status: v.status,
          documentNumber: v.documentNumber,
        })),
        services: j.services.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          startingPrice: s.startingPrice,
          categoryName: s.category.name,
        })),
      };
    });

    return NextResponse.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error("Erreur api/jobeurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des Jobeurs." },
      { status: 500 }
    );
  }
}
