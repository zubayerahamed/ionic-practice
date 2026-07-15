import { Injectable, inject } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

import { DatabaseService } from '../../core/database/database.service';

import {
  CreateFoodItemRequest,
  FoodItem,
  UpdateFoodItemRequest,
} from '../models/food-item.model';

@Injectable({
  providedIn: 'root',
})
export class FoodItemService {
  private readonly databaseService = inject(DatabaseService);

  /**
   * CREATE
   */
  async create(
    request: CreateFoodItemRequest,
  ): Promise<FoodItem> {
    const name = this.validateName(request.name);
    const database = await this.getDatabase();

    const result = await database.run(
      `
        INSERT INTO food_items (
          name,
          created_at,
          updated_at
        )
        VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      [name],
    );

    await this.databaseService.saveWebDatabase();

    const insertedId = result.changes?.lastId;

    if (insertedId === undefined || insertedId === null) {
      throw new Error('Food item was created, but no ID was returned.');
    }

    const createdItem = await this.findById(insertedId);

    if (!createdItem) {
      throw new Error('Created food item could not be loaded.');
    }

    return createdItem;
  }

  /**
   * READ ALL
   */
  async findAll(): Promise<FoodItem[]> {
    const database = await this.getDatabase();

    const result = await database.query(`
      SELECT
        id,
        name
      FROM food_items
      ORDER BY id DESC
    `);

    return (result.values ?? []).map(
      (row: Record<string, unknown>): FoodItem => ({
        id: Number(row['id']),
        name: String(row['name']),
      }),
    );
  }

  /**
   * READ ONE
   */
  async findById(id: number): Promise<FoodItem | null> {
    this.validateId(id);

    const database = await this.getDatabase();

    const result = await database.query(
      `
        SELECT
          id,
          name
        FROM food_items
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    const row = result.values?.[0];

    if (!row) {
      return null;
    }

    return {
      id: Number(row['id']),
      name: String(row['name']),
    };
  }

  /**
   * UPDATE
   */
  async update(
    request: UpdateFoodItemRequest,
  ): Promise<FoodItem> {
    this.validateId(request.id);

    const name = this.validateName(request.name);
    const database = await this.getDatabase();

    const result = await database.run(
      `
        UPDATE food_items
        SET
          name = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      [name, request.id],
    );

    if ((result.changes?.changes ?? 0) === 0) {
      throw new Error(`Food item ${request.id} was not found.`);
    }

    await this.databaseService.saveWebDatabase();

    const updatedItem = await this.findById(request.id);

    if (!updatedItem) {
      throw new Error('Updated food item could not be loaded.');
    }

    return updatedItem;
  }

  /**
   * DELETE
   */
  async delete(id: number): Promise<void> {
    this.validateId(id);

    const database = await this.getDatabase();

    const result = await database.run(
      `
        DELETE FROM food_items
        WHERE id = ?
      `,
      [id],
    );

    if ((result.changes?.changes ?? 0) === 0) {
      throw new Error(`Food item ${id} was not found.`);
    }

    await this.databaseService.saveWebDatabase();
  }

  /**
   * Optional search method.
   */
  async search(searchText: string): Promise<FoodItem[]> {
    const database = await this.getDatabase();
    const searchValue = `%${searchText.trim()}%`;

    const result = await database.query(
      `
        SELECT
          id,
          name
        FROM food_items
        WHERE name LIKE ?
        ORDER BY name ASC
      `,
      [searchValue],
    );

    return (result.values ?? []).map(
      (row: Record<string, unknown>): FoodItem => ({
        id: Number(row['id']),
        name: String(row['name']),
      }),
    );
  }

  private async getDatabase(): Promise<SQLiteDBConnection> {
    return this.databaseService.getDatabase();
  }

  private validateName(value: string): string {
    const name = value?.trim();

    if (!name) {
      throw new Error('Food item name is required.');
    }

    if (name.length > 100) {
      throw new Error(
        'Food item name cannot exceed 100 characters.',
      );
    }

    return name;
  }

  private validateId(id: number): void {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('A valid food item ID is required.');
    }
  }
}
