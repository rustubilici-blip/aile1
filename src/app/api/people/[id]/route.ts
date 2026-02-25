import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const person = await prisma.person.findUnique({
            where: { id: params.id },
            include: {
                father: true,
                mother: true,
                marriages1: { include: { spouse2: true } },
                marriages2: { include: { spouse1: true } },
                documents: true,
            },
        });

        if (!person) {
            return NextResponse.json({ error: "Kişi bulunamadı" }, { status: 404 });
        }

        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: "Kişi bilgileri yüklenemedi" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === "VIEWER") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Duplicate Check
        const existingPerson = await prisma.person.findFirst({
            where: {
                id: { not: params.id },
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

        const person = await prisma.person.update({
            where: { id: params.id },
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
                isElder: body.isElder !== undefined ? body.isElder : undefined,
                fatherId: body.fatherId,
                motherId: body.motherId,
            },
        });
        return NextResponse.json(person);
    } catch (error) {
        return NextResponse.json({ error: "Kişi güncellenemedi" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Sadece yöneticiler silebilir" }, { status: 401 });
    }

    try {
        await prisma.person.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ message: "Kişi silindi" });
    } catch (error) {
        return NextResponse.json({ error: "Kişi silinemedi" }, { status: 500 });
    }
}
