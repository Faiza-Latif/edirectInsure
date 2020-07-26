export class Task {
  constructor(
      public id: string,
      public taskTitle: string,
      public description: string,
      public creationDate: Date,
      public status: string,
      public finishDate?: Date
     ) {}
}
