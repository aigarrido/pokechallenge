import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PokemonDetail from '../../pages/PokemonDetail';

// Mock fetch
global.fetch = vi.fn((url) => {
  if (url.includes('pokemon-species')) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          flavor_text_entries: [
            {
              flavor_text: 'A test description',
              language: { name: 'en' },
            },
          ],
        }),
    });
  }
  return Promise.resolve({
    json: () =>
      Promise.resolve({
        name: 'pikachu',
        sprites: { front_default: 'pikachu.png' },
        types: [{ type: { name: 'electric' } }],
      }),
  });
}) as any;

test('renders Pokémon detail with mock data', async () => {
  render(
    <MemoryRouter initialEntries={['/pokemon/pikachu']}>
      <Routes>
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
    expect(screen.getByText(/electric/i)).toBeInTheDocument();
    expect(screen.getByText(/A test description/i)).toBeInTheDocument();
  });
});
