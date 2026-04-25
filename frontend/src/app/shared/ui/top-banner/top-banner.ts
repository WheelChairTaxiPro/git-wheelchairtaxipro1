import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DrawerService } from '../../services/drawer.service';

@Component({
  selector: 'app-top-banner',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './top-banner.html',
  styleUrl: './top-banner.scss',
})
export class TopBanner {
  protected readonly drawerService = inject(DrawerService);
}
