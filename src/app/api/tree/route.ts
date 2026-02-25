import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const rootId = searchParams.get("rootId");

    try {
        // If no rootId, fetch the oldest person or a default
        let rootPerson;
        if (rootId) {
            rootPerson = await prisma.person.findUnique({
                where: { id: rootId },
                include: {
                    childrenOfFather: true,
                    childrenOfMother: true,
                    marriages1: { include: { spouse2: true } },
                    marriages2: { include: { spouse1: true } },
                },
            });
        } else {
            rootPerson = await prisma.person.findFirst({
                orderBy: { birthDate: 'asc' },
                include: {
                    childrenOfFather: true,
                    childrenOfMother: true,
                    marriages1: { include: { spouse2: true } },
                    marriages2: { include: { spouse1: true } },
                },
            });
        }

        if (!rootPerson) {
            return NextResponse.json({ error: "Kişi bulunamadı" }, { status: 404 });
        }

        // For better scalability, we return the children as well
        // D3.js can handle the hierarchy if we provide the connections
        return NextResponse.json(rootPerson);
    } catch (error) {
        return NextResponse.json({ error: "Ağaç verisi yüklenemedi" }, { status: 500 });
    }
}
