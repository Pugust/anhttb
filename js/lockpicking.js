const Lockpicking = (() => {
  const pick = document.getElementById("lockpick");
  const tryButton = document.getElementById("try-button");
  const status = document.getElementById("attempt-status");
  const triesEl = document.getElementById("tries");

  let position = 50;
  let sweetSpot = 68; // propositalmente fixo na V0 para facilitar testes
  let dragging = false;
  let tries = 0;
  let finished = false;

  function setPosition(value) {
    position = Math.max(0, Math.min(100, value));
    pick.style.left = `${position}%`;
    pick.setAttribute("aria-valuenow", Math.round(position));
  }

  function updateFromPointer(clientX) {
    const rect = pick.parentElement.getBoundingClientRect();
    const value = ((clientX - rect.left) / rect.width) * 100;
    setPosition(value);
  }

  function pointerDown(e) {
    if (finished) return;
    dragging = true;
    pick.setPointerCapture?.(e.pointerId);
    AudioManager.unlock();
  }

  function pointerMove(e) {
    if (!dragging || finished) return;
    updateFromPointer(e.clientX);
  }

  function pointerUp() {
    dragging = false;
  }

  function vibrate(pattern) {
    if ("vibrate" in navigator) navigator.vibrate(pattern);
  }

  function tryPick() {
    if (finished) return;
    AudioManager.unlock();
    tries++;
    triesEl.textContent = tries;

    const distance = Math.abs(position - sweetSpot);
    pick.classList.remove("shake");

    if (distance <= 5) {
      status.textContent = "A fechadura abriu.";
      finished = true;
      pick.style.transform = "translate(-5%, -50%) rotate(22deg)";
      vibrate(30);
      AudioManager.play("lock-open");
      setTimeout(() => window.dispatchEvent(new Event("lockOpened")), 900);
      return;
    }

    if (distance <= 15) {
      status.textContent = "Resistência...";
      pick.classList.add("shake");
      vibrate([25, 20, 25]);
      AudioManager.play("lockpick-tension");
      setTimeout(() => pick.classList.remove("shake"), 500);
      return;
    }

    status.textContent = "O lockpick quebrou!";
    pick.classList.add("shake");
    vibrate([80, 30, 120]);
    AudioManager.play("lockpick-break");
    setTimeout(() => {
      pick.classList.remove("shake");
      pick.classList.add("broken");
      status.textContent = "Toque em TENTAR para usar outro lockpick.";
    }, 180);

    // Na V0, o botão passa a representar a colocação de um novo lockpick.
    tryButton.textContent = "NOVO LOCKPICK";
    tryButton.dataset.broken = "true";
  }

  function resetPick() {
    pick.classList.remove("broken", "shake");
    pick.style.transform = "translate(-5%, -50%) rotate(-8deg)";
    setPosition(50);
    status.textContent = "Novo lockpick.";
    tryButton.textContent = "TENTAR";
    tryButton.dataset.broken = "false";
  }

  function buttonClick() {
    if (tryButton.dataset.broken === "true") {
      resetPick();
      return;
    }
    tryPick();
  }

  pick.addEventListener("pointerdown", pointerDown);
  pick.addEventListener("pointermove", pointerMove);
  pick.addEventListener("pointerup", pointerUp);
  pick.addEventListener("pointercancel", pointerUp);
  tryButton.addEventListener("click", buttonClick);

  setPosition(position);

  return { setPosition, tryPick, resetPick };
})();
