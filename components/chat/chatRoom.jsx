"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUser } from "@/context/UserContext";
import { IoChevronBackSharp } from "react-icons/io5";

export default function ChatRoom({ roomId, chatRoomType, roomName, onLeave }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useUser();

  const myDisplayName = (user?.nickname?.trim() || user?.name?.trim()) ?? "알 수 없음";
  const stompClient = useRef(null);
  const subscription = useRef(null);
  const messageBoxRef = useRef(null);

  const createDisplayText = (body) => {
    const nickname = (body.sender?.nickname?.trim() || body.sender?.name?.trim()) || "알 수 없음";
    const time = new Date(body.createdAt).toLocaleTimeString();
    const text = body.messageText;
    const type = body.messageType; // "TALK", "ENTER", "LEAVE"
    return { nickname, time, text, type };
  };

  useEffect(() => {
    messageBoxRef.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (stompClient.current) return;

    const socket = new SockJS("https://studypod.click/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const topic = `/topic/chat/room/${roomId}`;

        if (!subscription.current) {
          subscription.current = client.subscribe(topic, (message) => {
            try {
              const body = JSON.parse(message.body);
              const parsed = createDisplayText(body);
              setMessages((prev) => [...prev, parsed]);
            } catch (error) {
              console.error("메시지 파싱 오류:", error);
            }
          });
        }

        client.publish({
          destination: "/app/chat/message",
          body: JSON.stringify({
            messageType: "ENTER",
            chatRoom: { id: roomId },
            sender: { nickname: myDisplayName },
          }),
        });
      },
      onStompError: (frame) => console.error("STOMP 오류:", frame),
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current?.connected) {
        client.publish({
          destination: "/app/chat/message",
          body: JSON.stringify({
            messageType: "LEAVE",
            chatRoom: { id: roomId },
            sender: { nickname: myDisplayName },
          }),
        });
        subscription.current?.unsubscribe();
        subscription.current = null;
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, [roomId, chatRoomType, myDisplayName]);

  const sendMessage = () => {
    if (!messageText.trim() || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({
        messageType: "TALK",
        chatRoom: { id: roomId },
        messageText,
        sender: { nickname: myDisplayName },
      }),
    });
    setMessageText("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-200">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-2">
          <button onClick={onLeave} className="text-gray-700 hover:text-black">
            <IoChevronBackSharp size={20} />
          </button>
          <span className="font-semibold text-gray-800 text-sm truncate">{roomName}</span>
        </div>
      </div>

      {/* 메시지 박스 */}
      <div
        ref={messageBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#C9D6E0]"
      >
        {messages.map((msg, i) => {
          if (msg.type === "ENTER" || msg.type === "LEAVE") {
            return (
              <div key={i} className="flex justify-center">
                <div className="bg-gray-400 bg-opacity-30 text-xs px-3 py-1 rounded text-gray-700">
                  {msg.nickname}님이 {msg.type === "ENTER" ? "입장" : "퇴장"}하셨습니다.
                </div>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`flex ${msg.nickname === myDisplayName ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-sm whitespace-pre-line
                ${msg.nickname === myDisplayName ? "bg-yellow-300 text-right" : "bg-white"}`}
              >
                {msg.nickname !== myDisplayName && (
                  <div className="font-semibold text-xs text-gray-600 mb-1">{msg.nickname}</div>
                )}
                <div>{msg.text}</div>
                <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 메시지 입력창 */}
      <div className="p-2 bg-white flex items-center gap-2 border-t">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow h-10 px-3 rounded border text-sm"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          전송
        </button>
      </div>
    </div>
  );
}
