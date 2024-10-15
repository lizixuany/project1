export class School {
  // tslint:disable-next-line:variable-name
  id: number;
  name: string;

  constructor(data = {} as {
    id?: number;
    name?: string;
  }) {
    this.id = data.id as number;
    this.name = data.name as string;
  }
}
