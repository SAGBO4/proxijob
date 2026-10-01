import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "proxijob-secret-secure-key-cotonou-benin-2026";

export const COOKIE_NAME = "proxijob_session";

export interface SessionPayload {
  userId: string;
  email?: string | null;
  phone?: string | null;
  name?: string | null;
  role: "CLIENT" | "JOBBER" | "HYBRID" | "ADMIN" | "MODERATOR";
  activeRole: "CLIENT" | "JOBBER" | "HYBRID" | "ADMIN" | "MODERATOR";
}

/**
 * Hache un mot de passe en clair via bcryptjs avec salt 12
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compare un mot de passe en clair avec son hachage bcrypt
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Émet un JWT signé pour une durée de 7 jours
 */
export function createToken(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Vérifie et décode un JWT
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as SessionPayload;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Récupère la session courante depuis les cookies Next.js
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload?.userId) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Récupère l'utilisateur complet en base Neon à partir de la session courante
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        jobberProfile: {
          include: {
            verifications: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
}

/**
 * Configure le cookie HTTP-only pour la session
 */
export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

/**
 * Efface le cookie de session
 */
export function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
