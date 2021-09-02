export default interface Test {
  id: string;
  name: string;
  type: 'countdown' | 'countup' | 'untimed';
  time?: number;
  summary: string;
  how: string[];
  improve: string;
  why: string;
  mens?: Table;
  womens?: Table;
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

interface Cell {
  higher?: number;
  lower?: number;
}
