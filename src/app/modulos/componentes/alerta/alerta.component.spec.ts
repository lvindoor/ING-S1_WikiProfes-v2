import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertaComponent } from './alerta.component';

describe('AlertaComponent', () => {
  let component: AlertaComponent;
  let fixture: ComponentFixture<AlertaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
