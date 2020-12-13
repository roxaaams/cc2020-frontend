import {
  useState,
  createContext,
  useContext,
  FC,
  useCallback,
  ChangeEvent,
} from 'react';

export type SettingsValuesType = {
  n: number,
  m: number,
  p: number,
  min: number,
  max: number,
  isFloat: boolean
};

export type SettingsSettersType = {
  setN: (event: ChangeEvent<HTMLInputElement>) => void;
  setM: (event: ChangeEvent<HTMLInputElement>) => void;
  setP: (event: ChangeEvent<HTMLInputElement>) => void;
  setMin: (event: ChangeEvent<HTMLInputElement>) => void;
  setMax: (event: ChangeEvent<HTMLInputElement>) => void;
  setIsFloat: (event: ChangeEvent<HTMLInputElement>) => void;
};

export type SettingsContextType = SettingsValuesType & SettingsSettersType;

const useInput = <T, V>({
  parser,
  validator,
  defaultValue,
}: {
  parser: (input: ChangeEvent<T>) => V,
  validator?: (input: V) => boolean,
  defaultValue: V
}): [V, (input: ChangeEvent<T>) => void] => {
  const [value, setValue] = useState<V>(defaultValue);
  const handler = useCallback(
    (e: ChangeEvent<T>) => {
      try {
        const newValue = parser(e);
        if (validator && !validator(newValue)) {
          throw new Error(`Invalid value! (${JSON.stringify(newValue)})`);
        }
        setValue(newValue);
      } catch (err) {
        console.error(err);
      }
    },
    [setValue],
  );
  return [value, handler];
};

const intParser = ({
  target: { value },
}: ChangeEvent<HTMLInputElement>): number => parseInt(value, 10);
const intValidator = (input: number) => !Number.isNaN(input);

const checkedParser = ({
  target: { checked },
}: ChangeEvent<HTMLInputElement>): boolean => checked;

export const SettingsContext = createContext<SettingsContextType>({
  n: 0,
  m: 0,
  p: 0,
  min: 0,
  max: Number.MAX_SAFE_INTEGER,
  isFloat: true,
  setN: () => {},
  setM: () => {},
  setP: () => {},
  setMin: () => {},
  setMax: () => {},
  setIsFloat: () => {},
});

export const SettingsProvider: FC = ({ children }) => {
  const [n, setN] = useInput<HTMLInputElement, number>({
    parser: intParser,
    validator: intValidator,
    defaultValue: 10,
  });
  const [m, setM] = useInput<HTMLInputElement, number>({
    parser: intParser,
    validator: intValidator,
    defaultValue: 10,
  });
  const [p, setP] = useInput<HTMLInputElement, number>({
    parser: intParser,
    validator: intValidator,
    defaultValue: 10,
  });
  const [min, setMin] = useInput<HTMLInputElement, number>({
    parser: intParser,
    validator: intValidator,
    defaultValue: 0,
  });
  const [max, setMax] = useInput<HTMLInputElement, number>({
    parser: intParser,
    validator: intValidator,
    defaultValue: 100,
  });
  const [isFloat, setIsFloat] = useInput<HTMLInputElement, boolean>({
    parser: checkedParser,
    defaultValue: false,
  });
  return (
    <SettingsContext.Provider value={{
      n,
      setN,
      m,
      setM,
      p,
      setP,
      min,
      setMin,
      max,
      setMax,
      isFloat,
      setIsFloat,
    }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
