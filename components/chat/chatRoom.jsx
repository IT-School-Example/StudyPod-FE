"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function ChatRoom({ roomId, chatRoomType, roomName, onLeave }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);

  const stompClient = useRef(null);
  const subscription = useRef(null);
  const messageBoxRef = useRef(null);

  // 메시지 목록이 업데이트 될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    messageBoxRef.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  /* const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };*/

  // 웹소켓 연결 및 구독
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP 연결 성공");

        // chatRoomType에 따라 구독 토픽 설정
        const topic =
          chatRoomType === "DIRECT"
            ? `/topic/chat/direct/${roomID}`
            : `/topic/chat/group/${roomId}`;

        // 채팅방 구독
        subscription.current = client.subscribe(topic, (message) => {
          const body = JSON.parse(message.body);
          const nickname = body.sender?.nickname || "알 수 없음";
          const time = new Date(body.createdAt).toLocaleTimeString();

          let displayText = "";

          if (body.messageType === "ENTER") {
            displayText = `${nickname}님이 입장하셨습니다.`;
          } else if (body.messageType === "LEAVE") {
            displayText = `${nickname}님이 퇴장하셨습니다.`;
          } else {
            displayText = `${nickname}: ${body.messageText} (${time})`;
          }

          setMessages((prev) => [...prev, displayText]);
        });

        // 입장 메시지  전송
        client.publish({
          destination: "/app/chat/message",
          body: JSON.stringify({
            messageType: "ENTER",
            chatRoom: { id: roomId },
          }),
        });

        setMessageText(""); // 메시지 전송 후 입력창 비우기
      },
      onStompError: (frame) => {
        console.error("STOMP 오류:", frame);
      },

      debug: (str) => {
        console.log(str);
      },
    });

    client.activate();
    stompClient.current = client;

    // 컴포넌트 언마운트 시 정리 함수 (퇴장 메시지 전송 및 연결 해제)
    return () => {
      if (stompClient.current?.connected) {
        //퇴장 메시지 전송
        stompClient.current.publish({
          destination: "/app/chat/message",
          body: JSON.stringify({
            messageType: "LEAVE",
            chatRoom: { id: roomId },
          }),
        });
        subscription.current?.unsubscribe();
        stompClient.current.disconnect();
      }
    };
  }, [roomId, chatRoomType]);

  //메시지 전송 함수수
  const sendMessage = () => {
    if (!messageText || !stompClient.current?.connected) return;

    stompClient.current.publish({
      destination: "/app/chat/message",
      body: JSON.stringify({
        messageType: "TALK",
        chatRoom: { id: roomId },
        messageText,
      }),
    });
    console.log("메시지 전송 요청 보냄:", messageText);
    setMessageText("");
  };

  // 웹소켓 연결 및 구독
  return (
    <div
      style={{
        fontFamily: "Nanum Gothic",
        backgroundColor: "#deb887",
        margin: 0,
        padding: "20px",
      }}
    >
      <div
      //style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
      >
        <input
          style={{
            width: "calc(100% - 70px)",
            height: "40px",
            padding: "11px",
            marginBottom: "10px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#fff",
            opacity: "0.7",
          }}
        >
          {roomName}
        </input>
        <button
          onClick={onLeave}
          style={{
            padding: "8px 16px",
            marginLeft: "8px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#cd853f",
            color: "white",
            cursor: "pointer",
          }}
        >
          퇴장
        </button>
        <div
          ref={messageBoxRef}
          style={{
            height: "80vh",
            maxHeight: "780px",
            backgroundColor: "#fff",
            opacity: "0.7",
            borderRadius: "10px",
            padding: "10px",
            overflowY: "auto",
            //border: "1px solid #ddd",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="메시지를 입력하세요"
          style={{
            width: "calc(100% - 70px)",
            padding: "11px",
            marginBottom: "10px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#fff",
            opacity: "0.7",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 16px",
            marginLeft: "8px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#cd853f",
            color: "white",
            cursor: "pointer",
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
}
