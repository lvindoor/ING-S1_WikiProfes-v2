import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoNoticiaComponent } from './ingreso-noticia.component';

describe('IngresoNoticiaComponent', () => {
  let component: IngresoNoticiaComponent;
  let fixture: ComponentFixture<IngresoNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresoNoticiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
