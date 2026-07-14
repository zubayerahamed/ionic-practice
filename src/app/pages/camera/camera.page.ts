import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonImg, IonMenuButton, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonImg
  ]
})
export class CameraPage implements OnInit {

  photoService: PhotoService = inject(PhotoService);

  constructor() { }

  ngOnInit() {
  }


  takePhoto() {
    this.photoService.addNewToGallery();
  }
}
