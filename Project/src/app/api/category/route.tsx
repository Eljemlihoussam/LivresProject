import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const sort = searchParams.get("sort") || "rating"; // default sort
    const category = searchParams.get("category"); // optional

    // Construction de la clause WHERE si un filtre est fourni
    const where = category && category !== "Tous" ? { category: { name: category } } : {};

    // Construction de la clause ORDER BY selon le tri demandé
    let orderBy = {};

    switch (sort) {
      case "price-low":
        orderBy = { price: "asc" };
        break;
      case "price-high":
        orderBy = { price: "desc" };
        break;
      case "title":
        orderBy = { title: "asc" };
        break;
      case "rating":
      default:
        orderBy = { rating: "desc" };
        break;
    }

    const categories = await prisma.category.findMany({
      where,
      orderBy,
      include: {
        Story_Category: true, // si tu veux les infos de la catégorie
      },
    });

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
