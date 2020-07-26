import { take, tap } from 'rxjs/operators';
import { TaskService } from './../task-page/task.service';
import { TaskPageCreationComponent } from './../task-page/task-page-creation/task-page-creation.component';
import { Project } from './project.model';
import { Subscription, pipe } from 'rxjs';
import { ProjectService } from './project.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../task-page/task.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  form: FormGroup;
  loadedProjects: Project[];
  private subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {
    this.projectService.fetchProjects().subscribe((projects: Project[]) => {
      projects.forEach((element) => {
        this.taskService
          .fetchTasks(element.id)
          .pipe(
            take(1),
            tap((tasks) => {
              tasks.filter((task) => task.status !== 'done');
            })
          )
          .subscribe((data) => {
            element.tasksTodo = data;
          });
        this.taskService
          .fetchTasks(element.id)
          .pipe(
            take(1),
            tap((tasks) => {
              tasks.filter((task) => task.status === 'done');
            })
          )
          .subscribe((data) => {
            element.tasksDone = data;
          });
      });
    });
  }

  ngOnInit(): void {
    this.projectService.projects.subscribe((data) => {
      this.loadedProjects = data;
      console.log(this.loadedProjects);
    });
    this.form = this.fb.group({
      projectName: ['', Validators.required],
    });
  }

  deteleProject(id) {
    this.projectService.deleteProject(id).subscribe();
  }

  editProject(id, newProjectTitle) {
    this.projectService.editProjectName(id, 'new title').subscribe();
  }
  onSubmit() {
    if (this.form.valid) {
      const projectName = this.form.get('projectName').value;
      this.projectService.addProject(projectName).subscribe((response) => {
        console.log(response);
      });
      console.log(projectName);
    }
  }

  openDialog(projectId): void {
    const dialogRef = this.dialog.open(TaskPageCreationComponent, {
      width: '250px',
      data: projectId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.taskService.addTask(
        projectId,
        result.value.taskName,
        result.value.taskDescription
      );
    });
  }
}
