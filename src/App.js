import './App.css';
import { useState } from 'react';

const Square = (props) => {
  return (
    <button
      className={props.value == "X" ? "square styleX" : "square styleO"}
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  );
};

const Board = () => {
     const CONFIG = {
       DIMENSION: 20,
     };
    const [squares, setSquares] = useState(
      Array(CONFIG.DIMENSION).fill(Array(CONFIG.DIMENSION).fill(null))
    );
    const [xIsNext, setXIsNext] = useState(true);
  
    const [theWinner, setTheWinner] = useState(null);

    const handleClick = (i, j) => {
      if (theWinner || squares[i][j]) {
        return;
      }

      let newSquares = squares.map((r) => [...r]);
      newSquares[i][j] = xIsNext ? "X" : "O";
      setSquares(newSquares);
      setXIsNext(!xIsNext);

      let whoTheWinner = calculateWinnerNew(newSquares, i, j);
      if (whoTheWinner) {
        setTheWinner(whoTheWinner);
      }
    };

    const isBingo = (currentPlayer, arr) => {
      let count = 0;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == currentPlayer) {
          count++;
          if (count == 5) {
            return true;
          }
        } else {
          count = 0;
        }
      }
      return false;
    };

    const findValueFromSquares = (squares, arrLocation) => {
      return squares[arrLocation[0]][arrLocation[1]]
    }

    const isValidPosition = (arrLocation) => {
      return !(arrLocation[0] >= CONFIG.DIMENSION || arrLocation[1] >= CONFIG.DIMENSION || arrLocation[0] < 0 || arrLocation[1] < 0)
    }
    //where the shit begin
    const directSouth = (i,j) => {
      return [i+1, j]
    }
    
    const directNorth = (i,j) => {
      return [i-1, j]
    }
    
    const directWest = (i,j) => {
      return [i, j-1]
    }
    
    const directEast = (i,j) => {
      return [i, j+1]
    }
    
    const directSouthEast = (i,j) => {
      let [_i, _j] = directSouth(i,j);
      return directEast(_i, _j);
    }
    
    const directSouthWest = (i,j) => {
      let [_i, _j] = directSouth(i,j);
      return directWest(_i, _j);
    }
    
    const directNorthWest = (i,j) => {
      let [_i, _j] = directNorth(i,j);
      return directWest(_i, _j);
    }
    
    const directNorthEast = (i,j) => {
      let [_i, _j] = directNorth(i,j);
      return directEast(_i, _j);
    }

    const buildNorthToSouthChainValue = (squares, i ,j) => {
      let result = [];
      let currentPosition = [i, j]
      let currentValue = findValueFromSquares(squares, currentPosition);
      
      result.push(currentValue)
      for (let x = 0; x < 4; x++) {
        currentPosition = directSouth(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.push(currentValue)
      }
      
      currentPosition = [i, j];
      for (let y = 0; y < 4; y++) {
        currentPosition = directNorth(currentPosition[0], currentPosition[1]);
      
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.unshift(currentValue)
      }
      return result;
    }

    const buildWestToEastChainValue = (squares, i ,j) => {
      let result = [];
      let currentPosition = [i, j]
      let currentValue = findValueFromSquares(squares, currentPosition);
      
      result.push(currentValue)
      for (let x = 0; x < 4; x++) {
        currentPosition = directEast(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.push(currentValue)
      }
      
      currentPosition = [i, j];
      for (let y = 0; y < 4; y++) {
        currentPosition = directWest(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.unshift(currentValue)
      }
      return result;
    }

    const buildNorthWestToSouthEastChainValue = (squares, i ,j) => {
      let result = [];
      let currentPosition = [i, j]
      let currentValue = findValueFromSquares(squares, currentPosition);
      
      result.push(currentValue)
      for (let x = 0; x < 4; x++) {
        currentPosition = directSouthEast(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.push(currentValue)
      }
      
      currentPosition = [i, j];
      for (let y = 0; y < 4; y++) {
        currentPosition = directNorthWest(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.unshift(currentValue)
      }
      return result;
    }

    const buildNorthEastToSouthWestChainValue = (squares, i ,j) => {
      let result = [];
      let currentPosition = [i, j]
      let currentValue = findValueFromSquares(squares, currentPosition);
      
      result.push(currentValue)
      for (let x = 0; x < 4; x++) {
        currentPosition = directSouthWest(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.push(currentValue)
      }
      
      currentPosition = [i, j];
      for (let y = 0; y < 4; y++) {
        currentPosition = directNorthEast(currentPosition[0], currentPosition[1]);
        if (!isValidPosition(currentPosition)) {
          break;
        }
        currentValue = findValueFromSquares(squares, currentPosition);
        result.unshift(currentValue)
      }
      return result;
    }

    const builChainValue = (squares, i, j) => {
      let nToS = buildNorthToSouthChainValue(squares, i, j);
      let wToE = buildWestToEastChainValue(squares, i, j);
      let neToSw = buildNorthEastToSouthWestChainValue(squares, i, j);
      let nwToSe = buildNorthWestToSouthEastChainValue(squares, i, j);
      return [nToS, wToE, neToSw, nwToSe];
    };

    const calculateWinnerNew = (squares, i, j) => {
      let currentPlayer = squares[i][j];
      let chainValues = builChainValue(squares, i, j);
      for (let x = 0; x < chainValues.length; x++) {
        let arr = chainValues[x];
        if (isBingo(currentPlayer, arr)) {
          return currentPlayer;
        }
      }
      return null;
    };
    
    const renderSquare = (i, j) => {
      return <Square value={squares[i][j]} onClick={() => handleClick(i, j)} />;
    };
  
    const renderTwoDimensionSquare = (i, j) => {
      let arrForLoopRow = Array(i).fill(null);
      let arrForLoopCol = Array(j).fill(null);
  
      return arrForLoopRow.map((e1, idx) => (
        <div className="board-row">
          {arrForLoopCol.map((e2, jdx) => renderSquare(idx, jdx))}
        </div>
      ));
    };
    let status;
    if (theWinner) {
      status = "Người thắng cuộc: " + theWinner;
    } else {
      status = "Đến lượt chơi của " + (xIsNext ? "X" : "O");
    }
  
    return (
      <div className="container">
        <div className="status">
          {status}
        </div>
        {renderTwoDimensionSquare(CONFIG.DIMENSION, CONFIG.DIMENSION)}
      </div>
    );
  };

const Game = () => {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
    </div>
  );
};

function App() {
  return (
    <Game />
  );
}

export default App;
