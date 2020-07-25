export class Task {
  constructor(
      public id: string,
      public userId: string,
      public projectId: string,
      public taskTitle: string,
      public description: string,
      public creationDate: Date,
      public finishDate: Date
     ) {}
}
