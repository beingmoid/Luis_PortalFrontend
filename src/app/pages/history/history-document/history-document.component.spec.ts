import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDocumentComponent } from './history-document.component';

describe('HistoryDocumentComponent', () => {
  let component: HistoryDocumentComponent;
  let fixture: ComponentFixture<HistoryDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
