import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryContactComponent } from './history-contact.component';

describe('HistoryContactComponent', () => {
  let component: HistoryContactComponent;
  let fixture: ComponentFixture<HistoryContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
