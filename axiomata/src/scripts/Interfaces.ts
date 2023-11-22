export interface AxiomData {
    upperSequence: Symbol[];
    lowerSequence: Symbol[];
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
    symbolIndex: number;
    possibilities: number[];
}

export interface LevelData {
    symbolAlphabet: SymbolData[];
    axioms: AxiomData[];
    derivates: AxiomData[];
    levelName: string;
    goalAxiom: AxiomData;
    sequenceHistory: Symbol[][];
    levelFinished: boolean;
    variables: VarData[];
}

export type Symbol = number | SeqVar;