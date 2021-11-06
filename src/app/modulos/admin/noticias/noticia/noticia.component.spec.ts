import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoticiaComponent } from './noticia.component';

describe('NoticiaComponent', () => {
  let component: NoticiaComponent;
  let fixture: ComponentFixture<NoticiaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
