import { TaskService } from './task.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  constructor(private taskService: TaskService) {

   }
  @Input() projectId: string;
  @Input() title: string;
  @Input() id: string;
  ngOnInit(): void {
  }

  changeStatus() {
    this.taskService.updateTask(this.projectId, this.id).subscribe();
  }

}
