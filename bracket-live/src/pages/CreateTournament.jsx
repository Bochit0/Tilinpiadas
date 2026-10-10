import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tournamentTypes = [
  { value: 'single', label: 'Eliminación directa', detail: 'Una derrota y termina el recorrido.' },
  { value: 'double', label: 'Doble eliminación', detail: 'Una segunda oportunidad en el cuadro inferior.' },
  { value: 'swiss', label: 'Sistema suizo', detail: 'Rondas entre participantes con resultados similares.' },
  { value: 'round-robin', label: 'Todos contra todos', detail: 'Cada participante juega contra los demás.' },
];

const participantCounts = [4, 8, 16, 32];
const storageKey = 'bracketLiveTournament';

export default function CreateTournament() {
  const navigate = useNavigate();
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentType, setTournamentType] = useState('single');
  const [participantCount, setParticipantCount] = useState(8);
  const [participantOrder, setParticipantOrder] = useState('random');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedName = tournamentName.trim();
    if (!trimmedName) {
      setSubmitError(true);
      setSubmitMessage('Escribe un nombre para el torneo.');
      return;
    }

    const isConfigurationValid =
      tournamentTypes.some((type) => type.value === tournamentType) &&
      participantCounts.includes(participantCount) &&
      ['random', 'manual'].includes(participantOrder);

    if (!isConfigurationValid) {
      setSubmitError(true);
      setSubmitMessage('Revisa las opciones seleccionadas antes de continuar.');
      return;
    }

    const configuration = {
      nombre: trimmedName,
      tipo: tournamentType,
      participantes: participantCount,
      orden: participantOrder,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(configuration));
      navigate('/admin');
    } catch {
      setSubmitError(true);
      setSubmitMessage('No se pudo guardar la configuración. Revisa el almacenamiento del navegador.');
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B0914] via-[#110D1D] to-[#1A1025] px-4 py-10 font-sans text-white sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-12 h-80 w-80 rounded-full bg-[#9B4DFF]/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#00F2FE]/8 blur-3xl" />

      <section className="relative z-10 w-full max-w-3xl">
        <header className="mb-8 text-center sm:mb-10">
          <a href="/" className="mb-7 inline-block text-xl font-extrabold tracking-tight text-white">
            Bracket.<span className="text-[#00F2FE]">live</span>
          </a>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#9B4DFF]">Nuevo torneo</p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Arma tu competencia</h1>
          <p className="mt-3 text-sm text-[#9DA1B1] sm:text-base">Define lo esencial y prepara el terreno para el primer partido.</p>
        </header>

        <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#15111F]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur sm:p-8">
          <div className="space-y-8">
            <div>
              <label htmlFor="tournament-name" className="mb-2 block text-sm font-semibold text-white">
                Nombre del torneo
              </label>
              <input
                id="tournament-name"
                name="tournamentName"
                type="text"
                required
                maxLength={60}
                value={tournamentName}
                onChange={(event) => {
                  setTournamentName(event.target.value);
                  setSubmitMessage('');
                  setSubmitError(false);
                }}
                placeholder="Ej. Copa de verano"
                className="w-full rounded-xl border border-white/10 bg-[#0D0B14] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[#666979] focus:border-[#9B4DFF] focus:ring-2 focus:ring-[#9B4DFF]/20"
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-white">Tipo de torneo</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {tournamentTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                      tournamentType === type.value
                        ? 'border-[#9B4DFF]/80 bg-[#9B4DFF]/10'
                        : 'border-white/10 bg-[#0D0B14]/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tournamentType"
                      value={type.value}
                      checked={tournamentType === type.value}
                      onChange={() => {
                        setTournamentType(type.value);
                        setSubmitMessage('');
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#9B4DFF]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-white">{type.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-[#8E94A5]">{type.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-white">Número de participantes</legend>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {participantCounts.map((count) => (
                  <label key={count} className="cursor-pointer">
                    <input
                      type="radio"
                      name="participantCount"
                      value={count}
                      checked={participantCount === count}
                      onChange={() => {
                        setParticipantCount(count);
                        setSubmitMessage('');
                      }}
                      className="peer sr-only"
                    />
                    <span className="flex h-12 items-center justify-center rounded-xl border border-white/10 bg-[#0D0B14]/70 text-sm font-bold text-[#B6B8C4] transition hover:border-white/20 peer-checked:border-[#9B4DFF]/80 peer-checked:bg-[#9B4DFF]/10 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#9B4DFF]">
                      {count}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-white">Orden de participantes</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {[{ value: 'random', label: 'Aleatorio', detail: 'Sortea las posiciones al crear el torneo.' }, { value: 'manual', label: 'Manual', detail: 'Organiza las posiciones por tu cuenta.' }].map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                      participantOrder === option.value
                        ? 'border-[#9B4DFF]/70 bg-[#9B4DFF]/[0.07]'
                        : 'border-white/10 bg-[#0D0B14]/70 hover:border-white/20'
                    }`}
                  >
                    <input
                      type="radio"
                      name="participantOrder"
                      value={option.value}
                      checked={participantOrder === option.value}
                      onChange={() => {
                        setParticipantOrder(option.value);
                        setSubmitMessage('');
                      }}
                      className="mt-1 h-4 w-4 shrink-0 accent-[#9B4DFF]"
                    />
                    <span>
                      <span className="block text-sm font-semibold text-white">{option.label}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-[#8E94A5]">{option.detail}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            {submitMessage && (
              <p role={submitError ? 'alert' : 'status'} className={`mb-4 text-sm ${submitError ? 'text-rose-300' : 'text-[#C4A1FF]'}`}>
                {submitMessage}
              </p>
            )}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8042D8] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#9B4DFF]/20 transition hover:bg-[#9255E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C4A1FF] active:scale-[0.99]"
            >
              Crear torneo
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}