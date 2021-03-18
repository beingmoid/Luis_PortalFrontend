import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCaseComponent } from './history-case.component';

describe('HistoryCaseComponent', () => {
  let component: HistoryCaseComponent;
  let fixture: ComponentFixture<HistoryCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
