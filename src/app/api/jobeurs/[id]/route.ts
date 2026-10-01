import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const jobber = await prisma.jobberProfile.findFirst({
      where: {
        OR: [{ id: id }, { userId: id }],
      },
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
    });

    if (!jobber) {
      return NextResponse.json(
        { error: "Artisan introuvable." },
        { status: 404 }
      );
    }

    const primaryService = jobber.services[0];

    const data = {
      id: jobber.id,
      userId: jobber.userId,
      name:
        jobber.user.name ||
        `${jobber.user.firstName || ""} ${jobber.user.lastName || ""}`.trim() ||
        "Artisan ProxiJob",
      trade: jobber.headline || primaryService?.category?.name || "Artisan Qualifié",
      headline: jobber.headline || "",
      bio: jobber.bio || "",
      avatar:
        jobber.user.image ||
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      phone: jobber.user.phone || "",
      email: jobber.user.email || "",
      legalStatus: jobber.legalStatus,
      companyName: jobber.companyName,
      ifu: jobber.ifu,
      rccm: jobber.rccm,
      city: jobber.city || jobber.user.city || "Cotonou",
      quarter: jobber.quarter || jobber.user.quarter || "Akpakpa",
      landmark: jobber.landmark || "",
      latitude: jobber.latitude || 6.3685,
      longitude: jobber.longitude || 2.4502,
      serviceZones: jobber.serviceZones || [],
      isAvailable: jobber.isAvailable,
      availabilityDetails: jobber.availabilityDetails || "Lun-Sam : 08h00 - 18h30",
      averageRating: jobber.averageRating,
      totalReviews: jobber.totalReviews,
      completedJobs: jobber.completedJobs,
      responseRate: jobber.responseRate,
      trustBadge: jobber.trustBadge,
      isVerified: jobber.isVerified,
      skills: jobber.skills || [],
      categorySlug: primaryService?.category?.slug || "",
      categoryName: primaryService?.category?.name || "Bâtiment & Travaux",
      startingPrice: primaryService?.startingPrice || jobber.hourlyRate || 3500,
      hourlyRate: jobber.hourlyRate || 3500,
      portfolios: jobber.portfolios.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description || "",
        photoUrl: p.photoUrl || p.apresUrl,
        avantUrl: p.avantUrl || "",
        apresUrl: p.apresUrl || "",
        date: p.createdAt.toISOString().slice(0, 10),
        isVerified: p.isVerified,
      })),
      reviews: jobber.reviews.map((r) => ({
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
      verifications: jobber.verifications.map((v) => ({
        id: v.id,
        type: v.type,
        status: v.status,
        documentNumber: v.documentNumber,
      })),
      services: jobber.services.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        startingPrice: s.startingPrice,
        priceUnit: s.priceUnit,
        categoryName: s.category.name,
      })),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Erreur api/jobeurs/[id]:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la recherche du profil." },
      { status: 500 }
    );
  }
}
