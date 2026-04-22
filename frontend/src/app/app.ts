import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ContactStrip } from './features/contact-strip/contact-strip';
import { BottomNav } from './shared/ui/bottom-nav/bottom-nav';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ContactStrip, BottomNav],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
