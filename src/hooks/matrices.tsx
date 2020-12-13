import {
  useState,
  useCallback,
  createContext,
  useContext,
  FC,
} from 'react';
import { useSettings } from './settings';

type MatrixType = string[][];
type MatricesValuesType = {
  A?: MatrixType,
  B?: MatrixType,
};
type MatricesSettersType = {
  generate: () => void,
};
type MatricesContextType = MatricesValuesType & MatricesSettersType;

export const MatricesContext = createContext<MatricesContextType>({
  generate: () => {},
});

const generateNumber = (
  min : number,
  max : number,
) => Math.random() * (max - min) + min;
const generateMatrix = (
  n : number,
  m : number,
  min : number,
  max : number,
  isFloat: boolean,
) => new Array(n)
  .fill(0)
  .map(() => new Array(m)
    .fill(0)
    .map(() => {
      const val = generateNumber(min, max);
      if (isFloat) {
        return val.toFixed(2);
      }
      return `${parseInt(`${val}`, 10)}`;
    }));
export const MatricesProvider: FC = ({ children }) => {
  const {
    n, m, p, min, max, isFloat,
  } = useSettings();
  const [A, setA] = useState<MatrixType | undefined>();
  const [B, setB] = useState<MatrixType | undefined>();
  const generate = useCallback(
    () => {
      setA(generateMatrix(n, m, min, max, isFloat));
      setB(generateMatrix(m, p, min, max, isFloat));
    },
    [setA, setB, m, n, p, min, max, isFloat],
  );
  return (
    <MatricesContext.Provider value={{
      A, B, generate,
    }}
    >
      {children}
    </MatricesContext.Provider>
  );
};

export const useMatrices = () => useContext(MatricesContext);
export const useGenerateMatrices = () => useMatrices().generate;
