import React, { FC } from 'react';
import {
  Button,
  FormControlLabel, Switch, TextField, Typography,
} from '@material-ui/core';
import styled from 'styled-components';
import { useSettings } from '../hooks/settings';
import { useMedia } from '../hooks/media';

const Container = styled.section`
  padding: 25px;
  display: flex;
  flex-flow: column nowrap;
`;

const FieldWrapper = styled.article`
  padding: 10px 0;
`;

export const SettingsControls: FC<{
  closeDrawer: () => void
}> = ({
  closeDrawer,
}) => {
  const {
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
  } = useSettings();
  const { isMobile } = useMedia();
  return (
    <Container>
      <Typography variant="h2" style={{ paddingBottom: 25 }}>Settings</Typography>
      <FieldWrapper>
        <TextField fullWidth type="number" label="N (Matrix A Rows)" value={n} onChange={setN} />
      </FieldWrapper>
      <FieldWrapper>
        <TextField fullWidth type="number" label="M (Matrix A Columns / Matrix B Rows)" value={m} onChange={setM} />
      </FieldWrapper>
      <FieldWrapper>
        <TextField fullWidth type="number" label="P (Matrix B Columns)" value={p} onChange={setP} />
      </FieldWrapper>
      <FieldWrapper>
        <TextField fullWidth type="number" label="Minimum Value" value={min} onChange={setMin} />
      </FieldWrapper>
      <FieldWrapper>
        <TextField fullWidth type="number" label="Maximum Value" value={max} onChange={setMax} />
      </FieldWrapper>
      <FieldWrapper>
        <FormControlLabel
          control={<Switch value={isFloat} onChange={setIsFloat} />}
          label="Use Float Values"
        />
      </FieldWrapper>
      <Typography>
        {`This will generate a matrix of size ${n}x${m} and one of size ${m}x${p} with numbers of type ${isFloat ? 'float' : 'integer'} between ${min} and ${max}.`}
      </Typography>
      {(isMobile
        ? (
          <>
            <br />
            <Button
              variant="contained"
              color="primary"
              onClick={closeDrawer}
            >
              Close
            </Button>
          </>
        )
        : undefined
      )}
    </Container>
  );
};

export default SettingsControls;
