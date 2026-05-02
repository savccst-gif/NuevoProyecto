export const fetchSucursalesFromAPI = async (query) => {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=Registro+Civil+${encodeURIComponent(query)}+Chile&format=json&addressdetails=1&limit=10`);
  return await response.json();
};
