import React from "react"


import WhiteKing from "../assets/W-King.png";
import WhiteQueen from "../assets/W-Queen.png";
import WhiteBishop from "../assets/W-Bishop.png";
import WhiteKnight from "../assets/W-Knight.png";
import WhiteRook from "../assets/W-Rook.png";
import WhitePawn from "../assets/W-Pawn.png";

import BlackKing from "../assets/B-King.png";
import BlackQueen from "../assets/B-Queen.png";
import BlackBishop from "../assets/B-Bishop.png";
import BlackKnight from "../assets/B-Knight.png";
import BlackRook from "../assets/B-Rook.png";
import BlackPawn from "../assets/B-Pawn.png";


const pieceImageMapping = {
  W: {
    King: WhiteKing,
    Queen: WhiteQueen,
    Bishop: WhiteBishop,
    Knight: WhiteKnight,
    Rook: WhiteRook,
    Pawn: WhitePawn,
  },
  B: {
    King: BlackKing,
    Queen: BlackQueen,
    Bishop: BlackBishop,
    Knight: BlackKnight,
    Rook: BlackRook,
    Pawn: BlackPawn,
  },
};


const Square = props => {
  const handleClick = () => {
    if (props.piece == null && !props.active) props.clickNothing()
    else props.handleClick(props.i, props.k)
  }
  return (
    <div
      onClick={handleClick}
      className="box-CSS"
      style={{
        boxShadow: `0 0 40px 1px ${ props.active ? (props.piece ? "Red" : "Yellow") : "transparent"} inset`
      }}
    >
      {props.piece && (
        <img
          className="img-piece-CSS"
          src={pieceImageMapping[props.piece.color][props.piece.type]}
          alt={`${ props.piece.color }-${ props.piece.type }`}
        />
      )}
    </div>
  )
}

export default Square;
