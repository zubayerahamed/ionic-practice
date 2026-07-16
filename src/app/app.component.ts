import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
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
import { DatabaseService } from './core/database/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  private readonly databaseService = inject(DatabaseService);

  public pages = [
    { title: 'Camera', url: '/camera', icon: 'camera-outline' },
    { title: 'Food Items', url: '/food-items', icon: 'camera-outline' },
    { title: 'Dashboard', url: '/tabs/tab1', icon: 'home-outline' },
    { title: 'Explore', url: '/tabs/tab2', icon: 'compass-outline' },
    { title: 'Settings', url: '/tabs/tab3', icon: 'cog-outline' },
  ];

  public darkMode = false;

  constructor() {
    addIcons({ homeOutline, compassOutline, cogOutline, moon, sunnyOutline, cameraOutline });
  }

  ngOnInit() {
    this.initializeTheme();
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      await this.databaseService.initializeDatabase();
      console.log('Database initialized successfully.');
    } catch (error: unknown) {
      console.error('Database initialization failed:', error);
    }
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

