// app/api/resume/upload/[resumeId]/route.js
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    // 1. Correctly await params to extract resumeId
    const { resumeId } = await params;

    if (!resumeId) {
      return NextResponse.json({ message: "Missing resumeId" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("resumeFile");
    if (!file) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized: missing token" }, { status: 401 });
    }

    const liaraFormData = new FormData();
    liaraFormData.append("resumeFile", file);

    const uploadUrl = `${process.env.API_BASE_URL}/api/resume/upload/${resumeId}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: liaraFormData,
    });

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non‑JSON response:", text.substring(0, 500));
      return NextResponse.json(
        { message: "External API returned non‑JSON", details: text.substring(0, 200) },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Upload proxy error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}