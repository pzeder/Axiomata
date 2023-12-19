<template>
  <div v-if="course">
    <div v-if="showLevelSelection">
      <div class="sidebar-left">
        <HomeButton @click="emit('openHomeScreen')" />
      </div>
      <CourseContainer :course="course" :frontLevelPointer="null" :editable="true" @editText="editText"
        @openLevel="openLevel" @openHomeScreen="emit('openHomeScreen')" @addNewChapter="addNewChapter"
        @deleteChapter="deleteChapter" @addNewLevel="addNewLevel" @deleteLevel="deleteLevel" @toggleBonus="toggleBonus"
        @editAxiom="editAxiom" @deleteAxiom="deleteAxiom" />
    </div>
    <PlayScreen v-if="showPlayScreen" :symbols="course?.symbols" :variables="course?.variables" :axioms="selectedAxioms"
      :derivates="selectedDerivates" :level="selectedLevel" @addMove="addMove" @openLevelSelection="openLevelSelection"
      @finishLevel="finishLevel" />
    <TextInputWindow v-if="showTextInput" :title="textEditTitle" :placeholder="textEditPlaceholder"
      @close="showTextInput = false" @updateText="updateText" />
    <AxiomEditor v-if="showAxiomEditor" :title="axiomEditorTitle" :axiom="editedAxiom" :symbols="course.symbols"
      :variables="course.variables" :headerUp="axiomEditorHeaderUp" :headerLow="axiomEditorHeaderLow"
      :borderColor="axiomEditorBorderColor" @close="showAxiomEditor = false" @editSymbol="editSymbol"
      @toggleVarTarget="toggleVarTarget" @deleteSymbol="deleteSymbol" @updateAxiom="updateAxiom" />
    <SymbolEditor v-if="showSymbolEditor && editedSymbol" :symbol="editedSymbol" @updateSymbol="updateSymbol"
      @close="showSymbolEditor = false" />
  </div>
</template>

<script setup lang="ts">
import { AxiomData, ChapterData, CourseData, LevelData, LevelPointer, MoveData, SymbolData, SymbolType, SymbolPointer, TextEditPointer, TextEditTarget, AxiomEditPointer, AxiomEditTarget } from '@/scripts/Interfaces';
import axios from 'axios';
import { Ref, ref, defineProps, defineEmits, onMounted, computed, ComputedRef } from 'vue';
import PlayScreen from '../play/PlayScreen.vue';
import TextInputWindow from '../UI/TextInputWindow.vue';
import AxiomEditor from './AxiomEditor.vue';
import SymbolEditor from './SymbolEditor.vue';
import CourseContainer from '../UI/CourseContainer.vue';
import HomeButton from '../menus/HomeButton.vue';

interface Props {
  editID: any;
}

const props = defineProps<Props>();
const emit = defineEmits(['openHomeScreen', 'openSaveStateMenu']);

const showLevelSelection: Ref<boolean> = ref(false);
const showPlayScreen: Ref<boolean> = ref(false);
const showVictoryWindow: Ref<boolean> = ref(false);
const showTextInput: Ref<boolean> = ref(false);
const showNoteWindow: Ref<boolean> = ref(false);
const noteMessage: Ref<string> = ref('');
const textEditPointer: Ref<TextEditPointer | null> = ref(null);
const course: Ref<CourseData | null> = ref(null);
const showAxiomEditor: Ref<boolean> = ref(false);
const axiomEditPointer: Ref<AxiomEditPointer | null> = ref(null);
const showSymbolEditor: Ref<boolean> = ref(false);
const editSymbolPointer: Ref<SymbolPointer | null> = ref(null)

const editedSymbol: ComputedRef<SymbolData | null> = computed(() => {
  if (!editSymbolPointer.value || !course.value) {
    return null;
  }
  if (editSymbolPointer.value.type === SymbolType.TERMINAL && editSymbolPointer.value.index < course.value.symbols.length) {
    return course.value.symbols[editSymbolPointer.value.index];
  }
  if (editSymbolPointer.value.type === SymbolType.VARIABLE && editSymbolPointer.value.index < course.value.variables.length) {
    return course.value.variables[editSymbolPointer.value.index];
  }
  return ({
    backgroundColor: { red: 255, green: 255, blue: 255 },
    text: 'text',
    textColor: { red: 44, green: 44, blue: 44 },
    fontSize: 35,
    type: editSymbolPointer.value.type,
    varTarget: true
  });
});

function editSymbol(pointer: SymbolPointer): void {
  editSymbolPointer.value = pointer;
  showSymbolEditor.value = true;
}

