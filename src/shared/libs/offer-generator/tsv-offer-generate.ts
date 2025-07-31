import dayjs from 'dayjs';
import { OfferGenerate } from './offer-generate.interface.js';
import {
  MockData,
  Type,
  City,
  MAX_HOUSING_IMAGES,
  MIN_AMENITIES_COUNT,
  MAX_AMENITIES_COUNT,
  MAX_COMMENTS_COUNT,
  PREMIUM_PROBABILITY,
  FAVORITE_PROBABILITY,
  LIST_DELIMITER,
  NAME_DELIMITER,
  TSV_DELIMITER,
  MIN_PRICE,
  MAX_PRICE,
  MIN_RATING,
  MAX_RATING,
  MIN_BEDROOMS,
  MAX_BEDROOMS,
  MIN_ADULTS,
  MAX_ADULTS,
  FIRST_WEEK_DAY,
  LAST_WEEK_DAY,
  CITY_COORDINATES,
} from '../../types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';

export class TSVOfferGenerate implements OfferGenerate {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities) as City;
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const housingImages = getRandomItems<string>(
      this.mockData.housingImages,
      MAX_HOUSING_IMAGES
    ).join(LIST_DELIMITER);
    const isPremium = Math.random() > PREMIUM_PROBABILITY;
    const isFavorite = Math.random() > FAVORITE_PROBABILITY;
    const rating = (
      Math.random() * (MAX_RATING - MIN_RATING) +
      MIN_RATING
    ).toFixed(1);
    const type = getRandomItem<string>(this.mockData.housingTypes) as Type;
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS);
    const maxAdults = generateRandomValue(MIN_ADULTS, MAX_ADULTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const amenities = getRandomItems<string>(
      this.mockData.amenities,
      generateRandomValue(MIN_AMENITIES_COUNT, MAX_AMENITIES_COUNT)
    ).join(LIST_DELIMITER);
    const host = getRandomItem<string>(this.mockData.hosts);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatars);
    const commentsCount = generateRandomValue(0, MAX_COMMENTS_COUNT);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const [firstname, lastname] = host.split(NAME_DELIMITER);
    const coordinates = CITY_COORDINATES[city as City];

    return [
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
      avatar,
      commentsCount,
      coordinates.latitude,
      coordinates.longitude,
    ].join(TSV_DELIMITER);
  }
}
