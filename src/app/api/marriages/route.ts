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
    const marriage = await prisma.marriage.create({
      data: {
        spouse1Id: body.spouse1Id,
        spouse2Id: body.spouse2Id,
        marriageDate: body.marriageDate ? new Date(body.marriageDate) : null,
      },
    });
    return NextResponse.json(marriage);
  } catch (error) {
    return NextResponse.json({ error: "Evlilik kaydı oluşturulamadı" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    await prisma.marriage.delete({ where: { id } });
    return NextResponse.json({ message: "Evlilik kaydı silindi" });
  } catch (error) {
    return NextResponse.json({ error: "Silme işlemi başarısız" }, { status: 500 });
  }
}
