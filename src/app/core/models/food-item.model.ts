export interface FoodItem {
  id: number;
  name: string;
}

export interface CreateFoodItemRequest {
  name: string;
}

export interface UpdateFoodItemRequest {
  id: number;
  name: string;
}
