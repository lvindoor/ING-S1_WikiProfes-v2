import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepuracionUsuariosComponent } from './depuracion-usuarios.component';

describe('DepuracionUsuariosComponent', () => {
  let component: DepuracionUsuariosComponent;
  let fixture: ComponentFixture<DepuracionUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepuracionUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepuracionUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
