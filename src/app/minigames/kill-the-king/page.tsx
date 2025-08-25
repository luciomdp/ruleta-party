// app/minigames/king/page.tsx

import SimpleMinigameTemplate from "@/components/SimpleMinigameTemplate";


export default function KingGamePage() {
  return (
    <SimpleMinigameTemplate
      title="Muerte al Rey"
      description={
        <div className="space-y-2">
          <p>Se juega con una baraja española completa.</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Mezclá bien todas las cartas.</li>
            <li>Repartí las cartas de a una a cada jugador, siguiendo el orden de la mesa.</li>
            <li>Continuá repartiendo hasta que aparezca el <strong>Rey de Oros 🃎</strong>.</li>
            <li>El jugador que reciba esa carta queda automáticamente eliminado de la partida.</li>
          </ol>
        </div>
      }
      actionLabel="Eliminar jugador"
    />
  );
}
