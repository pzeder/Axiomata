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

export interface CourseData {
    title: string;
    chapters: ChapterData[];
    variables: number[];
}

export interface ChapterData {
    title: string;
    newAxioms: AxiomData[];
    levels: LevelData[];
}

export interface LevelData {
    symbolAlphabet: SymbolData[];
    axioms: AxiomData[];
    derivates: AxiomData[];
    title: string;
    goalAxiom: AxiomData;
    sequenceHistory: SeqSymbol[][];
    levelFinished: boolean;
    variables: VarData[];
}

export type SeqSymbol = number | SeqVar;