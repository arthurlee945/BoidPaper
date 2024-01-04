export function readyToRender(elementId: string): { ready: true; domElement: HTMLElement } | { ready: false; message: string } {
  if (typeof document === "undefined" || typeof document === "undefined")
    return { ready: false, message: "'document' or 'window' is missing" };
  const container = document.getElementById(elementId);
  if (!container) return { ready: false, message: `There is no element with id: '${elementId}'` };
  if (container.tagName !== "DIV" && container.tagName !== "SECTION")
    return { ready: false, message: `Not Supported Element Tag ('div' or 'section' only)` };

  container.innerHTML = "";
  return { ready: true, domElement: container };
}
