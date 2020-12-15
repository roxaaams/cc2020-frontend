export interface Matrix {
  id: string;
  rows: number;
  columns: number;
}

export interface MatrixInput {
  rows: number | undefined;
  columns: number | undefined;
}

export interface Calculation {
  result_matrix_id?: string;
  multiplicand_matrix_id: string;
  multiplier_matrix_id: string;
  totalCalculations: number;
}
