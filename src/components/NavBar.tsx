import React, { FC } from 'react';
import styled from 'styled-components';
import { AppBar, Toolbar, Container, Button } from '@material-ui/core';

const FlexContainer = styled(Container)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
`;

export const NavBar: FC<{
  openDrawer: () => void;
  openGenModal: () => void;
}> = ({ openDrawer, openGenModal }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <FlexContainer>
          <Button
            variant="text"
            color="inherit"
            disableElevation
            onClick={openDrawer}
          >
            Select a Matrix
          </Button>
          <Button
            variant="text"
            color="inherit"
            disableElevation
            onClick={openGenModal}
          >
            Generate a Matrix
          </Button>
        </FlexContainer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
