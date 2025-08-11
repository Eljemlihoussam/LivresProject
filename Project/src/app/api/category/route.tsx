import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Toutes les catégories
    const allCategories = await prisma.category.findMany();

    // 2. Catégories triées par nom ASC
    const sortedCategories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    // 3. Jointure pour les infos détaillées des histoires/favorites
    const categoriesInfo = await prisma.$queryRaw`
      SELECT story_id ,title, author, description, audio_duration, publication_date, cover_img_url, range 
      FROM public."Favorite"
      INNER JOIN public."Story" ON public."Favorite".story_id = public."Story".id 
      INNER JOIN public."AgeRange" ON public."Story".Age_range_id = public."AgeRange".id
    `;

    // 4. Compter les favoris par story
    const ratingEachStory = await prisma.favorite.groupBy({
      by: ["story_id"],
      _count: true,
    });

    // 5. Tous les types de catégories (encore une fois ?)
    const typeEachStory = await prisma.category.findMany();

    return NextResponse.json({
      allCategories,
      sortedCategories,
      categoriesInfo,
      ratingEachStory,
      typeEachStory,
    });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
