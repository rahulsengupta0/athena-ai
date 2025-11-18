// src/components/landing/scrollReveal.js
// Call initScrollReveal() once in your top-level landing page component (useEffect).

export function initScrollReveal(root = document) {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // optionally unobserve to run only once
          observer.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  const items = root.querySelectorAll(".reveal");
  items.forEach((el) => observer.observe(el));
}
