/* eslint-disable react/no-array-index-key */
import { Card, CardContent, CardHeader } from '@material-ui/core';
import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

// const border = {
//   width: 1,
//   color: 'black',
// };

const StyledCardContent = styled(CardContent)`
  overflow: auto;
  max-height: 300px;
  transform: translate3D(0, 0, 0);
  padding: 0;
`;

const cellSize = 50;
const Grid = styled.section<{
  rows: number,
  columns: number,
}>`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, ${cellSize}px)`};
  grid-template-rows: ${({ rows }) => `repeat(${rows}, ${cellSize}px)`};
  position: relative;
  padding: ${cellSize}px 0 0 ${cellSize}px;
  margin-top: ${({ rows }) => 0 - (rows + 1) * cellSize}px;
  background: white;
`;

const Cell = styled.article`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${cellSize}px;
  height: ${cellSize}px;
  overflow: hidden;
`;

const headerAsideCommonStyles = `
  position: sticky;
  background: black;
  color: white;
  z-index: 9;
  display: flex;
`;

const Header = styled.header<{size: number}>`
  ${headerAsideCommonStyles}
  top: 0;
  left: ${cellSize}px;
  right: 0;
  flex-flow: row nowrap;
  width: ${({ size }) => size * cellSize}px;
  height: ${cellSize}px;
`;

const Aside = styled.aside<{size: number}>`
  ${headerAsideCommonStyles}
  top: ${cellSize}px;
  left: 0;
  bottom: 0;
  flex-flow: column nowrap;
  height: ${({ size }) => size * cellSize}px;
  width: ${cellSize}px;
`;

export const MatrixView: FC<{
  title?: string
  matrix: string[][]
}> = ({
  title,
  matrix,
}) => {
  const rows = useMemo(
    () => new Array(matrix.length)
      .fill(0)
      .map((_, idx) => idx),
    [matrix],
  );
  const columns = useMemo(
    () => new Array(matrix[0].length)
      .fill(0)
      .map((_, idx) => idx),
    [matrix],
  );
  return (
    <Card>
      {title
        ? <CardHeader title={title} />
        : undefined}
      <StyledCardContent>
        <Header size={columns.length}>
          {columns.map((col) => <Cell key={col}>{col + 1}</Cell>)}
        </Header>
        <Aside size={rows.length}>
          {rows.map((row) => <Cell key={row}>{row + 1}</Cell>)}
        </Aside>
        <Grid {...{ rows: rows.length, columns: columns.length }}>
          {matrix.map((row, ri) => row.map((cell, ci) => <Cell key={`${ri}x${ci}`}>{cell}</Cell>))}
        </Grid>
      </StyledCardContent>
    </Card>
  );
};

export default MatrixView;
