import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "proxijob-secret-secure-key-cotonou-benin-2026";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Jeton de réinitialisation et nouveau mot de passe requis." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    // Vérification du token JWT
    let decoded: { userId: string; type: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        type: string;
      };
    } catch {
      return NextResponse.json(
        { error: "Le lien de réinitialisation est invalide ou a expiré." },
        { status: 401 }
      );
    }

    if (decoded.type !== "password_reset" || !decoded.userId) {
      return NextResponse.json(
        { error: "Jeton invalide pour cette opération." },
        { status: 400 }
      );
    }

    // Hachage du nouveau mot de passe
    const hashedPassword = await hashPassword(newPassword);

    // Mise à jour en base Neon
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    });

    return NextResponse.json({
      success: true,
      message:
        "Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.",
    });
  } catch (error) {
    console.error("Erreur reset-password:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la réinitialisation du mot de passe." },
      { status: 500 }
    );
  }
}
