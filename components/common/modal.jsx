import { useEffect } from "react";

export default function Modal({ title, onClose, children }) {
  const preventOffModal = (event) => event.stopPropagation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 flex justify-center items-center bg-gray-500/50 z-50"
    >
      <div
        onClick={preventOffModal}
        className="bg-white w-11/12 max-w-5xl p-5 rounded-md shadow-xl"
      >
        <div className="text-lg font-semibold text-gray-800 mb-4">{title}</div>
        {children}
      </div>
    </div>
  );
}
