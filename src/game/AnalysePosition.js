import {valueOfPiece, isUnderCheck} from "./PieceLogic"

// These functions are same as the ones in pieceLogic.js but these don't change the pieces' canMoveTo property.

// Increasing value of this variable makes the AI more aggressive.
const CAPTURE_MULTIPLIER = 0.5


export const RookScore = (i, j, Board) => {
  let importance = 150
  const turn = Board[i][j].color
  const doesThisHorizontalMoveResultInCheck = (i, r) => {
    // If the new state of the board after the move happens results in the player being under check, then that move will not be possible.
    let newBoard = Board.map(inner => inner.slice())
    newBoard[i][r] = newBoard[i][j]
    newBoard[i][j] = null
    return isUnderCheck(newBoard, turn === "W" ? "B" : "W")
  }

  const doesThisVerticalMoveResultInCheck = (r, j) => {
    // If the new state of the board after the move happens results in the player being under check, then that move will not be possible.
    let newBoard = Board.map(inner => inner.slice())
    newBoard[r][j] = newBoard[i][j]
    newBoard[i][j] = null
    return isUnderCheck(newBoard, turn === "W" ? "B" : "W")
  }

  if (i !== 0) {
    for (let r = i - 1; r >= 0; r--) {
      // For boxes above the rook.
      const piece = Board[r][j]
      if (piece) {
        if (piece.color === turn) break
        else if (!doesThisVerticalMoveResultInCheck(r, j))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    }
  }

  if (i !== 7) {
    for (let r = i + 1; r <= 7; r++) {
      // For boxes below the rook.
      const piece = Board[r][j]
      if (piece) {
        if (piece.color === turn) break
        else if (!doesThisVerticalMoveResultInCheck(r, j))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    }
  }

  if (j !== 0) {
    for (let r = j - 1; r >= 0; r--) {
      // For boxes left to the rook.
      const piece = Board[i][r]
      if (piece) {
        if (piece.color === turn) break
        else if (!doesThisHorizontalMoveResultInCheck(i, r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    }
  }

  if (j !== 7) {
    for (let r = j + 1; r <= 7; r++) {
      // For boxes right to the rook.
      const piece = Board[i][r]
      if (piece) {
        if (piece.color === turn) break
        else if (!doesThisHorizontalMoveResultInCheck(i, r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    }
  }
  importance *= turn === "W" ? 1 : -1
  Board[i][j].importance = importance
}


export const KnightScore = (i, j, Board) => {
  let importance = 200
  const turn = Board[i][j].color
  // This covers the 2 cases:
  // Knight moving 2 Straight Up and 1 Left.
  // Knight moving 2 Straight Up and 1 Right.
  if (i >= 2) {
  // i has to be greater than 1 if the knight has to move ahead because it moves 2 straight and 1 in the other axis.
    if (j >= 1) {
      let left = Board[i - 2][j - 1]
      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 2][j - 1] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER
      }
    }
    if (j <= 6) {
      let right = Board[i - 2][j + 1]
      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 2][j + 1] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER
      }
    }
  }

  // This covers the 2 cases:
  // Knight moving 2 Straight Down and 1 Left.
  // Knight moving 2 Straight Down and 1 Right.
  if (i <= 5) {
  // i has to be less than 6 if the knight has to move below because it moves 2 straight and 1 in the other axis.
    if (j >= 1) {
      let left = Board[i + 2][j - 1]
      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 2][j - 1] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER
      }
    }
    if (j <= 6) {
      let right = Board[i + 2][j + 1]
      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 2][j + 1] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER
      }
    }
  }

  // This covers the 2 cases:
  // Knight moving 2 Left and 1 Up.
  // Knight moving 2 Left and 1 Down.
  if (j >= 2) {
  //i has to be greater than 1 if the knight has to move ahead because it moves 2 straight and 1 in the other axis.
    if (i >= 1) {
      let left = Board[i - 1][j - 2]
      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 1][j - 2] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER
      }
    }
    if (i <= 6) {
      let right = Board[i + 1][j - 2]
      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 1][j - 2] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER
      }
    }
  }

  // This covers the 2 cases:
  // Knight moving 2 Right and 1 Up.
  // Knight moving 2 Right and 1 Down.
  if (j <= 5) {
  //i has to be less than 6 if the knight has to move below because it moves 2 straight and 1 in the other axis.
    if (i >= 1) {
      let left = Board[i - 1][j + 2]
      if (left && left.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 1][j + 2] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(left.type) * CAPTURE_MULTIPLIER
      }
    }
    if (i <= 6) {
      let right = Board[i + 1][j + 2]
      if (right && right.color !== Board[i][j].color) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 1][j + 2] = newBoard[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(right.type) * CAPTURE_MULTIPLIER
      }
    }
  }
  importance *= turn === "W" ? 1 : -1
  Board[i][j].importance = importance
}


