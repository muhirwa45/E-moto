
import React, { useState } from 'react';
import type { Station } from '../types';
import { SearchIcon, LocationMarkerIcon } from './Icons';

interface SearchBarProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  onRecenter: () => void;
  userLocation: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ stations, onSelectStation, onRecenter, userLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Station[]>([]);

  const runSearch = (currentQuery: string) => {
    if (currentQuery.length > 1) {
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(currentQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    runSearch(newQuery);
  };

  const handleSelect = (station: Station) => {
    // Set query to the selected station name for better user feedback
    setQuery(station.name);
    // Hide the results list
    setResults([]);
    // Trigger the selection in the parent component
    onSelectStation(station);
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[1001]">
      <div className="relative flex items-center bg-white rounded-2xl shadow-lg">
        <div className="pl-4 pr-2">
            <SearchIcon />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onBlur={() => {
            // Use a small delay to allow onMouseDown to fire before results are hidden
            setTimeout(() => {
              setResults([]);
            }, 150);
          }}
          onFocus={() => runSearch(query)} // Re-run search if input is focused again with existing text
          placeholder="Search for a battery station..."
          className="w-full py-3 pr-4 bg-transparent outline-none text-gray-700"
        />
        {userLocation && (
            <button onClick={onRecenter} className="p-3 text-gray-500 hover:text-blue-600 focus:outline-none">
                <LocationMarkerIcon />
            </button>
        )}
      </div>
      {results.length > 0 && (
        <ul className="absolute w-full mt-2 bg-white rounded-lg shadow-lg overflow-hidden">
          {results.map(station => (
            <li
              key={station.id}
              // Use onMouseDown because it fires before onBlur, solving the race condition
              onMouseDown={() => handleSelect(station)}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100"
            >
              {station.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
