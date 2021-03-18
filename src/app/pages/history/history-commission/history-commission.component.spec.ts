import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCommissionComponent } from './history-commission.component';

describe('HistoryCommissionComponent', () => {
  let component: HistoryCommissionComponent;
  let fixture: ComponentFixture<HistoryCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
