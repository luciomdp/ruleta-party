# Ruleta Party 🎉

Ruleta Party is a local multiplayer party game designed to be played on a single device.  
Each round, a roulette decides a random mini-game, mixing bluff, creativity, reflexes, and luck.  
The roulette can even bring an eliminated player back to life, keeping everyone on edge until the very end.  

When only three players remain, the **Final Clash** begins: a timed word duel where only one can claim the party crown.  

---

## Features
- **3+ players** on one device (pass-and-play style).
- **Random roulette** that selects mini-games each round.
- **"Back from the Dead"** option to revive a random eliminated player.
- **Progressive elimination** until only one player remains victorious.

### Mini-games
- **Hidden Code**: One player has the odd symbol and must bluff. Others vote who they think is the impostor.
- **Broken Story**: Build a story together, then vote the least creative or coherent line.
- **Hands Game**: Collective rock-paper-scissors. The winner chooses who to eliminate.
- **Death to the King**: Deal cards from a Spanish deck. Whoever gets the *King of Golds* is instantly eliminated.
- **Final Clash**: With 3 players left, a random letter is shown. Each player must quickly say a word starting with it. 10 seconds per turn—fail or repeat and you’re out. Last one standing wins.

---

## Tech Stack
- **Next.js** 15 (App Router)
- **React** 19
- **TailwindCSS** 4 (UI)
- **Zustand** (game state store)
- **PWA support** with `next-pwa`
