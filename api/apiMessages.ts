export const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://barchasb-server.liara.run/api";

export interface Conversation {
  _id: string;
  participants: { _id: string; name: string }[];
  adId: string;
  adType: string;
  lastMessage: string;
  adImage?: string;
  adTitle?: string;
  unreadCount?: number;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface DeviceSession {
  id: string;
  deviceInfo?: {
    deviceType: string;
    browser: string;
    ip: string;
    userAgent?: string;
  };
  deviceType?: string;
  browser?: string;
  ip?: string;
  lastActiveAt: string;
  createdAt: string;
  isActive: boolean;
  isRead?: boolean;
}

// -------------------- Chat --------------------
export async function fetchConversations(
  userId: string,
): Promise<{ success: boolean; conversations: Conversation[] }> {
  const res = await fetch(`${API_BASE_URL}/chat/conversations/${userId}`, {
    credentials: "include",
  });
  return res.json();
}

export async function fetchUnreadCounts(
  userId: string,
): Promise<{ karjo: number; karfarma: number; agahi: number }> {
  const res = await fetch(`${API_BASE_URL}/chat/unread-count/${userId}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (data.success && data.data) {
    return data.data;
  }
  return { karjo: 0, karfarma: 0, agahi: 0 };
}

export async function fetchUnreadDetails(
  userId: string,
): Promise<Record<string, number>> {
  const res = await fetch(`${API_BASE_URL}/chat/unread-details/${userId}`, {
    credentials: "include",
  });
  const data = await res.json();
  if (data.success && data.data) {
    return data.data;
  }
  return {};
}

export async function markConversationAsRead(
  userId: string,
  conversationId: string,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE_URL}/chat/mark-read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, conversationId }),
  });
  return res.json();
}

// -------------------- Notifications --------------------
export async function fetchInAppNotifications(): Promise<InAppNotification[]> {
  const res = await fetch(`${API_BASE_URL}/in-app-notifications`, {
    credentials: "include",
  });
  const data = await res.json();
  if (data.success && data.data) {
    return data.data;
  }
  return [];
}

export async function markNotificationAsRead(
  notificationId: string,
): Promise<{ success: boolean }> {
  const res = await fetch(
    `${API_BASE_URL}/in-app-notifications/${notificationId}/read`,
    {
      method: "PUT",
      credentials: "include",
    },
  );
  return res.json();
}

// -------------------- Devices --------------------
export async function getDevices(): Promise<{
  sessions: DeviceSession[];
  unreadCount: number;
}> {
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    credentials: "include",
  });
  return res.json();
}

export async function markSessionAsRead(
  sessionId: string,
): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/read`, {
    method: "PUT",
    credentials: "include",
  });
  return res.json();
}
