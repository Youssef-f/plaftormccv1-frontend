export type Profile = {
  displayName: string;
  bio: string;
  skills: string;
  location: string;
  avatarUrl: string;
};

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
