import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactStrip } from './contact-strip';

describe('ContactStrip', () => {
  let component: ContactStrip;
  let fixture: ComponentFixture<ContactStrip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactStrip],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactStrip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
