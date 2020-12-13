import React, { FC, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Drawer,
  TextField,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import { NavBar } from './components/NavBar';
import { SettingsControls } from './components/Settings';
import { useMatrices } from './hooks/matrices';
import { MatrixView } from './components/Matrix';
import {
  useMatrixGeneratorTrigger,
  useMatrixInput,
  useMatrixListener,
} from './hooks/hook.matrix';

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
  const [drawerActive, setDrawerActive] = useState(false);
  const open = useCallback(() => {
    setDrawerActive(true);
  }, [setDrawerActive]);
  const close = useCallback(() => {
    setDrawerActive(false);
  }, [setDrawerActive]);
  const { A, B } = useMatrices();

  const [openMatrixGen, setOpenMatrixGen] = useState<boolean>(false);
  const closeMatrixGen = () => {
    setOpenMatrixGen(false);
  };

  const availableMatrices = useMatrixListener();

  useEffect(() => {
    if (availableMatrices.length > 0) {
      console.log('new matrices available');
      console.log(availableMatrices);
    }
  }, [availableMatrices]);

  return (
    <>
      <NavBar openDrawer={open} />
      <Drawer anchor="left" open={drawerActive} onClose={close}>
        <SettingsControls closeDrawer={close} />
      </Drawer>
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setOpenMatrixGen(true);
            }}
          >
            Generate a Matrix
          </Button>

          {availableMatrices.length > 0 &&
            availableMatrices.map((matrix) => (
              <Typography>{`id: ${matrix.id}, rows: ${matrix.rows}, columns: ${matrix.columns}`}</Typography>
            ))}

          {!(A && B) ? (
            <Typography>Generate the matrices first!</Typography>
          ) : (
            <>
              <MatrixView title="First Matrix (A)" matrix={A!} />
              <MatrixView title="Second Matrix (B)" matrix={B!} />
            </>
          )}
        </Box>
      </StyledContainer>
      <MatrixGenModal open={openMatrixGen} close={closeMatrixGen} />
    </>
  );
};

const MatrixGenModal = ({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
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
