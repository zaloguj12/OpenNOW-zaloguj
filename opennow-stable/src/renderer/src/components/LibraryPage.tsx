import { Search, Gamepad2, Loader2 } from "lucide-react";
import type { JSX } from "react";
import type { GameInfo } from "@shared/gfn";
import { GameCard } from "./GameCard";

export interface LibraryPageProps {
  games: GameInfo[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPlayGame: (game: GameInfo) => void;
  isLoading: boolean;
  selectedGameId: string;
  onSelectGame: (id: string) => void;
}

export function LibraryPage({
  games,
  searchQuery,
  onSearchChange,
  onPlayGame,
  isLoading,
  selectedGameId,
  onSelectGame,
}: LibraryPageProps): JSX.Element {
  const filteredGames = searchQuery.trim()
    ? games.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : games;

  return (
    <div className="home-page">
      {/* Toolbar: reuse home-toolbar classes so layout is identical to catalog */}
      <header className="home-toolbar">
        <div className="home-search">
          <Search className="home-search-icon" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your library..."
            className="home-search-input"
          />
        </div>

        <span className="home-count">{games.length} game{games.length !== 1 ? "s" : ""}</span>
      </header>

      {/* Game grid: reuse home-grid-area so scroll/overflow behaviour is identical */}
      <div className="home-grid-area">
        {isLoading ? (
          <div className="home-empty-state">
            <Loader2 className="home-spinner" size={36} />
            <p>Loading your library...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="home-empty-state">
            <Gamepad2 className="home-empty-icon" size={44} />
            <h3>Your library is empty</h3>
            <p>Games you own will appear here. Browse the catalog to find games.</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="home-empty-state">
            <Search className="home-empty-icon" size={44} />
            <h3>No results</h3>
            <p>No games match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        ) : (
          <div className="game-grid">
            {filteredGames.map((game, index) => (
              <GameCard
                key={`${game.id}-${index}`}
                game={game}
                isSelected={game.id === selectedGameId}
                onSelect={() => onSelectGame(game.id)}
                onPlay={() => onPlayGame(game)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
