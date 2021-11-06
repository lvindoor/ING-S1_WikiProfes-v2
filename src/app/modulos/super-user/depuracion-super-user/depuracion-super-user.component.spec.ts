import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepuracionSuperUserComponent } from './depuracion-super-user.component';

describe('DepuracionSuperUserComponent', () => {
  let component: DepuracionSuperUserComponent;
  let fixture: ComponentFixture<DepuracionSuperUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepuracionSuperUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepuracionSuperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
