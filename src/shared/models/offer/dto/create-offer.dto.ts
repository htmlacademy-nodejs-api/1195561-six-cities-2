import { City, Type, Amenity } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: Type;
  public bedrooms: number;
  public maxAdults: number;
  public price: number;
  public goods: Amenity[];
  public host: string;
  public commentsCount: number;
  public location: {
    latitude: number;
    longitude: number;
  };
}
