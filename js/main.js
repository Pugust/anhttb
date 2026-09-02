const screens = {
  lock: document.getElementById("lockpicking-screen"),
  skill: document.getElementById("skill-screen"),
  beacon: document.getElementById("beacon-screen")
};

function showOnly(screen) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screen.classList.add("active", "fade-in");
}

window.addEventListener("lockOpened", () => {
  showOnly(screens.skill);
  Skill.show();
});

window.addEventListener("skillFinished", () => {
  showOnly(screens.beacon);
  Beacon.show();
});

window.addEventListener("pointerdown", () => AudioManager.unlock(), { once:false, passive:true });
