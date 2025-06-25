"use client";

import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useUser } from "@/context/UserContext";

const styles = {
  container: {
    minHeight: "100vh",
    width: "100vw",
    boxSizing: "border-box",
    fontFamily: "Nanum Gothic",
    backgroundColor: "#deb887",
    margin: 0,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  headerInput: {
    width: "calc(100% - 70px)",
    height: 40,
    padding: "11px",
    marginBottom: 10,
    border: "none",
    borderRadius: 8,
    backgroundColor: "#fff",
    opacity: 0.7,
  },
  leaveButton: {
    padding: "8px 16px",
    marginLeft: 8,
    border: "none",
    borderRadius: 8,
    backgroundColor: "#cd853f",
    color: "white",
    cursor: "pointer",
  },
  messageBox: {
    height: "80vh",
    maxHeight: 780,
    backgroundColor: "#fff",
    opacity: 0.7,
    borderRadius: 10,
    padding: 10,
    overflowY: "auto",
    marginBottom: 10,
  },
  messageInput: {
    width: "calc(100% - 70px)",
    padding: 11,
    marginBottom: 10,
    border: "none",
    borderRadius: 8,
    backgroundColor: "#fff",
    opacity: 0.7,
  },
  sendButton: {
    padding: "8px 16px",
    marginLeft: 8,
    border: "none",
    borderRadius: 8,
    backgroundColor: "#cd853f",
    color: "white",
    cursor: "pointer",
  },
};

export default function ChatRoom({ roomId, chatRoomType, roomName, onLeave }) {
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useUser();

  const stompClient = useRef(null);
  const subscription = useRef(null);
  const messageBoxRef = useRef(null);

  // 메시지 표시 텍스트 생성 함수
  const createDisplayText = (body) => {
    console.log("message body:", body);
    const nickname = body.sender?.nickname || "알 수 없음";
    const time = new Date(body.createdAt).toLocaleTimeString();

    switch (body.messageText) {
      case "ENTER":
        return `${nickname}님이 입장하셨습니다.`;
      case "LEAVE":
        return `${nickname}님이 퇴장하셨습니다.`;
      case "TALK":
      default:
        return `${nickname}: ${body.messageText} (${time})`;
    }
  };

  // 메시지 목록이 업데이트 될 때마다 스크롤을 최하단으로 이동
  useEffect(() => {
    messageBoxRef.current?.scrollTo({
      top: messageBoxRef.current.scrollHeight,
      behavior: "smooth",
    });

    console.log("message 상태:", messages);
  }, [messages]);

  /* const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };*/

  // 웹소켓 연결 및 구독
  useEffect(() => {
    if (stompClient.current) {
      console.log("이미 연결된 stompClient 존재. 중복 연결 방지.");
      return;
    }

    const socket = new SockJS("http://localhost:8080/ws");

    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP 연결 성공");

        // chatRoomType에 따라 구독 토픽 설정
        const topic = `/topic/chat/room/${roomId}`;

        // 채팅방 구독
        if (!subscription.current) {
          subscription.current = client.subscribe(topic, (message) => {
            console.log("메시지 수신 시도됨");
            console.log("raw message.body:", message.body);
            try {
              console.log("raw message.body:", message.body);
              const body = JSON.parse(message.body);
              console.log("parsed body:", body);
              const displayText = createDisplayText(body);
              console.log("displayText:", displayText);
              setMessages((prev) => [...prev, displayText]);
            } catch (error) {
              console.error("메시지 파싱 오류:", error);
            }
          });
        }

        // 입장 메시지  전송
        client.publish({
          destination: "/app/chat/message",
          body: JSON.stringify({
            messageType: "ENTER",
            chatRoom: { id: roomId },
            sender: { nickname: user.nickname },
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

  //메시지 전송 함수
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
    console.log("메시지 전송 요청 보냄:", messageText);
    setMessageText("");
  };

  // 웹소켓 연결 및 구독
  //
  return (
<<<<<<< HEAD
    <div
      style={{
        fontFamily: "Nanum Gothic",
        backgroundColor: "#deb887",
        margin: 0,
        padding: "20px",
      }}
    >
=======
    <div style={styles.container}>
>>>>>>> a6f0c72 (chatRoom 오류 수정)
      <div
      //style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}
      >
        <input style={styles.headerInput} value={roomName} readOnly />
        <button style={styles.leaveButton} onClick={onLeave}>
          퇴장
        </button>
        <div ref={messageBoxRef} style={styles.messageBox}>
          {messages.map((msg, i) => (
            <p key={i}>{msg}</p>
          ))}
        </div>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          style={styles.messageInput}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
}
