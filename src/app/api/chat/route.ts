import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const messages = await prisma.message.findMany({
            take: 100,
            orderBy: {
                createdAt: "asc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { content } = await req.json();

        if (!content || content.trim() === "") {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                userId: (session.user as any).id,
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error creating message:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
