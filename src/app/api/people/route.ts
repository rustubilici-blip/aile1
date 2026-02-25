import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    try {
        const people = await prisma.person.findMany({
            where: q ? {
                OR: [
                    { firstName: { contains: q } },
                    { lastName: { contains: q } },
                    { birthplace: { contains: q } },
                ]
            } : {},
            include: {
                father: true,
                mother: true,
                marriages1: { include: { spouse2: true } },
                marriages2: { include: { spouse1: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 100, // Basic pagination/limit
        });

        return NextResponse.json(people);
    } catch (error) {
        return NextResponse.json({ error: "Kişiler yüklenemedi" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === "VIEWER") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Duplicate Check
        const existingPerson = await prisma.person.findFirst({
            where: {
                firstName: body.firstName,
                lastName: body.lastName,
                birthDate: body.birthDate ? new Date(body.birthDate) : null,
                birthplace: body.birthplace,
                occupation: body.occupation,
            }
        });

        if (existingPerson) {
            return NextResponse.json({ error: "DUPLICATE_MEMBER", message: "Bu bilgilere sahip bir aile üyesi zaten kayıtlı." }, { status: 409 });
        }

        const person = await prisma.person.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                birthDate: body.birthDate ? new Date(body.birthDate) : null,
                deathDate: body.deathDate ? new Date(body.deathDate) : null,
                birthplace: body.birthplace,
                occupation: body.occupation,
                biography: body.biography,
                phone: body.phone,
                imageUrl: body.imageUrl,
                isElder: body.isElder || false,
                fatherId: body.fatherId,
                motherId: body.motherId,
            },
        });
        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: "Kişi oluşturulamadı" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === "VIEWER") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { ids } = body;

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ error: "Geçersiz ID listesi" }, { status: 400 });
        }

        await prisma.person.deleteMany({
            where: {
                id: { in: ids }
            }
        });

        return NextResponse.json({ success: true, count: ids.length });
    } catch (error) {
        console.error("Bulk delete error:", error);
        return NextResponse.json({ error: "Toplu silme işlemi başarısız" }, { status: 500 });
    }
}
