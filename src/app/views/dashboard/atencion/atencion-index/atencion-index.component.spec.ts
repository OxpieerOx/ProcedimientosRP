import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionIndexComponent } from './atencion-index.component';

describe('AtencionIndexComponent', () => {
  let component: AtencionIndexComponent;
  let fixture: ComponentFixture<AtencionIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtencionIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtencionIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