const textEditTitle: ComputedRef<string> = computed(() => {
  if (!textEditPointer.value || !course.value) {
    return '';
  }
  switch (textEditPointer.value.target) {
    case TextEditTarget.COURSE:
      return 'Titel des Kurses ändern';
    case TextEditTarget.CHAPTER:
      return 'Titel des Kapitels ändern';
    case TextEditTarget.SYMBOL:
      return 'Symboltext ändern';
    default:
      return '';
  }
});

const textEditPlaceholder: ComputedRef<string> = computed(() => {
  if (!textEditPointer.value || !course.value) {
    return '';
  }
  const index: number = textEditPointer.value.index;
  switch (textEditPointer.value.target) {
    case TextEditTarget.COURSE:
      return course.value.title;
    case TextEditTarget.CHAPTER:
      return course.value.chapters[index].title;
    default:
      return '';
  }
});

const invalidLevel = (level: LevelData): boolean =>
  level.goalAxiom?.upperSequence.length === 0 || level.goalAxiom?.lowerSequence.length === 0;

const invalidChapter = (chapter: ChapterData): boolean =>
  chapter.levels.length === 0 || chapter.levels.some(invalidLevel);

const courseValid: ComputedRef<boolean> = computed(() => {
  if (!course.value || course.value.chapters.length === 0) {
    return false;
  }
  return course.value.chapters.filter(invalidChapter).length === 0;
});

const selectedLevelPointer: Ref<LevelPointer | null> = ref(null);

const selectedLevel: ComputedRef<LevelData | null> = computed(() => {
  if (!selectedLevelPointer.value || !course.value) {
    return null;
  }
  let chapterIndex = selectedLevelPointer.value.chapterIndex;
  let levelIndex = selectedLevelPointer.value.levelIndex;
  return course.value.chapters[chapterIndex].levels[levelIndex];
});

const selectedAxioms: ComputedRef<AxiomData[]> = computed(() => {
  if (!course.value || !selectedLevelPointer.value) {
    return [];
  }
  let axioms: AxiomData[] = []
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  for (let i = 0; i <= chapterIndex; i++) {
    axioms.push(...course.value.chapters[i].newAxioms);
  }
  return axioms;
}
);

const selectedDerivates: ComputedRef<AxiomData[]> = computed(() => {
  if (!course.value || !selectedLevelPointer.value) {
    return [];
  }
  let derivates: AxiomData[] = [];
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  const addGoalAxiom = (ch: number, lvl: number) => {
    if (course.value?.chapters[ch].levels[lvl].bonus && course.value?.chapters[ch].levels[lvl].goalAxiom) {
      const goalAxiom: AxiomData = course.value?.chapters[ch].levels[lvl].goalAxiom as AxiomData;
      derivates.push(goalAxiom);
    }
  }
  for (let ch = 0; ch < chapterIndex; ch++) {
    for (let lvl = 0; lvl < course.value.chapters[ch].levels.length; lvl++) {
      addGoalAxiom(ch, lvl);
    }
  }
  for (let lvl = 0; lvl < levelIndex; lvl++) {
    addGoalAxiom(chapterIndex, lvl);
  }
  return derivates;
});

const editedAxiom: ComputedRef<AxiomData | null> = computed(() => {
  if (!axiomEditPointer.value || !course.value) {
    return null;
  }
  const chapterIndex: number = axiomEditPointer.value.levelPointer.chapterIndex;
  const levelIndex: number = axiomEditPointer.value.levelPointer.levelIndex;
  if (axiomEditPointer.value.target === AxiomEditTarget.CHAPTER) {
    if (levelIndex < course.value.chapters[chapterIndex].newAxioms.length) {
      return course.value.chapters[chapterIndex].newAxioms[levelIndex];
    }
  }
  if (axiomEditPointer.value.target === AxiomEditTarget.LEVEL) {
    if (levelIndex < course.value.chapters[chapterIndex].levels.length) {
      return course.value.chapters[chapterIndex].levels[levelIndex].goalAxiom;
    }
  }
  return ({ upperSequence: [], lowerSequence: [] });
});

const axiomEditorTitle: ComputedRef<string> = computed(() => axiomEditPointer.value?.target === AxiomEditTarget.CHAPTER ? 'Tauschregel gestalten' : 'Level gestalten');
const axiomEditorHeaderUp: ComputedRef<string> = computed(() => axiomEditPointer.value?.target === AxiomEditTarget.CHAPTER ? 'OBEN' : 'START');
const axiomEditorHeaderLow: ComputedRef<string> = computed(() => axiomEditPointer.value?.target === AxiomEditTarget.CHAPTER ? 'UNTEN' : 'ZIEL');
const axiomEditorBorderColor: ComputedRef<string> = computed(() => axiomEditPointer.value?.target === AxiomEditTarget.CHAPTER ? 'gray' : 'orange');

