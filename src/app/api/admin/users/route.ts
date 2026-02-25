import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isBanned: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Kullanıcılar yüklenemedi" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { email, password, name, role } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "E-posta ve şifre zorunludur" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "Bu e-posta adresi zaten kullanımda" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || "VIEWER",
            },
        });

        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json(userWithoutPassword);
    } catch (error) {
        return NextResponse.json({ error: "Kullanıcı oluşturulamadı" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { id, isBanned, role } = body;

        if (!id) {
            return NextResponse.json({ error: "Kullanıcı ID gereklidir" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                ...(isBanned !== undefined && { isBanned }),
                ...(role !== undefined && { role }),
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Kullanıcı güncellenemedi" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
        return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Kullanıcı ID gereklidir" }, { status: 400 });
        }

        // Don't allow admins to delete themselves
        if (id === (session.user as any).id) {
            return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz" }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Kullanıcı silindi" });
    } catch (error) {
        return NextResponse.json({ error: "Kullanıcı silinemedi" }, { status: 500 });
    }
}
