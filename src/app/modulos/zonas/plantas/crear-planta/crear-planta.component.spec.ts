import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPlantaComponent } from './crear-planta.component';

describe('CrearPlantaComponent', () => {
  let component: CrearPlantaComponent;
  let fixture: ComponentFixture<CrearPlantaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearPlantaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPlantaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
