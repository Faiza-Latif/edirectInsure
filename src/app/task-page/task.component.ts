import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  status = '!done';
  constructor() { }

  ngOnInit(): void {
  }

  changeStatus(): void{
    this.status = 'done';
  }
}
