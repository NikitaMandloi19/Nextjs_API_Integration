"use client";
import { useEffect, useState } from 'react';
import EpisodeList from '../components/EpisodeList';
import ReactPaginate from 'react-paginate';

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [currentCharacters, setCurrentCharacters] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [charactersPerPage] = useState(9);
  const [episodeId, setEpisodeId] = useState(null);

  const fetchAllCharacters = async (page) => {
    const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page + 1}`);
    const data = await res.json();
    setCharacters(data.results);
    setPageCount(data.info.pages);
    setCurrentCharacters(data.results); 
  };

  const handleEpisodeClick = async (episodeId) => {
    if (episodeId === null) {
      setEpisodeId(null);
      setCurrentPage(0); 
      await fetchAllCharacters(0); 
    } else {
      const res = await fetch(`https://rickandmortyapi.com/api/episode/${episodeId}`);
      const data = await res.json();
      const characterUrls = data.characters;
      setCharacters(characterUrls);
      setPageCount(Math.ceil(characterUrls.length / charactersPerPage));
      setCurrentPage(0);
      setEpisodeId(episodeId);
    }
  };

  useEffect(() => {
    const fetchCharacterDetails = async () => {
      if (episodeId === null) {
        await fetchAllCharacters(currentPage);
      } else {
        const offset = currentPage * charactersPerPage;
        const currentCharactersUrls = characters.slice(offset, offset + charactersPerPage);
        
        const characterData = await Promise.all(
          currentCharactersUrls.map(async (url) => {
            const res = await fetch(url);
            return res.json();
          })
        );
        setCurrentCharacters(characterData);
      }
    };

    fetchCharacterDetails();
  }, [currentPage, episodeId]); 
  const handlePageClick = (event) => {
    setCurrentPage(event.selected); 
  };

  return (
    <div className="flex">
      <EpisodeList onEpisodeClick={handleEpisodeClick} />
      <div className="p-4">
        <h1 className="text-2xl">
          {episodeId ? `Characters from Episode ${episodeId}` : "All Characters"}
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {currentCharacters.length > 0
            ? currentCharacters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))
            : characters.map((character) => (
                <CharacterCard key={character.id} character={character} />
              ))}
        </div>

        {pageCount > 1 && (
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
            activeClassName={'active'}
          />
        )}
      </div>
    </div>
  );
}

function CharacterCard({ character }) {
  return (
    <div className="p-4 bg-gray-200">
      <img src={character.image} alt={character.name} />
      <h2>{character.name}</h2>
    </div>
  );
}
