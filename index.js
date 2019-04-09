document.addEventListener('DOMContentLoaded', () => {
  const board = document.getElementById('board');
  const ctx = board.getContext('2d');
  board.width = 400;
  board.height = 400;

  let startBoard = [
    [4, 9, 12, 8],
    [6, 15, 3, 11],
    [7, 0, 1, 10],
    [13, 14, 2, 5]
  ];

  let winnerBoard = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0]
  ];

  let tileMap = [];

  let tile = {
    width: 100,
    height: 100
  };

  let tilePosition = {
    x: 0,
    y: 0,
    numberXCoord: 45,
    numberYCoord: 55
  };

  const drawTile = () => {
    ctx.fillStyle = '#EB5E55';
    ctx.shadowColor = '#000';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;
    ctx.fillRect(
      tilePosition.x + 5,
      tilePosition.y + 5,
      tile.width - 10,
      tile.height - 10
    );
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    //adjust center for larger numbers
    if (startBoard[i][j] >= 10) {
      ctx.fillText(
        startBoard[i][j],
        tilePosition.numberXCoord - 2,
        tilePosition.numberYCoord
      );
    } else {
      ctx.fillText(
        startBoard[i][j],
        tilePosition.numberXCoord + 2,
        tilePosition.numberYCoord
      );
    }
  };

  const buildBoard = () => {
    for (i = 0; i < startBoard.length; i++) {
      tileMap[i] = [];

      for (j = 0; j < startBoard[i].length; j++) {
        let currentTile = {
          tileName: startBoard[i][j],
          x: tilePosition.x,
          y: tilePosition.y,
          width: 100,
          height: 100,
          tileIndex: j
        };

        if (startBoard[i][j] !== 0) {
          //create numbered tile/box
          drawTile();
          //push box id and coords to tilemap array
          tileMap[i].push(currentTile);
        } else {
          //create the empty tile/box
          tileMap[i].push(currentTile);
        }
        tilePosition.numberXCoord += 100;
        tilePosition.x += 100;
      }
      tilePosition.x = 0;
      tilePosition.numberXCoord = 43;
      tilePosition.numberYCoord += 100;
      tilePosition.y += 100;
    }
  };

  //get mouse position
  const getMousePosition = (event) => {
    let { x, y } = event;
    x -= board.offsetLeft;
    y -= board.offsetTop;

    //Check to see which box we are in
    for (let i = 0; i < tileMap.length; i++) {
      for (let j = 0; j < tileMap[i].length; j++) {
        if (
          y > tileMap[i][j].y &&
          y < tileMap[i][j].y + tileMap[i][j].height &&
          x > tileMap[i][j].x &&
          x < tileMap[i][j].x + tileMap[i][j].width
        ) {
          checkMove(tileMap[i][j].tileName, tileMap[i][j].tileIndex);
        }
      }
    }
  };

  // detect if move is possible
  const checkMove = (tile, tileIndex) => {
    //check column for zero and clicked box
    const checkColumn = () => {
      let zeroIndex = null;
      //check for zero
      for (let x = 0; x < startBoard.length; x++) {
        zeroIndex = startBoard[x].indexOf(0);
        if (zeroIndex > -1) {
          zeroIndex = zeroIndex;
          break;
        }
      }
      if (zeroIndex === tileIndex) {
        //create a new array with column values
        let tempArr = [];
        for (let i = 0; i < startBoard.length; i++) {
          tempArr.push(startBoard[i][zeroIndex]);
        }
        //keep track of our clicked tile and zero
        let zero = tempArr.indexOf(0);
        let selectedTileIdx = tempArr.indexOf(tile);

        //sort our tempArray
        if (selectedTileIdx >= tempArr.length) {
          let k = selectedTileIdx - tempArr.length;
          while (k-- + 1) {
            startBoard[i].push(null);
          }
        }
        tempArr.splice(selectedTileIdx, 0, tempArr.splice(zero, 1)[0]);

        //update our startBoard with the correct values for the column
        for (let colIndex = 0; colIndex < startBoard.length; colIndex++) {
          startBoard[colIndex][zeroIndex] = tempArr[colIndex];
        }
      }
    };

    //check row for zero and clicked box
    const checkRow = () => {
      for (let rowIdx = 0; rowIdx < startBoard.length; rowIdx++) {
        let tileIndex = startBoard[rowIdx].indexOf(tile);
        let zeroIndex = startBoard[rowIdx].indexOf(0);
        //if zero and clicked tile are present in same row
        if (tileIndex > -1 && zeroIndex > -1) {
          //reorder row
          if (tileIndex >= startBoard[rowIdx].length) {
            let k = tileIndex - startBoard[rowIdx].length;
            while (k-- + 1) {
              startBoard[rowIdx].push(null);
            }
          }
          startBoard[rowIdx].splice(
            tileIndex,
            0,
            startBoard[rowIdx].splice(zeroIndex, 1)[0]
          );
        }
      }
    };

    checkColumn();
    checkRow();

    clear();
  };

  const clear = () => {
    ctx.clearRect(0, 0, 400, 400);
    tilePosition = {
      x: 0,
      y: 0,
      numberXCoord: 46,
      numberYCoord: 55
    };
    buildBoard();
    checkWin();
  };

  const checkWin = () => {
    let allMatch = true;
    for (let i = 0; i < winnerBoard.length; i++) {
      for (let j = 0; j < winnerBoard[i].length; j++) {
        if (startBoard[i][j] !== winnerBoard[i][j]) {
          allMatch = false;
        }
      }
    }
    if (allMatch) {
      let winMessage = document.querySelector('.win');
      winMessage.classList.remove('hide');
      winMessage.classList.add('fall');
    }
  };

  buildBoard();
  board.addEventListener('mousedown', getMousePosition, false);
});
