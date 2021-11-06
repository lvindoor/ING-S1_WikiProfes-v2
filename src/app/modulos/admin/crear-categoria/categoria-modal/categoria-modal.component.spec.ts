import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CategoriaModalComponent } from './categoria-modal.component';

describe('CategoriaModalComponent', () => {
  let component: CategoriaModalComponent;
  let fixture: ComponentFixture<CategoriaModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
