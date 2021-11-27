export default interface Test {
  id: string;
  name: string;
  type: 'countdown' | 'countup' | 'untimed';
  time?: number;
  summary: string;
  how: string[];
  metric?: string;
  mens?: Table | PercentileTable;
  womens?: Table | PercentileTable;
};

export interface Table {
  age: Row;
  excellent?: Row;
  good?: Row;
  aboveAverage?: Row;
  average?: Row;
  belowAverage?: Row;
  poor?: Row;
  veryPoor?: Row;
}

export interface Row {
  col1?: Cell;
  col2?: Cell;
  col3?: Cell;
  col4?: Cell;
  col5?: Cell;
  col6?: Cell;
}

export interface Cell {
  higher?: string;
  lower?: string;
}

export interface PercentileTable {
  '10th': string;
  '20th': string;
  '30th': string;
  '40th': string;
  '50th': string;
  '60th': string;
  '70th': string;
  '80th': string;
  '90th': string;
}
