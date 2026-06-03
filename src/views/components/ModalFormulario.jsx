import React, { useState, useContext } from 'react';
import { X, CheckCircle, LogIn, ShieldCheck, MapPin, Search } from 'lucide-react';
import { CartContext } from '../../context/AppContexts';
import { useAuth } from '../../context/AuthContext';
import { fetchSucursalesFromAPI } from '../../models/api';

export function ModalFormulario({ type, onClose, onOpenOpenLogin, onOpenLogin }) {
  const { addToCart, addConfirmedItem } = useContext(CartContext);
  const { isAuthenticated, user, perfil } = useAuth();

  const isFolio = type === 'folio';
  const isCedula = type === 'Cédula de Identidad' || type === 'Renovar cédula' || type === 'Cédula';
  const title = isFolio
    ? "Agregar Trámite al Seguimiento"
    : isCedula
    ? "Cédula de Identidad"
    : `Solicitar ${type}`;

  const [cedulaOption, setCedulaOption] = useState('agendar');

  // Datos del formulario — se inicializan con el perfil si hay sesión
  const [rut, setRut] = useState(perfil?.rut || '');
  const [serie, setSerie] = useState(perfil?.numero_serie || '');
  const [email, setEmail] = useState(user?.email || '');

  // Nuevos estados para el agendamiento
  const [comuna, setComuna] = useState('Región Metropolitana - Santiago Centro');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Estados para la búsqueda de oficinas
  const [oficinaQuery, setOficinaQuery] = useState('');
  const [oficinaLoading, setOficinaLoading] = useState(false);
  const [oficinasList, setOficinasList] = useState([]);
  const [selectedOficinaObj, setSelectedOficinaObj] = useState({
    nombre: 'Región Metropolitana - Santiago Centro',
    direccion: 'Santiago Centro, Región Metropolitana, Chile'
  });

  const buscarOficinas = async () => {
    if (!oficinaQuery.trim()) return;
    setOficinaLoading(true);
    try {
      const data = await fetchSucursalesFromAPI(oficinaQuery);
      if (data && data.length > 0) {
        const mapped = data.map(item => {
          let shortName = "Oficina Registro Civil";
          if (item.name) {
            shortName = item.name.includes("Registro") ? item.name : `Registro Civil ${item.name}`;
          } else if (item.address?.suburb || item.address?.city || item.address?.town) {
            const place = item.address.suburb || item.address.city || item.address.town;
            shortName = `Registro Civil ${place}`;
          }
          return {
            nombre: shortName,
            direccion: item.display_name,
            lat: item.lat,
            lon: item.lon
          };
        });
        setOficinasList(mapped);
      } else {
        setOficinasList([]);
        alert("No se encontraron oficinas para esa búsqueda.");
      }
    } catch (error) {
      console.error("Error al buscar oficinas:", error);
      setOficinasList([]);
    } finally {
      setOficinasLoading(false);
    }
  };

  const camposLocked = isAuthenticated && !!perfil?.rut;

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isWeekend = (dateStr) => {
    if (!dateStr) return false;
    const parts = dateStr.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const day = d.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', 
    '13:00', '13:30', '14:00'
  ];

  const handleSubmit = () => {
    if (!isFolio) {
      if (isCedula && cedulaOption === 'agendar') {
        if (!rut) {
          alert("Por favor ingresa tu RUT.");
          return;
        }
        if (!selectedDate || !selectedTime) {
          alert("Por favor selecciona una fecha y una hora para agendar tu cita.");
          return;
        }
        if (isWeekend(selectedDate)) {
          alert("La institución atiende únicamente de lunes a viernes. Por favor, selecciona un día hábil.");
          return;
        }

        const nombreLugar = comuna
          .replace("Registro Civil ", "")
          .replace("Oficina Registro Civil ", "");

        addConfirmedItem({
          name: `Cita: Renovación Cédula (${nombreLugar})`,
          type: "Visita Agendada",
          price: 0,
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
          date: `Fecha: ${selectedDate} a las ${selectedTime} hrs`,
          selectedDate: selectedDate,
          selectedTime: selectedTime,
          comuna: comuna,
          rut: rut,
          email: email
        });
        alert(`Cita agendada con éxito en ${comuna} para el día ${selectedDate} a las ${selectedTime} hrs.\n\nPuedes descargar tu comprobante desde el carro de compras en la pestaña 'Descargas / Citas'.`);
      } else {
        if (!rut) {
          alert("Por favor ingresa tu RUT.");
          return;
        }
        addToCart({
          id: Math.random().toString(36).substr(2, 9),
          name: type,
          type: isCedula ? "Reimpresión" : "Certificado",
          price: 0,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600"
        });
      }
    }
    onClose();
  };

  const inputBase = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-medium text-slate-700 text-sm";
  const inputLocked = "w-full px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl font-semibold text-emerald-800 text-sm cursor-default select-all";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1 scrollbar-thin">

          {/* ── FOLIO ── */}
          {isFolio ? (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">Folio o Número de Solicitud</label>
              <input
                type="text"
                placeholder="Ej: CI-2026-..."
                className={inputBase}
              />
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Puedes encontrar este número en el comprobante impreso que te entregaron en sucursal o en el correo de confirmación.
              </p>
            </div>

          /* ── CÉDULA ── */
          ) : isCedula ? (
            <div className="space-y-4">
              <p className="text-sm text-slate-600 mb-2">Selecciona qué trámite deseas realizar con tu cédula:</p>

              <button
                onClick={() => setCedulaOption('agendar')}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${cedulaOption === 'agendar' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${cedulaOption === 'agendar' ? 'border-blue-600' : 'border-slate-300'}`}>
                  {cedulaOption === 'agendar' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Renovar o Agendar Hora</p>
                  <p className="text-xs text-slate-500 mt-1">Trámite presencial en sucursal. Agenda aquí tu visita.</p>
                </div>
              </button>

              <button
                onClick={() => setCedulaOption('reimpresion')}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${cedulaOption === 'reimpresion' ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${cedulaOption === 'reimpresion' ? 'border-blue-600' : 'border-slate-300'}`}>
                  {cedulaOption === 'reimpresion' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Reimpresión (100% Online)</p>
                  <p className="text-xs text-slate-500 mt-1">Si perdiste tu carnet vigente, pide una copia en línea.</p>
                </div>
              </button>

              {cedulaOption === 'agendar' && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                  {/* Banner de sesión en cédula agendamiento */}
                  <SesionBanner isAuthenticated={isAuthenticated} perfil={perfil} onOpenLogin={onOpenLogin} />
                  
                  {/* Datos del solicitante */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">RUT</label>
                      {camposLocked
                        ? <input type="text" readOnly value={rut} className={inputLocked} />
                        : <input type="text" placeholder="12.345.678-9" value={rut} onChange={e => setRut(e.target.value)} className={inputBase} />
                      }
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico</label>
                      {camposLocked && user?.email
                        ? <input type="text" readOnly value={email} className={inputLocked} />
                        : <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} className={inputBase} />
                      }
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Buscar Oficina o Comuna (Conectado a API GPS)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Ej: Santiago Centro, Providencia..."
                          value={oficinaQuery}
                          onChange={e => setOficinaQuery(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              buscarOficinas();
                            }
                          }}
                          className={`${inputBase} pl-10`}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={buscarOficinas}
                        disabled={oficinaLoading}
                        className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all rounded-xl cursor-pointer"
                      >
                        {oficinaLoading ? 'Buscando...' : 'Buscar'}
                      </button>
                    </div>
                  </div>

                  {oficinasList.length > 0 && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-xs font-bold text-slate-500">Oficinas registradas encontradas:</label>
                      <div className="max-h-36 overflow-y-auto border border-slate-100 rounded-xl p-1.5 bg-slate-50 space-y-1">
                        {oficinasList.map((oficina, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              setComuna(oficina.nombre);
                              setSelectedOficinaObj(oficina);
                              setOficinasList([]); // colapsar tras seleccionar
                            }}
                            className={`p-2 rounded-lg text-left text-xs cursor-pointer transition-all border ${
                              comuna === oficina.nombre
                                ? 'bg-blue-600 border-blue-600 text-white font-bold'
                                : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-100'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 font-bold">
                              <MapPin size={12} className={comuna === oficina.nombre ? 'text-white' : 'text-blue-500'} />
                              <span className="truncate">{oficina.nombre}</span>
                            </div>
                            <p className={`text-[0.65rem] truncate mt-0.5 ${comuna === oficina.nombre ? 'text-blue-100' : 'text-slate-400 font-medium'}`}>{oficina.direccion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {comuna && (
                    <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5 animate-in fade-in duration-200">
                      <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 font-bold leading-none">Oficina de Retiro/Atención Seleccionada</p>
                        <p className="text-xs text-slate-800 font-bold mt-1.5 truncate">{comuna}</p>
                        {selectedOficinaObj && selectedOficinaObj.direccion && (
                          <p className="text-[0.68rem] text-slate-500 font-medium leading-relaxed mt-0.5">{selectedOficinaObj.direccion}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selector de Fecha */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Fecha de la Cita</label>
                    <input 
                      type="date" 
                      min={getTodayString()} 
                      value={selectedDate} 
                      onChange={e => {
                        setSelectedDate(e.target.value);
                        setSelectedTime(''); // reset selection when date changes
                      }} 
                      className={inputBase}
                    />
                  </div>

                  {/* Validación de Fin de Semana */}
                  {selectedDate && isWeekend(selectedDate) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200">
                      ⚠️ La institución atiende únicamente de lunes a viernes. Por favor, selecciona un día hábil.
                    </div>
                  )}

                  {/* Horarios disponibles */}
                  {selectedDate && !isWeekend(selectedDate) && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="block text-sm font-bold text-slate-700">Horas Disponibles</label>
                      <p className="text-xs text-slate-500">Selecciona uno de los bloques de atención presencial:</p>
                      
                      <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto pr-1">
                        {timeSlots.map(time => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 text-center text-xs font-bold rounded-lg border transition-all ${
                              selectedTime === time
                                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {cedulaOption === 'reimpresion' && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {/* Banner de sesión en cédula reimpresión */}
                  <SesionBanner isAuthenticated={isAuthenticated} perfil={perfil} onOpenLogin={onOpenLogin} />
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">RUT</label>
                    {camposLocked
                      ? <input type="text" readOnly value={rut} className={inputLocked} />
                      : <input type="text" placeholder="12.345.678-9" value={rut} onChange={e => setRut(e.target.value)} className={inputBase} />
                    }
                  </div>
                </div>
              )}
            </div>

          /* ── RESTO DE TRÁMITES ── */
          ) : (
            <>
              {/* Banner de sesión */}
              <SesionBanner isAuthenticated={isAuthenticated} perfil={perfil} onOpenLogin={onOpenLogin} />

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  RUT
                  {camposLocked && <span className="ml-2 text-[0.7rem] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Autocompleto</span>}
                </label>
                {camposLocked
                  ? <input type="text" readOnly value={rut} className={inputLocked} />
                  : <input type="text" placeholder="12.345.678-9" value={rut} onChange={e => setRut(e.target.value)} className={inputBase} />
                }
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Número de Documento (Serie)
                  {camposLocked && <span className="ml-2 text-[0.7rem] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Autocompleto</span>}
                </label>
                {camposLocked
                  ? <input type="text" readOnly value={serie} className={inputLocked} />
                  : <input type="text" placeholder="A123456789" value={serie} onChange={e => setSerie(e.target.value)} className={inputBase} />
                }
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Correo Electrónico
                  {camposLocked && user?.email && <span className="ml-2 text-[0.7rem] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Autocompleto</span>}
                </label>
                {camposLocked && user?.email
                  ? <input type="text" readOnly value={email} className={inputLocked} />
                  : <input type="email" placeholder="correo@ejemplo.com" value={email} onChange={e => setEmail(e.target.value)} className={inputBase} />
                }
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg rounded-xl transition-all">
            {isFolio ? 'Agregar Folio' : isCedula && cedulaOption === 'agendar' ? 'Agendar Hora' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente banner de sugerencia de sesión ──────────────────────────────
function SesionBanner({ isAuthenticated, perfil, onOpenLogin }) {
  if (isAuthenticated && perfil?.rut) {
    return (
      <div className="flex items-center gap-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
        <ShieldCheck size={15} className="text-emerald-600 flex-shrink-0" />
        <p className="text-xs font-semibold text-emerald-700">
          Datos autocompletos desde tu cuenta. Puedes editarlos si lo necesitas.
        </p>
      </div>
    );
  }

  if (isAuthenticated && !perfil?.rut) {
    return (
      <div className="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <CheckCircle size={15} className="text-amber-600 flex-shrink-0" />
        <p className="text-xs font-semibold text-amber-700">
          Sesión iniciada, pero tu perfil no tiene RUT guardado. Completa los campos manualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
      <LogIn size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-xs font-semibold text-blue-700 leading-snug">
          ¿Tienes cuenta? Inicia sesión para autocompletar tus datos.
        </p>
        {onOpenLogin && (
          <button
            onClick={onOpenLogin}
            className="mt-1.5 text-[0.72rem] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
          >
            Iniciar sesión →
          </button>
        )}
      </div>
    </div>
  );
}
