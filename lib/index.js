"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieceStyle = void 0;
const chess_js_1 = require("chess.js");
const types_1 = require("./types");
Object.defineProperty(exports, "PieceStyle", { enumerable: true, get: function () { return types_1.Theme; } });
const canvas_1 = require("@napi-rs/canvas");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
class Chessboard {
    constructor(options) {
        this.cols = "abcdefgh";
        this.chess = new chess_js_1.Chess();
        this.padding = [0, 0, 0, 0];
        this.highlighted = [];
        this.size = 480;
        this.light = "rgb(238,238,210)";
        this.dark = "rgb(118,150,86)";
        this.highlight = "rgba(255, 255, 52, 0.5)";
        this.style = types_1.Theme.Modern;
        this.flipped = false;
        for (const key in options)
            this[key] = options[key];
    }
    loadPGN(pgn) {
        this.chess.loadPgn(pgn);
    }
    loadFEN(fen) {
        this.chess.board();
        this.chess.load(fen);
    }
    highlightSquares(...squares) {
        this.highlighted = squares;
    }
    buffer(mime = "image/png") {
        return __awaiter(this, void 0, void 0, function* () {
            const width = this.size + this.padding[1] + this.padding[3];
            const height = this.size + this.padding[0] + this.padding[2];
            const canvas = (0, canvas_1.createCanvas)(width, height);
            const ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.rect(0, 0, width, height);
            ctx.fillStyle = this.light;
            ctx.fill();
            const row = this.flipped ? r => r + 1 : r => 7 - r + 1;
            const col = this.flipped ? c => c : c => 7 - c;
            for (let r = 0; r < 8; r++) {
                for (let c = 0; c < 8; c++) {
                    const coords = this.cols[col(c)] + row(r);
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
                        const image = yield (0, canvas_1.loadImage)(path_1.default.join(__dirname, `../public/${this.style}/${piece.color}${piece.type}.png`));
                        yield ctx.drawImage(image, x, y, this.size / 8, this.size / 8);
                    }
                }
            }
            return canvas.toBuffer(mime);
        });
    }
    png(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield this.buffer();
            promises_1.default.writeFile(path, buffer);
        });
    }
    setTheme(theme) {
        this.style = theme;
        if (theme == types_1.Theme.Modern) {
            this.light = "rgb(238,238,210)";
            this.dark = "rgb(118,150,86)";
            this.highlight = "rgba(255, 255, 52, 0.5)";
        }
        else if (theme == types_1.Theme.Wood) {
            this.light = "rgb(192,166,132)";
            this.dark = "rgb(131,95,66)";
            this.highlight = "rgba(255, 255, 52, 0.5)";
        }
    }
}
exports.default = Chessboard;
//# sourceMappingURL=index.js.map