import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearCategoriaComponent } from './crear-categoria.component';

describe('CrearCategoriaComponent', () => {
  let component: CrearCategoriaComponent;
  let fixture: ComponentFixture<CrearCategoriaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
