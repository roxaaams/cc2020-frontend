import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  Box,
  Typography,
  CardActions,
} from '@material-ui/core';
import { Matrix } from '../types/type.matrix';
import useStyles from './styles/style.SeceltionCard';

interface SelectionCardProps {
  firstMatrix?: Matrix;
  secondMatrix?: Matrix;
  onReset: () => void;
  onTriggerCalc: () => void;
}

const SelectionCard = (props: SelectionCardProps) => {
  const [calcEnabled, setCalcEnabled] = useState<boolean>(false);

  const { firstMatrix, secondMatrix, onReset, onTriggerCalc } = props;

  useEffect(() => {
    if (!firstMatrix || !secondMatrix) {
      setCalcEnabled(false);
      return;
    }

    if (firstMatrix.columns === secondMatrix.rows) setCalcEnabled(true);
  }, [firstMatrix, secondMatrix]);

  const classes = useStyles();

  return (
    <Card
      className={classes.paper}
      style={{
        backgroundColor: calcEnabled
          ? 'lightgreen'
          : firstMatrix && secondMatrix
          ? 'red'
          : 'lightgray',
      }}
    >
      <CardContent className={classes.content}>
        <Typography variant="h4">
          {!firstMatrix && !secondMatrix
            ? 'please select 2 matrices'
            : !firstMatrix || !secondMatrix
            ? 'please select a second matrix'
            : calcEnabled
            ? 'ready to calculate'
            : 'these matrices are not compatible for multiplication'}
        </Typography>
        <Box className={classes.matrixSelectionContainer}>
          <MatrixSelection label="Matrix A" matrix={firstMatrix} />
          <MatrixSelection label="Matrix B" matrix={secondMatrix} />
        </Box>
      </CardContent>
      <CardActions className={classes.actions}>
        <Button variant="contained" color="secondary" onClick={onReset}>
          Reset
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!calcEnabled}
          onClick={onTriggerCalc}
        >
          Start
        </Button>
      </CardActions>
    </Card>
  );
};

const MatrixSelection = ({
  matrix,
  label,
}: {
  matrix?: Matrix;
  label: string;
}) => {
  return (
    <Box
      style={{
        width: '49%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6">{label}</Typography>
      <Box
        style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {matrix ? (
          <Box
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}
          >
            <Typography variant="h2">{`${matrix.rows}x${matrix.columns}`}</Typography>
            <Typography>{matrix.id}</Typography>
          </Box>
        ) : (
          <Typography variant="h5">select a Matrix</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SelectionCard;
