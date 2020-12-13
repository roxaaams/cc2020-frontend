export interface Matrix {
  id: string;
  rows: number;
  columns: number;
}

export interface MatrixInput {
  rows: number | undefined;
  columns: number | undefined;
}
