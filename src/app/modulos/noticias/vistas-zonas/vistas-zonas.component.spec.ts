import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistasZonasComponent } from './vistas-zonas.component';

describe('VistasZonasComponent', () => {
  let component: VistasZonasComponent;
  let fixture: ComponentFixture<VistasZonasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistasZonasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistasZonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
