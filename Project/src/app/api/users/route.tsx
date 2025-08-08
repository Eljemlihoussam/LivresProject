
import { prisma } from "../../lib/prisma"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany(); 
    return NextResponse.json(users);
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
