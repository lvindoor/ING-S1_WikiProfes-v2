import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoAppComponent } from './ingreso-app.component';

describe('IngresoAppComponent', () => {
  let component: IngresoAppComponent;
  let fixture: ComponentFixture<IngresoAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
