'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useGameStore } from '@/store/useGameStore';

export default function Lobby() {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);
  const start = useGameStore(s => s.setNames);
  const router = useRouter();

  const addPlayer = () => {
    if (name.trim()) {
      setPlayers([...players, name.trim()]);
      setName('');
    }
  };
  
  const removePlayer = (idx: number) => setPlayers(players.filter((_, i) => i !== idx));

  const handleStart = () => {
    if (players.length < 4) { 
      toast.error('Se necesitan al menos 4 jugadores'); 
      return; 
    }
    start(players);
    router.push('/roulette');
  };

  return (
    <main className="h-[100dvh] overflow-hidden bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 text-white">
      
      <div className="h-full mx-auto max-w-md flex flex-col items-center p-6 gap-3">

        {/* Logo */}
        <div className="relative w-[200px] h-[150px]">
          <Image src="/logo/logo-a.png" alt="Ruleta Party Logo" fill style={{ objectFit: 'contain', color: 'white' }} priority />
        </div>

        {/* Titulo */}
        <h1 className="text-4xl font-extrabold drop-shadow-lg text-center">Ruleta Party</h1>

        {/* Jugadores */}
        <div className="w-full flex-1 overflow-y-auto rounded-xl">
          <ul className="w-full space-y-2 pr-1">
            {players.map((p, idx) => (
              <li key={idx} className="flex items-center justify-between bg-white/30 rounded-lg px-4 py-2 text-gray-900">
                <span className="text-white">{p}</span>
                <button onClick={() => removePlayer(idx)} className="text-sm text-red-200 hover:text-red-100">✕</button>
              </li>
            ))}
          </ul>
        </div>

        {/* Agregar jugador */}
        <div className="flex w-full items-stretch gap-2">
          <input
            type="text"
            value={name}
            onChange={e=>setName(e.target.value)}
            placeholder="Nombre del jugador"
            className="flex-1 rounded-xl px-4 py-3 bg-white/30 text-gray-200 placeholder-gray-200 border border-white/10 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/40 shadow-sm"
          />
          <button
            onClick={addPlayer}
            className="shrink-0 rounded-xl px-4 py-3 bg-rose-500/90 text-white font-bold hover:bg-rose-600/90 active:bg-rose-700/90 border border-white/10 shadow-md"
            aria-label="Agregar jugador"
          >+</button>
        </div>

        {/* Iniciar juego */}
        <button
          onClick={handleStart}
          className="w-full rounded-xl py-3 font-semibold bg-rose-500/90 text-white hover:bg-rose-600/90 active:bg-rose-700/90 border border-white/10 shadow-lg shadow-rose-900/30 "
        >
          Iniciar Juego
        </button>
      </div>
    </main>
  );
}
