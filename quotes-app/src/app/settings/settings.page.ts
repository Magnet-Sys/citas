import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
})
export class SettingsPage implements OnInit {
  allowDeleteOnHome!: boolean;

  constructor(private settingsService: SettingsService) {}

  ngOnInit() {
    // Me suscribo a los cambios en allowDeleteOnHome
    this.settingsService.allowDeleteOnHome$.subscribe((value) => {
      this.allowDeleteOnHome = value;
    });
  }

  onToggleChange() {
    this.settingsService.setAllowDeleteOnHome(this.allowDeleteOnHome);
  }
}
