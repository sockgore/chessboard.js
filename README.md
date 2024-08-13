<div align="center">
    <img width="200" align="center"src="https://raw.githubusercontent.com/sockgore/node-chessboard/main/assets/opus.gif"/><br/>
    <p style="font-size:30px; font-weight:600;margin-top:8px;color:#bfa584;">node-chessboard</p>
    <p align="center" style="margin: 0px auto; margin-top: 15px; max-width: 600px">
        <a href="https://www.npmjs.com/package/node-chessboard">
            <img src="https://img.shields.io/npm/v/node-chessboard">
        </a>
        <a href="#">
            <img src="https://img.shields.io/npm/dt/node-chessboard"/>
        </a>
    </p>
</div>

# Overview
Generate a Buffer with a provided PGN or FEN with full customisability. 
Intended to work alongside [chess.js](https://www.npmjs.com/package/chess.js).

## Documentation
- [Installation](#installation)
- [Loading chess positions](#supported-formats)
    - [FEN](#loading-by-fen)
    - [PGN](#loading-by-pgn)
- [Generating a Buffer](#generating-a-buffer)
- [Dependencies](#dependencies)

## Installation
Install via node:
```sh
npm install node-chessboard
```
Import the package and instantiate a new Chessboard.
```ts
import { Chessboard } from "node-chessboard";

const chessboard = new Chessboard();
```
You may also pass in options for customisability.
```ts
import { Chessboard, Theme } from "node-chessboard";

const chessboard = new Chessboard({
	size: 720,
	light: "rgb(240, 217, 181)"
	dark: "rgb(181, 136, 99)",
	highlight: "rgba(235, 97, 80, 0.8)"
});
```
Load in your chess positions with any of the provided methods and export as a [Buffer](#generating-a-buffer).

## Supported Formats
- [Forsyth–Edwards Notation (FEN)](#loading-by-fend)
- [Portable Game Notation (PGN)](#loading-by-pgn)

### Loading by FEN
```
.loadFEN(fen)
```
|Parameter|Type|Description|
|-|-|-|
|fen|`string`|If you are using [chess.js](https://www.npmjs.com/package/chess.js), you can retrieve the FEN value with `Chess.fen()`|

FEN appears in the following [format](https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation): 
```
// 8/8/8/8/8/8/8/8 w - - 0 1
```

### Loading by PGN
```
.loadPGN(pgn)
```
|Parameter|Type|Description|
|-|-|-|
|pgn|`string`|If you are using [chess.js](https://www.npmjs.com/package/chess.js), you can retrieve the PGN value with `Chess.pgn()`|

PGN appears in the following [format](https://en.wikipedia.org/wiki/Portable_Game_Notation):

```
1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 {This opening is called the Ruy Lopez.}
4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7
11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15. Nb1 h6 16. Bh4 c5 17. dxe5
Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21. Nc4 Nxc4 22. Bxc4 Nb6
23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7 27. Qe3 Qg5 28. Qxg5
hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33. f3 Bc8 34. Kf2 Bf5
35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5 40. Rd6 Kc5 41. Ra6
Nf2 42. g4 Bd3 43. Re6 1/2-1/2
```

## Generating a Buffer
After you've loaded a chess position, you can use `.buffer()` to generate a buffer.

|Parameter|Type|Description|
|-|-|-|
|mime|`string`|A string that specifies the MIME type of the image. Only accepts `image/png`, `image/jpeg`, `image/webp`, `image/avif` and `image/gif`|
|options|[BufferOptions?](#bufferoptions)|The buffer options. See the [BufferOptions](#bufferoptions) interface below for detailed information.

### BufferOptions
|Property|Type|Description|
|-|-|-|
|delay|`number?`|Sets the delay between each frame, 500 by default. Only applicable if `mime` is `image/gif`|
|move|`number?`|Specifies the move number in a PGN string to which the game should be played up to. For example:|
|||- If `move` is `2`, and the PGN string loaded is `"1. Nc3 Nf6 2. Ne4"`, the result should be `"1. Nc3 Nf6"`|
|||- Alternatively, if `move` is `1`, the result should be `"1. Nc3"`|

### Example
This is an example of loading a `gif` and `png` Buffer for a game that had Fool's Mate.
```ts
import { Chessboard } from "node-chessboard";

const chessboard = new Chessboard();
// Loading Fool's Mate
chessboard.loadPGN("1. e4 g5 2. Nc3 f5 3. Qh5#");
chessboard.buffer("image/gif").then(buffer => fs.writeFile("assets/game.gif", buffer));

// Getting the 4th move
chessboard.buffer("image/png", { move: 4, highlight: true }).then(buffer => fs.writeFile("assets/blunder.png", buffer));
```
These are the `gif` and `png` output respectively:
<div >
    <img width="200" align="center"src="https://raw.githubusercontent.com/sockgore/node-chessboard/main/assets/game.gif"/>
    <img width="200" align="center"src="https://raw.githubusercontent.com/sockgore/node-chessboard/main/assets/blunder.png" />
</div>


## Dependencies
- [chess.js^1.0.0-beta.8](https://www.npmjs.com/package/chess.js)
- [@napi-rs/canvas^0.1.53](https://www.npmjs.com/package/@napi-rs/canvas)
- [gifencoder^2.0.1](https://www.npmjs.com/package/gifencoder)