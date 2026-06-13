import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // دریافت توکن از هدر Authorization
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
      "https://barchasb-server.liara.run/api/converter/compress-pdf",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ارسال توکن دریافت شده
        },
        body: formData,
      },
    );

    if (!liaraRes.ok) {
      const errorText = await liaraRes.text();
      return NextResponse.json(
        { message: errorText || "خطا در فشرده‌سازی فایل" },
        { status: liaraRes.status },
      );
    }

    const blob = await liaraRes.blob();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=compressed.pdf",
      },
    });
  } catch (error) {
    console.error("Compress API Error:", error);
    return NextResponse.json(
      { message: "خطای سرور: " + error.message },
      { status: 500 },
    );
  }
}
