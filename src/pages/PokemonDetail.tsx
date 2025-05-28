import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const typeColors: { [key: string]: string } = {
    normal: "bg-gray-400 text-black",
    fire: "bg-red-500 text-white",
    water: "bg-blue-500 text-white",
    electric: "bg-yellow-400 text-black",
    grass: "bg-green-500 text-white",
    ice: "bg-blue-200 text-black",
    fighting: "bg-red-700 text-white",
    poison: "bg-purple-600 text-white",
    ground: "bg-yellow-700 text-white",
    flying: "bg-indigo-300 text-black",
    psychic: "bg-pink-500 text-white",
    bug: "bg-lime-500 text-black",
    rock: "bg-yellow-800 text-white",
    ghost: "bg-indigo-800 text-white",
    dragon: "bg-purple-800 text-white",
    dark: "bg-gray-800 text-white",
    steel: "bg-gray-500 text-white",
    fairy: "bg-pink-300 text-black",
  };
  

interface PokemonType {
  type: {
    name: string;
  };
}

interface PokemonData {
    id: number;
    name: string;
    weight: number;
    height: number;
    sprites: {
      front_default: string;
    };
    types: PokemonType[];
}
  

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface PokemonSpeciesData {
  flavor_text_entries: FlavorTextEntry[];
}

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [species, setSpecies] = useState<PokemonSpeciesData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data: PokemonData = await res.json();
      setPokemon(data);

      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      const speciesData: PokemonSpeciesData = await speciesRes.json();
      setSpecies(speciesData);
    };

    fetchData();
  }, [name]);

  if (!pokemon || !species) return <div className="p-6">Loading...</div>;

  const flavor = species.flavor_text_entries.find((entry) => entry.language.name === "en");

  return (
    <div className="min-h-screen w-screen p-6 bg-gray-800">
      <Link to="/pokegrid" className="text-gray-600 underline mb-4 inline-block">← Back to list</Link>
      <div className="bg-gray-900 rounded-lg shadow p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold capitalize text-center mb-4">#{pokemon.id} {pokemon.name}</h1>
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="mx-auto mb-4 w-32 h-32"
        />
        <div className="flex flex-wrap justify-center gap-2 mb-4">
            {pokemon.types.map((t) => (
                <span
                key={t.type.name}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    typeColors[t.type.name] || "bg-gray-300 text-black"
                }`}
                >
                {t.type.name}
                </span>
            ))}
        </div>
        <div className="text-sm text-gray-700 mb-2">
            <strong>Height:</strong> {pokemon.height / 10} m
        </div>

        <div className="text-sm text-gray-700 mb-4">
            <strong>Weight:</strong> {pokemon.weight / 10} kg
        </div>
        <p className="text-gray-600">{flavor?.flavor_text.replace(/\f/g, ' ')}</p>
        
      </div>
    </div>

    
  );
}
