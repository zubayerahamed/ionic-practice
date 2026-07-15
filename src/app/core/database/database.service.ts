import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private readonly databaseName = 'food_database';
  private readonly databaseVersion = 1;
  private readonly isWeb = Capacitor.getPlatform() === 'web';

  private readonly sqliteConnection = new SQLiteConnection(
    CapacitorSQLite,
  );

  private database?: SQLiteDBConnection;
  private initializationPromise?: Promise<void>;

  initializeDatabase(): Promise<void> {
    if (!this.initializationPromise) {
      this.initializationPromise = this.performInitialization().catch(
        (error: unknown) => {
          /*
           * Reset it after failure so initialization can be retried.
           * Otherwise the rejected Promise remains cached forever.
           */
          this.initializationPromise = undefined;
          throw error;
        },
      );
    }

    return this.initializationPromise;
  }

  async getDatabase(): Promise<SQLiteDBConnection> {
    await this.initializeDatabase();

    if (!this.database) {
      throw new Error('Database connection is not available.');
    }

    return this.database;
  }

  async saveWebDatabase(): Promise<void> {
    if (!this.isWeb) {
      return;
    }

    await this.sqliteConnection.saveToStore(this.databaseName);
  }

  private async performInitialization(): Promise<void> {
    if (this.isWeb) {
      await this.initializeWebStore();
    }

    await this.openConnection();
    await this.createSchema();

    if (this.isWeb) {
      await this.saveWebDatabase();
    }
  }

  private async initializeWebStore(): Promise<void> {
    /*
     * Wait until the browser knows the custom element.
     */
    await customElements.whenDefined('jeep-sqlite');

    /*
     * Because initializeDatabase() is called from ngAfterViewInit(),
     * this element should now exist.
     */
    // const jeepSqliteElement =
    //   document.querySelector<HTMLJeepSqliteElement>('jeep-sqlite');
    const jeepSqliteElement =
      document.querySelector('jeep-sqlite');

    if (!jeepSqliteElement) {
      throw new Error(
        'The jeep-sqlite element was not found. ' +
        'Make sure <jeep-sqlite></jeep-sqlite> exists in AppComponent.',
      );
    }

    await this.sqliteConnection.initWebStore();
  }

  private async openConnection(): Promise<void> {
    const consistencyResult =
      await this.sqliteConnection.checkConnectionsConsistency();

    const connectionResult =
      await this.sqliteConnection.isConnection(
        this.databaseName,
        false,
      );

    if (
      consistencyResult.result &&
      connectionResult.result
    ) {
      this.database =
        await this.sqliteConnection.retrieveConnection(
          this.databaseName,
          false,
        );
    } else {
      this.database =
        await this.sqliteConnection.createConnection(
          this.databaseName,
          false,
          'no-encryption',
          this.databaseVersion,
          false,
        );
    }

    const isOpenResult = await this.database.isDBOpen();

    if (!isOpenResult.result) {
      await this.database.open();
    }
  }

  private async createSchema(): Promise<void> {
    if (!this.database) {
      throw new Error('Database has not been opened.');
    }

    const schema = `
      CREATE TABLE IF NOT EXISTS food_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_food_items_name
      ON food_items(name);
    `;

    await this.database.execute(schema);
  }
}
