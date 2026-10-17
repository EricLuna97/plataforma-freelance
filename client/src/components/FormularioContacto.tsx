import { useState } from 'react';

export function Formulario() {
    const [datos, setDatos] = useState({
        nombre: '',
        email: '',
        mensaje: '',
        telefono_confirmacion: '' // Campo Honeypot (trampa para bots)
    });

    const [estadoEnvio, setEstadoEnvio] = useState<'inactivo' | 'cargando' | 'exito' | 'error'>('inactivo');
    const [mensajeFeedback, setMensajeFeedback] = useState('');

    const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDatos({
            ...datos,
            [e.target.name]: e.target.value
        });
    };

    const manejarEnvio = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setEstadoEnvio('cargando');
        setMensajeFeedback('');

        try {
            const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/api/solicitudes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(datos),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMsg = data?.error || 'Hubo un problema al enviar. Por favor, intentá de nuevo.';
                throw new Error(errorMsg);
            }

            setEstadoEnvio('exito');
            setMensajeFeedback('¡Consulta enviada con éxito! Te responderé pronto.');
            setDatos({ nombre: '', email: '', mensaje: '', telefono_confirmacion: '' });
            setTimeout(() => {
                setEstadoEnvio('inactivo');
                setMensajeFeedback('');
            }, 4000);

        } catch (error: any) {
            console.error("Error al enviar:", error);
            setEstadoEnvio('error');
            setMensajeFeedback(error.message || 'Hubo un problema al enviar. Por favor, intentá de nuevo.');
            setTimeout(() => {
                setEstadoEnvio('inactivo');
                setMensajeFeedback('');
            }, 5000);
        }
    };

  return (
    <form onSubmit={manejarEnvio} className="space-y-6 bg-zinc-900/30 p-8 md:p-10 border border-zinc-800 rounded-2xl backdrop-blur-sm">
      
      {/* Campo Honeypot invisible para humanos, trampa para spambots */}
      <div 
        aria-hidden="true" 
        style={{ opacity: 0, position: 'absolute', top: 0, left: 0, height: 0, width: 0, zIndex: -1, pointerEvents: 'none' }}
      >
        <label htmlFor="telefono_confirmacion">No completar</label>
        <input 
          type="text" 
          id="telefono_confirmacion" 
          name="telefono_confirmacion" 
          value={datos.telefono_confirmacion} 
          onChange={manejarCambio} 
          tabIndex={-1} 
          autoComplete="off" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-zinc-400 mb-2">Nombre completo</label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            value={datos.nombre} 
            onChange={manejarCambio} 
            placeholder="Ej: Juan Pérez" 
            required 
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" 
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={datos.email} 
            onChange={manejarCambio} 
            placeholder="tu@empresa.com" 
            required 
            maxLength={150}
            className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors" 
          />
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-zinc-400 mb-2">Detalle del requerimiento</label>
        <textarea 
          id="mensaje" 
          name="mensaje" 
          value={datos.mensaje} 
          onChange={manejarCambio} 
          rows={4} 
          placeholder="Describe brevemente los objetivos o funcionalidades clave..." 
          required 
          maxLength={3000}
          className="w-full px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950/50 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
        ></textarea>
      </div>

      <button 
        type="submit" 
        disabled={estadoEnvio === 'cargando'} 
        className="w-full py-4 px-6 bg-zinc-100 text-zinc-900 font-bold rounded-xl hover:bg-white transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {estadoEnvio === 'cargando' ? 'Enviando...' : 'Enviar Consulta'}
      </button>

      {/* Mensajes de feedback dinámicos para el usuario */}
      {estadoEnvio === 'exito' && (
        <p className="text-green-400 text-sm text-center font-medium mt-2">{mensajeFeedback}</p>
      )}
      {estadoEnvio === 'error' && (
        <p className="text-red-400 text-sm text-center font-medium mt-2">{mensajeFeedback}</p>
      )}
    </form>
  );
}