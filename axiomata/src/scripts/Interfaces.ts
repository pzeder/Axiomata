export interface AxiomData {
    upperSequence: number[];
    lowerSequence: number[];
}

export interface SymbolData {
    backgroundColor: string;
    text: string;
    textColor: string;
}

export interface LevelData {
    symbolAlphabet: SymbolData[];
    axioms: AxiomData[];
    derivates: AxiomData[];
    levelName: string;
    goalAxiom: AxiomData;
    sequenceHistory: number[][];
    levelFinished: boolean;
    nextChapterIndex: number;
    nextLevelIndex: number;
}