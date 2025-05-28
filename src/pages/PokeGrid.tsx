import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Pokemon {
    name: string;
    url: string;
    description?: string;
}

interface FlavorTextEntry {
    flavor_text: string;
    language: {
      name: string;
    };
}


const POKEMONS_PER_PAGE = 30;

export default function PokeGrid() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [totalPokemons, setTotalPokemons] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const getIdFromUrl = (url: string) => {
        const parts = url.split("/").filter(Boolean);
        return parts[parts.length - 1];
    };
    
    const fetchPokemons = async (page: number) => {
        setLoading(true);
        try {
          const offset = page * POKEMONS_PER_PAGE;
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${POKEMONS_PER_PAGE}&offset=${offset}`);
          const data = await res.json();
      
          const pokemonWithDescriptions = await Promise.all(
            data.results.map(async (pokemon: Pokemon) => {
              try {
                const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
                const speciesData = await speciesRes.json();
                const englishEntry = (speciesData.flavor_text_entries as FlavorTextEntry[]).find(
                  (entry) => entry.language.name === "en"
                );
                return {
                  ...pokemon,
                  description: englishEntry ? englishEntry.flavor_text.replace(/\f/g, " ") : "No description found.",
                };
              } catch (err: unknown) {
                console.error("Error fetching species:", err);
                return { ...pokemon, description: "Failed to load description." };
              }
            })
          );
      
          setPokemons(pokemonWithDescriptions);
          setTotalPokemons(data.count);
        } catch (err: unknown) {
          console.error("Error loading Pokémon:", err);
        } finally {
          setLoading(false);
        }
      };

    const [allPokemonNames, setAllPokemonNames] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const [favorites, setFavorites] = useState<string[]>([]);
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);





    useEffect(() => {
        fetchPokemons(currentPage);
    }, [currentPage]);

    useEffect(() => {
        const fetchAllPokemonNames = async () => {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`);
          const data = await res.json();
          const names = data.results.map((p: { name: string }) => p.name);
          setAllPokemonNames(names);
        };
      
        fetchAllPokemonNames();
    }, []);
    
    const totalPages = Math.ceil(totalPokemons / POKEMONS_PER_PAGE);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.toLowerCase();
        setSearchTerm(input);
      
        if (input.length === 0) {
          setSuggestions([]);
          return;
        }
      
        const filtered = allPokemonNames
          .filter((name) => name.toLowerCase().includes(input))
          .slice(0, 10); // show top 10 matches
      
        setSuggestions(filtered);
    };


    useEffect(() => {
        const stored = localStorage.getItem("favorites");
        if (stored) {
            setFavorites(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (name: string) => {
        setFavorites((prev) =>
          prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
        );
    };
    
    const displayedPokemons = showOnlyFavorites
        ? pokemons.filter((p) => favorites.includes(p.name))
        : pokemons;
      
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300); // Show after 300px
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    
      

    return (
        <div className="min-h-screen bg-gray-800 p-6">
            <button
                onClick={() => navigate('/')}
                className="px-4 py-8 bg-gray-800 hover:bg-gray-400 rounded">
                Back to Main
            </button>
            <h1 className="text-3xl font-bold text-center mb-6">PokeGrid</h1>

            <div className="relative w-full max-w-md mb-6">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border border-gray-500 rounded"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-gray-800 border border-gray-200 mt-1 rounded shadow">
                    {suggestions.map((name) => (
                        <li
                        key={name}
                        onClick={() => {
                            navigate(`/pokemon/${name}`);
                            setSearchTerm("");
                            setSuggestions([]);
                        }}
                        className="px-4 py-2 hover:bg-gray-900 cursor-pointer capitalize"
                        >
                        {name}
                        </li>
                    ))}
                    </ul>
                )}
            </div>


            <button
                onClick={() => setShowOnlyFavorites((prev) => !prev)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                {showOnlyFavorites ? "Show All" : "Show Favorites Only"}
            </button>


                
            {loading ? (
                <div className="text-center text--500 font-semibold">Loading...</div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                {displayedPokemons.map((pokemon, index) => {
                        const id = getIdFromUrl(pokemon.url);
                        return (
                            <div 
                                key={index} 
                                className="relative bg-gray-900 rounded-lg shadow p-4 text-center"
                                onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                            >
                                <button
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(pokemon.name);
                                    }}
                                    className="absolute top-2 right-2 text-yellow-400 text-xl"
                                    title="Toggle Favorite"
                                >
                                    {favorites.includes(pokemon.name) ? "⭐" : "☆"}
                                </button>
                                <img
                                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                                    alt={pokemon.name}
                                    className="mx-auto w-20 h-20"
                                />
                                <h2 className="text-lg font-semibold capitalize mt-2">{pokemon.name}</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {pokemon.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
    
            {/* Pager */}
            <div className="flex justify-center mt-8 flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 rounded border ${
                    currentPage === i
                        ? "bg-gray-100 text-white font-bold"
                        : "bg-white text-gray-500 hover:bg-gray-100"
                    }`}
                >
                    {i + 1}
                </button>
                ))}
            </div>

            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
                    title="Back to Top"
                >
                    ↑ Back to top
                </button>
            )}


        </div>
    );
}