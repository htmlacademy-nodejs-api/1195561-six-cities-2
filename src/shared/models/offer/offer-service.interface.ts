import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferDocument } from './offer.mode.js';

export interface OfferService {
  create(offerData: Partial<CreateOfferDto>): Promise<OfferDocument>;
  findById(id: string): Promise<OfferDocument | null>;
  findAll(): Promise<OfferDocument[]>;
  updateById(
    id: string,
    offerData: Partial<CreateOfferDto>
  ): Promise<OfferDocument | null>;
  deleteById(id: string): Promise<boolean>;
}
