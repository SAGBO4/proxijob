import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, createToken, setSessionCookie } from "@/lib/auth";

// Normalisation du téléphone béninois pour la recherche
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  if (cleaned.startsWith("+229")) return cleaned;
  if (cleaned.startsWith("00229")) return "+" + cleaned.slice(2);
  if (cleaned.startsWith("229")) return "+" + cleaned;
  return `+229${cleaned}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Veuillez renseigner votre email ou téléphone et votre mot de passe." },
        { status: 400 }
      );
    }

    const trimmedIdentifier = identifier.trim();
    const isEmail = trimmedIdentifier.includes("@");

    // Recherche de l'utilisateur par email ou par téléphone
    let user = null;
    if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: trimmedIdentifier.toLowerCase() },
      });
    } else {
      const formattedPhone = normalizePhone(trimmedIdentifier);
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { phone: formattedPhone },
            { phone: trimmedIdentifier },
          ],
        },
      });
    }

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Ce compte a été suspendu. Veuillez contacter le support." },
        { status: 403 }
      );
    }

    // Vérification du mot de passe avec bcrypt
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Identifiant ou mot de passe incorrect." },
        { status: 401 }
      );
    }

    // Création du token JWT de session
    const token = createToken({
      userId: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      role: user.role,
      activeRole: user.activeRole,
    });

    setSessionCookie(token);

    // Détermination de la redirection stricte selon le rôle
    let redirectTo = "/dashboard/client";
    if (user.role === "ADMIN" || user.role === "MODERATOR") {
      redirectTo = "/admin";
    } else if (user.activeRole === "JOBBER" || user.role === "JOBBER") {
      redirectTo = "/dashboard/jobeur";
    } else {
      redirectTo = "/dashboard/client";
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        activeRole: user.activeRole,
        city: user.city,
        quarter: user.quarter,
      },
      redirectTo,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la tentative de connexion." },
      { status: 500 }
    );
  }
}
