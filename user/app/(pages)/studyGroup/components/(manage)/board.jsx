"use client";
import { useState } from "react";

const initialPosts = [
  { id: 1, date: '2023-08-09', title: '첫 번째 게시글', views: 123, content: '가나다라마바사' },
  { id: 2, date: '2023-08-09', title: '두 번째 게시글', views: 50, content: '내용입니다~' },
  { id: 3, date: '2023-08-09', title: '세 번째 게시글', views: 77, content: '더미 텍스트' },
];

export default function Board({study}) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };
  
  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleDelete = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setPosts(posts.filter((post) => post.id !== id));
      // 모달이 열려 있고 해당 게시글을 삭제한 경우 닫기
      if (selectedPost?.id === id) {
        handleCloseModal();
      }
    }
  };

  return (
    <div>
      <table className="w-full border border-gray-300 mb-5 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">번호</th>
            <th className="border p-2">날짜</th>
            <th className="border p-2">제목</th>
            <th className="border p-2">조회수</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="border p-2 text-center">{post.id}</td>
              <td className="border p-2 text-center">{post.date}</td>
              <td className="border p-2 text-left">
                <button
                  onClick={() => handleOpenModal(post)}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </button>
              </td>
              <td className="border p-2 text-center">{post.views}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center space-x-2">
        <button className="px-3 py-1 border rounded font-bold hover:bg-gray-200">이전</button>
        <button className="px-3 py-1 border bg-gray-100 rounded hover:bg-gray-200">1</button>
        <button className="px-3 py-1 border bg-gray-100 rounded hover:bg-gray-200">2</button>
        <button className="px-3 py-1 border bg-gray-100 rounded hover:bg-gray-200">3</button>
        <button className="px-3 py-1 border rounded font-bold hover:bg-gray-200">다음</button>
      </div>

      {/* 모달 */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded shadow-md max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedPost.title}</h2>
            <p className="mb-4">{selectedPost.content}</p>
            <button
              onClick={handleCloseModal}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}