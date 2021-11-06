import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSuperUserComponent } from './menu-super-user.component';

describe('MenuSuperUserComponent', () => {
  let component: MenuSuperUserComponent;
  let fixture: ComponentFixture<MenuSuperUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuSuperUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSuperUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
