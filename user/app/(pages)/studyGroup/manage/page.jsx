import { Suspense } from "react";
import Manage from "./(main)/manage"; // 위 컴포넌트를 import

export default function ManagePage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Manage />
    </Suspense>
  );
}
