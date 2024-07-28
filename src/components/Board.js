import React, {useState} from "react"
import "bootstrap/dist/css/bootstrap.css";
import {Button} from "react-bootstrap";
import Swal from "sweetalert2";


import Square from "../components/Square"
import {initialBoard, initiallyCanMoveTo} from "../game/InitialPosition"
import {isUnderCheck, pieceStateUpdate, stalemate} from "../game/PieceLogic"
import MinMax from "../game/MinMax"


pieceStateUpdate(initialBoard, "W")


const Board = () => {
  const [board, setBoard] = useState(() => initialBoard)
  const [previousClick, setPreviousClick] = useState([4, 4])
  const [turn, setTurn] = useState("W")
  const [canMoveToHighlighted, setCanMoveToHighlighted] = useState(() => [
    ...initiallyCanMoveTo
  ])
  const clickNothing = () => {
    setCanMoveToHighlighted(initiallyCanMoveTo.map(inner => inner.slice()))
    setPreviousClick([9, 9])
  }


  const movePiece = (previousBoard, i, k) => {
    // Create a copy of the previous board.
    let newBoard = previousBoard.map(inner => inner.slice())
    if (newBoard[i][k] && newBoard[i][k].type === "King") {
      // Game over here.
      alert("Game over!")
    }

    // Check for Castling (King Side):
    if (
      k === 6 &&
      (i === 0 || i === 7) &&
      previousClick[1] === 4 &&
      (previousClick[0] === 0 || previousClick[0] === 7) &&
      previousBoard[previousClick[0]][previousClick[1]].type === "King"
    ) {
      newBoard[i][k - 1] = previousBoard[previousClick[0]][7]
      newBoard[i][7] = null
      newBoard[i][k - 1].numOfMoves++
      newBoard[i][k - 1].hasCastling = true;
      newBoard[i][k - 2].hasCastling = true;
    }
    // Check for Castling (Queen Side):
    if (
      k === 2 &&
      (i === 0 || i === 7) &&
      previousClick[1] === 4 &&
      (previousClick[0] === 0 || previousClick[0] === 7) &&
      previousBoard[previousClick[0]][previousClick[1]].type === "King"
    ) {
      newBoard[i][k + 1] = previousBoard[previousClick[0]][0];
      newBoard[i][0] = null;
      newBoard[i][k + 1].numOfMoves++;
      newBoard[i][k + 1].hasCastling = true;
      newBoard[i][k + 2].hasCastling = true;
    }

    // Check for En Passant:
    if (
      (i === 2 &&
        previousBoard[i + 1][k] &&
        previousBoard[i + 1][k].type === "Pawn" &&
        previousBoard[previousClick[0]][previousClick[1]].type === "Pawn") ||
      (i === 5 &&
        previousBoard[i - 1][k] &&
        previousBoard[i - 1][k].type === "Pawn" &&
        previousBoard[previousClick[0]][previousClick[1]].type === "Pawn")
    )
      newBoard[i === 2 ? 3 : 4][k] = null

    // Check for White Pawn promotion:
    if (
      i === 0 && turn === "W" &&
      previousBoard[1][k] &&
      previousBoard[1][k].color === "W" &&
      previousBoard[1][k].type === "Pawn"
    ) {
      previousBoard[1][k].type = "Queen";
      previousBoard[1][k].isPromoted = true;
    }
    newBoard[i][k] = previousBoard[previousClick[0]][previousClick[1]]
    newBoard[previousClick[0]][previousClick[1]] = null
    newBoard[i][k].numOfMoves++
    newBoard[i][k].turnsSinceLastMove = 0
    return newBoard
  }


  const handleBlackPawnPromotion = (board) => {
    // Check for Black Pawn promotion.
    for (let k = 0; k < 8; k++) {
      if (board[7][k] && board[7][k].color === "B" && board[7][k].type === "Pawn") {
        board[7][k].type = "Queen";
        board[7][k].isPromoted = true;
      }
    }
  };


  const handleBlackCheckmate = (board) => {
    let {score: scoreToSend} = MinMax(
      board,
      "B",
      2,
      -100000,
      100000
    )

    if (scoreToSend === -100000) {
      // Check for checkmate.
      let isCheck = isUnderCheck(board, "B");
      if (isCheck) {
        // Check if there are any legal moves that can get the king out of check.
        let hasLegalMoves = false;
        // Iterate through all pieces of the player's color.
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
            if (board[i][j] && board[i][j].color === "B") {
              if (canMoveToHighlighted[i][j]) {
                hasLegalMoves = true;
                break;
              }
            }
          }
          if (hasLegalMoves) break;
        }
        if (hasLegalMoves === false) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You were checkmated by the AI :(",
            didClose: () => {
              // Perform any actions you want after the user closes the popup.
              window.scrollTo({top: 0, behavior: "instant"});
            },
          });
          return;
        }
      }
    }
  }


  const handleClick = (i, k) => {
    // If it's W's turn and they click B's Piece
    if (
      board[i][k] &&
      turn !== board[i][k].color &&
      !canMoveToHighlighted[i][k]
    )
      return

    // If clicking on the same box that the user previously clicked
    if (i === previousClick[0] && k === previousClick[1]) return

    // If the Piece that the user previously clicked on can move to [i, k]
    if (canMoveToHighlighted[i][k] === true) {
      const newBoard = movePiece(board, i, k)
      setBoard(newBoard)
      setCanMoveToHighlighted(initiallyCanMoveTo.map(inner => inner.slice()))
      let {score: scoreToSend, moveToMake} = MinMax(
        newBoard,
        "B",
        2,
        -100000,
        100000
      )
      if (stalemate(newBoard, "W")) {
        Swal.fire({
          icon: "warning",
          title: "Stalemate!",
          text: "Better Luck Next Time! :)",
          didClose: () => {
            // Perform any actions you want after the user closes the popup.
            window.scrollTo({top: 0, behavior: "instant"});
          },
        });
        return;
      } else if (scoreToSend === 100000) {
        Swal.fire({
          icon: "success",
          title: "Congratulations!",
          text: "You defeated the AI :)",
          didClose: () => {
            // Perform any actions you want after the user closes the popup.
            window.scrollTo({top: 0, behavior: "instant"});
          },
        });
        return;
      }
      setBoard(previousBoard => {
        let newBoard = previousBoard.map(inner => inner.slice())
        newBoard[moveToMake.x][moveToMake.y] =
          newBoard[moveToMake.i][moveToMake.j]
        newBoard[moveToMake.i][moveToMake.j] = null
        newBoard[moveToMake.x][moveToMake.y].numOfMoves++
        pieceStateUpdate(newBoard, "W")
        handleBlackPawnPromotion(newBoard)
        handleBlackCheckmate(newBoard)
        setCanMoveToHighlighted(() => {
          let toReturn = initiallyCanMoveTo.map(inner => inner.slice())
          toReturn[moveToMake.x][moveToMake.y] = true
          toReturn[moveToMake.i][moveToMake.j] = true
          setPreviousClick([moveToMake.x, moveToMake.y])
          return toReturn
        })
        return newBoard
      })
      setTurn("W")
    } else {
      setCanMoveToHighlighted(() => {
        let newCanMoveTo = board[i][k].canMoveTo.map(inner => inner.slice())
        newCanMoveTo[i][k] = true
        return newCanMoveTo
      })
      setPreviousClick([i, k])
    }
  }


  const resetPiece = (board) => {
    // Iterate through the entire board and reset any promoted pawns (Queens) to their original state.
    const newBoard = board.map((row) =>
      row.map((piece) => {
        // Reset Pawn's properties if it's not promoted.
        if (piece && piece.type === "Pawn") {
          if (piece.color === "W") {
            // Reset White Pawns.
            piece.numOfMoves = 0;
            piece.turnsSinceLastMove = 0;
          } else if (piece.color === "B") {
            // Reset Black Pawns.
            piece.numOfMoves = 0;
            piece.turnsSinceLastMove = 0;
          }
        }

        // Reset Promoted Pawns.
        if (piece && piece.isPromoted) {
          // Reset the isPromoted flag to false.
          piece.isPromoted = false;
          if (piece.color === "W") {
            // Reset a Promoted White Queen to a White Pawn.
            piece.type = "Pawn";
            piece.numOfMoves = 0;
            piece.turnsSinceLastMove = 0;
          } else if (piece.color === "B") {
            // Reset a Promoted Black Queen to a Black Pawn.
            piece.type = "Pawn";
            piece.numOfMoves = 0;
            piece.turnsSinceLastMove = 0;
          }
        }

        // Reset Castling
        if (piece && piece.hasCastling) {
          // Reset the hasCastling flag to false.
          piece.hasCastling = false;
          // Reset King's properties.
          if (piece.type === "King") {
            piece.numOfMoves = 0;
            piece.turnsSinceLastMove = 0;
          }
          // Reset Rook's properties.
          if (piece.type === "Rook") {
            piece.numOfMoves = 0;
            piece.turnsSinceLastMove = 0;
          }
        }
        return piece;
      })
    );
    return newBoard;
  };


  const resetGame = () => {
    // Reset the game board to its initial state.
    const newBoard = resetPiece(initialBoard);

    // Update the state of White pieces after resetting the board.
    pieceStateUpdate(newBoard, "W");
    setBoard(newBoard);
    setPreviousClick([4, 4]);
    setTurn("W");

    // Reset valid move highlights to their initial state.
    setCanMoveToHighlighted([...initiallyCanMoveTo]);
  };


  return (
    <div>
      <div className="header-CSS">
        <h1>React Chess AI</h1>
        <Button variant="dark" onClick={resetGame}>
          Reset
        </Button>
      </div>
      <section className="chessboard-CSS">
        {board.map((rows, i) => (
          <span className="d-flex row-CSS" key={`row_${ i }`}>
            {rows.map((col, k) => (
              <Square
                clickNothing={clickNothing}
                i={i}
                k={k}
                key={`square_${ i }_${ k }`}
                piece={board[i][k]}
                handleClick={handleClick}
                active={canMoveToHighlighted[i][k]}
              />
            ))}
          </span>
        ))}
      </section>
      <h5 className="h5-copyright-CSS">
        Copyright &#169; {new Date().getFullYear()} Rhael Fixer
      </h5>
    </div>
  )
}

export default Board;
