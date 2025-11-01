document.addEventListener("DOMContentLoaded", () => {
  const clock = document.getElementById("clock");
  const toggleBtn = document.getElementById("toggleSeconds");
  let showSeconds = true;

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    clock.textContent = showSeconds ? `${h}:${m}:${s}` : `${h}:${m}`;
  }

  toggleBtn.addEventListener("click", () => {
    showSeconds = !showSeconds;
    updateClock();
  });

  updateClock();
  setInterval(updateClock, 1000);
});
