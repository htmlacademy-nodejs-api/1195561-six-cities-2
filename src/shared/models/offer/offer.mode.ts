import { Schema, Document, model } from 'mongoose';
import { TOffer, City, Type, Amenity } from '../../types/index.js';

export interface OfferDocument extends TOffer, Document {}

const offerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 1024,
    },
    postDate: {
      type: Date,
      required: true,
    },
    city: {
      type: String,
      required: true,
      enum: City,
    },
    previewImage: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      length: 6,
    },
    isPremium: {
      type: Boolean,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    type: {
      type: String,
      enum: Type,
      required: true,
    },
    bedrooms: {
      type: Number,
      min: 1,
      max: 8,
      required: true,
    },
    maxAdults: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 100,
      max: 100000,
    },
    goods: {
      type: [String],
      required: true,
      enum: Amenity,
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentsCount: {
      type: Number,
    },
    location: {
      type: {
        latitude: {
          type: Number,
          required: true,
        },
        longitude: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
  },
  { timestamps: true }
);

export const OfferModel = model<OfferDocument>('Offer', offerSchema);
