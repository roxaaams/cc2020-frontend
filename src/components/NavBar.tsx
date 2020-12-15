import React, { FC } from 'react';
import styled from 'styled-components';

import {
  AppBar,
  Toolbar,
  Container,
  Button,
  IconButton,
} from '@material-ui/core';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { useMedia } from '../hooks/media';
import { useGenerateMatrices } from '../hooks/matrices';

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
  const { isMobile } = useMedia();
  const generate = useGenerateMatrices();
  return (
    <AppBar position="static">
      <Toolbar>
        <FlexContainer>
          {!isMobile ? (
            <Button
              variant="text"
              color="inherit"
              disableElevation
              onClick={openDrawer}
            >
              Select a Matrix
            </Button>
          ) : (
            <IconButton style={{ color: 'white' }} onClick={openDrawer}>
              <MenuOpenIcon />
            </IconButton>
          )}
          {!isMobile ? (
            <Button
              variant="text"
              color="inherit"
              disableElevation
              onClick={openGenModal}
            >
              Generate a Matrix
            </Button>
          ) : (
            <IconButton style={{ color: 'white' }} onClick={generate}>
              <PlayArrowIcon />
            </IconButton>
          )}
        </FlexContainer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
