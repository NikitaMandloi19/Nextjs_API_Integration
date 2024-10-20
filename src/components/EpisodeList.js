import { useState, useEffect } from 'react';

export default function EpisodeList({ onEpisodeClick }) {
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState(null); 

  useEffect(() => {
    fetch('https://rickandmortyapi.com/api/episode')
      .then((res) => res.json())
      .then((data) => setEpisodes(data.results));
  }, []);

  const handleShowAllClick = () => {
    setSelectedEpisodeId(null);
    onEpisodeClick(null); 
  };

  const handleEpisodeClick = (episodeId) => {
    setSelectedEpisodeId(episodeId); 
    onEpisodeClick(episodeId); 
  };

  return (
    <div className="w-64 bg-gray-800 p-4 rounded-md shadow-md">
      <h2 className="text-white text-lg font-semibold mb-2">Episodes</h2>
      <ul>
        <li>
          <button
            className={`p-2 block w-full text-left text-white rounded-md ${
              selectedEpisodeId === null ? 'bg-blue-500' : 'opacity-50'
            } hover:bg-blue-600 transition duration-200`} 
            onClick={handleShowAllClick} 
          >
            Show All Characters
          </button>
        </li>

        {episodes.map((episode) => (
          <li key={episode.id}>
            <button
              className={`text-white p-2 block w-full text-left rounded-md ${
                episode.id === selectedEpisodeId ? 'bg-blue-500' : 'opacity-50'
              } hover:bg-blue-600 transition duration-200`}
              onClick={() => handleEpisodeClick(episode.id)}
            >
              {episode.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
