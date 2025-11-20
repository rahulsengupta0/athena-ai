export function initLenis() {
  if (typeof window === "undefined") return;
  import("lenis")
    .then(({ default: Lenis }) => {
      const lenis = new Lenis({ smoothWheel: true });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    })
    .catch(() => {});
}