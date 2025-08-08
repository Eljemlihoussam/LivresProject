
import { prisma  }  from "../../lib/prisma";
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const languages = await prisma.language.findMany();
        if (!languages || languages.length === 0) {
            return NextResponse.json({ message: "No languages found" }, { status: 404 });
        }
        return NextResponse.json(languages, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
