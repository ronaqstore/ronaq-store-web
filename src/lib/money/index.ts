export function fromPaisa(paisa: number): number {
  return paisa / 100;
}

export function toPaisa(rupees: number): number {
  return Math.round(rupees * 100);
}
