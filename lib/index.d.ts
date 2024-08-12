/// <reference types="node" />
import { Square } from "chess.js";
import { ChessboardProps, Theme } from "./types";
declare class Chessboard implements ChessboardProps {
    private cols;
    private chess;
    private padding;
    private highlighted;
    size: number;
    light: string;
    dark: string;
    highlight: string;
    style: Theme;
    flipped: boolean;
    constructor(options?: ChessboardProps);
    /** Loads PGN into Chess.js instance */
    loadPGN(pgn: string): void;
    /** Loads FEN into Chess.js instance */
    loadFEN(fen: string): void;
    /** The squares to highlight */
    higlightSquares(...squares: Square[]): void;
    /** Generates buffer image */
    buffer(mime?: "image/png" | "image/jpeg" | "image/webp" | "image/avif"): Promise<Buffer>;
    /** Generates png image */
    png(path: string): Promise<void>;
    /** Set the theme of the board */
    setTheme(theme: Theme): void;
}
export { Theme as PieceStyle };
export default Chessboard;
