export default function IntroSideCard({ studyTitle, introduce }) {
  return (
    <div className="w-full border rounded-lg shadow p-4 bg-white hover:bg-gray-50 transition">
      <h2 className="text-lg font-bold mb-2 text-gray-900">{studyTitle}</h2>
      <p className="text-gray-700">{introduce}</p>
    </div>
  );
}
