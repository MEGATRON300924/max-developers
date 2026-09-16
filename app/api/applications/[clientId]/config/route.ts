import { NextResponse } from "next/server";
import { authFetchPath } from "../../../../../lib/auth-session";

const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
const maxBytes = 512 * 1024;

export async function GET(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/config`);
}

export async function PUT(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  try {
    const body = await request.json();
    return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/config`, { method: "PUT", body: JSON.stringify(body) });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ message: "Choose an image file." }, { status: 400 });
    if (!allowed.has(file.type)) return NextResponse.json({ message: "Logo must be PNG, JPEG, or WebP." }, { status: 400 });
    if (file.size > maxBytes) return NextResponse.json({ message: "Logo must be 512 KB or smaller." }, { status: 400 });
    const data = Buffer.from(await file.arrayBuffer()).toString("base64");
    return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/logo`, {
      method: "POST",
      body: JSON.stringify({ contentType: file.type, data }),
    });
  } catch {
    return NextResponse.json({ message: "Unable to upload logo." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/logo`, { method: "DELETE" });
}
