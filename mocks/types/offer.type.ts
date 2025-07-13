import { Offer } from "./offer.enum.js";

export type TOffer = {
    title: string;
    description: string;
    image: string;
    price: number;
    user: {
        email: string;
        firstname: string;
        lastname: string;
        avatarPath: string;
    };
    postDate: Date;
    type: Offer
    categories: { name: string }[];
};