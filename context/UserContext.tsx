"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  lastName: string;
  nationalCode: string;
  phone: string;
  birthDate: string;
  gender: string;
  province: string;
  city: string;
  acceptTerms: boolean;
  role: number;
  joinedAt: string;
  phone_confirmed: boolean;
  referralCode: string;
  email?: string;
  email_confirmed?: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 📌 اینجا درخواست می‌زنیم
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://barchasb-server.liara.run/api/auth/me",
          {
            credentials: "include", // 🟢 برای ارسال cookie اگر لازم باشد
          },
        );
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("خطا در گرفتن کاربر:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// 🔥 هرجا خواستی استفاده کنی:
export const useUser = () => useContext(UserContext);
