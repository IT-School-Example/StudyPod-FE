import React from "react";

export default function ChatRoomList({ rooms, currentRoomId, onSelectRoom }) {
  return (
    <div>
      <h3>채팅방 목록</h3>
      <ul>
        {rooms.length === 0 && <li>채팅방이 없습니다. </li>}
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            style={{
              cursor: "pointer",
              fontweight: currentRoomId === room.id ? "bold" : "normal",
              backgroundColor:
                currentRoomId === room.id ? "#d3d3d3" : "transparent",
              padding: "5px",
              margin: "3px 0",
              userSelect: "none",
            }}
          >
            {room.name} [{room.type === "DIRECT" ? "1:1" : "그룹"}]
          </li>
        ))}
      </ul>
    </div>
  );
}
