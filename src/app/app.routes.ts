import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'camera',
    loadComponent: () => import('./pages/camera/camera.page').then( m => m.CameraPage)
  },  {
    path: 'food-items',
    loadComponent: () => import('./pages/food-items/food-items.page').then( m => m.FoodItemsPage)
  },

];
