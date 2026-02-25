import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Define upload directory
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // Directory might already exist
        }

        // Generate unique filename
        const folderName = "people";
        const personUploadDir = join(uploadDir, folderName);
        try {
            await mkdir(personUploadDir, { recursive: true });
        } catch (err) { }

        const extension = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${extension}`;
        const path = join(personUploadDir, fileName);

        await writeFile(path, buffer);

        const fileUrl = `/uploads/${folderName}/${fileName}`;

        return NextResponse.json({ url: fileUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
