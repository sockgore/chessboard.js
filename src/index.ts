import { Chess, Square } from "chess.js";
import { ChessboardProps, Theme } from "./types";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import path from "path";
import fs from "fs/promises";

class Chessboard implements ChessboardProps {
	private cols = "abcdefgh";
	private chess: Chess = new Chess();
	private padding: [number, number, number, number] = [0, 0, 0, 0];
	private highlighted: Square[] = [];

	public size = 480;
	public light = "rgb(238,238,210)";
	public dark = "rgb(118,150,86)";
	public highlight = "rgba(255, 255, 52, 0.5)";
	public style = Theme.Modern;
	public flipped = false;

	constructor(options?: ChessboardProps) {
		for (const key in options) this[key] = options[key];
	}

	/** Loads PGN into Chess.js instance */
	public loadPGN(pgn: string) {
		this.chess.loadPgn(pgn);
	}

	/** Loads FEN into Chess.js instance */
	public loadFEN(fen: string) {
		this.chess.board();
		this.chess.load(fen);
	}

	/** The squares to highlight */
	public higlightSquares(...squares: Square[]) {
		this.highlighted = squares;
	}

	/** Generates buffer image */
	public async buffer(mime: "image/png" | "image/jpeg" | "image/webp" | "image/avif" = "image/png"): Promise<Buffer> {
		const width = this.size + this.padding[1] + this.padding[3];
		const height = this.size + this.padding[0] + this.padding[2];

		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		ctx.beginPath();
		ctx.rect(0, 0, width, height);
		ctx.fillStyle = this.light;
		ctx.fill();

		const row = this.flipped ? r => r + 1 : r => 7 - r + 1;
		const col = this.flipped ? c => c : c => 7 - c;

		for (let r = 0; r < 8; r++) {
			for (let c = 0; c < 8; c++) {
				const coords = this.cols[col(c)] + row(r) as Square;
				const x = ((this.size / 8) * (7 - c + 1) - this.size / 8) + this.padding[3];
				const y = ((this.size / 8) * r) + this.padding[0];

				// Drawing square backgrounds
				if ((r + c) % 2 == 0) {
					ctx.beginPath();
					ctx.rect(x, y, this.size / 8, this.size / 8);
					ctx.fillStyle = this.dark;
					ctx.fill();
				}

				ctx.font = "semibold 12px Arial";
				// Draw column
				if (c == 7) {
					ctx.textAlign = "left";
					ctx.textBaseline = "top";
					ctx.fillStyle = r % 2 == 0 ? this.dark : this.light;
					ctx.fillText(`${this.flipped ? r + 1 : 8 - r}`, x + 3, y + 4);
				}
				// Draw row
				if (r == 7) {
					ctx.textAlign = "right";
					ctx.textBaseline = "bottom";
					ctx.fillStyle = c % 2 == 0 ? this.dark : this.light;
					ctx.fillText(this.flipped ? String.fromCharCode(97 + c) : String.fromCharCode(104 - c), x + (this.size / 8) - 3, y + (this.size / 8) - 2);
				}


				// Highlighting squares if the coords are included in the highlighted array
				if (this.highlighted.includes(coords)) {
					ctx.beginPath();
					ctx.rect(x, y, this.size / 8, this.size / 8);
					ctx.fillStyle = this.highlight;
					ctx.fill();
				}

				// Checking if there's a chess piece on the coord
				const piece = this.chess.get(coords);
				// Draw the chess piece on the square
				if (piece) {
					const image = await loadImage(path.join(__dirname, `../public/${this.style}/${piece.color}${piece.type}.png`));
					await ctx.drawImage(image, x, y, this.size / 8, this.size / 8);
				}
			}
		}

		return canvas.toBuffer(mime as any);
	}

	/** Generates png image */
	public async png(path: string) {
		const buffer = await this.buffer();
		return fs.writeFile(path, buffer);
	}

	/** Set the theme of the board */
	public setTheme(theme: Theme) {
		this.style = theme;

		if (theme == Theme.Modern) {
			this.light = "rgb(238,238,210)";
			this.dark = "rgb(118,150,86)";
			this.highlight = "rgba(255, 255, 52, 0.5)";
		}
		else if (theme == Theme.Wood) {
			this.light = "rgb(192,166,132)";
			this.dark = "rgb(131,95,66)";
			this.highlight = "rgba(255, 255, 52, 0.5)";
		}
	}

}

export { Theme as PieceStyle };
export default Chessboard;