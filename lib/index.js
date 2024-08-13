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
exports.Theme = exports.Chessboard = void 0;
const chess_js_1 = require("chess.js");
const types_1 = require("./types");
Object.defineProperty(exports, "Theme", { enumerable: true, get: function () { return types_1.Theme; } });
const canvas_1 = require("@napi-rs/canvas");
const gifencoder_1 = __importDefault(require("gifencoder"));
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
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
    get width() {
        return this.size + this.padding[1] + this.padding[3];
    }
    get height() {
        return this.size + this.padding[0] + this.padding[2];
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
    drawBoard(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.beginPath();
            ctx.rect(0, 0, this.width, this.height);
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
            return ctx;
        });
    }
    /**
     * Returns a `Chess` instance representing the state of the game up to the specified move.
     * This method generates a snapshot of the chess game as it was after the given move number in the PGN string.
     * @param move - The move number in the PGN string up to which the game should be captured.
     *               For example:
     *               - If `move` is `2`, it returns the `Chess` instance with the game state reflecting all moves up to and including the second move.
     *               - If `move` is `4`, it returns the `Chess` instance with the game state reflecting all moves up to and including the fourth move.
     * @returns A `Chess` instance with the game state up to the provided move.
     */
    getSnapshot(move) {
        const moves = this.chess.history().slice(0, move);
        const pgn = moves.reduce((acc, curr, index) => `${acc} ${index % 2 === 0 ? `${Math.floor(index / 2) + 1}.` : ""} ${curr}`.trim(), "");
        const chess = new chess_js_1.Chess();
        chess.loadPgn(pgn);
        return chess;
    }
    buffer(mime = "image/png", options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mime != "image/gif") {
                const { length } = this.chess.history();
                const board = (options === null || options === void 0 ? void 0 : options.move) ? new Chessboard({ dark: this.dark, flipped: this.flipped, highlight: this.highlight, light: this.light, size: this.size, style: this.style }) : this;
                if (options === null || options === void 0 ? void 0 : options.move)
                    board.loadPGN(this.getSnapshot(options.move <= length ? options.move : length).pgn());
                if (options === null || options === void 0 ? void 0 : options.highlight) {
                    const latest = board.chess.history({ verbose: true }).pop();
                    if (latest)
                        board.highlightSquares(latest.from, latest.to);
                }
                const canvas = (0, canvas_1.createCanvas)(this.width, this.height);
                const ctx = canvas.getContext("2d");
                yield board.drawBoard(ctx);
                return canvas.toBuffer(mime);
            }
            else {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const encoder = new gifencoder_1.default(this.width, this.height);
                    const passThrough = new stream_1.PassThrough();
                    const chunks = [];
                    passThrough.on("data", chunk => chunks.push(chunk));
                    passThrough.on("end", () => resolve(Buffer.concat(chunks)));
                    passThrough.on("error", reject);
                    encoder.start();
                    encoder.setRepeat(0);
                    encoder.setDelay((_a = options === null || options === void 0 ? void 0 : options.delay) !== null && _a !== void 0 ? _a : 500);
                    encoder.createReadStream().pipe(passThrough);
                    const canvas = (0, canvas_1.createCanvas)(this.width, this.height);
                    const ctx = canvas.getContext("2d");
                    const moves = this.chess.history();
                    const length = (options === null || options === void 0 ? void 0 : options.move) ? (options === null || options === void 0 ? void 0 : options.move) <= moves.length ? options === null || options === void 0 ? void 0 : options.move : moves.length : moves.length;
                    for (let i = 0; i <= length; i++) {
                        const snapshot = this.getSnapshot(i);
                        const board = new Chessboard({ dark: this.dark, flipped: this.flipped, highlight: this.highlight, light: this.light, size: this.size, style: this.style });
                        board.loadPGN(snapshot.pgn());
                        const latest = board.chess.history({ verbose: true }).pop();
                        if (latest)
                            board.highlightSquares(latest.from, latest.to);
                        encoder.addFrame(yield board.drawBoard(ctx));
                    }
                    encoder.finish();
                }));
            }
        });
    }
}
exports.Chessboard = Chessboard;
//# sourceMappingURL=index.js.map