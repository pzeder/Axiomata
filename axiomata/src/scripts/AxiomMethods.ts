import { AxiomData } from "./Interfaces";

export function axiomWidth(axiom: AxiomData, symbolWidth: number) {
    return maxSequenceLength(axiom) * symbolWidth;
}
  
export function axiomHeight(symbolWidth: number, screenRatio: number) {
    return symbolWidth * screenRatio * 2.5;
}

export function maxSequenceLength(axiom: AxiomData): number {
    return Math.max(axiom.upperSequence.length, axiom.lowerSequence.length);
}