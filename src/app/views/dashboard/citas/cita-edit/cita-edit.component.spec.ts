import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaEditComponent } from './cita-edit.component';

describe('CitaEditComponent', () => {
  let component: CitaEditComponent;
  let fixture: ComponentFixture<CitaEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitaEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
