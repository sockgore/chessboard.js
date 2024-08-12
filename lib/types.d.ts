export declare enum Theme {
    Modern = "modern",
    Wood = "wood"
}
export interface ChessboardProps {
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
