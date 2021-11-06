import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CrearNoticiaComponent } from './crear-noticia.component';

describe('CrearNoticiaComponent', () => {
  let component: CrearNoticiaComponent;
  let fixture: ComponentFixture<CrearNoticiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearNoticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
