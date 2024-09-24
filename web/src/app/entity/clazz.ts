export class Clazz {
  id: number;
  name: string;
  schoolId: number;

  constructor(data = {} as {
    id?: number;
    name?: string;
    schoolId?: number;
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
    this.schoolId = data.schoolId as number;
  }
}
