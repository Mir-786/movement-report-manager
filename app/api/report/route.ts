import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Server-side in-memory persistence
let serverMemoryData: any = null;
const dataDir = path.join(process.cwd(), "data");
const dataFilePath = path.join(dataDir, "report.json");

export async function GET() {
  try {
    // Attempt to load from disk if available
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf-8");
      serverMemoryData = JSON.parse(fileContent);
      return NextResponse.json({ success: true, data: serverMemoryData });
    }
  } catch (err) {
    // Falls back to server memory on serverless platforms
  }

  return NextResponse.json({ success: true, data: serverMemoryData });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    serverMemoryData = payload;

    // Persist to server disk when filesystem is writable
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(payload, null, 2), "utf-8");
    } catch (fsErr) {
      // In read-only serverless environments, serverMemoryData handles live persistence
    }

    return NextResponse.json({
      success: true,
      message: "Data saved successfully on server",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
