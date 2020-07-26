import { Task } from '../task-page/task.model';

export class Project {
  constructor(
    public id: string,
    public userId: string,
    public projectTitle: string,
    public tasks?: Task[],
    public tasksTodo?: Task[],
    public tasksDone?: Task[],

  ) {}
}
