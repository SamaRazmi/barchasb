import React, { useState, useRef, useEffect, useCallback } from "react";
import { getWalletTransactions, WalletTransaction } from "@/api/apiWallet";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  time: string;
}

// تابع فیلتر زمانی (همانند قبل - برش ساده)
const filterTransactionsByTime = (
  transactions: Transaction[],
  filter: "today" | "thisWeek" | "thisMonth" | "thisYear",
): Transaction[] => {
  if (filter === "today") return transactions.slice(0, 2);
  if (filter === "thisWeek") return transactions.slice(0, 3);
  if (filter === "thisMonth") return transactions;
  return transactions;
};

const TransactionsContent: React.FC = () => {
  const [page, setPage] = useState<"main" | "deposit" | "withdraw">("main");
  const [timeFilter, setTimeFilter] = useState<
    "today" | "thisWeek" | "thisMonth" | "thisYear"
  >("today");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ذخیره تمام تراکنش‌های دریافت‌شده از API (بدون فیلتر نوع و زمان)
  const [allTransactions, setAllTransactions] = useState<WalletTransaction[]>(
    [],
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);

  // تبدیل تراکنش API به فرمت مورد نیاز کامپوننت
  const mapApiTransaction = (tx: WalletTransaction): Transaction => {
    // persianCreatedAt فرمت: "۱۴۰۳/۰۲/۱۵ ۱۴:۳۰:۰۰"
    const [datePart, timePart] = tx.persianCreatedAt.split(" ");
    return {
      id: tx.id,
      amount: tx.amount,
      date: datePart || "",
      time: timePart || "",
    };
  };

  // اعمال فیلترهای نوع (واریز/برداشت) و فیلتر زمانی
  const applyFilters = useCallback(() => {
    if (!allTransactions.length) {
      setTransactions([]);
      return;
    }

    // فیلتر بر اساس نوع صفحه (deposit یا withdraw)
    let filteredByType = allTransactions;
    if (page === "deposit") {
      filteredByType = allTransactions.filter((tx) => tx.type === "deposit");
    } else if (page === "withdraw") {
      filteredByType = allTransactions.filter((tx) => tx.type === "withdraw");
    }

    // تبدیل به فرمت Transaction
    const mapped = filteredByType.map(mapApiTransaction);
    // اعمال فیلتر زمانی (برش ساده)
    const finalTransactions = filterTransactionsByTime(mapped, timeFilter);
    setTransactions(finalTransactions);
  }, [allTransactions, page, timeFilter]);

  // دریافت داده‌ها از API
  const fetchTransactionsFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      // درخواست ۱۰۰ تراکنش اول (مرتب‌سازی نزولی)
      const response = await getWalletTransactions(1, 100);
      setAllTransactions(response.items);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "خطا در دریافت تراکنش‌ها");
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // بارگذاری اولیه از API
  useEffect(() => {
    fetchTransactionsFromApi();
  }, []);

  // هر بار که allTransactions یا page یا timeFilter تغییر کند، فیلترها اعمال می‌شوند
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // هندلرهای اسکرول (بدون تغییر)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!scrollContainerRef.current) return;
      const scrollAmount = 100;
      const pageScrollAmount = scrollContainerRef.current.clientHeight;
      switch (e.key) {
        case "ArrowDown":
          scrollContainerRef.current.scrollTop += scrollAmount;
          e.preventDefault();
          break;
        case "ArrowUp":
          scrollContainerRef.current.scrollTop -= scrollAmount;
          e.preventDefault();
          break;
        case "PageDown":
          scrollContainerRef.current.scrollTop += pageScrollAmount;
          e.preventDefault();
          break;
        case "PageUp":
          scrollContainerRef.current.scrollTop -= pageScrollAmount;
          e.preventDefault();
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDrag = (e: MouseEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.clientY);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragOffset(e.clientY);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) =>
    setDragOffset(e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (scrollContainerRef.current) {
      const delta = dragOffset - e.touches[0].clientY;
      scrollContainerRef.current.scrollTop = Math.max(
        0,
        scrollContainerRef.current.scrollTop + delta,
      );
      setDragOffset(e.touches[0].clientY);
    }
  };
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollContainerRef.current)
      scrollContainerRef.current.scrollTop += e.deltaY;
  };

  if (page === "main") {
    return (
      <div className="relative w-full h-full rounded-[20px] shadow-[1px_1px_8px_0px_#00000033] overflow-hidden flex items-center justify-center">
        <img
          src="/images/bg_wallet_billing.svg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="relative flex flex-col items-center space-y-16">
          <button
            onClick={() => setPage("deposit")}
            className="bg-[#143A62E5] text-white font-bold text-lg sm:text-base md:text-lg py-3 px-8 rounded-xl w-full max-w-[180px] whitespace-nowrap"
          >
            تاریخچه واریز
          </button>
          <button
            onClick={() => setPage("withdraw")}
            className="bg-[#143A62E5] text-white font-bold text-lg sm:text-base md:text-lg py-3 px-8 rounded-xl w-full max-w-[180px] whitespace-nowrap"
          >
            تاریخچه برداشت
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = page === "deposit" ? "تاریخچه واریز" : "تاریخچه برداشت";

  return (
    <div className="relative w-full h-full rounded-[20px] shadow-[1px_1px_8px_0px_#00000033] overflow-hidden flex flex-col">
      <img
        src="/images/bg_wallet_billing.svg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      {/* هدر */}
      <div className="relative pt-4 pb-2 flex items-center justify-center">
        <button
          onClick={() => setPage("main")}
          className="absolute left-4 z-10 bg-gray-200 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-gray-300 transition"
          aria-label="بازگشت"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h2 className="text-center text-xl font-bold text-[#143A62] py-2 px-6 inline-block rounded-full">
          {pageTitle}
        </h2>
      </div>

      {/* کادر اصلی */}
      <div className="relative flex-1 h-[50vh] pt-[1%] px-[10%] pb-[5%]">
        <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-2xl shadow-[1px_1px_6px_0px_#00000033] flex flex-col overflow-hidden">
          {/* دکمه‌های فیلتر */}
          <div className="flex flex-row justify-center gap-3 p-4 border-b border-white/20">
            {(["today", "thisWeek", "thisMonth", "thisYear"] as const).map(
              (filter) => {
                const labels = {
                  today: "امروز",
                  thisWeek: "این هفته",
                  thisMonth: "این ماه",
                  thisYear: "امسال",
                };
                const isActive = timeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#143A62] text-white border-[#143A62]"
                        : "bg-transparent text-[#143A62] border-[#143A62] hover:bg-[#143A62]/10"
                    }`}
                  >
                    {labels[filter]}
                  </button>
                );
              },
            )}
          </div>

          {/* لیست تراکنش‌ها با اسکرول */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto space-y-3 mx-[5%]"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={handleMouseDown}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-300 py-10">{error}</div>
            ) : transactions.length === 0 ? (
              <div className="text-center text-white/70 py-10">
                هیچ تراکنشی یافت نشد
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-[#143A6266] shadow-[1px_2px_4px_0px_#00000026] rounded-xl p-4 flex justify-between items-center text-white"
                  >
                    <div className="text-lg font-bold">
                      {tx.amount.toLocaleString()} تومان
                    </div>
                    <div className="text-left">
                      <div className="text-sm">{tx.date}</div>
                      <div className="text-xs opacity-80">{tx.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* سایه پایین */}
          <div
            className="w-full h-[3vh] sticky bottom-0 left-0 pointer-events-none rounded-md"
            style={{
              background:
                "linear-gradient(180deg, rgba(17, 17, 17, 0) 0%, rgba(17, 17, 17, 0.6) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionsContent;
