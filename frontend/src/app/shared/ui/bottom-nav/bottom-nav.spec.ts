import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BottomNav } from './bottom-nav';

/** Routes under test — `RouterLink` / `RouterLinkActive` need `Router` + `ActivatedRoute`. */
@Component({ standalone: true, template: '' })
class EmptyRoute {}

describe('BottomNav', () => {
  let component: BottomNav;
  let fixture: ComponentFixture<BottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BottomNav, EmptyRoute],
      providers: [
        provideRouter([
          { path: '', component: EmptyRoute },
          { path: 'booking', component: EmptyRoute },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BottomNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
