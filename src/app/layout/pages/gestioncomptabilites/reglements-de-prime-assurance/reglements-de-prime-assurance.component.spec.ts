import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglementsDePrimeAssuranceComponent } from './reglements-de-prime-assurance.component';

describe('ReglementsDePrimeAssuranceComponent', () => {
  let component: ReglementsDePrimeAssuranceComponent;
  let fixture: ComponentFixture<ReglementsDePrimeAssuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReglementsDePrimeAssuranceComponent]
    });
    fixture = TestBed.createComponent(ReglementsDePrimeAssuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
