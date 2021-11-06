import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CargandoComponent } from './cargando.component';

describe('CargandoComponent', () => {
  let component: CargandoComponent;
  let fixture: ComponentFixture<CargandoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CargandoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
