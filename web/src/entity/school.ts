export class School {
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
