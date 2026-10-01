import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken, setSessionCookie } from "@/lib/auth";
import { Role } from "@prisma/client";

// Normalisation des numéros béninois (+229...)
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  if (cleaned.startsWith("+229")) return cleaned;
  if (cleaned.startsWith("00229")) return "+" + cleaned.slice(2);
  if (cleaned.startsWith("229")) return "+" + cleaned;
  // Numéro national à 8 ou 10 chiffres (nouveau plan de numérotation béninois)
  return `+229${cleaned}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role = "CLIENT",
      city = "Cotonou",
      quarter = "Haie Vive",
      headline,
      categoryId,
      hourlyRate,
    } = body;

    // Validation des champs indispensables
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Le prénom et le nom sont requis." },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Le numéro de téléphone béninois est obligatoire." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit comporter au moins 6 caractères." },
        { status: 400 }
      );
    }

    const formattedPhone = normalizePhone(phone);
    const formattedEmail = email ? email.toLowerCase().trim() : null;
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    // Vérifier l'unicité du téléphone
    const existingPhone = await prisma.user.findUnique({
      where: { phone: formattedPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { error: "Ce numéro de téléphone est déjà associé à un compte." },
        { status: 409 }
      );
    }

    // Vérifier l'unicité de l'email si renseigné
    if (formattedEmail) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: formattedEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "Cette adresse email est déjà associée à un compte." },
          { status: 409 }
        );
      }
    }

    // Hachage du mot de passe
    const hashedPassword = await hashPassword(password);
    const userRole: Role = role === "JOBBER" ? Role.JOBBER : Role.CLIENT;

    // Création de l'utilisateur dans Neon
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: formattedEmail,
        phone: formattedPhone,
        password: hashedPassword,
        role: userRole,
        activeRole: userRole,
        city: city.trim(),
        quarter: quarter.trim(),
      },
    });

    // Si rôle Jobeur, création de son profil professionnel et initialisation de son solde crédits
    if (userRole === Role.JOBBER) {
      // Résolution de catégorie par défaut si non spécifiée
      let targetCategoryId = categoryId;
      if (!targetCategoryId) {
        const firstCategory = await prisma.category.findFirst();
        targetCategoryId = firstCategory?.id;
      }

      await prisma.jobberProfile.create({
        data: {
          userId: newUser.id,
          headline: headline || "Artisan Professionnel Qualifié",
          city: city.trim(),
          quarter: quarter.trim(),
          hourlyRate: hourlyRate ? Number(hourlyRate) : 3500,
          skills: headline ? [headline] : ["Bâtiment", "Dépannage"],
          isAvailable: true,
          isVerified: false,
        },
      });

      // Compte crédits offert avec 5 crédits de bienvenue
      await prisma.creditAccount.create({
        data: {
          userId: newUser.id,
          balance: 5,
          freeCreditsRemaining: 5,
          purchasedCredits: 0,
        },
      });
    }

    // Génération du token JWT de session
    const token = createToken({
      userId: newUser.id,
      email: newUser.email,
      phone: newUser.phone,
      name: newUser.name,
      role: newUser.role,
      activeRole: newUser.activeRole,
    });

    setSessionCookie(token);

    const redirectTo =
      userRole === Role.JOBBER ? "/dashboard/jobeur" : "/dashboard/client";

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        activeRole: newUser.activeRole,
      },
      redirectTo,
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du compte." },
      { status: 500 }
    );
  }
}
