function findCell(button) {
  let el = button;
  while (el && !(el.getAttribute("style") || "").includes("aspect-ratio")) {
    el = el.parentElement;
  }
  return el || button.parentElement;
}

function processThumbnails() {
  document.querySelectorAll('[role="button"]').forEach((button) => {
    const img = button.querySelector('img[src*="ig_cache_key="]');
    if (!img || button.dataset.wrapped === img.src) return;

    const url = getPostURL(img.src);
    const cell = findCell(button);
    if (!url || !cell?.parentElement) return;

    // Prevent infinite processing loops
    button.dataset.wrapped = img.src;

    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.style.display = "contents";
    a.dataset.postWrapper = "true";

    cell.before(a);
    a.append(cell);
  });
}

// intercept click events on grid cells, prevent post from opening in both tabs
document.addEventListener(
  "click",
  (e) => {
    const a = e.target.closest?.('a[data-post-wrapper="true"]');
    if (!a || e.button !== 0) return;

    if (
      e.target.closest('[data-testid="bulk_action_checkbox"]') ||
      document.querySelector('[aria-label="Toggle checkbox"]')
    )
      return;

    e.preventDefault();
    e.stopImmediatePropagation();

    window.open(a.href, "_blank", "noopener,noreferrer");
  },
  true,
);

const observer = new MutationObserver(processThumbnails);

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

processThumbnails();
