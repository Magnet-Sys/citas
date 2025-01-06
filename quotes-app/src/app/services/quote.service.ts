import { Injectable } from '@angular/core';
import { Quote } from '../models/quote.model';
import {
  SQLiteConnection,
  CapacitorSQLite,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  db!: SQLiteDBConnection;
  plataforma: string = '';
  DB_NAME: string = 'quotes.db';
  DB_READ_ONLY: boolean = false;
  DB_VERSION: number = 1;
  DB_ENCRIPTADA: boolean = false;
  DB_MODE: string = 'no-encryption';
  TABLE_NAME: string = 'quotes';
  COL_QUOTE: string = 'quote';
  COL_AUTHOR: string = 'author';

  DB_SQL_TABLAS: string = `
    CREATE TABLE IF NOT EXISTS ${this.TABLE_NAME} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ${this.COL_QUOTE} TEXT NOT NULL,
      ${this.COL_AUTHOR} TEXT NOT NULL
    );
  `;

  constructor() {}

  private async _iniciarPluginWeb(): Promise<void> {
    await customElements.whenDefined('jeep-sqlite');
    const jeepSqliteEl = document.querySelector('jeep-sqlite');
    if (jeepSqliteEl != null) {
      await this.sqlite.initWebStore();
    }
  }

  async iniciarPlugin(): Promise<void> {
    this.plataforma = Capacitor.getPlatform();
    if (this.plataforma == 'web') {
      await this._iniciarPluginWeb();
    }
    await this.abrirConexion();
    await this.db.execute(this.DB_SQL_TABLAS);

    // PRUEBA DE CITAS
    // this.addQuote({
    //   quote: 'Dios mío, ¡es asqueroso!',
    //   author: 'Stan Marsh',
    // });

    // this.addQuote({
    //   quote: '¡Hay una serpiente en mi bota!',
    //   author: 'Mr. Garrison',
    // });

    // this.addQuote({
    //   quote: 'No estoy gordo, estoy festivamente regordete.',
    //   author: 'Eric Cartman',
    // });
  }

  async abrirConexion() {
    const ret = await this.sqlite.checkConnectionsConsistency();
    const isConn = (
      await this.sqlite.isConnection(this.DB_NAME, this.DB_READ_ONLY)
    ).result;
    if (ret.result && isConn) {
      this.db = await this.sqlite.retrieveConnection(
        this.DB_NAME,
        this.DB_READ_ONLY
      );
    } else {
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        this.DB_ENCRIPTADA,
        this.DB_MODE,
        this.DB_VERSION,
        this.DB_READ_ONLY
      );
    }
    await this.db.open();
  }

  async getQuotes(): Promise<Quote[]> {
    const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY id DESC;`; // Ordeno por ID de forma descendente para que las citas más recientes aparezcan primero
    try {
      const resultado = await this.db.query(sql);
      console.log('Citas obtenidas:', resultado.values);
      return resultado?.values ?? [];
    } catch (error) {
      console.error('Error al obtener las citas:', error);
      return [];
    }
  }

  // South Park Quotes (My Favorite Show) :D
  async getRandomQuote(): Promise<Quote | null> {
    // Agregué validación para la base de datos (debe estar abierta antes de ejecutar la consulta)
    if (!this.db) {
      console.error('Base de datos no está abierta');
      return null;
    }

    const sql = `SELECT * FROM ${this.TABLE_NAME} ORDER BY RANDOM() LIMIT 1;`;
    try {
      const resultado = await this.db.query(sql);

      // Verifico que el resultado tenga valores antes de intentar acceder
      if (resultado?.values && resultado.values.length > 0) {
        const randomQuote = resultado.values[0]; // Selecciono la primera cita aleatoria.
        console.log(
          'Cita aleatoria obtenida del servicio getRandomQuote():',
          randomQuote
        );
        return {
          quote: randomQuote[this.COL_QUOTE],
          author: randomQuote[this.COL_AUTHOR],
        };
      } else {
        console.log('No se encontraron citas aleatorias.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener una cita aleatoria:', error);
      return null;
    }
  }

  async addQuote(cita: Quote): Promise<void> {
    const sql = `INSERT INTO ${this.TABLE_NAME}(${this.COL_QUOTE}, ${this.COL_AUTHOR}) VALUES(?, ?)`;
    try {
      await this.db.run(sql, [cita.quote, cita.author]);
      console.log('Cita agregada correctamente:', [cita.quote, cita.author]);
    } catch (error) {
      console.error('Error al agregar la cita:', error);
      throw error;
    }
  }

  async deleteQuote(id: number): Promise<void> {
    const sql = `DELETE FROM ${this.TABLE_NAME} WHERE id = ?;`;
    try {
      await this.db.run(sql, [id]);
      console.log(`Cita eliminada correctamente (ID: ${id})`);
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
      throw error;
    }
  }
}
