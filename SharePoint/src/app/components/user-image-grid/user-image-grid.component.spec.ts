import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserImageGridComponent } from './user-image-grid.component';

describe('UserImageGridComponent', () => {
  let component: UserImageGridComponent;
  let fixture: ComponentFixture<UserImageGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserImageGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserImageGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
