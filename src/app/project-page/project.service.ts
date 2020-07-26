import { take, switchMap, tap, map, filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { BehaviorSubject, pipe } from 'rxjs';
import { Project } from './project.model';
import { Injectable } from '@angular/core';
import { Task } from '../task-page/task.model';
interface ProjectData {
  userId: string;
  projectTitle: string;
  tasks?: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private authService: AuthService, private http: HttpClient) {}

  private _projects = new BehaviorSubject<Project[]>([]);

  get projects() {
    return this._projects.asObservable();
  }

  addProject(projectTitle) {
    let generatedId: string;
    let newProject;
    let fetchedUserId;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No user id found!');
        }
        newProject = new Project(
          Math.random().toString(),
          fetchedUserId,
          projectTitle
        );
        return this.http.post<{ name: string }>(
          `https://edirectinsure-f300f.firebaseio.com/projects.json?auth=${token}`,
          { ...newProject, id: null }
        );
      }),
      switchMap((responseData) => {
        generatedId = responseData.name;
        return this.projects;
      }),
      take(1),
      tap((projects) => {
        newProject.id = generatedId;
        this._projects.next(projects.concat(newProject));
      })
    );
  }

  fetchProjects() {
    //dynamic keys and the value of the keys will be of type BookingData
    let fetchedUserId;

    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.get<{ [key: string]: ProjectData }>(
          // tslint:disable-next-line: max-line-length
          `https://edirectinsure-f300f.firebaseio.com/projects.json?orderBy="userId"&equalTo="${fetchedUserId}"&auth=${token}`
        );
      }),
      map((projectData) => {
        const fetchedProjects = [];
        for (const key in projectData) {
          if (projectData.hasOwnProperty(key)) {
            fetchedProjects.push(
              new Project(
                key,
                projectData[key].userId,
                projectData[key].projectTitle,
                projectData[key].tasks
              )
            );
          }
        }
        return fetchedProjects;
      }),
      tap((projects) => {
        this._projects.next(projects);
      })
    );
  }

  deleteProject(projectId) {
    return this.authService.token.pipe(take(1),
        switchMap(token => {
            return this.http.delete(`https://edirectinsure-f300f.firebaseio.com/projects/${projectId}.json?auth=${token}`);
        }), switchMap(() => {
                    return this.projects;
                }),
                take(1),
                tap(projects => {
                    this._projects.next(projects.filter(project => project.id !== projectId));
                })
            );

  }

  editProjectName(projectId, projectName) {
    let fetchedUserId;
    let fectchedProject;
    return this.authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        if (!fetchedUserId) {
          throw new Error('No user id found!');
        }
        return this.projects;
      }),
      take(1),
      switchMap((projects) => {
            fectchedProject = projects.filter(project => project.id === projectId);
            console.log(fectchedProject + 'project');
            fectchedProject[0].projectTitle = projectName;
            return this.authService.token;
      }),
      take(1),
      switchMap((token) => {
        return this.http.put<Project>(
          `https://edirectinsure-f300f.firebaseio.com/projects.json?auth=${token}`,
          { ...fectchedProject, id: projectId}
    );
      }),
      take(1),
      tap((responseData) => {
       console.log(responseData);
      })
    );
  }

}
