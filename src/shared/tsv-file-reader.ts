import { readFileSync } from 'node:fs';

import { FileRead } from './file-read.interface.js';
import { resolve } from 'node:path';
import { Rents } from '../interfaces/rents.interface.js';

export class TsvFileReader implements FileRead {
  private rowData = '';

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rowData = readFileSync(resolve(this.filename), { encoding: 'utf-8'});
  }

  public toArray(): Rents[] {
    if (!this.rowData) {
      throw new Error('File was not read');
    }

    return this.rowData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split('\t'))
      .map(([ name,
        description,
        date,
        city,
        src,
        photos,
        isPremium,
        isFavorites,
        rate,
        type,
        countRooms,
        countGuests,
        price,
        comfort,
        avtor,
        comments,
        latitude,
        longitude ]) => ({
        name,
        description,
        date,
        city,
        src,
        photos: JSON.parse(photos) as string[],
        isPremium: isPremium === 'true',
        isFavorites: isFavorites === 'true',
        rate: parseInt(rate, 10),
        type,
        countRooms: parseInt(countRooms, 10),
        countGuests: parseInt(countGuests, 10),
        price: parseInt(price, 10),
        comfort,
        avtor,
        comments,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }));
  }
}
