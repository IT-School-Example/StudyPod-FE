"use client";
import { useState, useEffect } from "react";

const categoryMap = {
  notice: "공지",
  free: "자유"
};

export default function Board({ study }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch("/studyBoardData.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (post) => post.study_group_detail === study.detail
        );
        setPosts(filtered);
      });
  }, [study.detail]);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
  };

  const handleDelete = (id) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const updated = posts.filter((post) => post.board_id !== id);
      setPosts(updated);
      if (selectedPost?.board_id === id) {
        handleCloseModal();
      }
    }
  };

  return (
    <div>
      <table className="w-full text-sm table-fixed">
        <thead className="border-b text-gray-700 bg-gray-50">
          <tr className="text-center">
            <th className="p-2 w-12">번호</th>
            <th className="p-2 w-20">분류</th>
            <th className="p-2 w-28">날짜</th>
            <th className="p-2 text-left">제목</th>
            <th className="p-2 w-16">조회수</th>
            <th className="p-2 w-16">관리</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.board_id} className="hover:bg-gray-100 border-b text-center">
              <td className="p-2">{post.board_id}</td>
              <td className="p-2">{categoryMap[post.category] || post.category}</td>
              <td className="p-2">{post.date}</td>
              <td className="p-2 text-left">
                <button
                  onClick={() => handleOpenModal(post)}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </button>
              </td>
              <td className="p-2">{post.views}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(post.board_id)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 모달 */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded shadow-md max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-1">{selectedPost.title}</h2>
            <div className="mb-4 text-sm text-gray-600">
              분류: <span className="font-semibold">{categoryMap[selectedPost.category] || selectedPost.category}</span>
            </div>

            <p className="mb-4 whitespace-pre-wrap">{selectedPost.content}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">댓글</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPost.comments?.map((c) => (
                  <li key={c.id}>{c.content}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
