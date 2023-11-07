export interface UserState {
    userID: any;
    userName: string;
    saveID: any;
    chapterName: string;
    levelName: string;
}

export interface CourseData {
    courseName: string;
    chapters: ChapterData[];
}

export interface ChapterData {
    chapterName: string;
    levels: LevelData[];
}

export interface LevelData {
    levelName: string;
}

export interface CourseSave {
    _id: any;
    userName: string;
    courseName: string;
    chapters: ChapterSave[];
}

export interface ChapterSave {
    chapterName: string;
    unlocked: boolean;
    levels: LevelSave[];
}

interface LevelSave {
    levelName: string;
    status: string;
}