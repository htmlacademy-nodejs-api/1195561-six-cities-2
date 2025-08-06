import 'reflect-metadata';
import { Container } from 'inversify';
import { Command } from './command.interface.js';
import { TsvFileReader } from '../../shared/tsv-file-reader.js';
import {
  createOffer,
  getErrorMessage,
  getMongoURI,
} from '../../shared/helpers/index.js';
import {
  COMMAND_IMPORT,
  ERROR_CANT_IMPORT,
} from '../../shared/constants/commands.js';
import { UserModel } from '../../shared/models/user/user.model.js';
import { TOffer } from '../../shared/types/index.js';
import { Component } from '../../shared/types/index.js';
import {
  DEFAULT_DB_PORT,
  DEFAULT_USER_PASSWORD,
  DEFAULT_SALT,
} from './command.constant.js';
import { OfferService } from '../../shared/models/offer/offer-service.interface.js';
import { DatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';

export class ImportCommand implements Command {
  public getName(): string {
    return COMMAND_IMPORT;
  }

  public async execute(container: Container, ...args: string[]): Promise<void> {
    if (args.length < 5) {
      console.error(
        'Usage: --import <filename> <login> <password> <host> <dbname> [salt]'
      );
      console.error(
        'Example: --import ./data.tsv admin password localhost six-cities abc123'
      );
      return;
    }

    const [filename, login, password, host, dbname, salt = DEFAULT_SALT] = args;

    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);

    // Получаем зависимости из контейнера
    const logger = container.get<Logger>(Component.Logger);
    const databaseClient = container.get<DatabaseClient>(
      Component.DatabaseClient
    );
    const offerService = container.get<OfferService>(Component.OfferService);

    try {
      await databaseClient.connect(uri);
      const fileReader = new TsvFileReader(filename);

      fileReader.on('line', async (line: string, resolve: () => void) => {
        const offer = createOffer(line);
        await this.saveOffer(offer, offerService, logger, salt);
        resolve();
      });

      fileReader.on('end', (count: number) => {
        console.info(`${count} rows imported.`);
        databaseClient.disconnect();
      });

      await fileReader.read();
    } catch (error) {
      console.error(`${ERROR_CANT_IMPORT} ${filename}`);
      console.error(getErrorMessage(error));
    }
  }

  private async saveOffer(
    offer: TOffer,
    offerService: OfferService,
    logger: Logger,
    salt: string
  ) {
    let user = await UserModel.findOne({ email: offer.host.email });

    if (!user) {
      user = new UserModel({
        email: offer.host.email,
        avatarPath: offer.host.avatarPath,
        firstname: offer.host.firstname,
        lastname: offer.host.lastname,
        createdAt: new Date(),
      });

      user.setPassword(DEFAULT_USER_PASSWORD, salt);

      await UserModel.create(user);
      logger.info(`New user created: ${user.email}`);
    }

    await offerService.create({
      title: offer.title,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      images: offer.images,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      rating: offer.rating,
      type: offer.type,
      bedrooms: offer.bedrooms,
      maxAdults: offer.maxAdults,
      price: offer.price,
      goods: offer.goods,
      host: user.id,
      commentsCount: offer.commentsCount,
      location: offer.location,
    });
  }
}