export const BishopScore = (i, j, Board) => {
  let importance = 150
  const turn = Board[i][j].color
  // Bishop can move in 4 directions.
  for (let r = 1; r < 8; r++) {
    // Up Right.
    const isUnderCheckIfThisMoveHappens = r => {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i - r][j + r] = newBoard[i][j]
      newBoard[i][j] = null
      return isUnderCheck(newBoard, turn === "W" ? "B" : "W")
    }
    if (i - r >= 0 && j + r <= 7) {
      const piece = Board[i - r][j + r]
      if (piece) {
        if (piece.color === Board[i][j].color) break
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    } else break
  }

  for (let r = 1; r < 8; r++) {
    // Down Right.
    const isUnderCheckIfThisMoveHappens = r => {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i + r][j + r] = newBoard[i][j]
      newBoard[i][j] = null
      return isUnderCheck(newBoard, turn === "W" ? "B" : "W")
    }
    if (i + r <= 7 && j + r <= 7) {
      let piece = Board[i + r][j + r]
      if (piece) {
        if (piece.color === Board[i][j].color) break
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    } else break
  }

  for (let r = 1; r < 8; r++) {
    // Left Bottom.
    const isUnderCheckIfThisMoveHappens = r => {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i + r][j - r] = newBoard[i][j]
      newBoard[i][j] = null
      return isUnderCheck(newBoard, turn === "W" ? "B" : "W")
    }
    if (i + r <= 7 && j - r >= 0) {
      let piece = Board[i + r][j - r]
      if (piece) {
        if (piece.color === Board[i][j].color) break
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    }
  }

  for (let r = 1; r < 8; r++) {
    // Left Top.
    if (i - r >= 0 && j - r >= 0) {
      let piece = Board[i - r][j - r]
      const isUnderCheckIfThisMoveHappens = r => {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - r][j - r] = newBoard[i][j]
        newBoard[i][j] = null
        return isUnderCheck(newBoard, turn === "W" ? "B" : "W")
      }
      if (piece) {
        if (piece.color === Board[i][j].color) break
        else if (!isUnderCheckIfThisMoveHappens(r))
          importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
        break
      }
    } else break
  }
  importance *= turn === "W" ? 1 : -1
  Board[i][j].importance = importance
}


export const KingScore = (i, j, Board, canMoveTo) => {
  let importance = 10000
  const turn = Board[i][j].color
  if (i >= 1) {
    const piece = Board[i - 1][j]
    if (!piece || piece.color !== turn) {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i - 1][j] = Board[i][j]
      newBoard[i][j] = null
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
    }
    if (j >= 1) {
      const piece = Board[i - 1][j - 1]
      if (!piece || piece.color !== turn) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 1][j - 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
      }
    }
    if (j <= 6) {
      const piece = Board[i - 1][j + 1]
      if (!piece || piece.color !== turn) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 1][j + 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
      }
    }
  }

  if (i <= 6) {
    const piece = Board[i + 1][j]
    if (!piece || piece.color !== turn) {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i + 1][j] = Board[i][j]
      newBoard[i][j] = null
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
    }
    if (j >= 1) {
      const piece = Board[i + 1][j - 1]
      if (!piece || piece.color !== turn) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 1][j - 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
      }
    }
    if (j <= 6) {
      const piece = Board[i + 1][j + 1]
      if (!piece || piece.color !== turn) {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 1][j + 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
      }
    }
  }

  if (j >= 1) {
    const piece = Board[i][j - 1]
    if (!piece || piece.color !== turn) {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i][j - 1] = Board[i][j]
      newBoard[i][j] = null
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
    }
  }

  if (j <= 6) {
    const piece = Board[i][j + 1]
    if (!piece || piece.color !== turn) {
      let newBoard = Board.map(inner => inner.slice())
      newBoard[i][j + 1] = Board[i][j]
      newBoard[i][j] = null
      if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
        if (piece) importance += valueOfPiece(piece.type) * CAPTURE_MULTIPLIER
    }
  }
  importance *= turn === "W" ? 1 : -1
  Board[i][j].importance = importance
}


