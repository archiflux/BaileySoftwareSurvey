import softwareDatabaseJson from '../data/softwareDatabase.json';
import type { DisciplineSoftware, Discipline } from '../types/survey.types';

export const softwareDatabase: DisciplineSoftware[] = softwareDatabaseJson as DisciplineSoftware[];

export const getSoftwareForDiscipline = (discipline: Discipline): DisciplineSoftware | undefined => {
  return softwareDatabase.find(d => d.discipline === discipline);
};

export const getAllDisciplines = (): DisciplineSoftware[] => {
  return softwareDatabase;
};
