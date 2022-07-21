import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateMailComponent } from './generate-mail.component';

describe('GenerateMailComponent', () => {
  let component: GenerateMailComponent;
  let fixture: ComponentFixture<GenerateMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateMailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
