/// <reference types="node" />
import { Chess, Square } from "chess.js";
import { BufferOptions, ChessboardOptions, ChessboardProps, Theme } from "./types";
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
    private get width();
    private get height();
    setTheme(theme: Theme): void;
    loadPGN(pgn: string): void;
    loadFEN(fen: string): void;
    highlightSquares(...squares: Square[]): void;
    private drawBoard;
    /**
     * Returns a `Chess` instance representing the state of the game up to the specified move.
     * This method generates a snapshot of the chess game as it was after the given move number in the PGN string.
     * @param move - The move number in the PGN string up to which the game should be captured.
     *               For example:
     *               - If `move` is `2`, it returns the `Chess` instance with the game state reflecting all moves up to and including the second move.
     *               - If `move` is `4`, it returns the `Chess` instance with the game state reflecting all moves up to and including the fourth move.
     * @returns A `Chess` instance with the game state up to the provided move.
     */
    getSnapshot(move: number): Chess;
    buffer(mime?: "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/gif", options?: BufferOptions): Promise<Buffer>;
}
export { Chessboard, Theme };
