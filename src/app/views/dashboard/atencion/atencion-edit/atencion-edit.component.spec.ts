import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionEditComponent } from './atencion-edit.component';

describe('AtencionEditComponent', () => {
  let component: AtencionEditComponent;
  let fixture: ComponentFixture<AtencionEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtencionEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtencionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
