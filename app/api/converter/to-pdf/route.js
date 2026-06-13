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

    const liaraRes = await fetch(
      "https://barchasb-server.liara.run/api/converter/to-pdf",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    if (!liaraRes.ok) {
      const errorText = await liaraRes.text();

      return NextResponse.json(
        { message: errorText || "خطا در تبدیل تصاویر به PDF" },
        { status: liaraRes.status },
      );
    }

    const blob = await liaraRes.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="converted.pdf"',
      },
    });
  } catch (error) {
    console.error("ImageToPDF API Error:", error);

    return NextResponse.json(
      { message: "خطای سرور: " + error.message },
      { status: 500 },
    );
  }
}
