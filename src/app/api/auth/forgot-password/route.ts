import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "proxijob-secret-secure-key-cotonou-benin-2026";

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
    const { identifier } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: "Veuillez indiquer votre email ou numéro de téléphone." },
        { status: 400 }
      );
    }

    const trimmed = identifier.trim();
    const isEmail = trimmed.includes("@");

    let user = null;
    if (isEmail) {
      user = await prisma.user.findUnique({
        where: { email: trimmed.toLowerCase() },
      });
    } else {
      const formattedPhone = normalizePhone(trimmed);
      user = await prisma.user.findFirst({
        where: {
          OR: [{ phone: formattedPhone }, { phone: trimmed }],
        },
      });
    }

    if (!user) {
      // Pour des raisons de sécurité, on peut renvoyer un succès apparent ou un message clair
      return NextResponse.json(
        { error: "Aucun compte trouvé avec cet identifiant." },
        { status: 404 }
      );
    }

    // Création d'un jeton temporaire de réinitialisation sécurisé (valide 1 heure)
    const resetToken = jwt.sign(
      { userId: user.id, type: "password_reset" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      message:
        "Compte identifié avec succès. Vous pouvez maintenant définir un nouveau mot de passe.",
      resetToken,
      userName: user.name || "Utilisateur ProxiJob",
      phoneMasked: user.phone
        ? user.phone.slice(0, 6) + "•• •• " + user.phone.slice(-2)
        : null,
      emailMasked: user.email
        ? user.email.replace(/(.{2})(.*)(?=@)/, "$1•••")
        : null,
    });
  } catch (error) {
    console.error("Erreur forgot-password:", error);
    return NextResponse.json(
      { error: "Impossible de traiter la demande de réinitialisation." },
      { status: 500 }
    );
  }
}
