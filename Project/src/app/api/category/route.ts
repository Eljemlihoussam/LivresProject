import {prisma} from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories) , { status: 200 };
    if (!categories || categories.length === 0) {
      return NextResponse.json({ message: "No categories found" }, { status: 404 });
    }   
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}