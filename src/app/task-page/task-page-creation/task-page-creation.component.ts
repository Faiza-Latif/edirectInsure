import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-page-creation',
  templateUrl: './task-page-creation.component.html',
  styleUrls: ['./task-page-creation.component.scss']
})
export class TaskPageCreationComponent implements OnInit {
  form: FormGroup;

  constructor(  private fb: FormBuilder) { }
  ngOnInit(): void {
    this.form = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: ['', Validators.required],
      creationDate: [Date.now(), Validators.required],
    });
  }

}
