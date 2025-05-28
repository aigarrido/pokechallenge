import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen grid place-items-center bg-gray-800">
      <button
        onClick={() => navigate('/pokegrid')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xl font-semibold shadow-lg"
      >
        Go to PokeGrid
      </button>
    </div>
  );
}