onMounted(() => {
  fetchCourse();
  openLevelSelection();
});

async function fetchCourse(): Promise<void> {
  try {
    const query: string = '?editID=' + props.editID;
    const response = await axios.get('http://localhost:3000/edit' + query);
    if (response.status === 200) {
      course.value = response.data;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function openLevel(chapterIndex: number, levelIndex: number) {
  selectedLevelPointer.value = { chapterIndex: chapterIndex, levelIndex: levelIndex };
  openPlayScreen();
}

function openPlayScreen(): void {
  hideAll();
  showPlayScreen.value = true;
}

function openLevelSelection(): void {
  hideAll();
  showLevelSelection.value = true;
}

function openVictoryWindow(): void {
  hideAll();
  showVictoryWindow.value = true;
}

function hideAll(): void {
  showLevelSelection.value = false;
  showPlayScreen.value = false;
  showVictoryWindow.value = false;
}

async function saveEdit(): Promise<void> {
  try {
    const updatedData = {
      editID: props.editID,
      course: course.value
    };
    const response = await axios.patch(`http://localhost:3000/saveEdit`, updatedData);
    if (response.status === 200) {
      console.log('Edit saved successfully:', response.data);
    } else {
      console.error('Server responded with status:', response.status);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function editText(pointer: TextEditPointer): void {
  textEditPointer.value = pointer;
  showTextInput.value = true;
}

function updateText(text: string): void {
  if (!textEditPointer.value || !course.value) {
    return;
  }
  const index: number = textEditPointer.value.index;
  switch (textEditPointer.value.target) {
    case TextEditTarget.COURSE:
      course.value.title = text;
      break;
    case TextEditTarget.CHAPTER:
      course.value.chapters[index].title = text;
      break;
  }
  saveEdit();
}

function editAxiom(pointer: AxiomEditPointer): void {
  axiomEditPointer.value = pointer;
  showAxiomEditor.value = true;
}

function updateAxiom(axiom: AxiomData): void {
  if (!course.value || !axiomEditPointer.value) {
    return;
  }
  console.log(axiomEditPointer.value);
  const chapterIndex: number = axiomEditPointer.value.levelPointer.chapterIndex;
  const levelIndex: number = axiomEditPointer.value.levelPointer.levelIndex;
  switch (axiomEditPointer.value.target) {
    case AxiomEditTarget.CHAPTER:
      course.value.chapters[chapterIndex].newAxioms.splice(levelIndex, 1, axiom);
      break;
    case AxiomEditTarget.LEVEL:
      course.value.chapters[chapterIndex].levels[levelIndex].goalAxiom = axiom;
      break;
    default:
      return;
  }
  console.log(axiom);
  saveEdit();
}

function addMove(move: MoveData): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  course.value.chapters[chapterIndex].levels[levelIndex].moveHistory.push(move);
  saveEdit();
}

function finishLevel(): void {
  if (!selectedLevelPointer.value || !course.value) {
    return;
  }
  openVictoryWindow();
  const chapterIndex: number = selectedLevelPointer.value.chapterIndex;
  const levelIndex: number = selectedLevelPointer.value.levelIndex;
  const level: LevelData = course.value.chapters[chapterIndex].levels[levelIndex];
  if (!level.bestSolution || level.moveHistory.length < level.bestSolution.length) {
    course.value.chapters[chapterIndex].levels[levelIndex].bestSolution = level.moveHistory;
  }
  course.value.chapters[chapterIndex].levels[levelIndex].moveHistory = [level.moveHistory[0]];
  saveEdit();
}

function setCourseTitle(text: string): void {
  showTextInput.value = false;
  if (text.length === 0 || !course.value) {
    return;
  }
  course.value.title = text;
  saveEdit();
}

function addNewChapter(index: number): void {
  if (!course.value) {
    return
  }
  const newChapter: ChapterData = {
    title: 'Neues Kapitel',
    newAxioms: [],
    levels: []
  }
  course.value.chapters.splice(index, 0, newChapter);
  saveEdit();
}

function setChapterTitle(chapterIndex: number, title: string): void {
  if (!course.value) {
    return
  }
  course.value.chapters[chapterIndex].title = title;
  saveEdit();
}

function deleteChapter(chapterIndex: number) {
  if (!course.value) {
    return
  }
  course.value.chapters.splice(chapterIndex, 1);
  saveEdit();
}

function updateSymbol(symbol: SymbolData): void {
  if (!course.value || !editSymbolPointer.value) {
    return
  }
  if (symbol.type === SymbolType.VARIABLE) {
    course.value.variables.splice(editSymbolPointer.value.index, 1, symbol);
  }
  if (symbol.type === SymbolType.TERMINAL) {
    course.value.symbols.splice(editSymbolPointer.value.index, 1, symbol);
  }
  saveEdit();
}

function deleteSymbol(symbolPointer: SymbolPointer): void {
  if (!course.value) {
    return
  }

  if (symbolPointer.type === SymbolType.TERMINAL) {
    course.value.symbols.splice(symbolPointer.index, 1);
  } else {
    course.value.variables.splice(symbolPointer.index, 1);
  }

  const cleanSymbol = (sp: SymbolPointer): SymbolPointer => {
    if (sp.type === symbolPointer.type) {
      return ({
        type: sp.type,
        index: (sp.index < symbolPointer.index) ? sp.index : sp.index - 1
      });
    }
    return sp;
  };

  const cleanAxiom = (axiom: AxiomData | null): AxiomData | null => {
    const poisonedSymbol = (sp: SymbolPointer): boolean => sp.type === symbolPointer.type && sp.index === symbolPointer.index;
    if (!axiom || axiom.upperSequence.some(poisonedSymbol) || axiom.lowerSequence.some(poisonedSymbol)) {
      return null;
    }
    return ({
      upperSequence: axiom.upperSequence.map(cleanSymbol),
      lowerSequence: axiom.lowerSequence.map(cleanSymbol)
    });
  };

  const cleanLevel = (lvl: LevelData): LevelData => ({
    title: lvl.title,
    goalAxiom: cleanAxiom(lvl.goalAxiom),
    moveHistory: lvl.moveHistory,
    bestSolution: lvl.bestSolution,
    bonus: lvl.bonus
  });

  const cleanChapter = (ch: ChapterData): ChapterData => ({
    title: ch.title,
    newAxioms: ch.newAxioms.map(cleanAxiom).filter((axiom): axiom is AxiomData => axiom !== null),
    levels: ch.levels.map(cleanLevel)
  });

  course.value.chapters = course.value.chapters.map(cleanChapter);
  saveEdit();
}

function addNewAxiom(chapterIndex: number, axiom: AxiomData) {
  if (!course.value) {
    return;
  }
  course.value.chapters[chapterIndex].newAxioms.push(axiom);
  saveEdit();
}

function deleteAxiom(chapterIndex: number, axiomIndex: number): void {
  if (!course.value) {
    return;
  }
  course.value.chapters[chapterIndex].newAxioms.splice(axiomIndex, 1);
  saveEdit();
}

function addNewLevel(chapterIndex: number, levelIndex: number) {
  if (!course.value) {
    return;
  }
  const newLevel: LevelData = ({
    title: 'Neues Level',
    goalAxiom: null,
    moveHistory: [],
    bestSolution: null,
    bonus: false
  })
  course.value.chapters[chapterIndex].levels.splice(levelIndex, 0, newLevel);
  saveEdit();
}

function deleteLevel(chapterIndex: number, levelIndex: number) {
  if (!course.value) {
    return;
  }
  course.value.chapters[chapterIndex].levels.splice(levelIndex, 1);
  saveEdit();
}

function toggleVarTarget(symbol: SymbolPointer): void {
  if (!course.value) {
    return;
  }
  if (symbol.type === SymbolType.VARIABLE) {
    course.value.variables[symbol.index].varTarget = !course.value.variables[symbol.index].varTarget;
  } else {
    course.value.symbols[symbol.index].varTarget = !course.value.symbols[symbol.index].varTarget;
  }
  saveEdit();
}

function toggleBonus(chapterIndex: number, levelIndex: number): void {
  if (!course.value) {
    return;
  }
  course.value.chapters[chapterIndex].levels[levelIndex].bonus = !course.value.chapters[chapterIndex].levels[levelIndex].bonus;
  saveEdit();
}

async function submitCourse(): Promise<void> {
  if (!courseValid.value || !course.value) {
    return;
  }
  try {
    const data = {
      course: course.value
    };
    const response = await axios.post('http://localhost:3000/submitCourse', data);
    if (response.status === 200) {
      if (response.data.courseTitleAlreadyExists) {
        noteMessage.value = 'Ein Kurs mit dem Namen <span style="color: red;"> "' + course.value.title + '"</span> existiert bereits. ' +
          'Du musst den Titel ändern, damit es mit dem Hochladen klappt.';
      } else {
        noteMessage.value = 'Der Kurs <span style="color: green;">"' +
          course.value.title + '" </span> wurde erfolgreich hochgeladen. Er ist jetzt unter diesem Namen  für alle verfügbar. <br> <br> Viel Spass!'
      }
      showNoteWindow.value = true;
    } else {
      console.error('Server responded with status', response.status);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
</script>

<style>
.sidebar-left {
  position: fixed;
  left: 2vw;
  top: 2vw;
  display: grid;
  place-items: left;
}
</style>