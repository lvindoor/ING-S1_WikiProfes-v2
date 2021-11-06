import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroEmpleadoComponent } from './numero-empleado.component';

describe('NumeroEmpleadoComponent', () => {
  let component: NumeroEmpleadoComponent;
  let fixture: ComponentFixture<NumeroEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumeroEmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeroEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
