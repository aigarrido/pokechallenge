import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-white">
        {/* Background Pokémon Images */}
        
        <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png"
            alt="Gengar"
            className="absolute left-0 bottom-0 w-72 opacity-10 transform rotate-[-10deg] pointer-events-none"
        />
        <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png"
            alt="Blastoise"
            className="absolute right-0 top-0 w-72 opacity-10 transform rotate-[10deg] pointer-events-none"
        />

        <div className="flex flex-col items-center justify-center h-full relative z-10 text-center px-4">
            <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome Trainer</h1>
            <p className="text-lg text-indigo-200 mb-8 max-w-xl drop-shadow-sm">
            Dive into the world of Pokémon and collect them all
            </p>
            <button
                onClick={() => navigate('/pokegrid')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xl font-semibold shadow-lg"
            >
            Go to PokeGrid
            </button>
        </div>

    </div>
  );
}
