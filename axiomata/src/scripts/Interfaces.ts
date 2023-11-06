interface CourseData {
    courseName: string;
    chapters: ChapterData[];
}

interface ChapterData {
    chapterName: string;
    levels: LevelData[];
}

interface LevelData {
    levelName: string;
}

interface CourseSave {
    userName: string;
    courseName: string;
    chapters: ChapterSave[];
}

interface ChapterSave {
    chapterName: string;
    unlocked: boolean;
    levels: LevelSave[];
}

interface LevelSave {
    levelName: string;
    status: string;
}