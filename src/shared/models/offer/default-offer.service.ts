import { OfferService } from './offer-service.interface.js';
import { OfferModel, OfferDocument } from './offer.mode.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: typeof OfferModel
  ) {}

  public async create(
    offerData: Partial<CreateOfferDto>
  ): Promise<OfferDocument> {
    const offer = new OfferModel(offerData);
    const result = await this.offerModel.create(offer);

    this.logger.info(`New offer created: ${offer.title}`);

    return result;
  }

  public async findById(id: string): Promise<OfferDocument | null> {
    return OfferModel.findById(id);
  }

  public async findAll(): Promise<OfferDocument[]> {
    return OfferModel.find();
  }

  public async updateById(
    id: string,
    offerData: Partial<CreateOfferDto>
  ): Promise<OfferDocument | null> {
    const result = await OfferModel.findByIdAndUpdate(id, offerData, {
      new: true,
    });

    if (result) {
      this.logger.info(`Offer updated: ${result.title}`);
    }

    return result;
  }

  public async deleteById(id: string): Promise<boolean> {
    const result = await OfferModel.findByIdAndDelete(id);

    if (result) {
      this.logger.info(`Offer deleted: ${result.title}`);
      return true;
    }

    return false;
  }
}
