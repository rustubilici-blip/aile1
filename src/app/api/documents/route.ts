import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === "VIEWER") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const document = await prisma.document.create({
            data: {
                personId: body.personId,
                fileUrl: body.fileUrl,
                type: body.type, // "IMAGE", "VIDEO", "AUDIO", "PDF" etc.
            },
        });
        return NextResponse.json(document);
    } catch (error) {
        return NextResponse.json({ error: "Belge oluşturulamadı" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === "VIEWER") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID gerekli" }, { status: 400 });
    }

    try {
        await prisma.document.delete({
            where: { id },
        });
        return NextResponse.json({ message: "Belge silindi" });
    } catch (error) {
        return NextResponse.json({ error: "Belge silinemedi" }, { status: 500 });
    }
}
