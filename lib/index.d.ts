/// <reference types="node" />
import { Square } from "chess.js";
import { ChessboardOptions, ChessboardProps, Theme } from "./types";
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
    constructor(options?: ChessboardOptions);
    loadPGN(pgn: string): void;
    loadFEN(fen: string): void;
    highlightSquares(...squares: Square[]): void;
    buffer(mime?: "image/png" | "image/jpeg" | "image/webp" | "image/avif"): Promise<Buffer>;
    png(path: string): Promise<void>;
    setTheme(theme: Theme): void;
}
export { Theme };
export default Chessboard;
