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
  openDrawer: () => void,
}> = ({
  openDrawer,
}) => {
  const { isMobile } = useMedia();
  const generate = useGenerateMatrices();
  return (
    <AppBar position="static">
      <Toolbar>
        <FlexContainer>
          {!isMobile
            ? (
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={openDrawer}
              >
                Settings
              </Button>

            )
            : (
              <IconButton
                style={{ color: 'white' }}
                onClick={openDrawer}
              >
                <MenuOpenIcon />
              </IconButton>

            )}
          {!isMobile
            ? (
              <Button
                variant="contained"
                color="primary"
                disableElevation
                onClick={generate}
              >
                Generate
              </Button>
            )
            : (
              <IconButton
                style={{ color: 'white' }}
                onClick={generate}
              >
                <PlayArrowIcon />
              </IconButton>
            )}
        </FlexContainer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
