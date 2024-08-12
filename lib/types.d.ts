/// <reference types="node" />
import { Square } from "chess.js";
export declare enum Theme {
    Modern = "modern",
    Wood = "wood"
}
export interface ChessboardOptions {
    /** The pixel length of desired image */
    size?: number;
    /** Color of light squares */
    light?: string;
    /** Color of dark squares */
    dark?: string;
    /** Color of highlight overlay */
    highlight?: string;
    /** Whether the board should be flipped */
    flipped?: boolean;
    /** The desired style of the chess pieces */
    style?: Theme;
}
export interface ChessboardProps extends ChessboardOptions {
    /** Loads PGN into Chess.js instance */
    loadPGN: (pgn: string) => void;
    /** Loads FEN into Chess.js instance */
    loadFEN: (fen: string) => void;
    /** The squares to highlight */
    highlightSquares: (...squares: Square[]) => void;
    /** Set the theme of the chessboard */
    setTheme: (theme: Theme) => void;
    /** Generates buffer image */
    buffer: (mime: "image/png" | "image/jpeg" | "image/webp" | "image/avif") => Promise<Buffer>;
    /** Generates png image */
    png: (path: string) => Promise<void>;
}
