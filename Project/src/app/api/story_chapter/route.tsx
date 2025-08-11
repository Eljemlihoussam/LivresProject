// app/api/story_chapter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Récupérer l'ID depuis les paramètres de l'URL
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');

    if (!storyId) {
      return NextResponse.json(
        { error: 'story_id est requis' },
        { status: 400 }
      );
    }

    const storyIdNumber = parseInt(storyId, 10);

    if (isNaN(storyIdNumber) || storyIdNumber <= 0) {
      return NextResponse.json(
        { error: 'story_id doit être un nombre positif' },
        { status: 400 }
      );
    }

    console.log(`🔍 Recherche des chapitres pour story_id: ${storyIdNumber}`);

    // MÉTHODE 1: Récupérer d'abord l'histoire
    const story = await prisma.story.findUnique({
      where: { id: storyIdNumber }
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Histoire non trouvée' },
        { status: 404 }
      );
    }

    // MÉTHODE 2: Récupérer les chapitres séparément
    const chapters = await prisma.storyChapter.findMany({
      where: { story_id: storyIdNumber },
      orderBy: { id: 'asc' }
    });

    if (chapters.length === 0) {
      return NextResponse.json(
        { error: 'Aucun chapitre trouvé pour cette histoire' },
        { status: 404 }
      );
    }

    console.log(`📚 ${chapters.length} chapitre(s) trouvé(s)`);

    return NextResponse.json({
      success: true,
      story: {
        id: story.id,
        title: story.title,
        author: story.author,
        description: story.description,
        cover_img_url: story.cover_img_url,
        range: story.range
      },
      totalChapters: chapters.length,
      chapters: chapters.map(chapter => ({
        id: chapter.id,
        story_id: chapter.story_id,
        title: chapter.title,
        content: chapter.content,
        audio_url: chapter.audio_url,
        image_url: chapter.image_url,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt
      }))
    });

  } catch (error) {
    console.error('❌ Erreur dans l\'API story_chapter:', error);
    
    return NextResponse.json(
      { 
        error: 'Erreur serveur interne',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// VERSION ALTERNATIVE: Si les noms de vos modèles sont différents
export async function GET_ALTERNATIVE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storyId = searchParams.get('story_id');

    if (!storyId) {
      return NextResponse.json({ error: 'story_id est requis' }, { status: 400 });
    }

    const storyIdNumber = parseInt(storyId, 10);

    if (isNaN(storyIdNumber) || storyIdNumber <= 0) {
      return NextResponse.json({ error: 'story_id doit être un nombre positif' }, { status: 400 });
    }

    // Si vous avez des noms de tables différents, adaptez ces requêtes :
    
    // Option A: Utiliser une requête SQL brute
    const chapters = await prisma.$queryRaw`
      SELECT sc.*, s.title as story_title, s.author, s.description, s.cover_img_url, s.range
      FROM public."StoryChapter" sc
      JOIN public."Story" s ON s.id = sc.story_id
      WHERE sc.story_id = ${storyIdNumber}
      ORDER BY sc.id ASC
    `;

    if (!Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json({ error: 'Aucun chapitre trouvé' }, { status: 404 });
    }

    const firstChapter = chapters[0] as any;
    
    return NextResponse.json({
      success: true,
      story: {
        id: storyIdNumber,
        title: firstChapter.story_title,
        author: firstChapter.author,
        description: firstChapter.description,
        cover_img_url: firstChapter.cover_img_url,
        range: firstChapter.range
      },
      totalChapters: chapters.length,
      chapters: chapters.map((chapter: any) => ({
        id: chapter.id,
        story_id: chapter.story_id,
        title: chapter.title,
        content: chapter.content,
        audio_url: chapter.audio_url,
        image_url: chapter.image_url,
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt
      }))
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne', details: error.message },
      { status: 500 }
    );
  }
}