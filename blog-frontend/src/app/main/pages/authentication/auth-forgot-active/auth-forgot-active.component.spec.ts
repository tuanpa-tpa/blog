import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthForgotActiveComponent } from './auth-forgot-active.component';

describe('AuthForgotActiveComponent', () => {
  let component: AuthForgotActiveComponent;
  let fixture: ComponentFixture<AuthForgotActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthForgotActiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthForgotActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
