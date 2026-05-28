import { useState } from 'react';
import { fetchSucursalesFromAPI } from '../models/api';

export function useSucursales() {
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    setSelectedSucursal(null);
    try {
      const data = await fetchSucursalesFromAPI(searchQuery);
      if (data && data.length > 0) {
        const mapped = data.map(item => ({
          nombre: item.name && item.name.includes("Registro") ? item.name : "Oficina Registro Civil",
          direccion: item.display_name,
          lat: item.lat,
          lon: item.lon,
          horario: "Lunes a Viernes 08:30 - 14:00"
        }));
        setResults(mapped);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching from API:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
    setSelectedSucursal(null);
  };

  return {
    selectedSucursal,
    setSelectedSucursal,
    searchQuery,
    setSearchQuery,
    results,
    loading,
    hasSearched,
    handleSearch,
    clearSearch
  };
}
