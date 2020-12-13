import React, { FC, useCallback, useState } from 'react';
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import { useMatrixIds } from './hooks/useMatrixIds';
import { useMatrixId } from './hooks/useMatrixId';
import { useSubmit } from './hooks/useSubmit';

const StyledContainer = styled(Container)`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  padding: 100px 25px 0;
  box-sizing: border-box;
  margin: 0 auto;
`;

const Title = styled(Typography)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.section<{
  right?: boolean
  center?: boolean
}>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 25px 0;
  justify-content: ${({ right, center }) => (
    (right && 'flex-end')
    || (center && 'center')
    || 'space-between'
  )};
`;

const Progress = styled(LinearProgress)`
  flex: 1;
`;

export const SelectBox: FC<{
  ids: string[] | undefined,
  selectProps: any,
}> = ({
  ids,
  selectProps,
  children,
}) => (
  <FormControl fullWidth>
    <InputLabel>{children}</InputLabel>
    <Select {...selectProps}>
      {ids && ids.length > 0 && ids.map((id) => (
        <MenuItem value={id} key={id}>{id}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

const App: FC = () => {
  const [ids,,refresh] = useMatrixIds();
  const [showProgress, setShowProgress] = useState<boolean>(true);
  const onChangeProgress = useCallback(
    () => setShowProgress((t) => !t),
    [setShowProgress],
  );
  const matrix1 = useMatrixId(ids);
  const matrix2 = useMatrixId(ids);
  const {
    canSubmit,
    submit,
    isLoading,
    progress,
    currentStep,
    totalSteps,
    isDone,
  } = useSubmit(
    matrix1.value,
    matrix2.value,
  );
  return (
    <StyledContainer>
      <Title variant="h2">
        <span>
          App
        </span>
        <Button variant="contained" onClick={refresh}>Refresh</Button>
      </Title>
      <Row>
        <SelectBox selectProps={matrix1} ids={ids}>
          First Matrix
        </SelectBox>
        <SelectBox selectProps={matrix2} ids={ids}>
          Second Matrix
        </SelectBox>
      </Row>
      <Row right>
        <FormControlLabel
          control={<Switch checked={showProgress} onChange={onChangeProgress} />}
          label="Show Details"
        />
        <Button
          variant={canSubmit ? 'contained' : 'text'}
          color={canSubmit ? 'primary' : 'secondary'}
          disabled={!canSubmit}
          onClick={submit}
        >
          Submit
        </Button>
      </Row>
      {isLoading && !isDone && (
        <Row>
          {showProgress
            ? (
              <>
                <Progress value={progress} variant="determinate" />
                <span>{`${currentStep}/${totalSteps}`}</span>
              </>
            )
            : (
              <Progress />
            )}
        </Row>
      )}
      {isDone && (
        <Row center>
          <Typography variant="h4">Done!</Typography>
        </Row>
      )}
    </StyledContainer>
  );
};

export default App;
