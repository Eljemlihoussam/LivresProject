
import { prisma } from "../../lib/prisma"; // Assurez-vous que le chemin est correct
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany(); // Remplace "user" par le vrai nom du modèle
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
