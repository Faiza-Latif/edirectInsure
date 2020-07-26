import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskPageCreationComponent } from './task-page-creation.component';

describe('TaskPageCreationComponent', () => {
  let component: TaskPageCreationComponent;
  let fixture: ComponentFixture<TaskPageCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskPageCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskPageCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
