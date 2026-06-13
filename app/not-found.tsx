// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-800 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-white drop-shadow-2xl">۴۰۴</h1>
        <div className="my-6 text-8xl">🔍</div>
        <h2 className="text-3xl font-bold text-white mb-4">صفحه پیدا نشد!</h2>
        <p className="text-gray-200 max-w-md mx-auto mb-8">
          صفحه‌ای که دنبال آن بودید وجود ندارد یا جابه‌جا شده است.
        </p>
        <Link
          href="/"
          className="inline-block bg-white text-purple-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          برگشت به خانه
        </Link>
      </div>
    </div>
  );
}
