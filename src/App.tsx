import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  TextField,
  Typography,
  LinearProgress,
} from '@material-ui/core';
import styled from 'styled-components';
import { NavBar } from './components/NavBar';
import {
  useMatrixGeneratorTrigger,
  useMatrixInput,
  useMatrixListener,
} from './hooks/hook.matrix';
import { useMatrixCalculationTrigger } from './hooks/hook.master';
import SelectionCard from './components/SelectionCard';
import { Calculation, Matrix } from './types/type.matrix';
import SelectionDrawer from './components/SelectionDrawer';

const StyledContainer = styled(Container)`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: space-between;
  & > * {
    flex: 1;
    margin: 25px;
    min-width: 300px;
  }
`;

const App: FC = () => {
  const [generated, setGenerated] = useState<number>(0);
  const [firstMatrix, setFirstMatrix] = useState<Matrix | undefined>();
  const [secondMatrix, setSecondMatrix] = useState<Matrix | undefined>();
  const [calculationRunning, setCalculationRunning] = useState<boolean>(true);
  const [currentCalculation, setCurrentCalculation] = useState<Calculation>();

  const {
    availableMatrices,
    resultMatrices,
    calculationCache,
  } = useMatrixListener();
  const onTrigger = useMatrixCalculationTrigger();

  const resetSelection = () => {
    setFirstMatrix(undefined);
    setSecondMatrix(undefined);
  };

  const [openMatrixGen, setOpenMatrixGen] = useState<boolean>(false);
  const [openMatrixSelection, setOpenMatrixSelection] = useState<boolean>(
    false
  );

  const selectMatrix = (matrix: Matrix) => {
    if (firstMatrix && !secondMatrix) {
      setSecondMatrix(matrix);
    } else if (firstMatrix && secondMatrix) {
      setFirstMatrix(matrix);
    } else {
      setFirstMatrix(matrix);
    }
  };

  const startCalculation = () => {
    onTrigger({
      multiplicand: { id: firstMatrix!.id },
      multiplier: { id: secondMatrix!.id },
    })();
    setCurrentCalculation({
      multiplicand_matrix_id: firstMatrix!.id,
      multiplier_matrix_id: secondMatrix!.id,
      totalCalculations: firstMatrix!.rows * secondMatrix!.columns,
    });
  };

  const closeMatrixGen = () => {
    setOpenMatrixGen(false);
  };

  useEffect(() => {
    if (resultMatrices) {
      for (let i = 0; i < resultMatrices.length; i++) {
        if (
          resultMatrices[i].multiplier_matrix_id ===
            currentCalculation?.multiplier_matrix_id &&
          resultMatrices[i].multiplier_matrix_id ===
            currentCalculation?.multiplier_matrix_id
        ) {
          let newCalc = { ...currentCalculation };
          newCalc.result_matrix_id = resultMatrices[i].result_matrix_id;
          setCurrentCalculation(newCalc);
          return;
        }
      }
    }
  }, [resultMatrices]);

  return (
    <>
      <NavBar
        openDrawer={() => {
          setOpenMatrixSelection(true);
        }}
        openGenModal={() => {
          setOpenMatrixGen(true);
        }}
      />
      <StyledContainer>
        <Box
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <SelectionCard
            firstMatrix={firstMatrix}
            secondMatrix={secondMatrix}
            onReset={resetSelection}
            onTriggerCalc={startCalculation}
          />
          {currentCalculation && (
            <>
              <Typography variant="h2" style={{ marginTop: '20px' }}>
                Calculation
              </Typography>
              <Box
                style={{
                  marginTop: '20px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box style={{ width: '95%' }}>
                  <LinearProgress
                    variant="determinate"
                    value={
                      currentCalculation?.result_matrix_id
                        ? ((calculationCache.get(
                            currentCalculation?.result_matrix_id
                          )
                            ? Array.from(
                                calculationCache
                                  .get(currentCalculation?.result_matrix_id)!
                                  .keys()
                              ).length
                            : 0) /
                            currentCalculation.totalCalculations) *
                          100
                        : 0
                    }
                  />
                </Box>
                <Typography>{`${
                  currentCalculation?.result_matrix_id
                    ? ((calculationCache.get(
                        currentCalculation?.result_matrix_id
                      )
                        ? Array.from(
                            calculationCache
                              .get(currentCalculation?.result_matrix_id)!
                              .keys()
                          ).length
                        : 0) /
                        currentCalculation.totalCalculations) *
                      100
                    : 0
                }%`}</Typography>
              </Box>
            </>
          )}
        </Box>
      </StyledContainer>
      <MatrixGenModal
        open={openMatrixGen}
        close={closeMatrixGen}
        addLoading={() => {
          setGenerated((curr) => curr + 1);
        }}
      />
      <SelectionDrawer
        matrices={availableMatrices || []}
        loading={generated - availableMatrices.length}
        isOpen={openMatrixSelection}
        onSelect={selectMatrix}
        onClose={() => {
          setOpenMatrixSelection(false);
        }}
      />
    </>
  );
};

const MatrixGenModal = ({
  open,
  close,
  addLoading,
}: {
  open: boolean;
  close: () => void;
  addLoading: () => void;
}) => {
  const { values, onInput, resetInput } = useMatrixInput();
  const onSubmit = useMatrixGeneratorTrigger();

  return (
    <Dialog open={open} onClose={close}>
      <form
        noValidate
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(values)();
        }}
      >
        <DialogContent>
          <Box
            style={{
              minWidth: '500px',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5">generate a new Matrix</Typography>
            <Box
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
              }}
            >
              <TextField
                id="rows"
                label="rows"
                type="number"
                value={values.rows}
                onChange={onInput('rows')}
              />
              <TextField
                id="columns"
                label="columns"
                type="number"
                value={values.columns}
                onChange={onInput('columns')}
              />
            </Box>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onSubmit(values)();
                resetInput();
                close();
                addLoading();
              }}
            >
              Generate
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default App;
