import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sidebarmenu } from './sidebarmenu';

describe('Sidebarmenu', () => {
  let component: Sidebarmenu;
  let fixture: ComponentFixture<Sidebarmenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sidebarmenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sidebarmenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
