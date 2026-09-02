const Beacon = (() => {
  const screen = document.getElementById("beacon-screen");
  const button = document.getElementById("take-item");
  const message = document.getElementById("beacon-message");
  let taken = false;

  function show() {
    screen.classList.add("active", "fade-in");
    setTimeout(() => screen.classList.add("reveal"), 250);
  }

  function takeItem() {
    if (taken) return;
    taken = true;
    AudioManager.unlock();
    button.style.opacity = "0";
    button.style.pointerEvents = "none";
    screen.classList.add("reveal");
    AudioManager.play("beacon-reveal");
    setTimeout(() => {
      AudioManager.play("meridia");
      message.textContent = "A new hand touches the Beacon.";
      message.classList.add("show");
    }, 850);
  }

  button.addEventListener("click", takeItem);
  return { show };
})();
