import Navbar from "@/app/components/Navbar";
import Link from 'next/link';

const posts = [
  { id: 1, date: '2023-08-09', title: '첫 번째 게시글', views: 123 },
  // 더 많은 게시글을 여기에 추가
];

export default function Board() {
  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar/>
      <h1>게시글 관리 페이지입니다!</h1>
      <h1 className="text-2xl font-bold mb-4">게시판</h1>
      
      <table className="w-full border border-gray-300 mb-5 border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">번호</th>
            <th className="border p-2">날짜</th>
            <th className="border p-2">제목</th>
            <th className="border p-2">조회수</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="border p-2 text-center">{post.id}</td>
              <td className="border p-2 text-center">{post.date}</td>
              <td className="border p-2 text-left">
                <Link href={`#`} className="text-blue-600 hover:underline">
                  {post.title}
                </Link>
              </td>
              <td className="border p-2 text-center">{post.views}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center space-x-2">
        <Link href="#" className="inline-block px-3 py-1 border rounded font-bold hover:bg-gray-200">이전</Link>
        <Link href="#" className="inline-block px-3 py-1 border bg-gray-100 rounded hover:bg-gray-200">1</Link>
        <Link href="#" className="inline-block px-3 py-1 border bg-gray-100 rounded hover:bg-gray-200">2</Link>
        <Link href="#" className="inline-block px-3 py-1 border bg-gray-100 rounded hover:bg-gray-200">3</Link>
        <Link href="#" className="inline-block px-3 py-1 border rounded font-bold hover:bg-gray-200">다음</Link>
      </div>
    </div>
  );
}