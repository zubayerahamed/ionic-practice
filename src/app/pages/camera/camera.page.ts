import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonBackButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, close, trash } from 'ionicons/icons';
import { PhotoService, UserPhoto } from 'src/app/core/services/photo.service';

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
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonFab,
    IonFabButton,
    IonIcon,
    IonBackButton
  ]
})
export class CameraPage implements OnInit {

  photoService: PhotoService = inject(PhotoService);
  actionSheetController: ActionSheetController = inject(ActionSheetController);

  constructor() {
    addIcons({ camera, trash, close });
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }


  takePhoto() {
    this.photoService.addNewToGallery();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePhoto(photo, position);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }
}
