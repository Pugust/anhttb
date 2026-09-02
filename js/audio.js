// V0: nenhum arquivo de áudio é necessário.
// Quando os assets forem adicionados, substitua os caminhos nesta tabela.
const AudioManager = (() => {
  const files = {};
  const cache = {};
  let unlocked = false;

  function unlock() {
    unlocked = true;
    // Futuro: criar/resumir AudioContext após um gesto do usuário.
  }

  function load(name, url) {
    const a = new Audio(url);
    a.preload = "auto";
    cache[name] = a;
  }

  function play(name) {
    const a = cache[name];
    if (!a) return; // V0 silenciosa
    a.currentTime = 0;
    a.play().catch(() => {});
  }

  return { files, cache, unlock, load, play };
})();
