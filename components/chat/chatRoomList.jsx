"use client";

export default function ChatRoomList({ rooms, currentRoomId, onSelectRoom }) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-3">채팅방 목록</h3>
      <ul className="space-y-1">
        {rooms.length === 0 && (
          <li className="text-gray-500">채팅방이 없습니다.</li>
        )}
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            className={`cursor-pointer px-4 py-2 rounded-md transition select-none
              ${
                currentRoomId === room.id
                  ? "bg-gray-300 font-semibold"
                  : "hover:bg-gray-100"
              }`}
          >
            <div className="flex justify-between items-center">
              <span>{room.name}</span>
              <span className="text-sm text-gray-600">
                [{room.type === "DIRECT" ? "1:1" : "그룹"}]
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
