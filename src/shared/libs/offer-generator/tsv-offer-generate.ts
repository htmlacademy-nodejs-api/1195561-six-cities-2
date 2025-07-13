import dayjs from 'dayjs';
import { OfferGenerate } from './offer-generate.interface.js';
import { MockData, Offer } from '../../../../mocks/types/index.js';
import {
  generateRandomValue,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerate implements OfferGenerate {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const categories = getRandomItems<string>(this.mockData.categories).join(
      ';'
    );
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const photo = getRandomItem<string>(this.mockData.offerImages);
    const type = getRandomItem([Offer.Buy, Offer.Sell]);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const author = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const [firstname, lastname] = author.split(' ');

    return [
      title,
      description,
      createdDate,
      photo,
      type,
      price,
      categories,
      firstname,
      lastname,
      email,
      avatar,
    ].join('\t');
  }
}
