export type Profile = {
  id?: number;
  email?: string;
  role?: string;
  verificationStatus?: string;
  displayName: string;
  bio: string;
  skills: string;
  location: string;
  avatarUrl: string;
};

export type CreatorStats = Record<string, number | string>;

export type Service = {
  id: number;
  ownerId: number;
  ownerName: string;
  title: string;
  description: string;
  price: number;
  tags: string;
  deliveryTime: number;
};
