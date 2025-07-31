import { Type } from './type.enum.js';
import { City } from './city.enum.js';
import { Amenity } from './amenity.enum.js';

export type TOffer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: Type;
  bedrooms: number;
  maxAdults: number;
  price: number;
  goods: Amenity[];
  host: {
    email: string;
    firstname: string;
    lastname: string;
    avatarPath: string;
  };
  commentsCount: number;
  location: {
    latitude: number;
    longitude: number;
  };
};
