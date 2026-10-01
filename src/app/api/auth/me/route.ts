import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activeRole: user.activeRole,
        city: user.city,
        quarter: user.quarter,
        image: user.image,
        jobberProfile: user.jobberProfile
          ? {
              id: user.jobberProfile.id,
              headline: user.jobberProfile.headline,
              hourlyRate: user.jobberProfile.hourlyRate,
              isAvailable: user.jobberProfile.isAvailable,
              trustBadge: user.jobberProfile.trustBadge,
              averageRating: user.jobberProfile.averageRating,
              totalReviews: user.jobberProfile.totalReviews,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Erreur api/auth/me:", error);
    return NextResponse.json(
      { authenticated: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
