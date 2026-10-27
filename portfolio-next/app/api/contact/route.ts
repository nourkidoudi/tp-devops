import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

// Relaie le formulaire vers l'API Express (l'URL de l'API reste côté serveur)
export async function POST(request: NextRequest) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) headers["X-Forwarded-For"] = forwarded;

    try {
        const res = await fetch(`${API_URL}/api/contact`, {
            method: "POST",
            headers,
            body: await request.text(),
            cache: "no-store",
        });
        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: "API injoignable" }, { status: 502 });
    }
}