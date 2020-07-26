import { Task } from './task.model';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


interface TaskData {
    userId: string;
    projectId: string;
    taskTitle: string;
    description: string;
    creationDate: Date;
    status: string;
    finishDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
    constructor(private authService: AuthService,
      private http: HttpClient) { }


      private _task = new BehaviorSubject<Task>(null);

      get projects() {
        return this._task.asObservable();
      }

      fetchTasks(projectId){
      //map doesnt return a new observable
      return this.authService.token.pipe(take(1),
        switchMap(token => {
          return this.http
            .get<{ [key: string]: TaskData }>(`https://edirectinsure-f300f.firebaseio.com/projects/${projectId}/tasks.json?auth=${token}`);
        }), map(
          taskData => {
            const tasks = [];
            for (const key in taskData) {
              if (taskData.hasOwnProperty(key)) {
                tasks.push(new Task(
                  key,
                  taskData[key].taskTitle,
                  taskData[key].description,
                  new Date(taskData[key].creationDate),
                  taskData[key].status,
                  new Date(taskData[key].finishDate)
                ));
              }
            }
            return tasks;
          })
      );
    }

    getTask(projectId: string, taskId: string): Observable<Task> {
      return this.authService.token.pipe(take(1),
        switchMap(token => {
          return this.http.get<TaskData>(`https://edirectinsure-f300f.firebaseio.com/projects/${projectId}/tasks/${taskId}.json?auth=${token}`);

        }),
        map((responseData => {
          return new Task(taskId, responseData.taskTitle,
            responseData.description,
            new Date(responseData.creationDate), responseData.status, new Date(responseData.finishDate));
        })
        )
      );
    }

    addTask(projectId:string, taskTitle: string, description: string) {
      let generatedId: string;
      let newTask: Task;
      let fetchedUserId;
      return this.authService.userId.pipe(
        take(1),
        switchMap(id => {
          fetchedUserId = id;
          return this.authService.token;
        }),
        take(1),
        switchMap(token => {
          newTask = new Task(
            Math.random.toString(),
            taskTitle,
            description,
            new Date(Date.now()),
            'toDo'
          );
          return this.http
            .post<{ name: string }>
            (`https://edirectinsure-f300f.firebaseio.com/projects/${projectId}/tasks.json?auth=${token}`, {...newTask, id: null});
        }),
       );
    }

    updateTask(projectId: string, id: string) {
      let updatedTask: Task;
      let fetchedToken;
      return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.getTask(projectId, id);
      }),
      take(1),
       switchMap(task=> {
          const oldTask = task;
          updatedTask = new Task(
            oldTask.id,
            oldTask.taskTitle,
            oldTask.description,
            oldTask.creationDate,
            'done',
            new Date(Date.now())
            );
          return this.http.put(`https://edirectinsure-f300f.firebaseio.com/projects/${projectId}/tasks/${id}.json?auth=${fetchedToken}`,
            { updatedTask });
        }), tap(() => {
          this._task.next(updatedTask);
        })
      );
      }

  }
