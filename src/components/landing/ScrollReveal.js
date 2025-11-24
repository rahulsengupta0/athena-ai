// src/components/landing/scrollReveal.js

export function initScrollReveal(root = document) {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );

  const items = root.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-tilt, .reveal-blur, .reveal-zoom, .reveal-mask, .reveal-glow"
  );
  items.forEach((el) => observer.observe(el));

  // Mark any already-visible elements as in-view immediately
  items.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add("in-view");
    }
  });

  // Smooth-scroll for same-page hash links
  const anchors = Array.from(root.querySelectorAll('a[href^="#"]'));
  anchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      const id = href.replace("#", "");
      const target = root.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

}
