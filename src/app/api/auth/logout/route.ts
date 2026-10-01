import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST() {
  clearSessionCookie();
  return NextResponse.json({ success: true, message: "Déconnexion réussie." });
}

export async function GET() {
  clearSessionCookie();
  return NextResponse.redirect(new URL("/connexion", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
}
