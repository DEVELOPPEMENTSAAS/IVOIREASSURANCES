import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationJourneeComponent } from './creation-journee.component';

describe('CreationJourneeComponent', () => {
  let component: CreationJourneeComponent;
  let fixture: ComponentFixture<CreationJourneeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreationJourneeComponent]
    });
    fixture = TestBed.createComponent(CreationJourneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
