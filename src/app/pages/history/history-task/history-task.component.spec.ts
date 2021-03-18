import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTaskComponent } from './history-task.component';

describe('HistoryTaskComponent', () => {
  let component: HistoryTaskComponent;
  let fixture: ComponentFixture<HistoryTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
