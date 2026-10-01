import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const requests = await prisma.serviceRequest.findMany({
      include: {
        client: true,
        category: true,
        proposals: {
          include: {
            jobber: {
              include: { user: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const mapped = requests.map((r) => ({
      id: r.id,
      clientId: r.clientId,
      clientName: r.client.name || "Client ProxiJob",
      clientAvatar:
        r.client.image ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      clientQuarter: r.quarter,
      clientCity: r.city,
      title: r.title,
      description: r.description,
      categoryId: r.categoryId,
      categorySlug: r.category.slug,
      categoryName: r.category.name,
      city: r.city,
      quarter: r.quarter,
      landmark: r.landmark || "",
      latitude: r.latitude || 6.3685,
      longitude: r.longitude || 2.4183,
      dateLimite: r.dateLimite ? r.dateLimite.toISOString().slice(0, 10) : "",
      estUrgent: r.estUrgent,
      budgetIndicatif: r.budgetIndicatif,
      status: r.status,
      photos: r.photos || [],
      proposalsCount: r.proposals.length,
      createdAt: r.createdAt.toISOString(),
      proposals: r.proposals.map((p) => ({
        id: p.id,
        montant: p.montant,
        delaiJours: p.delaiJours,
        message: p.message,
        status: p.status,
        jobberName: p.jobber.user.name,
        jobberAvatar: p.jobber.user.image,
      })),
    }));

    return NextResponse.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    console.error("Erreur api/demandes GET:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();

    const {
      title,
      description,
      categoryId,
      city = "Cotonou",
      quarter = "Haie Vive",
      landmark = "",
      estUrgent = false,
      budgetIndicatif,
      dateLimite,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Le titre et la description de votre besoin sont obligatoires." },
        { status: 400 }
      );
    }

    // Résoudre l'utilisateur client réel ou un utilisateur par défaut
    let clientId = session?.userId;
    if (!clientId) {
      // Trouver le premier client en base Neon ou l'admin
      const firstClient = await prisma.user.findFirst({
        where: { role: "CLIENT" },
      });
      clientId = firstClient?.id || "usr_client_koffi";
    }

    // Résoudre la catégorie
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId) {
      const firstCat = await prisma.category.findFirst();
      resolvedCategoryId = firstCat?.id || "cat_batiment";
    }

    // Création persistée dans Neon PostgreSQL
    const newRequest = await prisma.serviceRequest.create({
      data: {
        clientId,
        title: title.trim(),
        description: description.trim(),
        categoryId: resolvedCategoryId,
        city: city.trim(),
        quarter: quarter.trim(),
        landmark: landmark.trim() || undefined,
        estUrgent: Boolean(estUrgent),
        budgetIndicatif: budgetIndicatif ? Number(budgetIndicatif) : null,
        dateLimite: dateLimite ? new Date(dateLimite) : undefined,
        status: "OPEN",
      },
      include: {
        category: true,
        client: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Votre demande de service a été publiée avec succès !",
      data: newRequest,
    });
  } catch (error) {
    console.error("Erreur api/demandes POST:", error);
    return NextResponse.json(
      { error: "Impossible de créer la demande de service." },
      { status: 500 }
    );
  }
}
