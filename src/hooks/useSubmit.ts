import {
  useCallback,
  useEffect,
  useMemo, useState,
} from 'react';

export const useSubmit = (
  matrix1: string,
  matrix2: string,
) => {
  const canSubmit = useMemo(
    () => !!(matrix1 && matrix2),
    [matrix1, matrix2],
  );
  const [currentStep, setCurrentStep] = useState<number>();
  const [totalSteps, setTotalSteps] = useState<number>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const submit = useCallback(
    () => {
      if (canSubmit) {
        fetch('/submit', { method: 'POST' });
        setIsLoading(true);
        setCurrentStep(0);
        setTotalSteps(0);
      }
    },
    [canSubmit, setIsLoading],
  );
  useEffect(
    () => {
      if (isLoading) {
        if (
          !(currentStep || totalSteps)
          || (currentStep! < totalSteps!)
        ) {
          const handler = () => fetch('/progress')
            .then((data) => data.json())
            .then(({ currentStep: c, totalSteps: t }) => {
              setCurrentStep(c);
              setTotalSteps(t);
            });
          const timer = setInterval(handler, 100);
          return () => clearInterval(timer);
        }
        setIsLoading(false);
        return undefined;
      }
      return undefined;
    },
    [
      isLoading,
      setTotalSteps,
      setCurrentStep,
      currentStep,
      totalSteps,
      setIsLoading,
    ],
  );
  const isDone = useMemo(
    () => currentStep && totalSteps && currentStep === totalSteps,
    [currentStep, totalSteps],
  );
  const progress = useMemo(
    () => {
      if (!(currentStep || totalSteps)) {
        return 0;
      }
      return parseInt(`${(currentStep! / totalSteps!) * 100}`, 10);
    },
    [currentStep, totalSteps],
  );
  return {
    canSubmit,
    submit,
    isLoading,
    currentStep,
    totalSteps,
    isDone,
    progress,
  };
};

export default useSubmit;
