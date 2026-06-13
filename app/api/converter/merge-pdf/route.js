import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");

    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: missing token" },
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const response = await fetch(
      "https://barchasb-server.liara.run/api/converter/merge-pdf",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const data = await response.json();

      return NextResponse.json(
        { message: data?.message || "External API error" },
        { status: response.status },
      );
    }

    const blob = await response.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="merged.pdf"',
      },
    });
  } catch (error) {
    console.error("Merge PDF API error:", error);

    return NextResponse.json(
      { message: "Server error: " + error.message },
      { status: 500 },
    );
  }
}
