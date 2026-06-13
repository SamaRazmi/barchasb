// authApi.ts
import { get } from "./apiClient";

export interface User {
  id: string;
  name: string;
  lastname: string;
  role: number; // از دیتابیس string میاد
  email?: string | null;
  fullName?: string; // برای راحتی در کامپوننت
}

export const fetchUser = async (): Promise<User | null> => {
  try {
    const data = await get<{ user: User }>("/auth/me");
    if (!data.user) return null;

    // ساخت fullName از name و lastname
    const userWithFullName: User = {
      ...data.user,
      fullName: `${data.user.name} ${data.user.lastname}`,
    };

    return userWithFullName;
  } catch (err) {
    console.error("fetchUser error:", err);
    return null;
  }
};
