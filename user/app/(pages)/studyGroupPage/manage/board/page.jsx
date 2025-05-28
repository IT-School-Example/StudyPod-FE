import Navbar from "@/app/components/Navbar";


export default function BoardPage() {
  return (
    <div className="w-full h-full flex flex-col bg-white px-24 text-black">
      <Navbar/>
      <h1>게시글 관리 페이지입니다!</h1>
    </div>
  );
}
