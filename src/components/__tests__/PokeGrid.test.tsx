import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PokeGrid from '../../pages/PokeGrid';

const mockPokemons = {
  count: 1,
  results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
};

const mockSpecies = {
  flavor_text_entries: [
    { flavor_text: 'Electric mouse.', language: { name: 'en' } },
  ],
};

global.fetch = vi.fn((url) => {
  if (url.includes('pokemon-species')) {
    return Promise.resolve({
      json: () => Promise.resolve(mockSpecies),
    });
  }
  if (url.includes('pokemon?limit=')) {
    return Promise.resolve({
      json: () => Promise.resolve(mockPokemons),
    });
  }
  return Promise.resolve({
    json: () => Promise.resolve({}),
  });
}) as any;

test('renders grid and shows Pokémon', async () => {
  render(
    <BrowserRouter>
      <PokeGrid />
    </BrowserRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/Electric mouse./i)).toBeInTheDocument();
  });
});
