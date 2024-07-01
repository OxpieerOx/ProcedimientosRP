import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionEditComponent } from './programacion-edit.component';

describe('ProgramacionEditComponent', () => {
  let component: ProgramacionEditComponent;
  let fixture: ComponentFixture<ProgramacionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
