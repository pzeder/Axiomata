export interface AxiomData {
    upperSequence: SymbolPointer[];
    lowerSequence: SymbolPointer[];
}

export enum SymbolType {
    VARIABLE, TERMINAL
}

export interface SymbolData {
    backgroundColor: ColorValue;
    text: string;
    textColor: ColorValue;
    fontSize: number;
    type: SymbolType;
    varTarget: boolean;
}

export interface CourseData {
    title: string;
    chapters: ChapterData[];
    variables: SymbolData[];
    symbols: SymbolData[];
}

export interface ChapterData {
    title: string;
    newAxioms: AxiomData[];
    levels: LevelData[];
}

export interface LevelData {
    title: string;
    goalAxiom: AxiomData | null;
    moveHistory: MoveData[];
    bestSolution: MoveData[] | null;
    bonus: boolean;
}

export interface MoveData {
    axiom: AxiomData | null,
    sequence: SymbolPointer[]
}

export interface LevelPointer {
    chapterIndex: number;
    levelIndex: number
}

export interface SymbolPointer {
    type: SymbolType;
    index: number
}

export enum TextEditTarget {
    COURSE, CHAPTER, SYMBOL
}

export interface TextEditPointer {
    target: TextEditTarget;
    index: number
}

export enum AxiomEditTarget {
    CHAPTER, LEVEL
}

export interface AxiomEditPointer {
    target: AxiomEditTarget;
    levelPointer: LevelPointer;
}

export interface ColorValue {
    red: number;
    green: number;
    blue: number;
}