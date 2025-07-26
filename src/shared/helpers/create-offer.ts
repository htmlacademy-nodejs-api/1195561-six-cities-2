import {
  Type,
  City,
  Amenity,
  TOffer,
  DECIMAL_RADIX,
  TSV_DELIMITER,
  LIST_DELIMITER,
  NEWLINE,
} from '../types/index.js';

export function createOffer(offerData: string): TOffer {
  // Проверяем, что строка не пустая
  const trimmedData = offerData.trim();

  if (!trimmedData) {
    throw new Error('Empty offer data provided');
  }

  const [
    title,
    description,
    createdDate,
    city,
    previewImage,
    housingImages,
    isPremium,
    isFavorite,
    rating,
    type,
    bedrooms,
    maxAdults,
    price,
    amenities,
    firstname,
    lastname,
    email,
    avatarPath,
    commentsCount,
    latitude,
    longitude,
  ] = trimmedData.replace(NEWLINE, '').split(TSV_DELIMITER);

  const host = {
    email,
    firstname,
    lastname,
    avatarPath,
  };

  return {
    title,
    description,
    postDate: new Date(createdDate),
    city: city as City,
    previewImage,
    images: housingImages.split(LIST_DELIMITER),
    isPremium: isPremium === 'true',
    isFavorite: isFavorite === 'true',
    rating: parseFloat(rating),
    type: type as Type,
    bedrooms: Number.parseInt(bedrooms, DECIMAL_RADIX),
    maxAdults: Number.parseInt(maxAdults, DECIMAL_RADIX),
    price: Number.parseInt(price, DECIMAL_RADIX),
    goods: amenities.split(LIST_DELIMITER) as Amenity[],
    host,
    commentsCount: Number.parseInt(commentsCount, DECIMAL_RADIX),
    location: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  };
}
