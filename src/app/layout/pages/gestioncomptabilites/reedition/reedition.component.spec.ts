import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReeditionComponent } from './reedition.component';

describe('ReeditionComponent', () => {
  let component: ReeditionComponent;
  let fixture: ComponentFixture<ReeditionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReeditionComponent]
    });
    fixture = TestBed.createComponent(ReeditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
