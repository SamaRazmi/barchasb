// import { NextResponse } from "next/server";

// export async function GET(request, { params }) {
//   try {
//     const { categoryId } = await params;

//     if (!categoryId || categoryId === "undefined") {
//       return NextResponse.json({ message: "ID نامعتبر است" }, { status: 400 });
//     }

//     const authHeader = request.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json(
//         { message: "توکن ارسال نشده است" },
//         { status: 401 },
//       );
//     }

//     // اصلاح مهم: استفاده از متغیری که در بقیه پروژه داری
//     const baseUrl =
//       process.env.NEXT_PUBLIC_BACKEND_URL || process.env.API_BASE_URL;
//     const apiUrl = `${baseUrl}/api/tests/categories/${categoryId}/types`;

//     console.log("Requesting to Backend:", apiUrl); // برای عیب‌یابی در کنسول ادیتور

//     const response = await fetch(apiUrl, {
//       method: "GET",
//       headers: {
//         Authorization: authHeader, // مستقیم هدر را بفرست (Bearer داخلش هست)
//       },
//       cache: "no-store", // جلوگیری از کش شدن دیتای خالی
//     });

//     const data = await response.json();
//     return NextResponse.json(data, { status: response.status });
//   } catch (error) {
//     console.error("API Route Error:", error);
//     return NextResponse.json({ message: "خطای سرور داخلی" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    // ۱. اطمینان از دریافت پارامترها (سازگار با همه نسخه‌های Next)
    const resolvedParams = await params;
    const categoryId = resolvedParams?.categoryId;

    if (!categoryId || categoryId === "undefined") {
      console.error("Error: categoryId is missing");
      return NextResponse.json({ message: "ID نامعتبر است" }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization");

    // ۲. بررسی مقدار Base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://barchasb-server.liara.run";
    const apiUrl = `${baseUrl}/api/tests/categories/${categoryId}/types`;

    console.log("Fetching from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader || "",
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 }, // جایگزین cache: 'no-store' در برخی نسخه‌ها
    });

    // ۳. بررسی اینکه آیا پاسخ سرور واقعا JSON است یا خیر
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      const errorText = await response.text();
      console.error("External API sent non-JSON response:", errorText);
      return NextResponse.json(
        { message: "پاسخ نامعتبر از سرور اصلی" },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Detailed API Route Error:", error);
    return NextResponse.json(
      { message: "خطای سرور داخلی", detail: error.message },
      { status: 500 },
    );
  }
}
