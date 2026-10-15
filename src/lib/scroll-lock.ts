// Counted body scroll lock, so overlays that open over each other (mobile menu,
// Ask Ari sheet) don't unlock the page while another one is still showing.
let locks = 0;
let previousOverflow = "";

export function lockBodyScroll(): () => void {
  if (locks === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;

  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) document.body.style.overflow = previousOverflow;
  };
}
