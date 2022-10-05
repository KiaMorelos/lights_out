import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.25}) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    
    for(let rowIdx = 0; rowIdx < nrows; rowIdx++){
      const row = [];

      for(let colIdx = 0; colIdx < ncols; colIdx++){
        row.push(Math.random() < chanceLightStartsOn) //pushes a true or false into array based on result of Math.random being less than or greater than chance.
      }
      initialBoard.push(row)
    }
    return initialBoard;
  }

  function hasWon() {
    return board.every(row => row.every(cell => !cell));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [rowIdx, colIdx] = coord.split("-").map(Number);

      // flipCell is a function inside a function`
      const flipCell = (rowIdx, colIdx, boardCopy) => {
        // if this coord is actually on board, flip it
        if (colIdx >= 0 && colIdx < ncols && rowIdx >= 0 && rowIdx < nrows) {
          boardCopy[rowIdx][colIdx] = !boardCopy[rowIdx][colIdx];
        }
      };

      const boardCopy = oldBoard.map(row => [...row]);

      flipCell(rowIdx, colIdx, boardCopy);
      flipCell(rowIdx, colIdx - 1, boardCopy); // cell to left of original coord
      flipCell(rowIdx, colIdx + 1, boardCopy); // cell to right of original coord
      flipCell(rowIdx - 1, colIdx, boardCopy); // cell on top of original coord
      flipCell(rowIdx + 1, colIdx, boardCopy);  // cell on bottom of original coord

      return boardCopy;
    });
  }

  if (hasWon()) {
    return <div>You Win!</div>;
  }

  const boardRowsAndCells = [];

  for (let rowIdx = 0; rowIdx < nrows; rowIdx++) {
    const row = [];
    for (let colIdx = 0; colIdx < ncols; colIdx++) {
      const coord = `${rowIdx}-${colIdx}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[rowIdx][colIdx]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      );
    }
    boardRowsAndCells.push(<tr key={rowIdx}>{row}</tr>);
  }

  return (
    <table className="Board">
      <tbody>{boardRowsAndCells}</tbody>
    </table>
  );
}

export default Board;
