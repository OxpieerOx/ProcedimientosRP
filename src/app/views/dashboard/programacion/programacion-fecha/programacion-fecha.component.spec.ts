import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramacionFechaComponent } from './programacion-fecha.component';

describe('ProgramacionFechaComponent', () => {
  let component: ProgramacionFechaComponent;
  let fixture: ComponentFixture<ProgramacionFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramacionFechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgramacionFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
