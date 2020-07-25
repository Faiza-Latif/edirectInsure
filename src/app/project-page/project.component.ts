import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      projectName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const projectName = this.form.get('projectName').value;
      console.log(projectName);
    }
  }
}
