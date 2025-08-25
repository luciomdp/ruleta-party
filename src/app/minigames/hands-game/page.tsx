// app/minigames/hands/page.tsx

import SimpleMinigameTemplate from "@/components/SimpleMinigameTemplate";

export default function HandsGamePage() {
  return (
    <MiniggameHands />
  );
}

function MiniggameHands() {
  return (
    <SimpleMinigameTemplate
      title="Juego de manos"
      description={
        <>
          <div className="space-y-3 leading-relaxed">
            <p>
              Todos los jugadores participan al mismo tiempo en una ronda de{" "}
              <span className="font-semibold">piedra, papel o tijera</span>.
            </p>
            <p>
              Quien resulte ganador obtiene el poder de decidir{" "}
              <span className="font-semibold">qué participante será eliminado</span> de la partida.
            </p>
            <p className="mt-4 rounded-lg text-sm text-white/80 ">
              💡 Tip: cuenten <strong>3-2-1</strong> y revelen sus manos al mismo tiempo.
            </p>
          </div>
        </>
      }
      actionLabel="Eliminar jugador"
    />
  );
}
