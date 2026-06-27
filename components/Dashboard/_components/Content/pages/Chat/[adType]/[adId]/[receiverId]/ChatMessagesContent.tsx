"use client";

import TopBar from "@/components/common/TopBar";
import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReportDropdown from "@/components/common/ReportDropdown";
import {
  getAdDetails,
  getChatHistory,
  sendMessage,
  markRead,
} from "@/api/apiChat";

interface Message {
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}

interface ChatMessagesContentProps {
  currentUserId: string;
  receiverId: string;
  adId: string;
  adType: string;
  adTitle?: string;
}

// خواندن آدرس سوکت از متغیر محیطی (با پشتیبان)
const SOCKET_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api$/, "") ||
  "https://barchasb-server.liara.run";

const ChatMessagesContent: React.FC<ChatMessagesContentProps> = ({
  currentUserId,
  receiverId,
  adId,
  adType,
  adTitle: propAdTitle,
}) => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userStatus, setUserStatus] = useState<string>("در حال بارگیری...");
  const [lastSeen, setLastSeen] = useState<string | null>(null);
  const [fetchedTitle, setFetchedTitle] = useState<string>("");
  const [adFetchError, setAdFetchError] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // دریافت عنوان آگهی
  useEffect(() => {
    if (propAdTitle) {
      setFetchedTitle(propAdTitle);
      return;
    }
    if (!adId || !adType) return;

    getAdDetails(adId, adType)
      .then((data) => {
        if (data && (data.title || data.name)) {
          const title = data.title || data.name || "";
          setFetchedTitle(title);
          setAdFetchError(false);
        } else if (data) {
          console.warn("Ad data has no title", data);
          setAdFetchError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching ad details:", err);
        setAdFetchError(true);
      });
  }, [adId, adType, propAdTitle]);

  // دریافت تاریخچه پیام‌ها
  useEffect(() => {
    if (!currentUserId || !receiverId || !adId || !adType) return;

    getChatHistory(adType, adId, currentUserId, receiverId)
      .then(async (data) => {
        if (data.success) {
          const msgs = data.messages
            .map((m: any) => ({
              senderId:
                typeof m.from === "object"
                  ? m.from._id.toString()
                  : m.from.toString(),
              receiverId:
                typeof m.to === "object"
                  ? m.to._id.toString()
                  : m.to.toString(),
              text: m.content,
              timestamp: m.createdAt,
            }))
            .sort(
              (a: Message, b: Message) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
            );
          setMessages(msgs);

          if (
            data.messages &&
            data.messages.length > 0 &&
            data.messages[0].conversationId
          ) {
            const convId = data.messages[0].conversationId;
            setConversationId(convId);
            try {
              const markData = await markRead(currentUserId, convId);
              if (markData && markData.success) {
                window.dispatchEvent(new CustomEvent("refreshUnreadCounts"));
              }
            } catch (err) {
              console.error("Error marking messages as read:", err);
            }
          }
        }
      })
      .catch(console.error);
  }, [currentUserId, receiverId, adId, adType]);

  const requestUserStatus = () => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("getUserStatus", { userId: receiverId });
    }
  };

  // اتصال سوکت با استفاده از SOCKET_URL برگرفته از env
  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { userId: currentUserId });
      requestUserStatus();
    });

    socket.on("receiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
      window.dispatchEvent(new CustomEvent("refreshUnreadCounts"));
    });

    socket.on("typingStatus", ({ fromUserId, isTyping }: any) => {
      if (fromUserId === receiverId) setIsTyping(isTyping);
    });

    socket.on(
      "userStatus",
      ({ userId, online, lastSeen: lastSeenTime }: any) => {
        if (userId === receiverId) {
          setUserStatus(online ? "برخط" : "خاموش");
          if (!online && lastSeenTime) {
            try {
              const date = new Date(lastSeenTime);
              if (!isNaN(date.getTime())) {
                const formatted = date.toLocaleString("fa-IR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                });
                setLastSeen(formatted);
              } else {
                setLastSeen(null);
              }
            } catch {
              setLastSeen(null);
            }
          } else {
            setLastSeen(null);
          }
        }
      },
    );

    pollingIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) requestUserStatus();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      socket.disconnect();
    };
  }, [currentUserId, receiverId]);

  useEffect(() => {
    if (socketRef.current?.connected) requestUserStatus();
  }, [receiverId]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const timestamp = new Date().toISOString();
    const socketMessage: Message = {
      senderId: currentUserId,
      receiverId,
      text: inputMessage,
      timestamp,
    };

    setMessages((prev) => [...prev, socketMessage]);
    setInputMessage("");

    socketRef.current?.emit("sendMessage", socketMessage);
    sendMessage(currentUserId, receiverId, adId, adType, inputMessage).catch(
      console.error,
    );
  };

  const handleTyping = (text: string) => {
    setInputMessage(text);
    socketRef.current?.emit("typing", {
      toUserId: receiverId,
      isTyping: !!text,
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("typing", {
        toUserId: receiverId,
        isTyping: false,
      });
    }, 2000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const displayTitle =
    propAdTitle || fetchedTitle || (adFetchError ? "آگهی" : "");
  const goBack = () => router.back();

  const statusText =
    userStatus === "در حال بارگیری..."
      ? `در حال بارگیری...${displayTitle ? ` - ${displayTitle}` : ""}`
      : userStatus === "برخط"
        ? `برخط - ${displayTitle}`
        : `خاموش${lastSeen ? ` (آخرین بازدید: ${lastSeen})` : " (آخرین بازدید نامشخص)"}${displayTitle ? ` - ${displayTitle}` : ""}`;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden rounded-xl shadow-lg">
      <div className="hidden md:block my-[1vh] bg-white ">
        <TopBar />
      </div>

      <div
        className="relative z-[10000] flex items-center justify-between px-4 py-3 backdrop-blur-[15px] bg-white/30 rounded-t-xl mx-[0.5]"
        style={{
          borderBottom: "1px solid #143A6233",
          boxShadow: "0px 1px 6px 0px #00000026",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white/50">
            <Image
              src="/images/default_avatar.svg"
              alt="آواتار گیرنده"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23143A62'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="text-sm font-medium text-gray-800">{statusText}</div>
        </div>

        <div className="flex items-center gap-2">
          <ReportDropdown
            targetId={conversationId || adId}
            reportType="chat"
            iconSrc="/images/report_chat.svg"
            placement="chat"
          />
          <button
            onClick={goBack}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 hover:opacity-80"
            style={{
              background: "#143A6233",
              boxShadow: "0px 0px 5px 0px #00000026",
            }}
            aria-label="بازگشت"
          >
            <Image
              src="/images/chat_arrow.svg"
              alt="بازگشت"
              width={6}
              height={6}
              className="cursor-pointer"
            />
          </button>
        </div>
      </div>

      {/* بخش پیام‌ها با پس‌زمینه ثابت */}
      <div
        className="flex-1 overflow-y-auto relative mx-[0.5]"
        style={{
          backgroundImage: "url('/images/bg_support_ticket.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 mx-[0.5vh] my-2 space-y-3">
          {messages.map((msg, idx) => {
            const isCurrentUser = msg.senderId === currentUserId;
            return (
              <div
                key={idx}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                {isCurrentUser ? (
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <div
                      className="px-4 py-3 rounded-xl text-sm md:text-base break-all"
                      style={{
                        background: "#FFFFFF80",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0px 1px 8px 0px #00000026",
                        color: "#143A62",
                      }}
                    >
                      {msg.text}
                    </div>
                    <Image
                      src="/images/sender_arrow.svg"
                      alt=""
                      width={34}
                      height={34}
                      className="flex-shrink-0"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <Image
                      src="/images/recevier_arrow.svg"
                      alt=""
                      width={34}
                      height={34}
                      className="flex-shrink-0"
                    />
                    <div
                      className="px-4 py-3 rounded-xl text-sm md:text-base break-all text-white"
                      style={{
                        background: "#143A6299",
                        backdropFilter: "blur(20px)",
                        boxShadow: "0px 1px 8px 0px #00000026",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {isTyping && (
        <div className="text-xs text-gray-500 px-4 pb-1">در حال تایپ است…</div>
      )}

      <div className="flex gap-2 p-3 border-t bg-white">
        <input
          value={inputMessage}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="پیام خود را وارد کنید..."
          className="flex-1 min-w-0 border rounded-full px-5 py-3 text-base outline-none focus:border-blue-400 transition-colors"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-5 py-3 rounded-full active:bg-blue-600 transition-colors font-medium"
        >
          ارسال
        </button>
      </div>
    </div>
  );
};

export default ChatMessagesContent;
