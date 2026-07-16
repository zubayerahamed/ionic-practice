import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController, IonBackButton
} from '@ionic/angular/standalone';
import { FoodItem } from 'src/app/core/models/food-item.model';
import { FoodItemService } from 'src/app/core/services/food-item.service';


@Component({
  selector: 'app-food-items',
  standalone: true,
  templateUrl: './food-items.page.html',
  styleUrls: ['./food-items.page.scss'],
  imports: [IonBackButton,
    CommonModule,
    FormsModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
    IonNote,
    IonButtons,
    IonSpinner,
  ],
})
export class FoodItemsPage implements OnInit {
  private readonly foodItemService = inject(FoodItemService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private cdr = inject(ChangeDetectorRef);

  foodItems: FoodItem[] = [];

  foodName = '';
  editingId: number | null = null;

  isLoading = false;
  isSaving = false;

  async ngOnInit(): Promise<void> {
    await this.loadFoodItems();
  }

  async loadFoodItems(): Promise<void> {
    this.isLoading = true;

    try {
      this.foodItems = await this.foodItemService.findAll();
    } catch (error: unknown) {
      await this.showError(error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveFoodItem(): Promise<void> {
    if (!this.foodName.trim()) {
      await this.showToast('Enter a food item name.');
      return;
    }

    this.isSaving = true;

    try {
      if (this.editingId === null) {
        await this.foodItemService.create({
          name: this.foodName,
        });

        await this.showToast('Food item created.');
      } else {
        await this.foodItemService.update({
          id: this.editingId,
          name: this.foodName,
        });

        await this.showToast('Food item updated.');
      }

      this.resetForm();
      await this.loadFoodItems();
    } catch (error: unknown) {
      await this.showError(error);
    } finally {
      this.isSaving = false;
    }
  }

  startEdit(foodItem: FoodItem): void {
    this.editingId = foodItem.id;
    this.foodName = foodItem.name;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  async confirmDelete(foodItem: FoodItem): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Delete food item',
      message: `Delete "${foodItem.name}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            void this.deleteFoodItem(foodItem.id);
          },
        },
      ],
    });

    await alert.present();
  }

  private async deleteFoodItem(id: number): Promise<void> {
    try {
      await this.foodItemService.delete(id);
      await this.showToast('Food item deleted.');
      await this.loadFoodItems();

      if (this.editingId === id) {
        this.resetForm();
      }

      this.cdr.detectChanges();
    } catch (error: unknown) {
      await this.showError(error);
    }
  }

  private resetForm(): void {
    this.foodName = '';
    this.editingId = null;
  }

  private async showError(error: unknown): Promise<void> {
    const message =
      error instanceof Error
        ? error.message
        : 'An unexpected error occurred.';

    await this.showToast(message);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }
}
