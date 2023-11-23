export interface AxiomData {
    upperSequence: SeqSymbol[];
    lowerSequence: SeqSymbol[];
}

export interface SymbolData {
    backgroundColor: string;
    text: string;
    textColor: string;
}

export interface SeqVar {
    varIndex: number;
    colorIndex: number;
}

export interface VarData {
    varText: string;
    possibilities: number[];
}

export interface LevelData {
    symbolAlphabet: SymbolData[];
    axioms: AxiomData[];
    derivates: AxiomData[];
    levelName: string;
    goalAxiom: AxiomData;
    sequenceHistory: SeqSymbol[][];
    levelFinished: boolean;
    variables: VarData[];
}

export type SeqSymbol = number | SeqVar;