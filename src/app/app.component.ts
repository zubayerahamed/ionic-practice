import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  IonNote,
  IonAvatar,
  IonToggle
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, compassOutline, cogOutline, moon, sunnyOutline, cameraOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenuToggle,
    IonNote,
    IonAvatar,
    IonToggle
  ],
})
export class AppComponent implements OnInit {
  public pages = [
    { title: 'Dashboard', url: '/tabs/tab1', icon: 'home-outline' },
    { title: 'Explore', url: '/tabs/tab2', icon: 'compass-outline' },
    { title: 'Settings', url: '/tabs/tab3', icon: 'cog-outline' },
    { title: 'Camera', url: '/camera', icon: 'camera-outline' },
  ];

  public darkMode = false;

  constructor() {
    addIcons({ homeOutline, compassOutline, cogOutline, moon, sunnyOutline, cameraOutline });
  }

  ngOnInit() {
    this.initializeTheme();
  }

  private initializeTheme() {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.darkMode = JSON.parse(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
      this.darkMode = prefersDark.matches;
    }
    this.applyTheme(this.darkMode);
  }

  public toggleTheme(event: any) {
    const isDark = event.detail.checked;
    this.darkMode = isDark;
    this.applyTheme(isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }

  private applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', isDark);
  }
}

