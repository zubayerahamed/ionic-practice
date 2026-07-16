import { SplashScreen } from '@capacitor/splash-screen';
import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton, IonButton],
})
export class Tab1Page {
  constructor() { }



  opneSplashScreen() {
    SplashScreen.show({
      showDuration: 10000,
      autoHide: true,
    });
  }





}
