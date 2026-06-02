import { supabase, isMockSupabase } from '../config/supabase';

/**
 * Guarda una solicitud de trámite en Supabase
 * @param {string} userId - ID del usuario autenticado
 * @param {object} tramite - Datos del trámite a guardar
 */
export const crearSolicitud = async (userId, tramite) => {
  if (isMockSupabase || !supabase || !userId) return null;

  const { data, error } = await supabase
    .from('solicitudes')
    .insert({
      user_id: userId,
      tramite_nombre: tramite.name,
      tramite_tipo: tramite.type || 'Gratuito',
      estado: 'pendiente',
      precio: tramite.price || 0
    })
    .select()
    .single();

  if (error) {
    console.error('[SolicitudesService] Error al crear solicitud:', error);
    return null;
  }

  return data;
};

/**
 * Confirma todas las solicitudes pendientes de un usuario (las marca como 'confirmado')
 * @param {string} userId - ID del usuario autenticado
 */
export const confirmarSolicitudes = async (userId) => {
  if (isMockSupabase || !supabase || !userId) return null;

  const { data, error } = await supabase
    .from('solicitudes')
    .update({ estado: 'confirmado' })
    .eq('user_id', userId)
    .eq('estado', 'pendiente')
    .select();

  if (error) {
    console.error('[SolicitudesService] Error al confirmar solicitudes:', error);
    return null;
  }

  return data;
};

/**
 * Obtiene todas las solicitudes de un usuario
 * @param {string} userId - ID del usuario autenticado
 */
export const getSolicitudesUsuario = async (userId) => {
  if (isMockSupabase || !supabase || !userId) return [];

  const { data, error } = await supabase
    .from('solicitudes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[SolicitudesService] Error al obtener solicitudes:', error);
    return [];
  }

  return data;
};

/**
 * Elimina una solicitud específica
 * @param {string} solicitudId - ID de la solicitud
 */
export const eliminarSolicitud = async (solicitudId) => {
  if (isMockSupabase || !supabase) return false;

  const { error } = await supabase
    .from('solicitudes')
    .delete()
    .eq('id', solicitudId);

  if (error) {
    console.error('[SolicitudesService] Error al eliminar solicitud:', error);
    return false;
  }

  return true;
};
