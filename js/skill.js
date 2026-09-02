const Skill = (() => {
  const screen = document.getElementById("skill-screen");
  const card = document.getElementById("skill-card");

  function show() {
    screen.classList.add("active", "fade-in");
    card.classList.remove("show");
    void card.offsetWidth;
    card.classList.add("show");
    AudioManager.play("skill-up");
    setTimeout(() => {
      window.dispatchEvent(new Event("skillFinished"));
    }, 2500);
  }

  return { show };
})();
