import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtOrganizerComponent } from './thought-organizer.component';

describe('ThoughtOrganizerComponent', () => {
  let component: ThoughtOrganizerComponent;
  let fixture: ComponentFixture<ThoughtOrganizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThoughtOrganizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThoughtOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
