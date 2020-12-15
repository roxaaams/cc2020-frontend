import React, { useState } from 'react';
import { Button, Box, Drawer, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import useStyles from './styles/style.SelectionDrawe';
import classes from '*.module.css';
import { Matrix } from '../types/type.matrix';

interface SelectionDrawerProps {
  matrices: Matrix[];
  loading?: number;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (matrix: Matrix) => void;
}

const SelectionDrawer = (props: SelectionDrawerProps) => {
  const [currentSelection, setCurrentSelection] = useState<
    Matrix | undefined
  >();

  const { isOpen, onClose, onSelect, matrices, loading } = props;

  const classes = useStyles();

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <Box className={classes.content}>
        <Box className={classes.info}>
          <Typography variant="h3">
            {matrices.length > 0 ? 'select a matrix' : 'no matrix available'}
          </Typography>
          <Typography>
            {currentSelection
              ? `current Matrix: ${currentSelection.id}`
              : 'no current Selection'}
          </Typography>
        </Box>
        <Box className={classes.tableContainer}>
          {(loading || 0) > 0 &&
            [...Array(loading)].map((_, i) => (
              <EntryRow key={`loading-${i}`} loading bg="#fff" />
            ))}
          {matrices.map((matrix, i) => (
            <EntryRow
              key={i}
              loading={false}
              matrix={matrix}
              bg={i % 2 === 0 ? '#fff' : '#fafafa'}
              onClick={() => {
                setCurrentSelection(matrix);
              }}
            />
          ))}
        </Box>
        <Box className={classes.actions}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            style={{ marginLeft: '15px' }}
            variant="contained"
            color="primary"
            onClick={() => {
              if (currentSelection) {
                onSelect(currentSelection);
              }
              onClose();
              setCurrentSelection(undefined);
            }}
          >
            Select
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

const EntryRow = ({
  matrix,
  bg,
  loading,
  onClick,
}: {
  matrix?: Matrix;
  onClick?: () => void;
  bg: string;
  loading: boolean;
}) => {
  return (
    <Box
      style={{
        width: '97%',
        minHeight: '80px',
        backgroundColor: bg,
        marginBottom: '15px',
        borderRadius: '5px',
        overflow: 'hidden',
        justifySelf: 'center',
      }}
    >
      {loading ? (
        <Skeleton animation="wave" variant="rect" height={80} />
      ) : (
        <Box
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          onClick={onClick}
        >
          <Typography variant="h6" style={{ marginLeft: '15px' }}>{`id: ${
            matrix!.id
          }`}</Typography>
          <Typography variant="h6">{`rows: ${matrix!.rows}`}</Typography>
          <Typography variant="h6" style={{ marginRight: '15px' }}>{`columns: ${
            matrix!.columns
          }`}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default SelectionDrawer;
