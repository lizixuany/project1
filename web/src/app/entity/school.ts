export class School {
  // tslint:disable-next-line:variable-name
  school_id: number;
  name: string;

  constructor(data = {} as {
    school_id?: number;
    name?: string;
  }) {
    this.school_id = data.school_id as number;
    this.name = data.name as string;
  }
}
