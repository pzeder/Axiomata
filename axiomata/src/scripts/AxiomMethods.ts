import { AxiomData } from "./Interfaces";

export function axiomWidth(axiom: AxiomData, symbolWidth: number) {
    return maxSequenceLength(axiom) * symbolWidth;
}

export function axiomHeight(symbolWidth: number) {
    return symbolWidth * 2.3;
}

export function maxSequenceLength(axiom: AxiomData): number {
    return Math.max(axiom.upperSequence.length, axiom.lowerSequence.length);
}

export function axiomValid(axiom: AxiomData): boolean {
    return axiom.upperSequence.length !== 0 && axiom.lowerSequence.length !== 0;
}