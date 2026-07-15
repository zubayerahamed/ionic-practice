import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FoodItemsPage } from './food-items.page';

describe('FoodItemsPage', () => {
  let component: FoodItemsPage;
  let fixture: ComponentFixture<FoodItemsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
