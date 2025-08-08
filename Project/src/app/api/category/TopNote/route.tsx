import { prisma  }  from "../../../lib/prisma";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const categoriesInfo = await prisma.$queryRaw`
            SELECT title,author,description,audio_duration,publication_date,cover_img_url,range FROM public."Favorite"
            Inner join public."Story" on public."Favorite".story_id = public."Story".id 
            inner join public."AgeRange" on public."Story".Age_range_id = public."AgeRange".id
        `;

        // if (!categories  || categories.length === 0) {
        //     return NextResponse.json({ message: 'No categories found' }, { status: 404 });
        // }
        const RatingEachStory = await prisma.favorite.groupBy(  
            {
                by: ['story_id'] , 
                _count : true,
    
        
                }
            
        );


        const TypeEachStory = await prisma.$queryRaw`
            Select * from public."Category"
        `;

        return NextResponse.json({ 
            categoriesInfo, 
            RatingEachStory, 
            TypeEachStory }
           
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}