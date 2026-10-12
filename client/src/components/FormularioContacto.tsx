import { useState } from 'react';

export function Formulario() {
    const [datos, setDatos] = useState({
        nombre: '',
        email: '',
        mensaje: ''
    });

    const [estadoEnvio, setEstadoEnvio] = useState('inactivo'); // 'inactivo' | 'cargando' | 'exito' | 'error'

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEstadoEnvio('cargando');

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/solicitudes`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            setEstadoEnvio('exito');
            setDatos({ nombre: '', email: '', mensaje: '' });
            setTimeout(() => setEstadoEnvio('inactivo'), 3000);

        } catch (error) {
            console.error("Error al enviar:", error);
            setEstadoEnvio('error');
            setTimeout(() => setEstadoEnvio('inactivo'), 4000);
        }
    };

  return (
    <form onSubmit={manejarEnvio} className="space-y-6 bg-zinc-900/30 p-8 md:p-10 border border-zinc-800 rounded-2xl backdrop-blur-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-zinc-400 mb-2">Nombre completo</label>
          <input type="text" id="nombre" name="nombre" value={datos.nombre} onChange={manejarCambio} placeholder="Ej: Juan Pérez" required className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Correo electrónico</label>
          <input type="email" id="email" name="email" value={datos.email} onChange={manejarCambio} placeholder="tu@empresa.com" required className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-zinc-400 mb-2">Detalle del requerimiento</label>
        <textarea id="mensaje" name="mensaje" value={datos.mensaje} onChange={manejarCambio} rows={4} placeholder="Describe brevemente los objetivos o funcionalidades clave..." required className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"></textarea>
      </div>

      <button type="submit" disabled={estadoEnvio === 'cargando'} className="w-full py-4 px-6 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed">
        {estadoEnvio === 'cargando' ? 'Enviando...' : 'Enviar Consulta'}
      </button>

      {/* Mensajes de feedback para el usuario */}
      {estadoEnvio === 'exito' && (
        <p className="text-green-400 text-sm text-center font-medium mt-2">¡Consulta enviada con éxito! Te responderé pronto.</p>
      )}
      {estadoEnvio === 'error' && (
        <p className="text-red-400 text-sm text-center font-medium mt-2">Hubo un problema al enviar. Por favor, intentá de nuevo.</p>
      )}
    </form>
  );
}