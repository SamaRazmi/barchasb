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
      "https://barchasb-server.liara.run/api/converter/image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // استفاده از توکن دریافتی
        },
        body: formData,
      },
    );

    if (!liaraRes.ok) {
      const errorText = await liaraRes.text();
      return NextResponse.json(
        { message: errorText || "خطا در تبدیل تصویر" },
        { status: liaraRes.status },
      );
    }

    const blob = await liaraRes.blob();
    const contentType =
      liaraRes.headers.get("content-type") || "application/octet-stream";

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": 'attachment; filename="converted-file"',
      },
    });
  } catch (error) {
    console.error("Image Convert API Error:", error);
    return NextResponse.json(
      { message: "خطای سرور: " + error.message },
      { status: 500 },
    );
  }
}
