"use client";
import { useState, useEffect } from "react";

const categoryMap = {
  NOTICE: "공지",
  FREE: "자유",
};

export default function Board({ study }) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/study-boards/study-groups/${study.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("게시글 목록 조회 실패");
        const data = await res.json();
        setPosts(data.data);
      } catch (err) {
        console.error("게시글 조회 오류:", err);
      }
    };

    if (study?.id) fetchPosts();
  }, [study.id]);

  const handleOpenModal = (post) => setSelectedPost(post);
  const handleCloseModal = () => setSelectedPost(null);

  const handleDelete = async (id) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/study-boards/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("삭제 요청 실패");

      // 삭제 성공 시 프론트 상태에서도 제거
      const updated = posts.filter((post) => post.id !== id);
      setPosts(updated);
      if (selectedPost?.id === id) handleCloseModal();
      alert("게시글이 삭제되었습니다.");
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("삭제에 실패했습니다.");
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
            <tr key={post.id} className="hover:bg-gray-100 border-b text-center">
              <td className="p-2">{post.id}</td>
              <td className="p-2">{categoryMap[post.studyBoardCategory] || post.studyBoardCategory}</td>
              <td className="p-2">{post.createdAt?.split("T")[0]}</td>
              <td className="p-2 text-left">
                <button
                  onClick={() => handleOpenModal(post)}
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </button>
              </td>
              <td className="p-2">{post.viewCount ?? 0}</td>
              <td className="p-2">
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
              분류:{" "}
              <span className="font-semibold">
                {categoryMap[selectedPost.studyBoardCategory] || selectedPost.studyBoardCategory}
              </span>
            </div>

            <p className="mb-4 whitespace-pre-wrap">{selectedPost.content}</p>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">댓글</h3>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPost.comments?.map((c) => (
                  <li key={c.id}>{c.content}</li>
                )) ?? <li>댓글이 없습니다.</li>}
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
