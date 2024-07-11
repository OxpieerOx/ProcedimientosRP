import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasAddComponent } from './citas-add.component';

describe('CitasAddComponent', () => {
  let component: CitasAddComponent;
  let fixture: ComponentFixture<CitasAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitasAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