export const PawnScore = (i, j, Board) => {
  let importance = 50
  const turn = Board[i][j].color
  if (turn === "W" && i !== 0) {
    if (j !== 0) {
      const upLeft = Board[i - 1][j - 1]
      // const left = Board[i][j - 1]
      if (upLeft && upLeft.color === "B") {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 1][j - 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upLeft.type) * CAPTURE_MULTIPLIER
      }
      /*
      Removing En Passant for AI for now
        else if (
          // En Passant
          i === 3 &&
          left &&
          left.numOfMoves === 1 &&
          left.turnsSinceLastMove === 0
        ) {
          let newBoard = Board.map((inner) => inner.slice());
          newBoard[i - 1][j - 1] = Board[i][j];
          newBoard[i][j - 1] = null;
          if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W")) {
            importance += valueOfPiece(left.type);
          }
        }
      */
    }
    if (j !== 7) {
      const upRight = Board[i - 1][j + 1]
      // const right = Board[i][j + 1]
      if (upRight && upRight.color === "B") {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i - 1][j + 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upRight.type) * CAPTURE_MULTIPLIER
      }
      /*
      Removing En Passant for AI for now
      else if (
        //  En Passant
        i === 3 &&
        right &&
        right.numOfMoves === 1 &&
        right.turnsSinceLastMove === 0
      ) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i - 1][j + 1] = Board[i][j];
        newBoard[i][j + 1] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W")) {
          canMoveTo[i - 1][j + 1] = true;
          importance += valueOfPiece(right.type);
        }
      }
      */
    }
  }

  if (turn === "B" && i !== 7) {
    if (j !== 0) {
      const upLeft = Board[i + 1][j - 1]
      // const left = Board[i][j - 1]
      if (upLeft && upLeft.color === "W") {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 1][j - 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upLeft.type) * CAPTURE_MULTIPLIER
      }
      /*
      Removing En Passant for AI for now
      else if (
        // EN Passant
        i === 4 &&
        left &&
        left.numOfMoves === 1 &&
        left.turnsSinceLastMove === 0
      ) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j - 1] = newBoard[i][j];
        newBoard[i][j - 1] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          canMoveTo[i + 1][j - 1] = true;
        importance += valueOfPiece(left.type);
      }
      */
    }
    if (j !== 7) {
      const upRight = Board[i + 1][j + 1]
      // const right = Board[i][j + 1]
      if (upRight && upRight.color === "W") {
        let newBoard = Board.map(inner => inner.slice())
        newBoard[i + 1][j + 1] = Board[i][j]
        newBoard[i][j] = null
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          importance += valueOfPiece(upRight.type) * CAPTURE_MULTIPLIER
      }
      /*
      Removing En Passant for AI for now
      else if (
        // En Passant
        i === 4 &&
        right &&
        right.numOfMoves === 1 &&
        right.turnsSinceLastMove === 0
      ) {
        let newBoard = Board.map((inner) => inner.slice());
        newBoard[i + 1][j + 1] = newBoard[i][j];
        newBoard[i][j + 1] = null;
        if (!isUnderCheck(newBoard, turn === "W" ? "B" : "W"))
          canMoveTo[i + 1][j + 1] = true;
        importance += valueOfPiece(right.type);
      }
      */
    }
  }
  importance *= turn === "W" ? 1 : -1
  Board[i][j].importance = importance
}
