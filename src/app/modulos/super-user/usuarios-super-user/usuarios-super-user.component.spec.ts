import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosSuperUserComponent } from './usuarios-super-user.component';

describe('UsuariosSuperUserComponent', () => {
  let component: UsuariosSuperUserComponent;
  let fixture: ComponentFixture<UsuariosSuperUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuariosSuperUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuariosSuperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
