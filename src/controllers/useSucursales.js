import { useState } from 'react';
import { fetchSucursalesFromAPI } from '../models/api';

const fallbackSucursales = [
  { nombre: "Arica y Parinacota - Arica", direccion: "San Marcos 261, Arica", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-18.478", lon: "-70.318" },
  { nombre: "Arica y Parinacota - Putre", direccion: "José Miguel Carrera 350, Putre", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-18.196", lon: "-69.560" },
  { nombre: "Tarapacá - Iquique", direccion: "Sotomayor s/n, Iquique", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-20.213", lon: "-70.150" },
  { nombre: "Valparaíso - Viña del Mar", direccion: "Plaza Sucre s/n, Viña del Mar", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-33.024", lon: "-71.551" },
  { nombre: "Región Metropolitana - Providencia", direccion: "Av. Providencia 1234, Providencia", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-33.431", lon: "-70.618" },
  { nombre: "Región Metropolitana - Maipú", direccion: "Av. 5 de Abril 3340, Maipú", horario: "Lunes a Viernes 08:30 - 19:00", lat: "-33.510", lon: "-70.760" },
  { nombre: "Región Metropolitana - Santiago Centro", direccion: "Huérfanos 1570, Santiago", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-33.440", lon: "-70.658" },
  { nombre: "Región Metropolitana - Las Condes", direccion: "Apoquindo 3400, Las Condes", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-33.415", lon: "-70.589" },
  { nombre: "Biobío - Concepción", direccion: "Chacabuco 1000, Concepción", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-36.827", lon: "-73.050" },
  { nombre: "Araucanía - Temuco", direccion: "Claro Solar 875, Temuco", horario: "Lunes a Viernes 08:30 - 14:00", lat: "-38.740", lon: "-72.590" }
];

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
        throw new Error("No data");
      }
    } catch (error) {
      console.log("Using fallback search for:", searchQuery);
      const fallback = fallbackSucursales.filter(s => 
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.direccion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(fallback);
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
