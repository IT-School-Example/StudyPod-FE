"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUser } from "@/context/UserContext";

export default function ChatRoom({ roomId, chatRoomType, roomName, onLeave }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useUser();

  const stompClient = useRef(null);
  const subscription = useRef(null);
  const messageBoxRef = useRef(null);

  const createDisplayText = (body) => {
    const nickname = body.sender?.nickname || "알 수 없음";
    const time = new Date(body.createdAt).toLocaleTimeString();

    switch (body.messageText) {
      case "ENTER":
        return `${nickname}님이 입장하셨습니다.`;
      case "LEAVE":
        return `${nickname}님이 퇴장하셨습니다.`;
      default:
        return `${nickname}: ${body.messageText} (${time})`;
    }
  };

  useEffect(() => {
    messageBoxRef.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (stompClient.current) return;

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        const topic = `/topic/chat/room/${roomId}`;

        if (!subscription.current) {
          subscription.current = client.subscribe(topic, (message) => {
            try {
              const body = JSON.parse(message.body);
              const displayText = createDisplayText(body);
              setMessages((prev) => [...prev, displayText]);
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
            sender: { nickname: user.nickname },
          }),
        });
      },
      onStompError: (frame) => console.error("STOMP 오류:", frame),
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (stompClient.current?.connected) {
        stompClient.current.publish({
          destination: "/app/chat/message",
          body: JSON.stringify({
            messageType: "LEAVE",
            chatRoom: { id: roomId },
            sender: { nickname: user.nickname },
          }),
        });
        subscription.current?.unsubscribe();
        subscription.current = null;
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, [roomId, chatRoomType, user.nickname]);

  const sendMessage = () => {
    if (!messageText.trim() || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({
        messageType: "TALK",
        chatRoom: { id: roomId },
        messageText,
        sender: { nickname: user.nickname },
      }),
    });
    setMessageText("");
  };

  return (
    <div className="w-full h-full flex flex-col p-4 bg-amber-100 text-sm">
      <div className="flex items-center mb-2">
        <input
          className="flex-grow h-10 px-3 rounded bg-white opacity-70"
          value={roomName}
          readOnly
        />
        <button
          onClick={onLeave}
          className="ml-2 px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700"
        >
          퇴장
        </button>
      </div>

      <div
        ref={messageBoxRef}
        className="flex-1 bg-white opacity-70 rounded p-2 overflow-y-auto mb-2"
      >
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow h-10 px-3 rounded bg-white opacity-70"
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 rounded bg-orange-600 text-white hover:bg-orange-700"
        >
          전송
        </button>
      </div>
    </div>
  );
}