export default interface Test {
  id: string;
  name: string;
  purpose: string;
  description: string;
  riskZone: string;
  scores?: Scores;
};

interface Scores {
  men: { [key: string]: string };
  women: { [key: string]: string };
}
