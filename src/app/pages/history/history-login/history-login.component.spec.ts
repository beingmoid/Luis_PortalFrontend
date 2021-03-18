import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryLoginComponent } from './history-login.component';

describe('HistoryLoginComponent', () => {
  let component: HistoryLoginComponent;
  let fixture: ComponentFixture<HistoryLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
