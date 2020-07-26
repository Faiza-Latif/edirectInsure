import { TaskPageCreationComponent } from './../task-page/task-page-creation/task-page-creation.component';
import { TaskComponent } from './../task-page/task.component';
import { Project } from './project.model';
import { Subscription } from 'rxjs';
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
  tasksToDo: Task[];
  tasksDone: Task[];
  loadedProjects: Project[];
  private subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private projectService: ProjectService
  ) {
    this.projectService.fetchProjects().subscribe((projects) => {
      console.log(projects.length);
    });
  }

  ngOnInit(): void {
    this.projectService.projects.subscribe(data => {
      this.loadedProjects = data;
      console.log(this.loadedProjects);
    });
    this.form = this.fb.group({
      projectName: ['', Validators.required],
    });
  }

  deteleProject(id){
    this.projectService.deleteProject(id).subscribe();
  }

  editProject(id, newProjectTitle){
    this.projectService.editProjectName(id, 'a').subscribe();
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
      data: Task,
    });

    dialogRef.afterClosed().subscribe(result => {
      let task: Task;
      console.log('The dialog was closed');
      task.projectId = projectId;
      task.taskTitle = result.value.taskName;
      task.description = result.value.taskDescription;
      task.creationDate = result.value.creationDate;
      this.tasksToDo.push(task);
    });
  }



}
