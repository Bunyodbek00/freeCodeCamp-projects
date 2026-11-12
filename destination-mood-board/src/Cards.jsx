import { useState, useEffect } from "react";

const DEFAULT_DESTINATIONS = [
  {
    id: 1,
    color: "#0288D1",
    image: "https://cdn.freecodecamp.org/curriculum/labs/pathway.jpg",
    title: "Caribbean",
    details: "Crystal-clear turquoise waters, lush tropical trails, and warm island breezes year-round.",
    isFavorite: false,
  },
  {
    id: 2,
    color: "#00897B",
    image: "https://cdn.freecodecamp.org/curriculum/labs/shore.jpg",
    title: "Gaward Beach",
    details: "Dramatic rocky coves meeting calm, sunlit coastal waters ideal for quiet seaside escapes.",
    isFavorite: false,
  },
  {
    id: 3,
    color: "#2E7D32",
    image: "https://cdn.freecodecamp.org/curriculum/labs/grass.jpg",
    title: "Cape Town",
    details: "Vibrant coastal cliffs carpeted in wildflowers overlooking the deep blue Atlantic horizon.",
    isFavorite: false,
  },
  {
    id: 4,
    color: "#EF6C00",
    image: "https://cdn.freecodecamp.org/curriculum/labs/ship.jpg",
    title: "Ship View",
    details: "Golden-hour voyages across open waters silhouetted against a glowing sunset sky.",
    isFavorite: false,
  },
  {
    id: 5,
    color: "#3949AB",
    image: "https://cdn.freecodecamp.org/curriculum/labs/santorini.jpg",
    title: "Santorini",
    details: "Iconic whitewashed architecture and cobalt-blue domes perched high above the Aegean Sea.",
    isFavorite: false,
  },
  {
    id: 6,
    color: "#C2185B",
    image: "https://cdn.freecodecamp.org/curriculum/labs/pigeon.jpg",
    title: "Istanbul",
    details: "A historic crossroads where timeless waterfronts and bustling culture meet the Bosphorus.",
    isFavorite: false,
  },
];

export function MoodBoardItem({
  color,
  image,
  title,
  details,
  isFavorite,
  isFlipped,
  isHighlighted,
  onFlip,
  onToggleFavorite,
  onDelete,
}) {
  return (
    <div
      className={`mood-board-item ${isFlipped ? "flipped" : ""} ${
        isHighlighted ? "highlighted" : ""
      }`}
      onClick={onFlip}
    >
      <div className="card-inner">
        {/* Front Face */}
        <div className="card-front" style={{ backgroundColor: color }}>
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="Delete destination"
          >
            🗑
          </button>

          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          >
            ♥
          </button>

          <img className="mood-board-image" src={image} alt={title} />
          <h3 className="mood-board-text">{title}</h3>
        </div>

        {/* Back Face */}
        <div className="card-back" style={{ backgroundColor: color }}>
          <h3 className="card-back-title">{title}</h3>
          <p className="card-back-details">{details}</p>
          <span className="card-back-hint">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}

export function MoodBoard() {
  const [destinations, setDestinations] = useState(() => {
    const saved = localStorage.getItem("moodBoardDestinations");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved destinations", e);
      }
    }
    return DEFAULT_DESTINATIONS;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("moodBoardDarkMode") === "true";
  });

  const [flippedIds, setFlippedIds] = useState({});
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newColor, setNewColor] = useState("#673AB7");

  useEffect(() => {
    localStorage.setItem("moodBoardDestinations", JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem("moodBoardDarkMode", darkMode);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const handleToggleFlip = (id) => {
    setFlippedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    if (highlightedId === id) {
      setHighlightedId(null);
    }
  };

  const handleToggleFavorite = (id) => {
    setDestinations(
      destinations.map((dest) =>
        dest.id === id ? { ...dest, isFavorite: !dest.isFavorite } : dest
      )
    );
  };

  const handleDeleteDestination = (id) => {
    setDestinations(destinations.filter((dest) => dest.id !== id));
    if (highlightedId === id) setHighlightedId(null);
  };

  const handleResetBoard = () => {
    setDestinations(DEFAULT_DESTINATIONS);
    setFlippedIds({});
    setHighlightedId(null);
    setSearchQuery("");
  };

  const handleSurpriseMe = () => {
    const pool = filteredDestinations.length > 0 ? filteredDestinations : destinations;
    if (pool.length === 0) return;

    const randomDest = pool[Math.floor(Math.random() * pool.length)];
    setHighlightedId(randomDest.id);
    setFlippedIds({ [randomDest.id]: true });
  };

  const handleAddDestination = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImage.trim()) return;

    const newDest = {
      id: Date.now(),
      color: newColor,
      image: newImage,
      title: newTitle,
      details: newDetails || "A wonderful new destination added by you!",
      isFavorite: false,
    };

    setDestinations([newDest, ...destinations]);
    setNewTitle("");
    setNewImage("");
    setNewDetails("");
    setShowForm(false);
  };

  const filteredDestinations = destinations.filter(
    (dest) =>
      dest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const favoriteCount = destinations.filter((d) => d.isFavorite).length;

  return (
    <div className={`mood-board-container ${darkMode ? "dark" : ""}`}>
      <div className="header-row">
        <h1 className="mood-board-heading">Destination Mood Board</h1>
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Control Panel */}
      <div className="controls-bar">
        <div className="wishlist-badge">
          Wishlist: <span>{favoriteCount}</span> saved
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Search destinations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="action-buttons">
          <button className="surprise-btn" onClick={handleSurpriseMe}>
            🎲 Surprise Me!
          </button>

          <button className="toggle-form-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close Form" : "+ Add Destination"}
          </button>

          <button className="reset-btn" onClick={handleResetBoard}>
            Reset Board
          </button>
        </div>
      </div>

      {/* Add New Destination Form */}
      {showForm && (
        <form className="add-destination-form" onSubmit={handleAddDestination}>
          <h3>Add Your Own Destination</h3>
          <input
            type="text"
            placeholder="Destination Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <input
            type="url"
            placeholder="Image URL (e.g., https://...)"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Short details description"
            value={newDetails}
            onChange={(e) => setNewDetails(e.target.value)}
          />
          <div className="color-picker-wrapper">
            <label>Card Color:</label>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-card-btn">
            Save to Board
          </button>
        </form>
      )}

      {/* Cards Grid */}
      <div className="mood-board">
        {filteredDestinations.length > 0 ? (
          filteredDestinations.map((item) => (
            <MoodBoardItem
              key={item.id}
              color={item.color}
              image={item.image}
              title={item.title}
              details={item.details}
              isFavorite={item.isFavorite}
              isFlipped={!!flippedIds[item.id]}
              isHighlighted={highlightedId === item.id}
              onFlip={() => handleToggleFlip(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
              onDelete={() => handleDeleteDestination(item.id)}
            />
          ))
        ) : (
          <p className="no-results">
            {destinations.length === 0
              ? 'Your board is empty. Click "Reset Board" or "+ Add Destination" to add cards!'
              : `No destinations found matching "${searchQuery}"`}
          </p>
        )}
      </div>
    </div>
  );
}