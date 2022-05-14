
export default interface Education {
  id: string;
  title: string;
  body: string;
  premium: boolean;
  category: Category;
  image: {
    src: string;
    title: string;
  };
  createdate: Date;
}

export enum Category {
  GENERAL = 'general',
  NUTRITIONAL = 'nutritional',
  EXERCISE = 'exercise',
}
