(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Q = undefined;
function setQ(q) {
    exports.Q = q;
}
exports.setQ = setQ;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = require("./Utils/Color");
class Grid {
    constructor(k) {
        this.constructGrid(k);
        this.solved = false;
        this.k = k;
    }
    *solve(solver) {
        let move = undefined;
        do {
            move = solver.getNextMove();
            yield move;
        } while (move);
    }
    constructGrid(k) {
        this.grid = [];
        for (let r = 0; r < (1 << k); r++) {
            let row = [];
            for (let c = 0; c < (1 << k); c++) {
                row.push(Color_1.Color.White);
            }
            this.grid.push(row);
        }
    }
}
exports.Grid = Grid;

},{"./Utils/Color":15}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Color_1 = require("./Utils/Color");
const Grid_1 = require("./Grid");
const Exports_1 = require("./Exports");
class GridManager {
    constructor(canvasElement, k) {
        this._canvasElement = canvasElement;
        this._context = canvasElement.getContext('2d');
        this._grid = new Grid_1.Grid(k);
    }
    solve(solver) {
        return __awaiter(this, void 0, void 0, function* () {
            let delay = (ms) => {
                return new Promise(r => setTimeout(r, ms));
            };
            this.draw();
            return Exports_1.Q().then(() => __awaiter(this, void 0, void 0, function* () {
                const solved = this.grid.solve(solver);
                const cycle = Color_1.Color.cycle(this.grid.k);
                while (true) {
                    try {
                        const move = solved.next().value;
                        for (let coord of move.piece.getRelativeIndices()) {
                            this.grid.grid[move.location.row + coord.row][move.location.col + coord.col] = cycle.next().value;
                        }
                        this.draw(move);
                        yield delay(1);
                    }
                    catch (e) {
                        console.log('exited loop', e);
                        break;
                    }
                }
                return Exports_1.Q();
            }));
        });
    }
    draw(move) {
        let width = this.canvasElement.width / (1 << this.grid.k);
        let height = this.canvasElement.height / (1 << this.grid.k);
        if (move) {
            for (let idx of move.piece.getRelativeIndices()) {
                const row = move.location.row + idx.row;
                const col = move.location.col + idx.col;
                this.drawPiece(width, height, row, col);
            }
        }
        else {
            for (let row = 0; row < (1 << this.grid.k); row++) {
                for (let col = 0; col < (1 << this.grid.k); col++) {
                    this.drawPiece(width, height, row, col);
                }
            }
        }
    }
    drawPiece(width, height, row, col) {
        let x = col * width;
        let y = row * height;
        let color = this.grid.grid[row][col];
        this.context.beginPath();
        this.context.rect(x, y, width, height);
        this.context.fillStyle = color.hexString;
        this.context.fill();
    }
    get canvasElement() { return this._canvasElement; }
    get context() { return this._context; }
    get grid() { return this._grid; }
}
exports.GridManager = GridManager;

},{"./Exports":1,"./Grid":2,"./Utils/Color":15}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Location {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}
exports.Location = Location;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GridManager_1 = require("./GridManager");
const BFSSolver_1 = require("./Solvers/BFSSolver");
const LSolver_1 = require("./Solvers/LSolver");
const SpiralSolver_1 = require("./Solvers/SpiralSolver");
const Pro = require("../third_party/q.js");
const Ex = require("./Exports");
// make Q() global
Ex.setQ(Pro);
const K = 8;
const bfsSolver = new BFSSolver_1.BFSSolver(K);
const spiralSolver = new SpiralSolver_1.SpiralSolver(K);
const lSolver = new LSolver_1.LSolver(K);
let idx = 0;
for (let solver of [bfsSolver, spiralSolver, lSolver]) {
    const c = window.document.getElementById(`canvas-${idx++}`);
    const gridManager = new GridManager_1.GridManager(c, K);
    gridManager.solve(solver).then(() => { console.log('done!'); });
}

},{"../third_party/q.js":16,"./Exports":1,"./GridManager":3,"./Solvers/BFSSolver":11,"./Solvers/LSolver":12,"./Solvers/SpiralSolver":14}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Move {
    constructor(piece, location) {
        this.piece = piece;
        this.location = location;
    }
}
exports.Move = Move;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Orientation;
(function (Orientation) {
    Orientation[Orientation["Up"] = 0] = "Up";
    Orientation[Orientation["Down"] = 1] = "Down";
    Orientation[Orientation["Left"] = 2] = "Left";
    Orientation[Orientation["Right"] = 3] = "Right";
})(Orientation = exports.Orientation || (exports.Orientation = {}));

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = require("./Piece");
const Location_1 = require("../Location");
const Orientation_1 = require("../Orientation");
class LPiece extends Piece_1.Piece {
    getRelativeIndices() {
        switch (+this.orientation) {
            /**
             *  #
             * ##
             */
            case Orientation_1.Orientation.Up:
                return [
                    new Location_1.Location(0, 0),
                    new Location_1.Location(-1, 0),
                    new Location_1.Location(0, -1),
                ];
            /**
             * ##
             * #
             */
            case Orientation_1.Orientation.Down:
                return [
                    new Location_1.Location(0, 0),
                    new Location_1.Location(+1, 0),
                    new Location_1.Location(0, +1),
                ];
            /**
             * ##
             *  #
             */
            case Orientation_1.Orientation.Left:
                return [
                    new Location_1.Location(0, 0),
                    new Location_1.Location(0, -1),
                    new Location_1.Location(+1, 0),
                ];
            /**
             * #
             * ##
             */
            case Orientation_1.Orientation.Right:
                return [
                    new Location_1.Location(0, 0),
                    new Location_1.Location(0, +1),
                    new Location_1.Location(-1, 0),
                ];
            default:
                console.error(`Orientation '${orientation}' not known.`);
                break;
        }
    }
    constructor(orientation) {
        super(orientation);
    }
}
exports.LPiece = LPiece;

},{"../Location":4,"../Orientation":7,"./Piece":9}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Piece {
    constructor(orientation) {
        this.orientation = orientation;
    }
}
exports.Piece = Piece;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Piece_1 = require("./Piece");
const Location_1 = require("../Location");
class SinglePiece extends Piece_1.Piece {
    getRelativeIndices() {
        return [new Location_1.Location(0, 0)];
    }
    constructor(orientation) {
        super(orientation);
    }
}
exports.SinglePiece = SinglePiece;

},{"../Location":4,"./Piece":9}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Move_1 = require("../Move");
const Location_1 = require("../Location");
const Solver_1 = require("./Solver");
const SinglePiece_1 = require("../Pieces/SinglePiece");
const LPiece_1 = require("../Pieces/LPiece");
const Orientation_1 = require("../Orientation");
class BFSSolver extends Solver_1.Solver {
    reset(k) {
        super.reset(k);
        this.resetGrid(k);
        this.queue = [new Move_1.Move(new SinglePiece_1.SinglePiece(), new Location_1.Location(0, 0))];
    }
    resetGrid(k) {
        this.grid = [];
        for (let r = 0; r < (1 << k); r++) {
            let row = [];
            for (let c = 0; c < (1 << k); c++) {
                row.push(false);
            }
            this.grid.push(row);
        }
    }
    getNextMove() {
        while (this.queue.length > 0) {
            const topMove = this.queue[0];
            this.queue.shift();
            if (this.fits(topMove)) {
                for (let loc of topMove.piece.getRelativeIndices()) {
                    this.grid[topMove.location.row + loc.row][topMove.location.col + loc.col] = true;
                    this.queue.push(new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Up), new Location_1.Location(topMove.location.row + loc.row + 1, topMove.location.col + loc.col + 1)));
                    this.queue.push(new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Down), new Location_1.Location(topMove.location.row + loc.row - 1, topMove.location.col + loc.col - 1)));
                    this.queue.push(new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Left), new Location_1.Location(topMove.location.row + loc.row - 1, topMove.location.col + loc.col + 1)));
                    this.queue.push(new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Right), new Location_1.Location(topMove.location.row + loc.row + 1, topMove.location.col + loc.col - 1)));
                }
                return topMove;
            }
        }
    }
    fits(move) {
        console.log(move);
        const moveLocation = move.location;
        for (let relativeIndex of move.piece.getRelativeIndices()) {
            const rowPlacement = moveLocation.row + relativeIndex.row;
            const colPlacement = moveLocation.col + relativeIndex.col;
            if (!((0 <= rowPlacement && rowPlacement < this.grid.length) &&
                (0 <= colPlacement && colPlacement < this.grid[0].length))) {
                return false;
            }
            else if (this.grid[rowPlacement][colPlacement]) {
                return false;
            }
        }
        return true;
    }
    constructor(k) {
        super(k);
        this.reset(k);
    }
}
exports.BFSSolver = BFSSolver;

},{"../Location":4,"../Move":6,"../Orientation":7,"../Pieces/LPiece":8,"../Pieces/SinglePiece":10,"./Solver":13}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Move_1 = require("../Move");
const Location_1 = require("../Location");
const Solver_1 = require("./Solver");
const SinglePiece_1 = require("../Pieces/SinglePiece");
const LPiece_1 = require("../Pieces/LPiece");
const Orientation_1 = require("../Orientation");
class LSolver extends Solver_1.Solver {
    reset(k) {
        super.reset(k);
        this.moves = this.getMoves(k);
    }
    getNextMove() {
        const move = this.moves.next().value;
        return move;
    }
    /**
     * quadrants
     * 0 1
     * 3 2
     */
    rotate(move, quadrant, k) {
        let orientation = move.piece.orientation;
        for (let i = 0; i < (quadrant % 4) && quadrant % 2 === 1; i++) {
            switch (+orientation) {
                case Orientation_1.Orientation.Up:
                    orientation = Orientation_1.Orientation.Left;
                    break;
                case Orientation_1.Orientation.Right:
                    orientation = Orientation_1.Orientation.Up;
                    break;
                case Orientation_1.Orientation.Down:
                    orientation = Orientation_1.Orientation.Right;
                    break;
                case Orientation_1.Orientation.Left:
                    orientation = Orientation_1.Orientation.Down;
                    break;
            }
        }
        const rotatedPiece = new LPiece_1.LPiece(orientation);
        let row = 0;
        let col = 0;
        switch (quadrant % 4) {
            case 0:
                break;
            case 1:
                col = (1 << (k - 1));
                break;
            case 2:
                row = (1 << (k - 1));
                col = (1 << (k - 1));
                break;
            case 3:
                row = (1 << (k - 1));
                break;
        }
        let rrow = move.location.row;
        let rcol = move.location.col;
        for (let i = 0; i < (quadrant % 4) && quadrant % 2 === 1; i++) {
            const oldRRow = rrow;
            rrow = (1 << (k - 1)) - rcol - 1;
            rcol = oldRRow;
        }
        const rotatedLocation = new Location_1.Location(row + rrow, col + rcol);
        const rotatedMove = new Move_1.Move(rotatedPiece, rotatedLocation);
        return rotatedMove;
    }
    *getMoves(k) {
        if (k === 0) {
            yield new Move_1.Move(new SinglePiece_1.SinglePiece(), new Location_1.Location(0, 0));
        }
        else {
            const topLeft = this.getMoves(k - 1);
            let moves = [];
            while (true) {
                const nextMove = topLeft.next().value;
                if (!nextMove) {
                    break;
                }
                moves.push(nextMove);
            }
            for (let move of moves) {
                if (move.piece instanceof SinglePiece_1.SinglePiece) {
                    yield move;
                }
                else if (move.piece instanceof LPiece_1.LPiece) {
                    yield this.rotate(move, 0, k);
                }
            }
            yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Up), new Location_1.Location(1 << (k - 1), 1 << (k - 1)));
            for (let quadrant of [1, 2, 3]) {
                for (let move of moves) {
                    if (move.piece instanceof LPiece_1.LPiece) {
                        yield this.rotate(move, quadrant, k);
                    }
                }
            }
        }
    }
}
exports.LSolver = LSolver;

},{"../Location":4,"../Move":6,"../Orientation":7,"../Pieces/LPiece":8,"../Pieces/SinglePiece":10,"./Solver":13}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Solver {
    reset(k) {
        this.k = k;
    }
    constructor(k) {
        this.reset(k);
    }
}
exports.Solver = Solver;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Move_1 = require("../Move");
const Location_1 = require("../Location");
const Solver_1 = require("./Solver");
const SinglePiece_1 = require("../Pieces/SinglePiece");
const LPiece_1 = require("../Pieces/LPiece");
const Orientation_1 = require("../Orientation");
class SpiralSolver extends Solver_1.Solver {
    reset(k) {
        super.reset(k);
        this.moves = this.getMoves(k);
    }
    getNextMove() {
        const move = this.moves.next().value;
        console.log(move);
        return move;
    }
    *getMoves(k) {
        if (k === 0) {
            yield new Move_1.Move(new SinglePiece_1.SinglePiece(), new Location_1.Location(0, 0));
        }
        else if (k === 1) {
            yield new Move_1.Move(new SinglePiece_1.SinglePiece(), new Location_1.Location(0, 0));
            yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Up), new Location_1.Location(1, 1));
        }
        else {
            const innerFrame = this.getMoves(k - 1);
            while (true) {
                const nextMove = innerFrame.next().value;
                console.log(nextMove);
                if (!nextMove) {
                    break;
                }
                yield new Move_1.Move(nextMove.piece, new Location_1.Location((1 << (k - 2)) + nextMove.location.row, (1 << (k - 2)) + nextMove.location.col));
            }
            if (k === 2) {
                yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Down), new Location_1.Location(0, 0));
                yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Left), new Location_1.Location(0, 3));
                yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Up), new Location_1.Location(3, 3));
                yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Right), new Location_1.Location(3, 0));
            }
            else {
                // build outer frame
                for (let layer = (1 << (k - 2)) - 2; layer >= 0; layer -= 2) {
                    // top
                    for (let col = 0; col < (1 << (k - 2)); col++) {
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Right), new Location_1.Location(layer + 1, 3 * col));
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Left), new Location_1.Location(layer, 3 * col + 2));
                    }
                    // right
                    for (let row = 0; row < (1 << (k - 2)); row++) {
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Down), new Location_1.Location(3 * row, (1 << k) - layer - 2));
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Up), new Location_1.Location(3 * row + 2, (1 << k) - layer - 1));
                    }
                    // bottom
                    for (let col = 0; col < 1 << (k - 2); col++) {
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Left), new Location_1.Location((1 << k) - layer - 2, (1 << k) - 3 * col - 1));
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Right), new Location_1.Location((1 << k) - layer - 1, (1 << k) - 3 * col - 3));
                    }
                    // left
                    for (let row = 0; row < (1 << (k - 2)); row++) {
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Up), new Location_1.Location((1 << k) - 3 * row - 1, layer + 1));
                        yield new Move_1.Move(new LPiece_1.LPiece(Orientation_1.Orientation.Down), new Location_1.Location((1 << k) - 3 * row - 3, layer));
                    }
                }
            }
        }
    }
}
exports.SpiralSolver = SpiralSolver;

},{"../Location":4,"../Move":6,"../Orientation":7,"../Pieces/LPiece":8,"../Pieces/SinglePiece":10,"./Solver":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    constructor(r, g, b, a = 0xff) {
        [r, g, b, a].forEach(color => console.assert(0 <= color && color <= 0xff, 'Hues must be in the interval [0, 255].' + [r, g, b, a]));
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
        this._hexString = '#' +
            [this._r, this._b, this._g]
                .map((c) => this.pad(c.toString(16)))
                .join('');
        this._rgbaString = 'rgba(' + [this._r, this._g, this._b, this._a].join() + ')';
    }
    static get Red() { return Color._red; }
    static get Orange() { return Color._orange; }
    static get Yellow() { return Color._yellow; }
    static get Green() { return Color._green; }
    static get Blue() { return Color._blue; }
    static get Indigo() { return Color._indigo; }
    static get Violet() { return Color._violet; }
    static get White() { return Color._white; }
    static get Black() { return Color._black; }
    static *rainbow(k) {
        console.assert(0 <= 2 * k && 2 * k <= 24);
        const numColors = 1 << (2 * k);
        console.log(k, numColors);
        const x = 1 << (24 - 2 * k);
        for (let i = 0; i < numColors; i++) {
            const colorNum = i * x;
            const color = new Color((colorNum >> 0x10) & 0xff, (colorNum >> 0x8) & 0xff, colorNum & 0xff);
            console.log(i, x, colorNum);
            console.log(color);
            yield color;
        }
        console.log('finshed coloring');
    }
    static *cycle(k) {
        console.assert(0 <= 2 * k && 2 * k <= 24);
        const numColors = 1 << (2 * k);
        for (let idx = 0; idx < numColors; idx++) {
            yield new Color(Math.floor(0xff * (1 / numColors)), 0, 0, 0);
        }
        //    let idx = 0;
        //    for (let b = 0; b < 0xff && idx < numColors; b++) {
        //      for (let g = 0; g < 0xff && idx < numColors; g++) {
        //        for (let r = 0; r < 0xff && idx < numColors; r++) {
        //          for (let a = 0; a < 0xff && idx < numColors; a++) {
        //            yield new Color(r, g, b, a);
        //          }
        //        }
        //      }
        //    }
    }
    get hexString() {
        return this._hexString;
    }
    get rgbaString() {
        return this._rgbaString;
    }
    pad(num) {
        return num.length === 2 ? num : '0' + num;
    }
}
Color._red = new Color(0xf4, 0x36, 0x43);
Color._orange = new Color(0xff, 0x00, 0x98);
Color._yellow = new Color(0xff, 0x3b, 0xeb);
Color._green = new Color(0x4c, 0x50, 0xaf);
Color._blue = new Color(0x21, 0xf3, 0x96);
Color._indigo = new Color(0x3f, 0xb5, 0x51);
Color._violet = new Color(0x9c, 0xb0, 0x27);
Color._white = new Color(0xff, 0xff, 0xff);
Color._black = new Color(0x00, 0x00, 0x00);
exports.Color = Color;

},{}],16:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2017 Kris Kowal under the terms of the MIT
 * license found at https://github.com/kriskowal/q/blob/v1/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
(function (definition) {
    "use strict";
    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.
    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);
        // CommonJS
    }
    else if (typeof exports === "object" && typeof module === "object") {
        module.exports = definition();
        // RequireJS
    }
    else if (typeof define === "function" && define.amd) {
        define(definition);
        // SES (Secure EcmaScript)
    }
    else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        }
        else {
            ses.makeQ = definition;
        }
        // <script>
    }
    else if (typeof window !== "undefined" || typeof self !== "undefined") {
        // Prefer window over self for add-on scripts. Use self for
        // non-windowed contexts.
        var global = typeof window !== "undefined" ? window : self;
        // Get the `window` object, save the previous Q global
        // and initialize Q as a global.
        var previousQ = global.Q;
        global.Q = definition();
        // Add a noConflict function so Q can be removed from the
        // global namespace.
        global.Q.noConflict = function () {
            global.Q = previousQ;
            return this;
        };
    }
    else {
        throw new Error("This environment was not anticipated by Q. Please file a bug.");
    }
})(function () {
    "use strict";
    var hasStacks = false;
    try {
        throw new Error();
    }
    catch (e) {
        hasStacks = !!e.stack;
    }
    // All code after this point will be filtered from stack traces reported
    // by Q.
    var qStartingLine = captureLine();
    var qFileName;
    // shims
    // used for fallback in "allResolved"
    var noop = function () { };
    // Use the fastest possible means to execute a task in a future turn
    // of the event loop.
    var nextTick = (function () {
        // linked list of tasks (single, with head node)
        var head = { task: void 0, next: null };
        var tail = head;
        var flushing = false;
        var requestTick = void 0;
        var isNodeJS = false;
        // queue for late tasks, used by unhandled rejection tracking
        var laterQueue = [];
        function flush() {
            /* jshint loopfunc: true */
            var task, domain;
            while (head.next) {
                head = head.next;
                task = head.task;
                head.task = void 0;
                domain = head.domain;
                if (domain) {
                    head.domain = void 0;
                    domain.enter();
                }
                runSingle(task, domain);
            }
            while (laterQueue.length) {
                task = laterQueue.pop();
                runSingle(task);
            }
            flushing = false;
        }
        // runs a single function in the async queue
        function runSingle(task, domain) {
            try {
                task();
            }
            catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!
                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }
                    throw e;
                }
                else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function () {
                        throw e;
                    }, 0);
                }
            }
            if (domain) {
                domain.exit();
            }
        }
        nextTick = function (task) {
            tail = tail.next = {
                task: task,
                domain: isNodeJS && process.domain,
                next: null
            };
            if (!flushing) {
                flushing = true;
                requestTick();
            }
        };
        if (typeof process === "object" &&
            process.toString() === "[object process]" && process.nextTick) {
            // Ensure Q is in a real Node environment, with a `process.nextTick`.
            // To see through fake Node environments:
            // * Mocha test runner - exposes a `process` global without a `nextTick`
            // * Browserify - exposes a `process.nexTick` function that uses
            //   `setTimeout`. In this case `setImmediate` is preferred because
            //    it is faster. Browserify's `process.toString()` yields
            //   "[object Object]", while in a real Node environment
            //   `process.toString()` yields "[object process]".
            isNodeJS = true;
            requestTick = function () {
                process.nextTick(flush);
            };
        }
        else if (typeof setImmediate === "function") {
            // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
            if (typeof window !== "undefined") {
                requestTick = setImmediate.bind(window, flush);
            }
            else {
                requestTick = function () {
                    setImmediate(flush);
                };
            }
        }
        else if (typeof MessageChannel !== "undefined") {
            // modern browsers
            // http://www.nonblocking.io/2011/06/windownexttick.html
            var channel = new MessageChannel();
            // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
            // working message ports the first time a page loads.
            channel.port1.onmessage = function () {
                requestTick = requestPortTick;
                channel.port1.onmessage = flush;
                flush();
            };
            var requestPortTick = function () {
                // Opera requires us to provide a message payload, regardless of
                // whether we use it.
                channel.port2.postMessage(0);
            };
            requestTick = function () {
                setTimeout(flush, 0);
                requestPortTick();
            };
        }
        else {
            // old browsers
            requestTick = function () {
                setTimeout(flush, 0);
            };
        }
        // runs a task after all other tasks have been run
        // this is useful for unhandled rejection tracking that needs to happen
        // after all `then`d tasks have been run.
        nextTick.runAfter = function (task) {
            laterQueue.push(task);
            if (!flushing) {
                flushing = true;
                requestTick();
            }
        };
        return nextTick;
    })();
    // Attempt to make generics safe in the face of downstream
    // modifications.
    // There is no situation where this is necessary.
    // If you need a security guarantee, these primordials need to be
    // deeply frozen anyway, and if you don’t need a security guarantee,
    // this is just plain paranoid.
    // However, this **might** have the nice side-effect of reducing the size of
    // the minified code by reducing x.call() to merely x()
    // See Mark Miller’s explanation of what this does.
    // http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
    var call = Function.call;
    function uncurryThis(f) {
        return function () {
            return call.apply(f, arguments);
        };
    }
    // This is equivalent, but slower:
    // uncurryThis = Function_bind.bind(Function_bind.call);
    // http://jsperf.com/uncurrythis
    var array_slice = uncurryThis(Array.prototype.slice);
    var array_reduce = uncurryThis(Array.prototype.reduce || function (callback, basis) {
        var index = 0, length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    });
    var array_indexOf = uncurryThis(Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    });
    var array_map = uncurryThis(Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    });
    var object_create = Object.create || function (prototype) {
        function Type() { }
        Type.prototype = prototype;
        return new Type();
    };
    var object_defineProperty = Object.defineProperty || function (obj, prop, descriptor) {
        obj[prop] = descriptor.value;
        return obj;
    };
    var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);
    var object_keys = Object.keys || function (object) {
        var keys = [];
        for (var key in object) {
            if (object_hasOwnProperty(object, key)) {
                keys.push(key);
            }
        }
        return keys;
    };
    var object_toString = uncurryThis(Object.prototype.toString);
    function isObject(value) {
        return value === Object(value);
    }
    // generator related shims
    // FIXME: Remove this function once ES6 generators are in SpiderMonkey.
    function isStopIteration(exception) {
        return (object_toString(exception) === "[object StopIteration]" ||
            exception instanceof QReturnValue);
    }
    // FIXME: Remove this helper and Q.return once ES6 generators are in
    // SpiderMonkey.
    var QReturnValue;
    if (typeof ReturnValue !== "undefined") {
        QReturnValue = ReturnValue;
    }
    else {
        QReturnValue = function (value) {
            this.value = value;
        };
    }
    // long stack traces
    var STACK_JUMP_SEPARATOR = "From previous event:";
    function makeStackTraceLong(error, promise) {
        // If possible, transform the error stack trace by removing Node and Q
        // cruft, then concatenating with the stack trace of `promise`. See #57.
        if (hasStacks &&
            promise.stack &&
            typeof error === "object" &&
            error !== null &&
            error.stack) {
            var stacks = [];
            for (var p = promise; !!p; p = p.source) {
                if (p.stack && (!error.__minimumStackCounter__ || error.__minimumStackCounter__ > p.stackCounter)) {
                    object_defineProperty(error, "__minimumStackCounter__", { value: p.stackCounter, configurable: true });
                    stacks.unshift(p.stack);
                }
            }
            stacks.unshift(error.stack);
            var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
            var stack = filterStackString(concatedStacks);
            object_defineProperty(error, "stack", { value: stack, configurable: true });
        }
    }
    function filterStackString(stackString) {
        var lines = stackString.split("\n");
        var desiredLines = [];
        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
                desiredLines.push(line);
            }
        }
        return desiredLines.join("\n");
    }
    function isNodeFrame(stackLine) {
        return stackLine.indexOf("(module.js:") !== -1 ||
            stackLine.indexOf("(node.js:") !== -1;
    }
    function getFileNameAndLineNumber(stackLine) {
        // Named functions: "at functionName (filename:lineNumber:columnNumber)"
        // In IE10 function name can have spaces ("Anonymous function") O_o
        var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
        if (attempt1) {
            return [attempt1[1], Number(attempt1[2])];
        }
        // Anonymous functions: "at filename:lineNumber:columnNumber"
        var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
        if (attempt2) {
            return [attempt2[1], Number(attempt2[2])];
        }
        // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
        var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
        if (attempt3) {
            return [attempt3[1], Number(attempt3[2])];
        }
    }
    function isInternalFrame(stackLine) {
        var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
        if (!fileNameAndLineNumber) {
            return false;
        }
        var fileName = fileNameAndLineNumber[0];
        var lineNumber = fileNameAndLineNumber[1];
        return fileName === qFileName &&
            lineNumber >= qStartingLine &&
            lineNumber <= qEndingLine;
    }
    // discover own file name and line number range for filtering stack
    // traces
    function captureLine() {
        if (!hasStacks) {
            return;
        }
        try {
            throw new Error();
        }
        catch (e) {
            var lines = e.stack.split("\n");
            var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
            var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
            if (!fileNameAndLineNumber) {
                return;
            }
            qFileName = fileNameAndLineNumber[0];
            return fileNameAndLineNumber[1];
        }
    }
    function deprecate(callback, name, alternative) {
        return function () {
            if (typeof console !== "undefined" &&
                typeof console.warn === "function") {
                console.warn(name + " is deprecated, use " + alternative +
                    " instead.", new Error("").stack);
            }
            return callback.apply(callback, arguments);
        };
    }
    // end of shims
    // beginning of real work
    /**
     * Constructs a promise for an immediate reference, passes promises through, or
     * coerces promises from different systems.
     * @param value immediate reference or promise
     */
    function Q(value) {
        // If the object is already a Promise, return it directly.  This enables
        // the resolve function to both be used to created references from objects,
        // but to tolerably coerce non-promises to promises.
        if (value instanceof Promise) {
            return value;
        }
        // assimilate thenables
        if (isPromiseAlike(value)) {
            return coerce(value);
        }
        else {
            return fulfill(value);
        }
    }
    Q.resolve = Q;
    /**
     * Performs a task in a future turn of the event loop.
     * @param {Function} task
     */
    Q.nextTick = nextTick;
    /**
     * Controls whether or not long stack traces will be on
     */
    Q.longStackSupport = false;
    /**
     * The counter is used to determine the stopping point for building
     * long stack traces. In makeStackTraceLong we walk backwards through
     * the linked list of promises, only stacks which were created before
     * the rejection are concatenated.
     */
    var longStackCounter = 1;
    // enable long stacks if Q_DEBUG is set
    if (typeof process === "object" && process && process.env && process.env.Q_DEBUG) {
        Q.longStackSupport = true;
    }
    /**
     * Constructs a {promise, resolve, reject} object.
     *
     * `resolve` is a callback to invoke with a more resolved value for the
     * promise. To fulfill the promise, invoke `resolve` with any value that is
     * not a thenable. To reject the promise, invoke `resolve` with a rejected
     * thenable, or invoke `reject` with the reason directly. To resolve the
     * promise to another thenable, thus putting it in the same state, invoke
     * `resolve` with that other thenable.
     */
    Q.defer = defer;
    function defer() {
        // if "messages" is an "Array", that indicates that the promise has not yet
        // been resolved.  If it is "undefined", it has been resolved.  Each
        // element of the messages array is itself an array of complete arguments to
        // forward to the resolved promise.  We coerce the resolution value to a
        // promise using the `resolve` function because it handles both fully
        // non-thenable values and other thenables gracefully.
        var messages = [], progressListeners = [], resolvedPromise;
        var deferred = object_create(defer.prototype);
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, operands) {
            var args = array_slice(arguments);
            if (messages) {
                messages.push(args);
                if (op === "when" && operands[1]) {
                    progressListeners.push(operands[1]);
                }
            }
            else {
                Q.nextTick(function () {
                    resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
                });
            }
        };
        // XXX deprecated
        promise.valueOf = function () {
            if (messages) {
                return promise;
            }
            var nearerValue = nearer(resolvedPromise);
            if (isPromise(nearerValue)) {
                resolvedPromise = nearerValue; // shorten chain
            }
            return nearerValue;
        };
        promise.inspect = function () {
            if (!resolvedPromise) {
                return { state: "pending" };
            }
            return resolvedPromise.inspect();
        };
        if (Q.longStackSupport && hasStacks) {
            try {
                throw new Error();
            }
            catch (e) {
                // NOTE: don't try to use `Error.captureStackTrace` or transfer the
                // accessor around; that causes memory leaks as per GH-111. Just
                // reify the stack trace as a string ASAP.
                //
                // At the same time, cut off the first line; it's always just
                // "[object Promise]\n", as per the `toString`.
                promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
                promise.stackCounter = longStackCounter++;
            }
        }
        // NOTE: we do the checks for `resolvedPromise` in each method, instead of
        // consolidating them into `become`, since otherwise we'd create new
        // promises with the lines `become(whatever(value))`. See e.g. GH-252.
        function become(newPromise) {
            resolvedPromise = newPromise;
            if (Q.longStackSupport && hasStacks) {
                // Only hold a reference to the new promise if long stacks
                // are enabled to reduce memory usage
                promise.source = newPromise;
            }
            array_reduce(messages, function (undefined, message) {
                Q.nextTick(function () {
                    newPromise.promiseDispatch.apply(newPromise, message);
                });
            }, void 0);
            messages = void 0;
            progressListeners = void 0;
        }
        deferred.promise = promise;
        deferred.resolve = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(Q(value));
        };
        deferred.fulfill = function (value) {
            if (resolvedPromise) {
                return;
            }
            become(fulfill(value));
        };
        deferred.reject = function (reason) {
            if (resolvedPromise) {
                return;
            }
            become(reject(reason));
        };
        deferred.notify = function (progress) {
            if (resolvedPromise) {
                return;
            }
            array_reduce(progressListeners, function (undefined, progressListener) {
                Q.nextTick(function () {
                    progressListener(progress);
                });
            }, void 0);
        };
        return deferred;
    }
    /**
     * Creates a Node-style callback that will resolve or reject the deferred
     * promise.
     * @returns a nodeback
     */
    defer.prototype.makeNodeResolver = function () {
        var self = this;
        return function (error, value) {
            if (error) {
                self.reject(error);
            }
            else if (arguments.length > 2) {
                self.resolve(array_slice(arguments, 1));
            }
            else {
                self.resolve(value);
            }
        };
    };
    /**
     * @param resolver {Function} a function that returns nothing and accepts
     * the resolve, reject, and notify functions for a deferred.
     * @returns a promise that may be resolved with the given resolve and reject
     * functions, or rejected by a thrown exception in resolver
     */
    Q.Promise = promise; // ES6
    Q.promise = promise;
    function promise(resolver) {
        if (typeof resolver !== "function") {
            throw new TypeError("resolver must be a function.");
        }
        var deferred = defer();
        try {
            resolver(deferred.resolve, deferred.reject, deferred.notify);
        }
        catch (reason) {
            deferred.reject(reason);
        }
        return deferred.promise;
    }
    promise.race = race; // ES6
    promise.all = all; // ES6
    promise.reject = reject; // ES6
    promise.resolve = Q; // ES6
    // XXX experimental.  This method is a way to denote that a local value is
    // serializable and should be immediately dispatched to a remote upon request,
    // instead of passing a reference.
    Q.passByCopy = function (object) {
        //freeze(object);
        //passByCopies.set(object, true);
        return object;
    };
    Promise.prototype.passByCopy = function () {
        //freeze(object);
        //passByCopies.set(object, true);
        return this;
    };
    /**
     * If two promises eventually fulfill to the same value, promises that value,
     * but otherwise rejects.
     * @param x {Any*}
     * @param y {Any*}
     * @returns {Any*} a promise for x and y if they are the same, but a rejection
     * otherwise.
     *
     */
    Q.join = function (x, y) {
        return Q(x).join(y);
    };
    Promise.prototype.join = function (that) {
        return Q([this, that]).spread(function (x, y) {
            if (x === y) {
                // TODO: "===" should be Object.is or equiv
                return x;
            }
            else {
                throw new Error("Q can't join: not the same: " + x + " " + y);
            }
        });
    };
    /**
     * Returns a promise for the first of an array of promises to become settled.
     * @param answers {Array[Any*]} promises to race
     * @returns {Any*} the first promise to be settled
     */
    Q.race = race;
    function race(answerPs) {
        return promise(function (resolve, reject) {
            // Switch to this once we can assume at least ES5
            // answerPs.forEach(function (answerP) {
            //     Q(answerP).then(resolve, reject);
            // });
            // Use this in the meantime
            for (var i = 0, len = answerPs.length; i < len; i++) {
                Q(answerPs[i]).then(resolve, reject);
            }
        });
    }
    Promise.prototype.race = function () {
        return this.then(Q.race);
    };
    /**
     * Constructs a Promise with a promise descriptor object and optional fallback
     * function.  The descriptor contains methods like when(rejected), get(name),
     * set(name, value), post(name, args), and delete(name), which all
     * return either a value, a promise for a value, or a rejection.  The fallback
     * accepts the operation name, a resolver, and any further arguments that would
     * have been forwarded to the appropriate method above had a method been
     * provided with the proper name.  The API makes no guarantees about the nature
     * of the returned object, apart from that it is usable whereever promises are
     * bought and sold.
     */
    Q.makePromise = Promise;
    function Promise(descriptor, fallback, inspect) {
        if (fallback === void 0) {
            fallback = function (op) {
                return reject(new Error("Promise does not support operation: " + op));
            };
        }
        if (inspect === void 0) {
            inspect = function () {
                return { state: "unknown" };
            };
        }
        var promise = object_create(Promise.prototype);
        promise.promiseDispatch = function (resolve, op, args) {
            var result;
            try {
                if (descriptor[op]) {
                    result = descriptor[op].apply(promise, args);
                }
                else {
                    result = fallback.call(promise, op, args);
                }
            }
            catch (exception) {
                result = reject(exception);
            }
            if (resolve) {
                resolve(result);
            }
        };
        promise.inspect = inspect;
        // XXX deprecated `valueOf` and `exception` support
        if (inspect) {
            var inspected = inspect();
            if (inspected.state === "rejected") {
                promise.exception = inspected.reason;
            }
            promise.valueOf = function () {
                var inspected = inspect();
                if (inspected.state === "pending" ||
                    inspected.state === "rejected") {
                    return promise;
                }
                return inspected.value;
            };
        }
        return promise;
    }
    Promise.prototype.toString = function () {
        return "[object Promise]";
    };
    Promise.prototype.then = function (fulfilled, rejected, progressed) {
        var self = this;
        var deferred = defer();
        var done = false; // ensure the untrusted promise makes at most a
        // single call to one of the callbacks
        function _fulfilled(value) {
            try {
                return typeof fulfilled === "function" ? fulfilled(value) : value;
            }
            catch (exception) {
                return reject(exception);
            }
        }
        function _rejected(exception) {
            if (typeof rejected === "function") {
                makeStackTraceLong(exception, self);
                try {
                    return rejected(exception);
                }
                catch (newException) {
                    return reject(newException);
                }
            }
            return reject(exception);
        }
        function _progressed(value) {
            return typeof progressed === "function" ? progressed(value) : value;
        }
        Q.nextTick(function () {
            self.promiseDispatch(function (value) {
                if (done) {
                    return;
                }
                done = true;
                deferred.resolve(_fulfilled(value));
            }, "when", [function (exception) {
                    if (done) {
                        return;
                    }
                    done = true;
                    deferred.resolve(_rejected(exception));
                }]);
        });
        // Progress propagator need to be attached in the current tick.
        self.promiseDispatch(void 0, "when", [void 0, function (value) {
                var newValue;
                var threw = false;
                try {
                    newValue = _progressed(value);
                }
                catch (e) {
                    threw = true;
                    if (Q.onerror) {
                        Q.onerror(e);
                    }
                    else {
                        throw e;
                    }
                }
                if (!threw) {
                    deferred.notify(newValue);
                }
            }]);
        return deferred.promise;
    };
    Q.tap = function (promise, callback) {
        return Q(promise).tap(callback);
    };
    /**
     * Works almost like "finally", but not called for rejections.
     * Original resolution value is passed through callback unaffected.
     * Callback may return a promise that will be awaited for.
     * @param {Function} callback
     * @returns {Q.Promise}
     * @example
     * doSomething()
     *   .then(...)
     *   .tap(console.log)
     *   .then(...);
     */
    Promise.prototype.tap = function (callback) {
        callback = Q(callback);
        return this.then(function (value) {
            return callback.fcall(value).thenResolve(value);
        });
    };
    /**
     * Registers an observer on a promise.
     *
     * Guarantees:
     *
     * 1. that fulfilled and rejected will be called only once.
     * 2. that either the fulfilled callback or the rejected callback will be
     *    called, but not both.
     * 3. that fulfilled and rejected will not be called in this turn.
     *
     * @param value      promise or immediate reference to observe
     * @param fulfilled  function to be called with the fulfilled value
     * @param rejected   function to be called with the rejection exception
     * @param progressed function to be called on any progress notifications
     * @return promise for the return value from the invoked callback
     */
    Q.when = when;
    function when(value, fulfilled, rejected, progressed) {
        return Q(value).then(fulfilled, rejected, progressed);
    }
    Promise.prototype.thenResolve = function (value) {
        return this.then(function () { return value; });
    };
    Q.thenResolve = function (promise, value) {
        return Q(promise).thenResolve(value);
    };
    Promise.prototype.thenReject = function (reason) {
        return this.then(function () { throw reason; });
    };
    Q.thenReject = function (promise, reason) {
        return Q(promise).thenReject(reason);
    };
    /**
     * If an object is not a promise, it is as "near" as possible.
     * If a promise is rejected, it is as "near" as possible too.
     * If it’s a fulfilled promise, the fulfillment value is nearer.
     * If it’s a deferred promise and the deferred has been resolved, the
     * resolution is "nearer".
     * @param object
     * @returns most resolved (nearest) form of the object
     */
    // XXX should we re-do this?
    Q.nearer = nearer;
    function nearer(value) {
        if (isPromise(value)) {
            var inspected = value.inspect();
            if (inspected.state === "fulfilled") {
                return inspected.value;
            }
        }
        return value;
    }
    /**
     * @returns whether the given object is a promise.
     * Otherwise it is a fulfilled value.
     */
    Q.isPromise = isPromise;
    function isPromise(object) {
        return object instanceof Promise;
    }
    Q.isPromiseAlike = isPromiseAlike;
    function isPromiseAlike(object) {
        return isObject(object) && typeof object.then === "function";
    }
    /**
     * @returns whether the given object is a pending promise, meaning not
     * fulfilled or rejected.
     */
    Q.isPending = isPending;
    function isPending(object) {
        return isPromise(object) && object.inspect().state === "pending";
    }
    Promise.prototype.isPending = function () {
        return this.inspect().state === "pending";
    };
    /**
     * @returns whether the given object is a value or fulfilled
     * promise.
     */
    Q.isFulfilled = isFulfilled;
    function isFulfilled(object) {
        return !isPromise(object) || object.inspect().state === "fulfilled";
    }
    Promise.prototype.isFulfilled = function () {
        return this.inspect().state === "fulfilled";
    };
    /**
     * @returns whether the given object is a rejected promise.
     */
    Q.isRejected = isRejected;
    function isRejected(object) {
        return isPromise(object) && object.inspect().state === "rejected";
    }
    Promise.prototype.isRejected = function () {
        return this.inspect().state === "rejected";
    };
    //// BEGIN UNHANDLED REJECTION TRACKING
    // This promise library consumes exceptions thrown in handlers so they can be
    // handled by a subsequent promise.  The exceptions get added to this array when
    // they are created, and removed when they are handled.  Note that in ES6 or
    // shimmed environments, this would naturally be a `Set`.
    var unhandledReasons = [];
    var unhandledRejections = [];
    var reportedUnhandledRejections = [];
    var trackUnhandledRejections = true;
    function resetUnhandledRejections() {
        unhandledReasons.length = 0;
        unhandledRejections.length = 0;
        if (!trackUnhandledRejections) {
            trackUnhandledRejections = true;
        }
    }
    function trackRejection(promise, reason) {
        if (!trackUnhandledRejections) {
            return;
        }
        if (typeof process === "object" && typeof process.emit === "function") {
            Q.nextTick.runAfter(function () {
                if (array_indexOf(unhandledRejections, promise) !== -1) {
                    process.emit("unhandledRejection", reason, promise);
                    reportedUnhandledRejections.push(promise);
                }
            });
        }
        unhandledRejections.push(promise);
        if (reason && typeof reason.stack !== "undefined") {
            unhandledReasons.push(reason.stack);
        }
        else {
            unhandledReasons.push("(no stack) " + reason);
        }
    }
    function untrackRejection(promise) {
        if (!trackUnhandledRejections) {
            return;
        }
        var at = array_indexOf(unhandledRejections, promise);
        if (at !== -1) {
            if (typeof process === "object" && typeof process.emit === "function") {
                Q.nextTick.runAfter(function () {
                    var atReport = array_indexOf(reportedUnhandledRejections, promise);
                    if (atReport !== -1) {
                        process.emit("rejectionHandled", unhandledReasons[at], promise);
                        reportedUnhandledRejections.splice(atReport, 1);
                    }
                });
            }
            unhandledRejections.splice(at, 1);
            unhandledReasons.splice(at, 1);
        }
    }
    Q.resetUnhandledRejections = resetUnhandledRejections;
    Q.getUnhandledReasons = function () {
        // Make a copy so that consumers can't interfere with our internal state.
        return unhandledReasons.slice();
    };
    Q.stopUnhandledRejectionTracking = function () {
        resetUnhandledRejections();
        trackUnhandledRejections = false;
    };
    resetUnhandledRejections();
    //// END UNHANDLED REJECTION TRACKING
    /**
     * Constructs a rejected promise.
     * @param reason value describing the failure
     */
    Q.reject = reject;
    function reject(reason) {
        var rejection = Promise({
            "when": function (rejected) {
                // note that the error has been handled
                if (rejected) {
                    untrackRejection(this);
                }
                return rejected ? rejected(reason) : this;
            }
        }, function fallback() {
            return this;
        }, function inspect() {
            return { state: "rejected", reason: reason };
        });
        // Note that the reason has not been handled.
        trackRejection(rejection, reason);
        return rejection;
    }
    /**
     * Constructs a fulfilled promise for an immediate reference.
     * @param value immediate reference
     */
    Q.fulfill = fulfill;
    function fulfill(value) {
        return Promise({
            "when": function () {
                return value;
            },
            "get": function (name) {
                return value[name];
            },
            "set": function (name, rhs) {
                value[name] = rhs;
            },
            "delete": function (name) {
                delete value[name];
            },
            "post": function (name, args) {
                // Mark Miller proposes that post with no name should apply a
                // promised function.
                if (name === null || name === void 0) {
                    return value.apply(void 0, args);
                }
                else {
                    return value[name].apply(value, args);
                }
            },
            "apply": function (thisp, args) {
                return value.apply(thisp, args);
            },
            "keys": function () {
                return object_keys(value);
            }
        }, void 0, function inspect() {
            return { state: "fulfilled", value: value };
        });
    }
    /**
     * Converts thenables to Q promises.
     * @param promise thenable promise
     * @returns a Q promise
     */
    function coerce(promise) {
        var deferred = defer();
        Q.nextTick(function () {
            try {
                promise.then(deferred.resolve, deferred.reject, deferred.notify);
            }
            catch (exception) {
                deferred.reject(exception);
            }
        });
        return deferred.promise;
    }
    /**
     * Annotates an object such that it will never be
     * transferred away from this process over any promise
     * communication channel.
     * @param object
     * @returns promise a wrapping of that object that
     * additionally responds to the "isDef" message
     * without a rejection.
     */
    Q.master = master;
    function master(object) {
        return Promise({
            "isDef": function () { }
        }, function fallback(op, args) {
            return dispatch(object, op, args);
        }, function () {
            return Q(object).inspect();
        });
    }
    /**
     * Spreads the values of a promised array of arguments into the
     * fulfillment callback.
     * @param fulfilled callback that receives variadic arguments from the
     * promised array
     * @param rejected callback that receives the exception if the promise
     * is rejected.
     * @returns a promise for the return value or thrown exception of
     * either callback.
     */
    Q.spread = spread;
    function spread(value, fulfilled, rejected) {
        return Q(value).spread(fulfilled, rejected);
    }
    Promise.prototype.spread = function (fulfilled, rejected) {
        return this.all().then(function (array) {
            return fulfilled.apply(void 0, array);
        }, rejected);
    };
    /**
     * The async function is a decorator for generator functions, turning
     * them into asynchronous generators.  Although generators are only part
     * of the newest ECMAScript 6 drafts, this code does not cause syntax
     * errors in older engines.  This code should continue to work and will
     * in fact improve over time as the language improves.
     *
     * ES6 generators are currently part of V8 version 3.19 with the
     * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
     * for longer, but under an older Python-inspired form.  This function
     * works on both kinds of generators.
     *
     * Decorates a generator function such that:
     *  - it may yield promises
     *  - execution will continue when that promise is fulfilled
     *  - the value of the yield expression will be the fulfilled value
     *  - it returns a promise for the return value (when the generator
     *    stops iterating)
     *  - the decorated function returns a promise for the return value
     *    of the generator or the first rejected promise among those
     *    yielded.
     *  - if an error is thrown in the generator, it propagates through
     *    every following yield until it is caught, or until it escapes
     *    the generator function altogether, and is translated into a
     *    rejection for the promise returned by the decorated generator.
     */
    Q.async = async;
    function async(makeGenerator) {
        return function () {
            // when verb is "send", arg is a value
            // when verb is "throw", arg is an exception
            function continuer(verb, arg) {
                var result;
                // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
                // engine that has a deployed base of browsers that support generators.
                // However, SM's generators use the Python-inspired semantics of
                // outdated ES6 drafts.  We would like to support ES6, but we'd also
                // like to make it possible to use generators in deployed browsers, so
                // we also support Python-style generators.  At some point we can remove
                // this block.
                if (typeof StopIteration === "undefined") {
                    // ES6 Generators
                    try {
                        result = generator[verb](arg);
                    }
                    catch (exception) {
                        return reject(exception);
                    }
                    if (result.done) {
                        return Q(result.value);
                    }
                    else {
                        return when(result.value, callback, errback);
                    }
                }
                else {
                    // SpiderMonkey Generators
                    // FIXME: Remove this case when SM does ES6 generators.
                    try {
                        result = generator[verb](arg);
                    }
                    catch (exception) {
                        if (isStopIteration(exception)) {
                            return Q(exception.value);
                        }
                        else {
                            return reject(exception);
                        }
                    }
                    return when(result, callback, errback);
                }
            }
            var generator = makeGenerator.apply(this, arguments);
            var callback = continuer.bind(continuer, "next");
            var errback = continuer.bind(continuer, "throw");
            return callback();
        };
    }
    /**
     * The spawn function is a small wrapper around async that immediately
     * calls the generator and also ends the promise chain, so that any
     * unhandled errors are thrown instead of forwarded to the error
     * handler. This is useful because it's extremely common to run
     * generators at the top-level to work with libraries.
     */
    Q.spawn = spawn;
    function spawn(makeGenerator) {
        Q.done(Q.async(makeGenerator)());
    }
    // FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
    /**
     * Throws a ReturnValue exception to stop an asynchronous generator.
     *
     * This interface is a stop-gap measure to support generator return
     * values in older Firefox/SpiderMonkey.  In browsers that support ES6
     * generators like Chromium 29, just use "return" in your generator
     * functions.
     *
     * @param value the return value for the surrounding generator
     * @throws ReturnValue exception with the value.
     * @example
     * // ES6 style
     * Q.async(function* () {
     *      var foo = yield getFooPromise();
     *      var bar = yield getBarPromise();
     *      return foo + bar;
     * })
     * // Older SpiderMonkey style
     * Q.async(function () {
     *      var foo = yield getFooPromise();
     *      var bar = yield getBarPromise();
     *      Q.return(foo + bar);
     * })
     */
    Q["return"] = _return;
    function _return(value) {
        throw new QReturnValue(value);
    }
    /**
     * The promised function decorator ensures that any promise arguments
     * are settled and passed as values (`this` is also settled and passed
     * as a value).  It will also ensure that the result of a function is
     * always a promise.
     *
     * @example
     * var add = Q.promised(function (a, b) {
     *     return a + b;
     * });
     * add(Q(a), Q(B));
     *
     * @param {function} callback The function to decorate
     * @returns {function} a function that has been decorated.
     */
    Q.promised = promised;
    function promised(callback) {
        return function () {
            return spread([this, all(arguments)], function (self, args) {
                return callback.apply(self, args);
            });
        };
    }
    /**
     * sends a message to a value in a future turn
     * @param object* the recipient
     * @param op the name of the message operation, e.g., "when",
     * @param args further arguments to be forwarded to the operation
     * @returns result {Promise} a promise for the result of the operation
     */
    Q.dispatch = dispatch;
    function dispatch(object, op, args) {
        return Q(object).dispatch(op, args);
    }
    Promise.prototype.dispatch = function (op, args) {
        var self = this;
        var deferred = defer();
        Q.nextTick(function () {
            self.promiseDispatch(deferred.resolve, op, args);
        });
        return deferred.promise;
    };
    /**
     * Gets the value of a property in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of property to get
     * @return promise for the property value
     */
    Q.get = function (object, key) {
        return Q(object).dispatch("get", [key]);
    };
    Promise.prototype.get = function (key) {
        return this.dispatch("get", [key]);
    };
    /**
     * Sets the value of a property in a future turn.
     * @param object    promise or immediate reference for object object
     * @param name      name of property to set
     * @param value     new value of property
     * @return promise for the return value
     */
    Q.set = function (object, key, value) {
        return Q(object).dispatch("set", [key, value]);
    };
    Promise.prototype.set = function (key, value) {
        return this.dispatch("set", [key, value]);
    };
    /**
     * Deletes a property in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of property to delete
     * @return promise for the return value
     */
    Q.del = // XXX legacy
        Q["delete"] = function (object, key) {
            return Q(object).dispatch("delete", [key]);
        };
    Promise.prototype.del = // XXX legacy
        Promise.prototype["delete"] = function (key) {
            return this.dispatch("delete", [key]);
        };
    /**
     * Invokes a method in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of method to invoke
     * @param value     a value to post, typically an array of
     *                  invocation arguments for promises that
     *                  are ultimately backed with `resolve` values,
     *                  as opposed to those backed with URLs
     *                  wherein the posted value can be any
     *                  JSON serializable object.
     * @return promise for the return value
     */
    // bound locally because it is used by other methods
    Q.mapply = // XXX As proposed by "Redsandro"
        Q.post = function (object, name, args) {
            return Q(object).dispatch("post", [name, args]);
        };
    Promise.prototype.mapply = // XXX As proposed by "Redsandro"
        Promise.prototype.post = function (name, args) {
            return this.dispatch("post", [name, args]);
        };
    /**
     * Invokes a method in a future turn.
     * @param object    promise or immediate reference for target object
     * @param name      name of method to invoke
     * @param ...args   array of invocation arguments
     * @return promise for the return value
     */
    Q.send = // XXX Mark Miller's proposed parlance
        Q.mcall = // XXX As proposed by "Redsandro"
            Q.invoke = function (object, name /*...args*/) {
                return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
            };
    Promise.prototype.send = // XXX Mark Miller's proposed parlance
        Promise.prototype.mcall = // XXX As proposed by "Redsandro"
            Promise.prototype.invoke = function (name /*...args*/) {
                return this.dispatch("post", [name, array_slice(arguments, 1)]);
            };
    /**
     * Applies the promised function in a future turn.
     * @param object    promise or immediate reference for target function
     * @param args      array of application arguments
     */
    Q.fapply = function (object, args) {
        return Q(object).dispatch("apply", [void 0, args]);
    };
    Promise.prototype.fapply = function (args) {
        return this.dispatch("apply", [void 0, args]);
    };
    /**
     * Calls the promised function in a future turn.
     * @param object    promise or immediate reference for target function
     * @param ...args   array of application arguments
     */
    Q["try"] =
        Q.fcall = function (object /* ...args*/) {
            return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
        };
    Promise.prototype.fcall = function () {
        return this.dispatch("apply", [void 0, array_slice(arguments)]);
    };
    /**
     * Binds the promised function, transforming return values into a fulfilled
     * promise and thrown errors into a rejected one.
     * @param object    promise or immediate reference for target function
     * @param ...args   array of application arguments
     */
    Q.fbind = function (object /*...args*/) {
        var promise = Q(object);
        var args = array_slice(arguments, 1);
        return function fbound() {
            return promise.dispatch("apply", [
                this,
                args.concat(array_slice(arguments))
            ]);
        };
    };
    Promise.prototype.fbind = function () {
        var promise = this;
        var args = array_slice(arguments);
        return function fbound() {
            return promise.dispatch("apply", [
                this,
                args.concat(array_slice(arguments))
            ]);
        };
    };
    /**
     * Requests the names of the owned properties of a promised
     * object in a future turn.
     * @param object    promise or immediate reference for target object
     * @return promise for the keys of the eventually settled object
     */
    Q.keys = function (object) {
        return Q(object).dispatch("keys", []);
    };
    Promise.prototype.keys = function () {
        return this.dispatch("keys", []);
    };
    /**
     * Turns an array of promises into a promise for an array.  If any of
     * the promises gets rejected, the whole array is rejected immediately.
     * @param {Array*} an array (or promise for an array) of values (or
     * promises for values)
     * @returns a promise for an array of the corresponding values
     */
    // By Mark Miller
    // http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
    Q.all = all;
    function all(promises) {
        return when(promises, function (promises) {
            var pendingCount = 0;
            var deferred = defer();
            array_reduce(promises, function (undefined, promise, index) {
                var snapshot;
                if (isPromise(promise) &&
                    (snapshot = promise.inspect()).state === "fulfilled") {
                    promises[index] = snapshot.value;
                }
                else {
                    ++pendingCount;
                    when(promise, function (value) {
                        promises[index] = value;
                        if (--pendingCount === 0) {
                            deferred.resolve(promises);
                        }
                    }, deferred.reject, function (progress) {
                        deferred.notify({ index: index, value: progress });
                    });
                }
            }, void 0);
            if (pendingCount === 0) {
                deferred.resolve(promises);
            }
            return deferred.promise;
        });
    }
    Promise.prototype.all = function () {
        return all(this);
    };
    /**
     * Returns the first resolved promise of an array. Prior rejected promises are
     * ignored.  Rejects only if all promises are rejected.
     * @param {Array*} an array containing values or promises for values
     * @returns a promise fulfilled with the value of the first resolved promise,
     * or a rejected promise if all promises are rejected.
     */
    Q.any = any;
    function any(promises) {
        if (promises.length === 0) {
            return Q.resolve();
        }
        var deferred = Q.defer();
        var pendingCount = 0;
        array_reduce(promises, function (prev, current, index) {
            var promise = promises[index];
            pendingCount++;
            when(promise, onFulfilled, onRejected, onProgress);
            function onFulfilled(result) {
                deferred.resolve(result);
            }
            function onRejected(err) {
                pendingCount--;
                if (pendingCount === 0) {
                    var rejection = err || new Error("" + err);
                    rejection.message = ("Q can't get fulfillment value from any promise, all " +
                        "promises were rejected. Last error message: " + rejection.message);
                    deferred.reject(rejection);
                }
            }
            function onProgress(progress) {
                deferred.notify({
                    index: index,
                    value: progress
                });
            }
        }, undefined);
        return deferred.promise;
    }
    Promise.prototype.any = function () {
        return any(this);
    };
    /**
     * Waits for all promises to be settled, either fulfilled or
     * rejected.  This is distinct from `all` since that would stop
     * waiting at the first rejection.  The promise returned by
     * `allResolved` will never be rejected.
     * @param promises a promise for an array (or an array) of promises
     * (or values)
     * @return a promise for an array of promises
     */
    Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
    function allResolved(promises) {
        return when(promises, function (promises) {
            promises = array_map(promises, Q);
            return when(all(array_map(promises, function (promise) {
                return when(promise, noop, noop);
            })), function () {
                return promises;
            });
        });
    }
    Promise.prototype.allResolved = function () {
        return allResolved(this);
    };
    /**
     * @see Promise#allSettled
     */
    Q.allSettled = allSettled;
    function allSettled(promises) {
        return Q(promises).allSettled();
    }
    /**
     * Turns an array of promises into a promise for an array of their states (as
     * returned by `inspect`) when they have all settled.
     * @param {Array[Any*]} values an array (or promise for an array) of values (or
     * promises for values)
     * @returns {Array[State]} an array of states for the respective values.
     */
    Promise.prototype.allSettled = function () {
        return this.then(function (promises) {
            return all(array_map(promises, function (promise) {
                promise = Q(promise);
                function regardless() {
                    return promise.inspect();
                }
                return promise.then(regardless, regardless);
            }));
        });
    };
    /**
     * Captures the failure of a promise, giving an oportunity to recover
     * with a callback.  If the given promise is fulfilled, the returned
     * promise is fulfilled.
     * @param {Any*} promise for something
     * @param {Function} callback to fulfill the returned promise if the
     * given promise is rejected
     * @returns a promise for the return value of the callback
     */
    Q.fail = // XXX legacy
        Q["catch"] = function (object, rejected) {
            return Q(object).then(void 0, rejected);
        };
    Promise.prototype.fail = // XXX legacy
        Promise.prototype["catch"] = function (rejected) {
            return this.then(void 0, rejected);
        };
    /**
     * Attaches a listener that can respond to progress notifications from a
     * promise's originating deferred. This listener receives the exact arguments
     * passed to ``deferred.notify``.
     * @param {Any*} promise for something
     * @param {Function} callback to receive any progress notifications
     * @returns the given promise, unchanged
     */
    Q.progress = progress;
    function progress(object, progressed) {
        return Q(object).then(void 0, void 0, progressed);
    }
    Promise.prototype.progress = function (progressed) {
        return this.then(void 0, void 0, progressed);
    };
    /**
     * Provides an opportunity to observe the settling of a promise,
     * regardless of whether the promise is fulfilled or rejected.  Forwards
     * the resolution to the returned promise when the callback is done.
     * The callback can return a promise to defer completion.
     * @param {Any*} promise
     * @param {Function} callback to observe the resolution of the given
     * promise, takes no arguments.
     * @returns a promise for the resolution of the given promise when
     * ``fin`` is done.
     */
    Q.fin = // XXX legacy
        Q["finally"] = function (object, callback) {
            return Q(object)["finally"](callback);
        };
    Promise.prototype.fin = // XXX legacy
        Promise.prototype["finally"] = function (callback) {
            if (!callback || typeof callback.apply !== "function") {
                throw new Error("Q can't apply finally callback");
            }
            callback = Q(callback);
            return this.then(function (value) {
                return callback.fcall().then(function () {
                    return value;
                });
            }, function (reason) {
                // TODO attempt to recycle the rejection with "this".
                return callback.fcall().then(function () {
                    throw reason;
                });
            });
        };
    /**
     * Terminates a chain of promises, forcing rejections to be
     * thrown as exceptions.
     * @param {Any*} promise at the end of a chain of promises
     * @returns nothing
     */
    Q.done = function (object, fulfilled, rejected, progress) {
        return Q(object).done(fulfilled, rejected, progress);
    };
    Promise.prototype.done = function (fulfilled, rejected, progress) {
        var onUnhandledError = function (error) {
            // forward to a future turn so that ``when``
            // does not catch it and turn it into a rejection.
            Q.nextTick(function () {
                makeStackTraceLong(error, promise);
                if (Q.onerror) {
                    Q.onerror(error);
                }
                else {
                    throw error;
                }
            });
        };
        // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
        var promise = fulfilled || rejected || progress ?
            this.then(fulfilled, rejected, progress) :
            this;
        if (typeof process === "object" && process && process.domain) {
            onUnhandledError = process.domain.bind(onUnhandledError);
        }
        promise.then(void 0, onUnhandledError);
    };
    /**
     * Causes a promise to be rejected if it does not get fulfilled before
     * some milliseconds time out.
     * @param {Any*} promise
     * @param {Number} milliseconds timeout
     * @param {Any*} custom error message or Error object (optional)
     * @returns a promise for the resolution of the given promise if it is
     * fulfilled before the timeout, otherwise rejected.
     */
    Q.timeout = function (object, ms, error) {
        return Q(object).timeout(ms, error);
    };
    Promise.prototype.timeout = function (ms, error) {
        var deferred = defer();
        var timeoutId = setTimeout(function () {
            if (!error || "string" === typeof error) {
                error = new Error(error || "Timed out after " + ms + " ms");
                error.code = "ETIMEDOUT";
            }
            deferred.reject(error);
        }, ms);
        this.then(function (value) {
            clearTimeout(timeoutId);
            deferred.resolve(value);
        }, function (exception) {
            clearTimeout(timeoutId);
            deferred.reject(exception);
        }, deferred.notify);
        return deferred.promise;
    };
    /**
     * Returns a promise for the given value (or promised value), some
     * milliseconds after it resolved. Passes rejections immediately.
     * @param {Any*} promise
     * @param {Number} milliseconds
     * @returns a promise for the resolution of the given promise after milliseconds
     * time has elapsed since the resolution of the given promise.
     * If the given promise rejects, that is passed immediately.
     */
    Q.delay = function (object, timeout) {
        if (timeout === void 0) {
            timeout = object;
            object = void 0;
        }
        return Q(object).delay(timeout);
    };
    Promise.prototype.delay = function (timeout) {
        return this.then(function (value) {
            var deferred = defer();
            setTimeout(function () {
                deferred.resolve(value);
            }, timeout);
            return deferred.promise;
        });
    };
    /**
     * Passes a continuation to a Node function, which is called with the given
     * arguments provided as an array, and returns a promise.
     *
     *      Q.nfapply(FS.readFile, [__filename])
     *      .then(function (content) {
     *      })
     *
     */
    Q.nfapply = function (callback, args) {
        return Q(callback).nfapply(args);
    };
    Promise.prototype.nfapply = function (args) {
        var deferred = defer();
        var nodeArgs = array_slice(args);
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
    /**
     * Passes a continuation to a Node function, which is called with the given
     * arguments provided individually, and returns a promise.
     * @example
     * Q.nfcall(FS.readFile, __filename)
     * .then(function (content) {
     * })
     *
     */
    Q.nfcall = function (callback /*...args*/) {
        var args = array_slice(arguments, 1);
        return Q(callback).nfapply(args);
    };
    Promise.prototype.nfcall = function () {
        var nodeArgs = array_slice(arguments);
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        this.fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
    /**
     * Wraps a NodeJS continuation passing function and returns an equivalent
     * version that returns a promise.
     * @example
     * Q.nfbind(FS.readFile, __filename)("utf-8")
     * .then(console.log)
     * .done()
     */
    Q.nfbind =
        Q.denodeify = function (callback /*...args*/) {
            if (callback === undefined) {
                throw new Error("Q can't wrap an undefined function");
            }
            var baseArgs = array_slice(arguments, 1);
            return function () {
                var nodeArgs = baseArgs.concat(array_slice(arguments));
                var deferred = defer();
                nodeArgs.push(deferred.makeNodeResolver());
                Q(callback).fapply(nodeArgs).fail(deferred.reject);
                return deferred.promise;
            };
        };
    Promise.prototype.nfbind =
        Promise.prototype.denodeify = function () {
            var args = array_slice(arguments);
            args.unshift(this);
            return Q.denodeify.apply(void 0, args);
        };
    Q.nbind = function (callback, thisp /*...args*/) {
        var baseArgs = array_slice(arguments, 2);
        return function () {
            var nodeArgs = baseArgs.concat(array_slice(arguments));
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            function bound() {
                return callback.apply(thisp, arguments);
            }
            Q(bound).fapply(nodeArgs).fail(deferred.reject);
            return deferred.promise;
        };
    };
    Promise.prototype.nbind = function () {
        var args = array_slice(arguments, 0);
        args.unshift(this);
        return Q.nbind.apply(void 0, args);
    };
    /**
     * Calls a method of a Node-style object that accepts a Node-style
     * callback with a given array of arguments, plus a provided callback.
     * @param object an object that has the named method
     * @param {String} name name of the method of object
     * @param {Array} args arguments to pass to the method; the callback
     * will be provided by Q and appended to these arguments.
     * @returns a promise for the value or error
     */
    Q.nmapply = // XXX As proposed by "Redsandro"
        Q.npost = function (object, name, args) {
            return Q(object).npost(name, args);
        };
    Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
        Promise.prototype.npost = function (name, args) {
            var nodeArgs = array_slice(args || []);
            var deferred = defer();
            nodeArgs.push(deferred.makeNodeResolver());
            this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
            return deferred.promise;
        };
    /**
     * Calls a method of a Node-style object that accepts a Node-style
     * callback, forwarding the given variadic arguments, plus a provided
     * callback argument.
     * @param object an object that has the named method
     * @param {String} name name of the method of object
     * @param ...args arguments to pass to the method; the callback will
     * be provided by Q and appended to these arguments.
     * @returns a promise for the value or error
     */
    Q.nsend = // XXX Based on Mark Miller's proposed "send"
        Q.nmcall = // XXX Based on "Redsandro's" proposal
            Q.ninvoke = function (object, name /*...args*/) {
                var nodeArgs = array_slice(arguments, 2);
                var deferred = defer();
                nodeArgs.push(deferred.makeNodeResolver());
                Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
                return deferred.promise;
            };
    Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
        Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
            Promise.prototype.ninvoke = function (name /*...args*/) {
                var nodeArgs = array_slice(arguments, 1);
                var deferred = defer();
                nodeArgs.push(deferred.makeNodeResolver());
                this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
                return deferred.promise;
            };
    /**
     * If a function would like to support both Node continuation-passing-style and
     * promise-returning-style, it can end its internal promise chain with
     * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
     * elects to use a nodeback, the result will be sent there.  If they do not
     * pass a nodeback, they will receive the result promise.
     * @param object a result (or a promise for a result)
     * @param {Function} nodeback a Node.js-style callback
     * @returns either the promise or nothing
     */
    Q.nodeify = nodeify;
    function nodeify(object, nodeback) {
        return Q(object).nodeify(nodeback);
    }
    Promise.prototype.nodeify = function (nodeback) {
        if (nodeback) {
            this.then(function (value) {
                Q.nextTick(function () {
                    nodeback(null, value);
                });
            }, function (error) {
                Q.nextTick(function () {
                    nodeback(error);
                });
            });
        }
        else {
            return this;
        }
    };
    Q.noConflict = function () {
        throw new Error("Q.noConflict only works when Q is used as a global");
    };
    // All code before this point will be filtered from stack traces.
    var qEndingLine = captureLine();
    return Q;
});

}).call(this,require('_process'))

},{"_process":17}],17:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNjcmlwdHMvRXhwb3J0cy50cyIsInNjcmlwdHMvR3JpZC50cyIsInNjcmlwdHMvR3JpZE1hbmFnZXIudHMiLCJzY3JpcHRzL0xvY2F0aW9uLnRzIiwic2NyaXB0cy9NYWluLnRzIiwic2NyaXB0cy9Nb3ZlLnRzIiwic2NyaXB0cy9PcmllbnRhdGlvbi50cyIsInNjcmlwdHMvUGllY2VzL0xQaWVjZS50cyIsInNjcmlwdHMvUGllY2VzL1BpZWNlLnRzIiwic2NyaXB0cy9QaWVjZXMvU2luZ2xlUGllY2UudHMiLCJzY3JpcHRzL1NvbHZlcnMvQkZTU29sdmVyLnRzIiwic2NyaXB0cy9Tb2x2ZXJzL0xTb2x2ZXIudHMiLCJzY3JpcHRzL1NvbHZlcnMvU29sdmVyLnRzIiwic2NyaXB0cy9Tb2x2ZXJzL1NwaXJhbFNvbHZlci50cyIsInNjcmlwdHMvVXRpbHMvQ29sb3IudHMiLCJ0aGlyZF9wYXJ0eS9xLmpzIiwiLi4vLi4vLi4vLi4vdXNyL2xvY2FsL2xpYi9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBVyxRQUFBLENBQUMsR0FBUSxTQUFTLENBQUM7QUFFOUIsY0FBcUIsQ0FBTTtJQUN6QixTQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1IsQ0FBQztBQUZELG9CQUVDOzs7OztBQ0ZELHlDQUFzQztBQUV0QztJQUtFLFlBQVksQ0FBUztRQUNuQixJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVNLENBQUMsS0FBSyxDQUFDLE1BQWM7UUFDMUIsSUFBSSxJQUFJLEdBQVMsU0FBUyxDQUFDO1FBQzNCLEdBQUcsQ0FBQztZQUNGLElBQUksR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDNUIsTUFBTSxJQUFJLENBQUM7UUFDYixDQUFDLFFBQVEsSUFBSSxFQUFFO0lBQ2pCLENBQUM7SUFFTyxhQUFhLENBQUMsQ0FBUztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNsQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDYixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztDQUNGO0FBN0JELG9CQTZCQzs7Ozs7Ozs7Ozs7OztBQ2pDRCx5Q0FBc0M7QUFDdEMsaUNBQThCO0FBRzlCLHVDQUE4QjtBQUU5QjtJQUtFLFlBQVksYUFBZ0MsRUFBRSxDQUFTO1FBQ3JELElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksV0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFWSxLQUFLLENBQUMsTUFBYzs7WUFDL0IsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFVLEVBQUUsRUFBRTtnQkFDekIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdDLENBQUMsQ0FBQTtZQUNELElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNaLE1BQU0sQ0FBQyxXQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUUsR0FBUyxFQUFFO2dCQUMxQixNQUFNLE1BQU0sR0FBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3ZELE1BQU0sS0FBSyxHQUFvQixhQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hELE9BQU8sSUFBSSxFQUFFLENBQUM7b0JBQ1osSUFBSSxDQUFDO3dCQUNILE1BQU0sSUFBSSxHQUFTLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7d0JBQ3ZDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDcEcsQ0FBQzt3QkFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNoQixNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakIsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUM5QixLQUFLLENBQUM7b0JBQ1IsQ0FBQztnQkFDSCxDQUFDO2dCQUNELE1BQU0sQ0FBQyxXQUFDLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQSxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQUE7SUFFTyxJQUFJLENBQUMsSUFBVztRQUN0QixJQUFJLEtBQUssR0FBVyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksTUFBTSxHQUFXLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNULEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3hDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUM7Z0JBQ3hDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDMUMsQ0FBQztRQUNILENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFXLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO2dCQUMxRCxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBVyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztvQkFDMUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDMUMsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLFNBQVMsQ0FBQyxLQUFhLEVBQUUsTUFBYyxFQUFFLEdBQVcsRUFBRSxHQUFXO1FBQ3ZFLElBQUksQ0FBQyxHQUFXLEdBQUcsR0FBRyxLQUFLLENBQUM7UUFDNUIsSUFBSSxDQUFDLEdBQVcsR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUM3QixJQUFJLEtBQUssR0FBVSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDekMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsSUFBSSxhQUFhLEtBQXdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN0RSxJQUFJLE9BQU8sS0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLElBQUksSUFBSSxLQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztDQUN4QztBQW5FRCxrQ0FtRUM7Ozs7O0FDekVEO0lBSUUsWUFBWSxHQUFXLEVBQUUsR0FBVztRQUNsQyxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2pCLENBQUM7Q0FDRjtBQVJELDRCQVFDOzs7OztBQ1JELCtDQUE0QztBQUU1QyxtREFBZ0Q7QUFDaEQsK0NBQTRDO0FBQzVDLHlEQUFzRDtBQUN0RCwyQ0FBMkM7QUFDM0MsZ0NBQWdDO0FBRWhDLGtCQUFrQjtBQUNsQixFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBRWIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1osTUFBTSxTQUFTLEdBQUcsSUFBSSxxQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sWUFBWSxHQUFHLElBQUksMkJBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ1osR0FBRyxDQUFDLENBQUMsSUFBSSxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0RCxNQUFNLENBQUMsR0FBMEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsVUFBVSxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbkcsTUFBTSxXQUFXLEdBQUcsSUFBSSx5QkFBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMxQyxXQUFXLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQzs7Ozs7QUNqQkQ7SUFJRSxZQUFZLEtBQVksRUFBRSxRQUFrQjtRQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUFSRCxvQkFRQzs7Ozs7QUNYRCxJQUFZLFdBS1g7QUFMRCxXQUFZLFdBQVc7SUFDckIseUNBQUUsQ0FBQTtJQUNGLDZDQUFJLENBQUE7SUFDSiw2Q0FBSSxDQUFBO0lBQ0osK0NBQUssQ0FBQTtBQUNQLENBQUMsRUFMVyxXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQUt0Qjs7Ozs7QUNMRCxtQ0FBZ0M7QUFDaEMsMENBQXVDO0FBQ3ZDLGdEQUE2QztBQUU3QyxZQUFvQixTQUFRLGFBQUs7SUFDeEIsa0JBQWtCO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDMUI7OztlQUdHO1lBQ0gsS0FBSyx5QkFBVyxDQUFDLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQztvQkFDTCxJQUFJLG1CQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxtQkFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDcEIsQ0FBQztZQUNKOzs7ZUFHRztZQUNILEtBQUsseUJBQVcsQ0FBQyxJQUFJO2dCQUNuQixNQUFNLENBQUM7b0JBQ0wsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2xCLElBQUksbUJBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ25CLElBQUksbUJBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3BCLENBQUM7WUFDSjs7O2VBR0c7WUFDSCxLQUFLLHlCQUFXLENBQUMsSUFBSTtnQkFDbkIsTUFBTSxDQUFDO29CQUNMLElBQUksbUJBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUNsQixJQUFJLG1CQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNuQixJQUFJLG1CQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNwQixDQUFDO1lBQ0o7OztlQUdHO1lBQ0gsS0FBSyx5QkFBVyxDQUFDLEtBQUs7Z0JBQ3BCLE1BQU0sQ0FBQztvQkFDTCxJQUFJLG1CQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDbEIsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDbkIsSUFBSSxtQkFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztpQkFDcEIsQ0FBQztZQUNKO2dCQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLFdBQVcsY0FBYyxDQUFDLENBQUM7Z0JBQ3pELEtBQUssQ0FBQztRQUNWLENBQUM7SUFDSCxDQUFDO0lBRUQsWUFBWSxXQUF5QjtRQUNuQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDckIsQ0FBQztDQUNGO0FBcERELHdCQW9EQzs7Ozs7QUNyREQ7SUFHRSxZQUFZLFdBQXlCO1FBQ25DLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQ2pDLENBQUM7Q0FDRjtBQU5ELHNCQU1DOzs7OztBQ1RELG1DQUFnQztBQUNoQywwQ0FBdUM7QUFHdkMsaUJBQXlCLFNBQVEsYUFBSztJQUM3QixrQkFBa0I7UUFDdkIsTUFBTSxDQUFDLENBQUMsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxZQUFZLFdBQXlCO1FBQ25DLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNyQixDQUFDO0NBQ0Y7QUFSRCxrQ0FRQzs7Ozs7QUNaRCxrQ0FBK0I7QUFDL0IsMENBQXVDO0FBQ3ZDLHFDQUFrQztBQUNsQyx1REFBb0Q7QUFDcEQsNkNBQTBDO0FBQzFDLGdEQUE2QztBQUc3QyxlQUF1QixTQUFRLGVBQU07SUFLNUIsS0FBSyxDQUFDLENBQVM7UUFDcEIsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDakIsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksV0FBSSxDQUFDLElBQUkseUJBQVcsRUFBRSxFQUFFLElBQUksbUJBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFFTyxTQUFTLENBQUMsQ0FBUztRQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNsQyxJQUFJLEdBQUcsR0FBYyxFQUFFLENBQUM7WUFDeEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO2dCQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xCLENBQUM7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixDQUFDO0lBQ0gsQ0FBQztJQUVNLFdBQVc7UUFDaEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztZQUM3QixNQUFNLE9BQU8sR0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDbkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBRWpGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksV0FBSSxDQUNOLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQzFCLElBQUksbUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUNyRixDQUNGLENBQUM7b0JBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQ2IsSUFBSSxXQUFJLENBQ04sSUFBSSxlQUFNLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsRUFDNUIsSUFBSSxtQkFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQ3JGLENBQ0YsQ0FBQztvQkFDRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDYixJQUFJLFdBQUksQ0FDTixJQUFJLGVBQU0sQ0FBQyx5QkFBVyxDQUFDLElBQUksQ0FBQyxFQUM1QixJQUFJLG1CQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FDckYsQ0FDRixDQUFDO29CQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUNiLElBQUksV0FBSSxDQUNOLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsS0FBSyxDQUFDLEVBQzdCLElBQUksbUJBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUNyRixDQUNGLENBQUM7Z0JBQ0osQ0FBQztnQkFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2pCLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVPLElBQUksQ0FBQyxJQUFVO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsTUFBTSxZQUFZLEdBQWEsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QyxHQUFHLENBQUMsQ0FBQyxJQUFJLGFBQWEsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzFELE1BQU0sWUFBWSxHQUFHLFlBQVksQ0FBQyxHQUFHLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQztZQUMxRCxNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUM7WUFFMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFlBQVksSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQyxJQUFJLFlBQVksSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEUsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNmLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDZixDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsWUFBWSxDQUFTO1FBQ25CLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBakZELDhCQWlGQzs7Ozs7QUN6RkQsa0NBQStCO0FBQy9CLDBDQUF1QztBQUN2QyxxQ0FBa0M7QUFDbEMsdURBQW9EO0FBQ3BELDZDQUEwQztBQUMxQyxnREFBNkM7QUFFN0MsYUFBcUIsU0FBUSxlQUFNO0lBRzFCLEtBQUssQ0FBQyxDQUFTO1FBQ3BCLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLFdBQVc7UUFDaEIsTUFBTSxJQUFJLEdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssTUFBTSxDQUFDLElBQVUsRUFBRSxRQUFnQixFQUFFLENBQVM7UUFDcEQsSUFBSSxXQUFXLEdBQWdCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO1FBQ3RELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLElBQUksUUFBUSxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM5RCxNQUFNLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEtBQUsseUJBQVcsQ0FBQyxFQUFFO29CQUNqQixXQUFXLEdBQUcseUJBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQy9CLEtBQUssQ0FBQztnQkFDUixLQUFLLHlCQUFXLENBQUMsS0FBSztvQkFDcEIsV0FBVyxHQUFHLHlCQUFXLENBQUMsRUFBRSxDQUFDO29CQUM3QixLQUFLLENBQUM7Z0JBQ1IsS0FBSyx5QkFBVyxDQUFDLElBQUk7b0JBQ25CLFdBQVcsR0FBRyx5QkFBVyxDQUFDLEtBQUssQ0FBQztvQkFDaEMsS0FBSyxDQUFDO2dCQUNSLEtBQUsseUJBQVcsQ0FBQyxJQUFJO29CQUNuQixXQUFXLEdBQUcseUJBQVcsQ0FBQyxJQUFJLENBQUM7b0JBQy9CLEtBQUssQ0FBQztZQUNWLENBQUM7UUFDSCxDQUFDO1FBQ0QsTUFBTSxZQUFZLEdBQVcsSUFBSSxlQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFckQsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osTUFBTSxDQUFDLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDO2dCQUNKLEtBQUssQ0FBQztZQUNSLEtBQUssQ0FBQztnQkFDSixHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixLQUFLLENBQUM7UUFDVixDQUFDO1FBQ0QsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFDN0IsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7UUFFN0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsSUFBSSxRQUFRLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzlELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDakIsQ0FBQztRQUNELE1BQU0sZUFBZSxHQUFhLElBQUksbUJBQVEsQ0FDNUMsR0FBRyxHQUFHLElBQUksRUFDVixHQUFHLEdBQUcsSUFBSSxDQUNYLENBQUM7UUFDRixNQUFNLFdBQVcsR0FBUyxJQUFJLFdBQUksQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRU8sQ0FBQyxRQUFRLENBQUMsQ0FBUztRQUN6QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLE1BQU0sSUFBSSxXQUFJLENBQUMsSUFBSSx5QkFBVyxFQUFFLEVBQUUsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sT0FBTyxHQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLEtBQUssR0FBVyxFQUFFLENBQUM7WUFFdkIsT0FBTyxJQUFJLEVBQUUsQ0FBQztnQkFDWixNQUFNLFFBQVEsR0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUM1QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ2QsS0FBSyxDQUFDO2dCQUNSLENBQUM7Z0JBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBRUQsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssWUFBWSx5QkFBVyxDQUFDLENBQUMsQ0FBQztvQkFDdEMsTUFBTSxJQUFJLENBQUM7Z0JBQ2IsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssWUFBWSxlQUFNLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztZQUNILENBQUM7WUFFRCxNQUFNLElBQUksV0FBSSxDQUNaLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQzFCLElBQUksbUJBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQ3pDLENBQUM7WUFFRixHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxZQUFZLGVBQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2pDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7Q0FDRjtBQTNHRCwwQkEyR0M7Ozs7O0FDaEhEO0lBR1MsS0FBSyxDQUFDLENBQVM7UUFDcEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDYixDQUFDO0lBSUQsWUFBWSxDQUFTO1FBQ25CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBWkQsd0JBWUM7Ozs7O0FDZEQsa0NBQStCO0FBQy9CLDBDQUF1QztBQUN2QyxxQ0FBa0M7QUFDbEMsdURBQW9EO0FBQ3BELDZDQUEwQztBQUMxQyxnREFBNkM7QUFFN0Msa0JBQTBCLFNBQVEsZUFBTTtJQUcvQixLQUFLLENBQUMsQ0FBUztRQUNwQixLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTSxXQUFXO1FBQ2hCLE1BQU0sSUFBSSxHQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxDQUFDLFFBQVEsQ0FBQyxDQUFTO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1osTUFBTSxJQUFJLFdBQUksQ0FBQyxJQUFJLHlCQUFXLEVBQUUsRUFBRSxJQUFJLG1CQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixNQUFNLElBQUksV0FBSSxDQUFDLElBQUkseUJBQVcsRUFBRSxFQUFFLElBQUksbUJBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxNQUFNLElBQUksV0FBSSxDQUFDLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sVUFBVSxHQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN4RCxPQUFPLElBQUksRUFBRSxDQUFDO2dCQUNaLE1BQU0sUUFBUSxHQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDZCxLQUFLLENBQUM7Z0JBQ1IsQ0FBQztnQkFDRCxNQUFNLElBQUksV0FBSSxDQUNaLFFBQVEsQ0FBQyxLQUFLLEVBQ2QsSUFBSSxtQkFBUSxDQUNWLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQ3RDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQ3ZDLENBQ0YsQ0FBQztZQUNKLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixNQUFNLElBQUksV0FBSSxDQUFDLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxNQUFNLElBQUksV0FBSSxDQUFDLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxNQUFNLElBQUksV0FBSSxDQUFDLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxNQUFNLElBQUksV0FBSSxDQUFDLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxtQkFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixvQkFBb0I7Z0JBQ3BCLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO29CQUM1RCxNQUFNO29CQUNOLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO3dCQUM5QyxNQUFNLElBQUksV0FBSSxDQUNaLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsS0FBSyxDQUFDLEVBQzdCLElBQUksbUJBQVEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FDakMsQ0FBQzt3QkFDRixNQUFNLElBQUksV0FBSSxDQUNaLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEVBQzVCLElBQUksbUJBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FDakMsQ0FBQztvQkFDSixDQUFDO29CQUVELFFBQVE7b0JBQ1IsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7d0JBQzlDLE1BQU0sSUFBSSxXQUFJLENBQ1osSUFBSSxlQUFNLENBQUMseUJBQVcsQ0FBQyxJQUFJLENBQUMsRUFDNUIsSUFBSSxtQkFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUM1QyxDQUFDO3dCQUNGLE1BQU0sSUFBSSxXQUFJLENBQ1osSUFBSSxlQUFNLENBQUMseUJBQVcsQ0FBQyxFQUFFLENBQUMsRUFDMUIsSUFBSSxtQkFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FDaEQsQ0FBQztvQkFDSixDQUFDO29CQUVELFNBQVM7b0JBQ1QsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzt3QkFDNUMsTUFBTSxJQUFJLFdBQUksQ0FDWixJQUFJLGVBQU0sQ0FBQyx5QkFBVyxDQUFDLElBQUksQ0FBQyxFQUM1QixJQUFJLG1CQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUMzRCxDQUFDO3dCQUNGLE1BQU0sSUFBSSxXQUFJLENBQ1osSUFBSSxlQUFNLENBQUMseUJBQVcsQ0FBQyxLQUFLLENBQUMsRUFDN0IsSUFBSSxtQkFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FDM0QsQ0FBQztvQkFDSixDQUFDO29CQUVELE9BQU87b0JBQ1AsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7d0JBQzlDLE1BQU0sSUFBSSxXQUFJLENBQ1osSUFBSSxlQUFNLENBQUMseUJBQVcsQ0FBQyxFQUFFLENBQUMsRUFDMUIsSUFBSSxtQkFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FDaEQsQ0FBQzt3QkFDRixNQUFNLElBQUksV0FBSSxDQUNaLElBQUksZUFBTSxDQUFDLHlCQUFXLENBQUMsSUFBSSxDQUFDLEVBQzVCLElBQUksbUJBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FDNUMsQ0FBQztvQkFDSixDQUFDO2dCQUVILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7Q0FDRjtBQWpHRCxvQ0FpR0M7Ozs7O0FDeEdEO0lBNEJFLFlBQVksQ0FBUyxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsSUFBWSxJQUFJO1FBQzNELENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQzNCLE9BQU8sQ0FBQyxNQUFNLENBQ1osQ0FBQyxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksSUFBSSxFQUMzQix3Q0FBd0MsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN4RCxDQUNGLENBQUM7UUFDRixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNaLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDWixJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVaLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRztZQUNuQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDO2lCQUN4QixHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lCQUNwQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDakYsQ0FBQztJQTVCRCxNQUFNLEtBQUssR0FBRyxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM5QyxNQUFNLEtBQUssTUFBTSxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLEtBQUssTUFBTSxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLEtBQUssS0FBSyxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsRCxNQUFNLEtBQUssSUFBSSxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoRCxNQUFNLEtBQUssTUFBTSxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLEtBQUssTUFBTSxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRCxNQUFNLEtBQUssS0FBSyxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNsRCxNQUFNLEtBQUssS0FBSyxLQUFZLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQXNCM0MsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQVM7UUFDOUIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbkMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLElBQUksR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixNQUFNLEtBQUssQ0FBQztRQUNkLENBQUM7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFTO1FBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxQyxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFL0IsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUcsQ0FBQztZQUMxQyxNQUFNLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvRCxDQUFDO1FBRUwsa0JBQWtCO1FBQ2xCLHlEQUF5RDtRQUN6RCwyREFBMkQ7UUFDM0QsNkRBQTZEO1FBQzdELCtEQUErRDtRQUMvRCwwQ0FBMEM7UUFDMUMsYUFBYTtRQUNiLFdBQVc7UUFDWCxTQUFTO1FBQ1QsT0FBTztJQUNMLENBQUM7SUFFRCxJQUFXLFNBQVM7UUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELElBQVcsVUFBVTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRU8sR0FBRyxDQUFDLEdBQVc7UUFDckIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDNUMsQ0FBQzs7QUFyRmMsVUFBSSxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsYUFBTyxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsYUFBTyxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsWUFBTSxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUMsV0FBSyxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0MsYUFBTyxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsYUFBTyxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsWUFBTSxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUMsWUFBTSxHQUFVLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFoQjdELHNCQThGQzs7OztBQzlGRCx1QkFBdUI7QUFDdkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Qkc7QUFFSCxDQUFDLFVBQVUsVUFBVTtJQUNqQixZQUFZLENBQUM7SUFFYixrRUFBa0U7SUFDbEUsNkRBQTZEO0lBQzdELCtEQUErRDtJQUMvRCxnRUFBZ0U7SUFFaEUsa0JBQWtCO0lBQ2xCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsU0FBUyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVyQyxXQUFXO0lBQ1gsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNuRSxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBRWxDLFlBQVk7SUFDWixDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdkIsMEJBQTBCO0lBQzFCLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDWixNQUFNLENBQUM7UUFDWCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUMzQixDQUFDO1FBRUwsV0FBVztJQUNYLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdEUsMkRBQTJEO1FBQzNELHlCQUF5QjtRQUN6QixJQUFJLE1BQU0sR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTNELHNEQUFzRDtRQUN0RCxnQ0FBZ0M7UUFDaEMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDO1FBRXhCLHlEQUF5RDtRQUN6RCxvQkFBb0I7UUFDcEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLEdBQUc7WUFDbEIsTUFBTSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUM7SUFFTixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDSixNQUFNLElBQUksS0FBSyxDQUFDLCtEQUErRCxDQUFDLENBQUM7SUFDckYsQ0FBQztBQUVMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsWUFBWSxDQUFDO0lBRWIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLElBQUksQ0FBQztRQUNELE1BQU0sSUFBSSxLQUFLLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULFNBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUMxQixDQUFDO0lBRUQsd0VBQXdFO0lBQ3hFLFFBQVE7SUFDUixJQUFJLGFBQWEsR0FBRyxXQUFXLEVBQUUsQ0FBQztJQUNsQyxJQUFJLFNBQVMsQ0FBQztJQUVkLFFBQVE7SUFFUixxQ0FBcUM7SUFDckMsSUFBSSxJQUFJLEdBQUcsY0FBYSxDQUFDLENBQUM7SUFFMUIsb0VBQW9FO0lBQ3BFLHFCQUFxQjtJQUNyQixJQUFJLFFBQVEsR0FBRSxDQUFDO1FBQ1gsZ0RBQWdEO1FBQ2hELElBQUksSUFBSSxHQUFHLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztRQUN0QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztRQUNyQiw2REFBNkQ7UUFDN0QsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBRXBCO1lBQ0ksMkJBQTJCO1lBQzNCLElBQUksSUFBSSxFQUFFLE1BQU0sQ0FBQztZQUVqQixPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDakIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUVyQixFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNULElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7b0JBQ3JCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLENBQUM7WUFDRCxPQUFPLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdkIsSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQkFDeEIsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFDRCxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLENBQUM7UUFDRCw0Q0FBNEM7UUFDNUMsbUJBQW1CLElBQUksRUFBRSxNQUFNO1lBQzNCLElBQUksQ0FBQztnQkFDRCxJQUFJLEVBQUUsQ0FBQztZQUVYLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNULEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsNERBQTREO29CQUM1RCxxREFBcUQ7b0JBRXJELDhEQUE4RDtvQkFDOUQsMERBQTBEO29CQUMxRCxrREFBa0Q7b0JBQ2xELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNsQixDQUFDO29CQUNELFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ1QsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNuQixDQUFDO29CQUVELE1BQU0sQ0FBQyxDQUFDO2dCQUVaLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osa0RBQWtEO29CQUNsRCxvREFBb0Q7b0JBQ3BELFVBQVUsQ0FBQzt3QkFDUCxNQUFNLENBQUMsQ0FBQztvQkFDWixDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsQ0FBQztZQUNMLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNULE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNsQixDQUFDO1FBQ0wsQ0FBQztRQUVELFFBQVEsR0FBRyxVQUFVLElBQUk7WUFDckIsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsTUFBTSxFQUFFLFFBQVEsSUFBSSxPQUFPLENBQUMsTUFBTTtnQkFDbEMsSUFBSSxFQUFFLElBQUk7YUFDYixDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNaLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLFdBQVcsRUFBRSxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRO1lBQzNCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsS0FBSyxrQkFBa0IsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNoRSxxRUFBcUU7WUFDckUseUNBQXlDO1lBQ3pDLHdFQUF3RTtZQUN4RSxnRUFBZ0U7WUFDaEUsbUVBQW1FO1lBQ25FLDREQUE0RDtZQUM1RCx3REFBd0Q7WUFDeEQsb0RBQW9EO1lBQ3BELFFBQVEsR0FBRyxJQUFJLENBQUM7WUFFaEIsV0FBVyxHQUFHO2dCQUNWLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsQ0FBQyxDQUFDO1FBRU4sQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLFlBQVksS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzVDLG9FQUFvRTtZQUNwRSxFQUFFLENBQUMsQ0FBQyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxXQUFXLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDbkQsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFdBQVcsR0FBRztvQkFDVixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hCLENBQUMsQ0FBQztZQUNOLENBQUM7UUFFTCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sY0FBYyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0Msa0JBQWtCO1lBQ2xCLHdEQUF3RDtZQUN4RCxJQUFJLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25DLHlFQUF5RTtZQUN6RSxxREFBcUQ7WUFDckQsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUc7Z0JBQ3RCLFdBQVcsR0FBRyxlQUFlLENBQUM7Z0JBQzlCLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDaEMsS0FBSyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUM7WUFDRixJQUFJLGVBQWUsR0FBRztnQkFDbEIsZ0VBQWdFO2dCQUNoRSxxQkFBcUI7Z0JBQ3JCLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FBQztZQUNGLFdBQVcsR0FBRztnQkFDVixVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNyQixlQUFlLEVBQUUsQ0FBQztZQUN0QixDQUFDLENBQUM7UUFFTixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixlQUFlO1lBQ2YsV0FBVyxHQUFHO2dCQUNWLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUNELGtEQUFrRDtRQUNsRCx1RUFBdUU7UUFDdkUseUNBQXlDO1FBQ3pDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsVUFBVSxJQUFJO1lBQzlCLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNaLFFBQVEsR0FBRyxJQUFJLENBQUM7Z0JBQ2hCLFdBQVcsRUFBRSxDQUFDO1lBQ2xCLENBQUM7UUFDTCxDQUFDLENBQUM7UUFDRixNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFTCwwREFBMEQ7SUFDMUQsaUJBQWlCO0lBQ2pCLGlEQUFpRDtJQUNqRCxpRUFBaUU7SUFDakUsb0VBQW9FO0lBQ3BFLCtCQUErQjtJQUMvQiw0RUFBNEU7SUFDNUUsdURBQXVEO0lBQ3ZELG1EQUFtRDtJQUNuRCwyRUFBMkU7SUFDM0UsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztJQUN6QixxQkFBcUIsQ0FBQztRQUNsQixNQUFNLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUNELGtDQUFrQztJQUNsQyx3REFBd0Q7SUFDeEQsZ0NBQWdDO0lBRWhDLElBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJELElBQUksWUFBWSxHQUFHLFdBQVcsQ0FDMUIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksVUFBVSxRQUFRLEVBQUUsS0FBSztRQUMvQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQ1QsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDekIsdURBQXVEO1FBQ3ZELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixtREFBbUQ7WUFDbkQsZ0RBQWdEO1lBQ2hELEdBQUcsQ0FBQztnQkFDQSxFQUFFLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO29CQUN0QixLQUFLLENBQUM7Z0JBQ1YsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNwQixNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7Z0JBQzFCLENBQUM7WUFDTCxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2hCLENBQUM7UUFDRCxTQUFTO1FBQ1QsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEdBQUcsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDN0IsdURBQXVEO1lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEQsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUMsQ0FDSixDQUFDO0lBRUYsSUFBSSxhQUFhLEdBQUcsV0FBVyxDQUMzQixLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sSUFBSSxVQUFVLEtBQUs7UUFDdEMsOERBQThEO1FBQzlELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZCxDQUFDLENBQ0osQ0FBQztJQUVGLElBQUksU0FBUyxHQUFHLFdBQVcsQ0FDdkIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksVUFBVSxRQUFRLEVBQUUsS0FBSztRQUM1QyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLFlBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUs7WUFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDWCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUMsQ0FDSixDQUFDO0lBRUYsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxVQUFVLFNBQVM7UUFDcEQsa0JBQWtCLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdEIsQ0FBQyxDQUFDO0lBRUYsSUFBSSxxQkFBcUIsR0FBRyxNQUFNLENBQUMsY0FBYyxJQUFJLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVO1FBQ2hGLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDZixDQUFDLENBQUM7SUFFRixJQUFJLHFCQUFxQixHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBRXpFLElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLElBQUksVUFBVSxNQUFNO1FBQzdDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMscUJBQXFCLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0lBRUYsSUFBSSxlQUFlLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFN0Qsa0JBQWtCLEtBQUs7UUFDbkIsTUFBTSxDQUFDLEtBQUssS0FBSyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELDBCQUEwQjtJQUUxQix1RUFBdUU7SUFDdkUseUJBQXlCLFNBQVM7UUFDOUIsTUFBTSxDQUFDLENBQ0gsZUFBZSxDQUFDLFNBQVMsQ0FBQyxLQUFLLHdCQUF3QjtZQUN2RCxTQUFTLFlBQVksWUFBWSxDQUNwQyxDQUFDO0lBQ04sQ0FBQztJQUVELG9FQUFvRTtJQUNwRSxnQkFBZ0I7SUFDaEIsSUFBSSxZQUFZLENBQUM7SUFDakIsRUFBRSxDQUFDLENBQUMsT0FBTyxXQUFXLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQztRQUNyQyxZQUFZLEdBQUcsV0FBVyxDQUFDO0lBQy9CLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNKLFlBQVksR0FBRyxVQUFVLEtBQUs7WUFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDdkIsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELG9CQUFvQjtJQUVwQixJQUFJLG9CQUFvQixHQUFHLHNCQUFzQixDQUFDO0lBRWxELDRCQUE0QixLQUFLLEVBQUUsT0FBTztRQUN0QyxzRUFBc0U7UUFDdEUsd0VBQXdFO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLFNBQVM7WUFDVCxPQUFPLENBQUMsS0FBSztZQUNiLE9BQU8sS0FBSyxLQUFLLFFBQVE7WUFDekIsS0FBSyxLQUFLLElBQUk7WUFDZCxLQUFLLENBQUMsS0FDVixDQUFDLENBQUMsQ0FBQztZQUNDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsdUJBQXVCLElBQUksS0FBSyxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hHLHFCQUFxQixDQUFDLEtBQUssRUFBRSx5QkFBeUIsRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO29CQUNyRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU1QixJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsQ0FBQztZQUNyRSxJQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM5QyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztRQUM5RSxDQUFDO0lBQ0wsQ0FBQztJQUVELDJCQUEyQixXQUFXO1FBQ2xDLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQ3BDLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUVwQixFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVCLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVELHFCQUFxQixTQUFTO1FBQzFCLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxrQ0FBa0MsU0FBUztRQUN2Qyx3RUFBd0U7UUFDeEUsbUVBQW1FO1FBQ25FLElBQUksUUFBUSxHQUFHLCtCQUErQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFFRCw2REFBNkQ7UUFDN0QsSUFBSSxRQUFRLEdBQUcsMkJBQTJCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzNELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsQ0FBQztRQUVELHdFQUF3RTtRQUN4RSxJQUFJLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlCQUF5QixTQUFTO1FBQzlCLElBQUkscUJBQXFCLEdBQUcsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFaEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBSSxVQUFVLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxTQUFTO1lBQ3pCLFVBQVUsSUFBSSxhQUFhO1lBQzNCLFVBQVUsSUFBSSxXQUFXLENBQUM7SUFDbEMsQ0FBQztJQUVELG1FQUFtRTtJQUNuRSxTQUFTO0lBQ1Q7UUFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDYixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0QsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ1QsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hFLElBQUkscUJBQXFCLEdBQUcsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxTQUFTLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUM7SUFDTCxDQUFDO0lBRUQsbUJBQW1CLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVztRQUMxQyxNQUFNLENBQUM7WUFDSCxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxXQUFXO2dCQUM5QixPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsc0JBQXNCLEdBQUcsV0FBVztvQkFDM0MsV0FBVyxFQUFFLElBQUksS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELGVBQWU7SUFDZix5QkFBeUI7SUFFekI7Ozs7T0FJRztJQUNILFdBQVcsS0FBSztRQUNaLHdFQUF3RTtRQUN4RSwyRUFBMkU7UUFDM0Usb0RBQW9EO1FBQ3BELEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDakIsQ0FBQztRQUVELHVCQUF1QjtRQUN2QixFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxQixDQUFDO0lBQ0wsQ0FBQztJQUNELENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBRWQ7OztPQUdHO0lBQ0gsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFFdEI7O09BRUc7SUFDSCxDQUFDLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBRTNCOzs7OztPQUtHO0lBQ0gsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7SUFFekIsdUNBQXVDO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDL0UsQ0FBQyxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztJQUM5QixDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDaEI7UUFDSSwyRUFBMkU7UUFDM0Usb0VBQW9FO1FBQ3BFLDRFQUE0RTtRQUM1RSx3RUFBd0U7UUFDeEUscUVBQXFFO1FBQ3JFLHNEQUFzRDtRQUN0RCxJQUFJLFFBQVEsR0FBRyxFQUFFLEVBQUUsaUJBQWlCLEdBQUcsRUFBRSxFQUFFLGVBQWUsQ0FBQztRQUUzRCxJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzlDLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFL0MsT0FBTyxDQUFDLGVBQWUsR0FBRyxVQUFVLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUTtZQUNyRCxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDWCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssTUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLGlCQUFpQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEMsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUMsUUFBUSxDQUFDO29CQUNQLGVBQWUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsaUJBQWlCO1FBQ2pCLE9BQU8sQ0FBQyxPQUFPLEdBQUc7WUFDZCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDbkIsQ0FBQztZQUNELElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixlQUFlLEdBQUcsV0FBVyxDQUFDLENBQUMsZ0JBQWdCO1lBQ25ELENBQUM7WUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztRQUVGLE9BQU8sQ0FBQyxPQUFPLEdBQUc7WUFDZCxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsQ0FBQztZQUNoQyxDQUFDO1lBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNyQyxDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1lBQ3RCLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNULG1FQUFtRTtnQkFDbkUsZ0VBQWdFO2dCQUNoRSwwQ0FBMEM7Z0JBQzFDLEVBQUU7Z0JBQ0YsNkRBQTZEO2dCQUM3RCwrQ0FBK0M7Z0JBQy9DLE9BQU8sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQzdELE9BQU8sQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLEVBQUUsQ0FBQztZQUM5QyxDQUFDO1FBQ0wsQ0FBQztRQUVELDBFQUEwRTtRQUMxRSxvRUFBb0U7UUFDcEUsc0VBQXNFO1FBRXRFLGdCQUFnQixVQUFVO1lBQ3RCLGVBQWUsR0FBRyxVQUFVLENBQUM7WUFFN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLDBEQUEwRDtnQkFDMUQscUNBQXFDO2dCQUNyQyxPQUFPLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztZQUNoQyxDQUFDO1lBRUQsWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLFNBQVMsRUFBRSxPQUFPO2dCQUMvQyxDQUFDLENBQUMsUUFBUSxDQUFDO29CQUNQLFVBQVUsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDMUQsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUVYLFFBQVEsR0FBRyxLQUFLLENBQUMsQ0FBQztZQUNsQixpQkFBaUIsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUMvQixDQUFDO1FBRUQsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDM0IsUUFBUSxDQUFDLE9BQU8sR0FBRyxVQUFVLEtBQUs7WUFDOUIsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUM7UUFFRixRQUFRLENBQUMsT0FBTyxHQUFHLFVBQVUsS0FBSztZQUM5QixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQztRQUNGLFFBQVEsQ0FBQyxNQUFNLEdBQUcsVUFBVSxNQUFNO1lBQzlCLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0IsQ0FBQyxDQUFDO1FBQ0YsUUFBUSxDQUFDLE1BQU0sR0FBRyxVQUFVLFFBQVE7WUFDaEMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLFNBQVMsRUFBRSxnQkFBZ0I7Z0JBQ2pFLENBQUMsQ0FBQyxRQUFRLENBQUM7b0JBQ1AsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQy9CLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDZixDQUFDLENBQUM7UUFFRixNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRztRQUMvQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIsTUFBTSxDQUFDLFVBQVUsS0FBSyxFQUFFLEtBQUs7WUFDekIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDUixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ04sQ0FBQyxDQUFDO0lBRUY7Ozs7O09BS0c7SUFDSCxDQUFDLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLE1BQU07SUFDM0IsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDcEIsaUJBQWlCLFFBQVE7UUFDckIsRUFBRSxDQUFDLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLElBQUksU0FBUyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELElBQUksUUFBUSxHQUFHLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQztZQUNELFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pFLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsTUFBTTtJQUMzQixPQUFPLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLE1BQU07SUFDekIsT0FBTyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxNQUFNO0lBQy9CLE9BQU8sQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTTtJQUUzQiwwRUFBMEU7SUFDMUUsOEVBQThFO0lBQzlFLGtDQUFrQztJQUNsQyxDQUFDLENBQUMsVUFBVSxHQUFHLFVBQVUsTUFBTTtRQUMzQixpQkFBaUI7UUFDakIsaUNBQWlDO1FBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDbEIsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUc7UUFDM0IsaUJBQWlCO1FBQ2pCLGlDQUFpQztRQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUMsQ0FBQztJQUVGOzs7Ozs7OztPQVFHO0lBQ0gsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBQ25CLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSTtRQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsMkNBQTJDO2dCQUMzQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE1BQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUM7SUFFRjs7OztPQUlHO0lBQ0gsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDZCxjQUFjLFFBQVE7UUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLE9BQU8sRUFBRSxNQUFNO1lBQ3BDLGlEQUFpRDtZQUNqRCx3Q0FBd0M7WUFDeEMsd0NBQXdDO1lBQ3hDLE1BQU07WUFDTiwyQkFBMkI7WUFDM0IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztnQkFDbEQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDekMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7OztPQVVHO0lBQ0gsQ0FBQyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDeEIsaUJBQWlCLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTztRQUMxQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFFBQVEsR0FBRyxVQUFVLEVBQUU7Z0JBQ25CLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQ25CLHNDQUFzQyxHQUFHLEVBQUUsQ0FDOUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDO1FBQ04sQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckIsT0FBTyxHQUFHO2dCQUNOLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxTQUFTLEVBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7UUFDTixDQUFDO1FBRUQsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUUvQyxPQUFPLENBQUMsZUFBZSxHQUFHLFVBQVUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJO1lBQ2pELElBQUksTUFBTSxDQUFDO1lBQ1gsSUFBSSxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pCLE1BQU0sR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDakQsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUM5QyxDQUFDO1lBQ0wsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0IsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixPQUFPLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUUxQixtREFBbUQ7UUFDbkQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLElBQUksU0FBUyxHQUFHLE9BQU8sRUFBRSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDakMsT0FBTyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO1lBQ3pDLENBQUM7WUFFRCxPQUFPLENBQUMsT0FBTyxHQUFHO2dCQUNkLElBQUksU0FBUyxHQUFHLE9BQU8sRUFBRSxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLFNBQVM7b0JBQzdCLFNBQVMsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQztnQkFDbkIsQ0FBQztnQkFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztZQUMzQixDQUFDLENBQUM7UUFDTixDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUc7UUFDekIsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0lBQzlCLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVO1FBQzlELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQztRQUN2QixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBRywrQ0FBK0M7UUFDL0Msc0NBQXNDO1FBRTFELG9CQUFvQixLQUFLO1lBQ3JCLElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsT0FBTyxTQUFTLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUN0RSxDQUFDO1lBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDakIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM3QixDQUFDO1FBQ0wsQ0FBQztRQUVELG1CQUFtQixTQUFTO1lBQ3hCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDO29CQUNELE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQy9CLENBQUM7Z0JBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztvQkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDaEMsQ0FBQztZQUNMLENBQUM7WUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdCLENBQUM7UUFFRCxxQkFBcUIsS0FBSztZQUN0QixNQUFNLENBQUMsT0FBTyxVQUFVLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUN4RSxDQUFDO1FBRUQsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNQLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxLQUFLO2dCQUNoQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNQLE1BQU0sQ0FBQztnQkFDWCxDQUFDO2dCQUNELElBQUksR0FBRyxJQUFJLENBQUM7Z0JBRVosUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsVUFBVSxTQUFTO29CQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNQLE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUNELElBQUksR0FBRyxJQUFJLENBQUM7b0JBRVosUUFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNSLENBQUMsQ0FBQyxDQUFDO1FBRUgsK0RBQStEO1FBQy9ELElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsVUFBVSxLQUFLO2dCQUN6RCxJQUFJLFFBQVEsQ0FBQztnQkFDYixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7Z0JBQ2xCLElBQUksQ0FBQztvQkFDRCxRQUFRLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO2dCQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ1QsS0FBSyxHQUFHLElBQUksQ0FBQztvQkFDYixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQzt3QkFDWixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqQixDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNKLE1BQU0sQ0FBQyxDQUFDO29CQUNaLENBQUM7Z0JBQ0wsQ0FBQztnQkFFRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ1QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDOUIsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztJQUM1QixDQUFDLENBQUM7SUFFRixDQUFDLENBQUMsR0FBRyxHQUFHLFVBQVUsT0FBTyxFQUFFLFFBQVE7UUFDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLFFBQVE7UUFDdEMsUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV2QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUs7WUFDNUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7Ozs7Ozs7OztPQWVHO0lBQ0gsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDZCxjQUFjLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVU7UUFDaEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxLQUFLO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQztJQUVGLENBQUMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxPQUFPLEVBQUUsS0FBSztRQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUFVLE1BQU07UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxNQUFNLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BELENBQUMsQ0FBQztJQUVGLENBQUMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxPQUFPLEVBQUUsTUFBTTtRQUNwQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QyxDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7T0FRRztJQUVILDRCQUE0QjtJQUM1QixDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNsQixnQkFBZ0IsS0FBSztRQUNqQixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQzNCLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDeEIsbUJBQW1CLE1BQU07UUFDckIsTUFBTSxDQUFDLE1BQU0sWUFBWSxPQUFPLENBQUM7SUFDckMsQ0FBQztJQUVELENBQUMsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO0lBQ2xDLHdCQUF3QixNQUFNO1FBQzFCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFDeEIsbUJBQW1CLE1BQU07UUFDckIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUc7UUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDO0lBQzlDLENBQUMsQ0FBQztJQUVGOzs7T0FHRztJQUNILENBQUMsQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0lBQzVCLHFCQUFxQixNQUFNO1FBQ3ZCLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLLFdBQVcsQ0FBQztJQUN4RSxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUc7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEtBQUssV0FBVyxDQUFDO0lBQ2hELENBQUMsQ0FBQztJQUVGOztPQUVHO0lBQ0gsQ0FBQyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7SUFDMUIsb0JBQW9CLE1BQU07UUFDdEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxLQUFLLFVBQVUsQ0FBQztJQUN0RSxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUc7UUFDM0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDO0lBQy9DLENBQUMsQ0FBQztJQUVGLHVDQUF1QztJQUV2Qyw2RUFBNkU7SUFDN0UsZ0ZBQWdGO0lBQ2hGLDRFQUE0RTtJQUM1RSx5REFBeUQ7SUFDekQsSUFBSSxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7SUFDMUIsSUFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFDN0IsSUFBSSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7SUFDckMsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFFcEM7UUFDSSxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLG1CQUFtQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLENBQUM7WUFDNUIsd0JBQXdCLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLENBQUM7SUFDTCxDQUFDO0lBRUQsd0JBQXdCLE9BQU8sRUFBRSxNQUFNO1FBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDcEUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Z0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3JELE9BQU8sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUNwRCwyQkFBMkIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzlDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2hELGdCQUFnQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGFBQWEsR0FBRyxNQUFNLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0wsQ0FBQztJQUVELDBCQUEwQixPQUFPO1FBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO1lBQzVCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLEVBQUUsR0FBRyxhQUFhLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDcEUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7b0JBQ2hCLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDbkUsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbEIsT0FBTyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQzt3QkFDaEUsMkJBQTJCLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDcEQsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkMsQ0FBQztJQUNMLENBQUM7SUFFRCxDQUFDLENBQUMsd0JBQXdCLEdBQUcsd0JBQXdCLENBQUM7SUFFdEQsQ0FBQyxDQUFDLG1CQUFtQixHQUFHO1FBQ3BCLHlFQUF5RTtRQUN6RSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDcEMsQ0FBQyxDQUFDO0lBRUYsQ0FBQyxDQUFDLDhCQUE4QixHQUFHO1FBQy9CLHdCQUF3QixFQUFFLENBQUM7UUFDM0Isd0JBQXdCLEdBQUcsS0FBSyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztJQUVGLHdCQUF3QixFQUFFLENBQUM7SUFFM0IscUNBQXFDO0lBRXJDOzs7T0FHRztJQUNILENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ2xCLGdCQUFnQixNQUFNO1FBQ2xCLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQztZQUNwQixNQUFNLEVBQUUsVUFBVSxRQUFRO2dCQUN0Qix1Q0FBdUM7Z0JBQ3ZDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ1gsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzNCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDOUMsQ0FBQztTQUNKLEVBQUU7WUFDQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUMsRUFBRTtZQUNDLE1BQU0sQ0FBQyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO1FBRUgsNkNBQTZDO1FBQzdDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFbEMsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNyQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDcEIsaUJBQWlCLEtBQUs7UUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNYLE1BQU0sRUFBRTtnQkFDSixNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxLQUFLLEVBQUUsVUFBVSxJQUFJO2dCQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZCLENBQUM7WUFDRCxLQUFLLEVBQUUsVUFBVSxJQUFJLEVBQUUsR0FBRztnQkFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUN0QixDQUFDO1lBQ0QsUUFBUSxFQUFFLFVBQVUsSUFBSTtnQkFDcEIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkIsQ0FBQztZQUNELE1BQU0sRUFBRSxVQUFVLElBQUksRUFBRSxJQUFJO2dCQUN4Qiw2REFBNkQ7Z0JBQzdELHFCQUFxQjtnQkFDckIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDckMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzFDLENBQUM7WUFDTCxDQUFDO1lBQ0QsT0FBTyxFQUFFLFVBQVUsS0FBSyxFQUFFLElBQUk7Z0JBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDO1lBQ0QsTUFBTSxFQUFFO2dCQUNKLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDOUIsQ0FBQztTQUNKLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDUCxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsZ0JBQWdCLE9BQU87UUFDbkIsSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUNQLElBQUksQ0FBQztnQkFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckUsQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDbEIsZ0JBQWdCLE1BQU07UUFDbEIsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUNYLE9BQU8sRUFBRSxjQUFhLENBQUM7U0FDMUIsRUFBRSxrQkFBa0IsRUFBRSxFQUFFLElBQUk7WUFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RDLENBQUMsRUFBRTtZQUNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsQ0FBQyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDbEIsZ0JBQWdCLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUTtRQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsU0FBUyxFQUFFLFFBQVE7UUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLO1lBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNqQixDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXlCRztJQUNILENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2hCLGVBQWUsYUFBYTtRQUN4QixNQUFNLENBQUM7WUFDSCxzQ0FBc0M7WUFDdEMsNENBQTRDO1lBQzVDLG1CQUFtQixJQUFJLEVBQUUsR0FBRztnQkFDeEIsSUFBSSxNQUFNLENBQUM7Z0JBRVgsb0VBQW9FO2dCQUNwRSx1RUFBdUU7Z0JBQ3ZFLGdFQUFnRTtnQkFDaEUsb0VBQW9FO2dCQUNwRSxzRUFBc0U7Z0JBQ3RFLHdFQUF3RTtnQkFDeEUsY0FBYztnQkFFZCxFQUFFLENBQUMsQ0FBQyxPQUFPLGFBQWEsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxpQkFBaUI7b0JBQ2pCLElBQUksQ0FBQzt3QkFDRCxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNsQyxDQUFDO29CQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzdCLENBQUM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2QsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDakQsQ0FBQztnQkFDTCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLDBCQUEwQjtvQkFDMUIsdURBQXVEO29CQUN2RCxJQUFJLENBQUM7d0JBQ0QsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDbEMsQ0FBQztvQkFBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3dCQUNqQixFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDOUIsQ0FBQzt3QkFBQyxJQUFJLENBQUMsQ0FBQzs0QkFDSixNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3dCQUM3QixDQUFDO29CQUNMLENBQUM7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxDQUFDO1lBQ0wsQ0FBQztZQUNELElBQUksU0FBUyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ2pELElBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDaEIsZUFBZSxhQUFhO1FBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHdFQUF3RTtJQUN4RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsT0FBTyxDQUFDO0lBQ3RCLGlCQUFpQixLQUFLO1FBQ2xCLE1BQU0sSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7OztPQWNHO0lBQ0gsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDdEIsa0JBQWtCLFFBQVE7UUFDdEIsTUFBTSxDQUFDO1lBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxVQUFVLElBQUksRUFBRSxJQUFJO2dCQUN0RCxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDdEIsa0JBQWtCLE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSTtRQUM5QixNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsRUFBRSxFQUFFLElBQUk7UUFDM0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxRQUFRLENBQUM7WUFDUCxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0lBRUY7Ozs7O09BS0c7SUFDSCxDQUFDLENBQUMsR0FBRyxHQUFHLFVBQVUsTUFBTSxFQUFFLEdBQUc7UUFDekIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUc7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2QyxDQUFDLENBQUM7SUFFRjs7Ozs7O09BTUc7SUFDSCxDQUFDLENBQUMsR0FBRyxHQUFHLFVBQVUsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFLEtBQUs7UUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQyxDQUFDO0lBRUY7Ozs7O09BS0c7SUFDSCxDQUFDLENBQUMsR0FBRyxHQUFHLGFBQWE7UUFDckIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLFVBQVUsTUFBTSxFQUFFLEdBQUc7WUFDL0IsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxhQUFhO1FBQ3JDLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsVUFBVSxHQUFHO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxvREFBb0Q7SUFDcEQsQ0FBQyxDQUFDLE1BQU0sR0FBRyxpQ0FBaUM7UUFDNUMsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSTtZQUNqQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxpQ0FBaUM7UUFDNUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSTtZQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUM7SUFFRjs7Ozs7O09BTUc7SUFDSCxDQUFDLENBQUMsSUFBSSxHQUFHLHNDQUFzQztRQUMvQyxDQUFDLENBQUMsS0FBSyxHQUFHLGlDQUFpQztZQUMzQyxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUN6QyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsc0NBQXNDO1FBQy9ELE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLGlDQUFpQztZQUMzRCxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLElBQUksQ0FBQyxXQUFXO2dCQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEUsQ0FBQyxDQUFDO0lBRUY7Ozs7T0FJRztJQUNILENBQUMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxNQUFNLEVBQUUsSUFBSTtRQUM3QixNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFVBQVUsSUFBSTtRQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQztJQUVGOzs7O09BSUc7SUFDSCxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLE1BQU0sQ0FBQyxZQUFZO1lBQ25DLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDO0lBRUY7Ozs7O09BS0c7SUFDSCxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsTUFBTSxDQUFDLFdBQVc7UUFDbEMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUM3QixJQUFJO2dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3RDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUNGLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO1FBQ3RCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEMsTUFBTSxDQUFDO1lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO2dCQUM3QixJQUFJO2dCQUNKLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3RDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGOzs7OztPQUtHO0lBQ0gsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLE1BQU07UUFDckIsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO1FBQ3JCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUM7SUFFRjs7Ozs7O09BTUc7SUFDSCxpQkFBaUI7SUFDakIsMEZBQTBGO0lBQzFGLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ1osYUFBYSxRQUFRO1FBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVUsUUFBUTtZQUNwQyxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7WUFDckIsSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLENBQUM7WUFDdkIsWUFBWSxDQUFDLFFBQVEsRUFBRSxVQUFVLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSztnQkFDdEQsSUFBSSxRQUFRLENBQUM7Z0JBQ2IsRUFBRSxDQUFDLENBQ0MsU0FBUyxDQUFDLE9BQU8sQ0FBQztvQkFDbEIsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQzdDLENBQUMsQ0FBQyxDQUFDO29CQUNDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUNyQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEVBQUUsWUFBWSxDQUFDO29CQUNmLElBQUksQ0FDQSxPQUFPLEVBQ1AsVUFBVSxLQUFLO3dCQUNYLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7d0JBQ3hCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9CLENBQUM7b0JBQ0wsQ0FBQyxFQUNELFFBQVEsQ0FBQyxNQUFNLEVBQ2YsVUFBVSxRQUFRO3dCQUNkLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUN2RCxDQUFDLENBQ0osQ0FBQztnQkFDTixDQUFDO1lBQ0wsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWCxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDO1lBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUc7UUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUM7SUFFRjs7Ozs7O09BTUc7SUFDSCxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUVaLGFBQWEsUUFBUTtRQUNqQixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixDQUFDO1FBRUQsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3pCLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNyQixZQUFZLENBQUMsUUFBUSxFQUFFLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLO1lBQ2pELElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU5QixZQUFZLEVBQUUsQ0FBQztZQUVmLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNuRCxxQkFBcUIsTUFBTTtnQkFDdkIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQ0Qsb0JBQW9CLEdBQUc7Z0JBQ25CLFlBQVksRUFBRSxDQUFDO2dCQUNmLEVBQUUsQ0FBQyxDQUFDLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLFNBQVMsR0FBRyxHQUFHLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO29CQUUzQyxTQUFTLENBQUMsT0FBTyxHQUFHLENBQUMsc0RBQXNEO3dCQUN2RSw4Q0FBOEMsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBRXhFLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQy9CLENBQUM7WUFDTCxDQUFDO1lBQ0Qsb0JBQW9CLFFBQVE7Z0JBQ3hCLFFBQVEsQ0FBQyxNQUFNLENBQUM7b0JBQ1osS0FBSyxFQUFFLEtBQUs7b0JBQ1osS0FBSyxFQUFFLFFBQVE7aUJBQ2xCLENBQUMsQ0FBQztZQUNQLENBQUM7UUFDTCxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFZCxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUc7UUFDcEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7T0FRRztJQUNILENBQUMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDLENBQUM7SUFDcEUscUJBQXFCLFFBQVE7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBVSxRQUFRO1lBQ3BDLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxPQUFPO2dCQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3BCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUc7UUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDLENBQUM7SUFFRjs7T0FFRztJQUNILENBQUMsQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQzFCLG9CQUFvQixRQUFRO1FBQ3hCLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEMsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsUUFBUTtZQUMvQixNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxPQUFPO2dCQUM1QyxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQjtvQkFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUM3QixDQUFDO2dCQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNoRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7T0FRRztJQUNILENBQUMsQ0FBQyxJQUFJLEdBQUcsYUFBYTtRQUN0QixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsVUFBVSxNQUFNLEVBQUUsUUFBUTtZQUNuQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxhQUFhO1FBQ3RDLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsVUFBVSxRQUFRO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQztJQUVGOzs7Ozs7O09BT0c7SUFDSCxDQUFDLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUN0QixrQkFBa0IsTUFBTSxFQUFFLFVBQVU7UUFDaEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsVUFBVTtRQUM3QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztJQUNqRCxDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7OztPQVVHO0lBQ0gsQ0FBQyxDQUFDLEdBQUcsR0FBRyxhQUFhO1FBQ3JCLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLE1BQU0sRUFBRSxRQUFRO1lBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDMUMsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsYUFBYTtRQUNyQyxPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFVBQVUsUUFBUTtZQUM3QyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3RELENBQUM7WUFDRCxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSztnQkFDNUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7b0JBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFFLFVBQVUsTUFBTTtnQkFDZixxREFBcUQ7Z0JBQ3JELE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDO29CQUN6QixNQUFNLE1BQU0sQ0FBQztnQkFDakIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztJQUVGOzs7OztPQUtHO0lBQ0gsQ0FBQyxDQUFDLElBQUksR0FBRyxVQUFVLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVE7UUFDcEQsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUTtRQUM1RCxJQUFJLGdCQUFnQixHQUFHLFVBQVUsS0FBSztZQUNsQyw0Q0FBNEM7WUFDNUMsa0RBQWtEO1lBQ2xELENBQUMsQ0FBQyxRQUFRLENBQUM7Z0JBQ1Asa0JBQWtCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDWixDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE1BQU0sS0FBSyxDQUFDO2dCQUNoQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFRiw2REFBNkQ7UUFDN0QsSUFBSSxPQUFPLEdBQUcsU0FBUyxJQUFJLFFBQVEsSUFBSSxRQUFRLENBQUMsQ0FBQztZQUM3QyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMxQyxJQUFJLENBQUM7UUFFVCxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzNELGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUVELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7T0FRRztJQUNILENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxNQUFNLEVBQUUsRUFBRSxFQUFFLEtBQUs7UUFDbkMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFLEtBQUs7UUFDM0MsSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxTQUFTLEdBQUcsVUFBVSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLFFBQVEsS0FBSyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLElBQUksa0JBQWtCLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO2dCQUM1RCxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztZQUM3QixDQUFDO1lBQ0QsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzQixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFUCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSztZQUNyQixZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDeEIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixDQUFDLEVBQUUsVUFBVSxTQUFTO1lBQ2xCLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN4QixRQUFRLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFcEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDNUIsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7O09BUUc7SUFDSCxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsTUFBTSxFQUFFLE9BQU87UUFDL0IsRUFBRSxDQUFDLENBQUMsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQixPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ2pCLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNwQixDQUFDO1FBQ0QsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQyxDQUFDO0lBRUYsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxPQUFPO1FBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSztZQUM1QixJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQztZQUN2QixVQUFVLENBQUM7Z0JBQ1AsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDWixNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztJQUVGOzs7Ozs7OztPQVFHO0lBQ0gsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLFFBQVEsRUFBRSxJQUFJO1FBQ2hDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSTtRQUN0QyxJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQztRQUN2QixJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztJQUM1QixDQUFDLENBQUM7SUFFRjs7Ozs7Ozs7T0FRRztJQUNILENBQUMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxRQUFRLENBQUMsV0FBVztRQUNyQyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHO1FBQ3ZCLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QyxJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQztRQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQzVCLENBQUMsQ0FBQztJQUVGOzs7Ozs7O09BT0c7SUFDSCxDQUFDLENBQUMsTUFBTTtRQUNSLENBQUMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxRQUFRLENBQUMsV0FBVztZQUN4QyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDekIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO1lBQzFELENBQUM7WUFDRCxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLE1BQU0sQ0FBQztnQkFDSCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLFFBQVEsR0FBRyxLQUFLLEVBQUUsQ0FBQztnQkFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1lBQzVCLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsTUFBTTtRQUN4QixPQUFPLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRztZQUMxQixJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO0lBRUYsQ0FBQyxDQUFDLEtBQUssR0FBRyxVQUFVLFFBQVEsRUFBRSxLQUFLLENBQUMsV0FBVztRQUMzQyxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sQ0FBQztZQUNILElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLENBQUM7WUFDdkIsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO1lBQzNDO2dCQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUM1QyxDQUFDO1lBQ0QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2hELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO1FBQzVCLENBQUMsQ0FBQztJQUNOLENBQUMsQ0FBQztJQUVGLE9BQU8sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO1FBQ3RCLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7O09BUUc7SUFDSCxDQUFDLENBQUMsT0FBTyxHQUFHLGlDQUFpQztRQUM3QyxDQUFDLENBQUMsS0FBSyxHQUFHLFVBQVUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJO1lBQ2xDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxpQ0FBaUM7UUFDN0QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxJQUFJLEVBQUUsSUFBSTtZQUMxQyxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRSxDQUFDO1lBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7UUFDNUIsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7OztPQVNHO0lBQ0gsQ0FBQyxDQUFDLEtBQUssR0FBRyw2Q0FBNkM7UUFDdkQsQ0FBQyxDQUFDLE1BQU0sR0FBRyxzQ0FBc0M7WUFDakQsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDMUMsSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekMsSUFBSSxRQUFRLEdBQUcsS0FBSyxFQUFFLENBQUM7Z0JBQ3ZCLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQztnQkFDM0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNuRSxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztZQUM1QixDQUFDLENBQUM7SUFFRixPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyw2Q0FBNkM7UUFDdkUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsc0NBQXNDO1lBQ2pFLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsSUFBSSxDQUFDLFdBQVc7Z0JBQ2xELElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksUUFBUSxHQUFHLEtBQUssRUFBRSxDQUFDO2dCQUN2QixRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDOUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7WUFDNUIsQ0FBQyxDQUFDO0lBRUY7Ozs7Ozs7OztPQVNHO0lBQ0gsQ0FBQyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDcEIsaUJBQWlCLE1BQU0sRUFBRSxRQUFRO1FBQzdCLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLFFBQVE7UUFDMUMsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLO2dCQUNyQixDQUFDLENBQUMsUUFBUSxDQUFDO29CQUNQLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFFLFVBQVUsS0FBSztnQkFDZCxDQUFDLENBQUMsUUFBUSxDQUFDO29CQUNQLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDcEIsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUMsQ0FBQztJQUVGLENBQUMsQ0FBQyxVQUFVLEdBQUc7UUFDWCxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7SUFDMUUsQ0FBQyxDQUFDO0lBRUYsaUVBQWlFO0lBQ2pFLElBQUksV0FBVyxHQUFHLFdBQVcsRUFBRSxDQUFDO0lBRWhDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFFVCxDQUFDLENBQUMsQ0FBQzs7Ozs7QUMzaEVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfXJldHVybiBlfSkoKSIsImV4cG9ydCBsZXQgUTogYW55ID0gdW5kZWZpbmVkO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0UShxOiBhbnkpIHtcbiAgUSA9IHE7XG59XG4iLCJpbXBvcnQgeyBTb2x2ZXIgfSBmcm9tIFwiLi9Tb2x2ZXJzL1NvbHZlclwiO1xuaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuL01vdmVcIjtcbmltcG9ydCB7IENvbG9yIH0gZnJvbSBcIi4vVXRpbHMvQ29sb3JcIjtcblxuZXhwb3J0IGNsYXNzIEdyaWQge1xuICBwdWJsaWMgZ3JpZDogQ29sb3JbXVtdO1xuICBwdWJsaWMgazogbnVtYmVyO1xuICBwdWJsaWMgc29sdmVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKGs6IG51bWJlcikge1xuICAgIHRoaXMuY29uc3RydWN0R3JpZChrKTsgIFxuICAgIHRoaXMuc29sdmVkID0gZmFsc2U7XG4gICAgdGhpcy5rID0gaztcbiAgfVxuXG4gIHB1YmxpYyAqc29sdmUoc29sdmVyOiBTb2x2ZXIpIHtcbiAgICBsZXQgbW92ZTogTW92ZSA9IHVuZGVmaW5lZDtcbiAgICBkbyB7XG4gICAgICBtb3ZlID0gc29sdmVyLmdldE5leHRNb3ZlKCk7XG4gICAgICB5aWVsZCBtb3ZlO1xuICAgIH0gd2hpbGUgKG1vdmUpO1xuICB9IFxuICAgXG4gIHByaXZhdGUgY29uc3RydWN0R3JpZChrOiBudW1iZXIpIHtcbiAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICBmb3IgKGxldCByID0gMDsgciA8ICgxIDw8IGspOyByKyspIHtcbiAgICAgIGxldCByb3cgPSBbXTtcbiAgICAgIGZvciAobGV0IGMgPSAwOyBjIDwgKDEgPDwgayk7IGMrKykge1xuICAgICAgICByb3cucHVzaChDb2xvci5XaGl0ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmdyaWQucHVzaChyb3cpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29sb3IgfSBmcm9tIFwiLi9VdGlscy9Db2xvclwiO1xuaW1wb3J0IHsgR3JpZCB9IGZyb20gXCIuL0dyaWRcIjtcbmltcG9ydCB7IE1vdmUgfSBmcm9tIFwiLi9Nb3ZlXCI7XG5pbXBvcnQgeyBTb2x2ZXIgfSBmcm9tIFwiLi9Tb2x2ZXJzL1NvbHZlclwiO1xuaW1wb3J0IHsgUSB9IGZyb20gXCIuL0V4cG9ydHNcIjtcblxuZXhwb3J0IGNsYXNzIEdyaWRNYW5hZ2VyIHtcbiAgcHJpdmF0ZSByZWFkb25seSBfY2FudmFzRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgcHJpdmF0ZSByZWFkb25seSBfZ3JpZDogR3JpZDtcblxuICBjb25zdHJ1Y3RvcihjYW52YXNFbGVtZW50OiBIVE1MQ2FudmFzRWxlbWVudCwgazogbnVtYmVyKSB7XG4gICAgdGhpcy5fY2FudmFzRWxlbWVudCA9IGNhbnZhc0VsZW1lbnQ7XG4gICAgdGhpcy5fY29udGV4dCA9IGNhbnZhc0VsZW1lbnQuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB0aGlzLl9ncmlkID0gbmV3IEdyaWQoayk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc29sdmUoc29sdmVyOiBTb2x2ZXIpIHtcbiAgICBsZXQgZGVsYXkgPSAobXM6IG51bWJlcikgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKHIgPT4gc2V0VGltZW91dChyLCBtcykpO1xuICAgIH0gXG4gICAgdGhpcy5kcmF3KCk7XG4gICAgcmV0dXJuIFEoKS50aGVuKCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBzb2x2ZWQ6IEl0ZXJhdG9yPE1vdmU+ID0gdGhpcy5ncmlkLnNvbHZlKHNvbHZlcik7XG4gICAgICBjb25zdCBjeWNsZTogSXRlcmF0b3I8Q29sb3I+ID0gQ29sb3IuY3ljbGUodGhpcy5ncmlkLmspO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBtb3ZlOiBNb3ZlID0gc29sdmVkLm5leHQoKS52YWx1ZTtcbiAgICAgICAgICBmb3IgKGxldCBjb29yZCBvZiBtb3ZlLnBpZWNlLmdldFJlbGF0aXZlSW5kaWNlcygpKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQuZ3JpZFttb3ZlLmxvY2F0aW9uLnJvdyArIGNvb3JkLnJvd11bbW92ZS5sb2NhdGlvbi5jb2wgKyBjb29yZC5jb2xdID0gY3ljbGUubmV4dCgpLnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLmRyYXcobW92ZSk7XG4gICAgICAgICAgYXdhaXQgZGVsYXkoMSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXhpdGVkIGxvb3AnLCBlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIFEoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZHJhdyhtb3ZlPzogTW92ZSkge1xuICAgIGxldCB3aWR0aDogbnVtYmVyID0gdGhpcy5jYW52YXNFbGVtZW50LndpZHRoIC8gKDEgPDwgdGhpcy5ncmlkLmspO1xuICAgIGxldCBoZWlnaHQ6IG51bWJlciA9IHRoaXMuY2FudmFzRWxlbWVudC5oZWlnaHQgLyAoMSA8PCB0aGlzLmdyaWQuayk7XG4gICAgaWYgKG1vdmUpIHtcbiAgICAgIGZvciAobGV0IGlkeCBvZiBtb3ZlLnBpZWNlLmdldFJlbGF0aXZlSW5kaWNlcygpKSB7XG4gICAgICAgIGNvbnN0IHJvdyA9IG1vdmUubG9jYXRpb24ucm93ICsgaWR4LnJvdztcbiAgICAgICAgY29uc3QgY29sID0gbW92ZS5sb2NhdGlvbi5jb2wgKyBpZHguY29sO1xuICAgICAgICB0aGlzLmRyYXdQaWVjZSh3aWR0aCwgaGVpZ2h0LCByb3csIGNvbCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IHJvdzogbnVtYmVyID0gMDsgcm93IDwgKDEgPDwgdGhpcy5ncmlkLmspOyByb3crKykge1xuICAgICAgICBmb3IgKGxldCBjb2w6IG51bWJlciA9IDA7IGNvbCA8ICgxIDw8IHRoaXMuZ3JpZC5rKTsgY29sKyspIHtcbiAgICAgICAgICB0aGlzLmRyYXdQaWVjZSh3aWR0aCwgaGVpZ2h0LCByb3csIGNvbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGRyYXdQaWVjZSh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgcm93OiBudW1iZXIsIGNvbDogbnVtYmVyKSB7XG4gICAgbGV0IHg6IG51bWJlciA9IGNvbCAqIHdpZHRoO1xuICAgIGxldCB5OiBudW1iZXIgPSByb3cgKiBoZWlnaHQ7XG4gICAgbGV0IGNvbG9yOiBDb2xvciA9IHRoaXMuZ3JpZC5ncmlkW3Jvd11bY29sXTsgXG4gICAgdGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY29udGV4dC5yZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSBjb2xvci5oZXhTdHJpbmc7XG4gICAgdGhpcy5jb250ZXh0LmZpbGwoKTtcbiAgfVxuXG4gIGdldCBjYW52YXNFbGVtZW50KCk6IEhUTUxDYW52YXNFbGVtZW50IHsgcmV0dXJuIHRoaXMuX2NhbnZhc0VsZW1lbnQ7IH1cbiAgZ2V0IGNvbnRleHQoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHsgcmV0dXJuIHRoaXMuX2NvbnRleHQ7IH1cbiAgZ2V0IGdyaWQoKTogR3JpZCB7IHJldHVybiB0aGlzLl9ncmlkOyB9XG59XG4iLCJleHBvcnQgY2xhc3MgTG9jYXRpb24ge1xuICBwdWJsaWMgcm93OiBudW1iZXI7XG4gIHB1YmxpYyBjb2w6IG51bWJlcjtcblxuICBjb25zdHJ1Y3Rvcihyb3c6IG51bWJlciwgY29sOiBudW1iZXIpIHtcbiAgICB0aGlzLnJvdyA9IHJvdztcbiAgICB0aGlzLmNvbCA9IGNvbDtcbiAgfVxufVxuIiwiaW1wb3J0IHsgR3JpZE1hbmFnZXIgfSBmcm9tIFwiLi9HcmlkTWFuYWdlclwiO1xuaW1wb3J0IHsgTmFpdmVTb2x2ZXIgfSBmcm9tIFwiLi9Tb2x2ZXJzL05haXZlU29sdmVyXCI7XG5pbXBvcnQgeyBCRlNTb2x2ZXIgfSBmcm9tIFwiLi9Tb2x2ZXJzL0JGU1NvbHZlclwiO1xuaW1wb3J0IHsgTFNvbHZlciB9IGZyb20gXCIuL1NvbHZlcnMvTFNvbHZlclwiO1xuaW1wb3J0IHsgU3BpcmFsU29sdmVyIH0gZnJvbSBcIi4vU29sdmVycy9TcGlyYWxTb2x2ZXJcIjtcbmltcG9ydCAqIGFzIFBybyBmcm9tIFwiLi4vdGhpcmRfcGFydHkvcS5qc1wiO1xuaW1wb3J0ICogYXMgRXggZnJvbSBcIi4vRXhwb3J0c1wiO1xuXG4vLyBtYWtlIFEoKSBnbG9iYWxcbkV4LnNldFEoUHJvKTtcblxuY29uc3QgSyA9IDg7XG5jb25zdCBiZnNTb2x2ZXIgPSBuZXcgQkZTU29sdmVyKEspO1xuY29uc3Qgc3BpcmFsU29sdmVyID0gbmV3IFNwaXJhbFNvbHZlcihLKTtcbmNvbnN0IGxTb2x2ZXIgPSBuZXcgTFNvbHZlcihLKTtcbmxldCBpZHggPSAwO1xuZm9yIChsZXQgc29sdmVyIG9mIFtiZnNTb2x2ZXIsIHNwaXJhbFNvbHZlciwgbFNvbHZlcl0pIHtcbiAgY29uc3QgYzogSFRNTENhbnZhc0VsZW1lbnQgPSA8SFRNTENhbnZhc0VsZW1lbnQ+IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY2FudmFzLSR7aWR4Kyt9YCk7XG4gIGNvbnN0IGdyaWRNYW5hZ2VyID0gbmV3IEdyaWRNYW5hZ2VyKGMsIEspO1xuICBncmlkTWFuYWdlci5zb2x2ZShzb2x2ZXIpLnRoZW4oKCkgPT4geyBjb25zb2xlLmxvZygnZG9uZSEnKTsgfSk7XG59XG4iLCJpbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCIuL0xvY2F0aW9uXCI7XG5pbXBvcnQgeyBQaWVjZSB9IGZyb20gXCIuL1BpZWNlcy9QaWVjZVwiO1xuXG5leHBvcnQgY2xhc3MgTW92ZSB7XG4gIHB1YmxpYyBwaWVjZTogUGllY2U7XG4gIHB1YmxpYyBsb2NhdGlvbjogTG9jYXRpb247XG5cbiAgY29uc3RydWN0b3IocGllY2U6IFBpZWNlLCBsb2NhdGlvbjogTG9jYXRpb24pIHtcbiAgICB0aGlzLnBpZWNlID0gcGllY2U7XG4gICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uO1xuICB9XG59XG4iLCJleHBvcnQgZW51bSBPcmllbnRhdGlvbiB7XG4gIFVwLFxuICBEb3duLFxuICBMZWZ0LFxuICBSaWdodCxcbn1cbiIsImltcG9ydCB7IFBpZWNlIH0gZnJvbSBcIi4vUGllY2VcIjtcbmltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIi4uL0xvY2F0aW9uXCI7XG5pbXBvcnQgeyBPcmllbnRhdGlvbiB9IGZyb20gXCIuLi9PcmllbnRhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgTFBpZWNlIGV4dGVuZHMgUGllY2Uge1xuICBwdWJsaWMgZ2V0UmVsYXRpdmVJbmRpY2VzKCk6IExvY2F0aW9uW10ge1xuICAgIHN3aXRjaCAoK3RoaXMub3JpZW50YXRpb24pIHtcbiAgICAgIC8qKlxuICAgICAgICogICNcbiAgICAgICAqICMjXG4gICAgICAgKi9cbiAgICAgIGNhc2UgT3JpZW50YXRpb24uVXA6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgbmV3IExvY2F0aW9uKDAsIDApLFxuICAgICAgICAgIG5ldyBMb2NhdGlvbigtMSwgMCksXG4gICAgICAgICAgbmV3IExvY2F0aW9uKDAsIC0xKSxcbiAgICAgICAgXTtcbiAgICAgIC8qKlxuICAgICAgICogIyNcbiAgICAgICAqICNcbiAgICAgICAqL1xuICAgICAgY2FzZSBPcmllbnRhdGlvbi5Eb3duOlxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIG5ldyBMb2NhdGlvbigwLCAwKSxcbiAgICAgICAgICBuZXcgTG9jYXRpb24oKzEsIDApLFxuICAgICAgICAgIG5ldyBMb2NhdGlvbigwLCArMSksXG4gICAgICAgIF07XG4gICAgICAvKipcbiAgICAgICAqICMjXG4gICAgICAgKiAgI1xuICAgICAgICovXG4gICAgICBjYXNlIE9yaWVudGF0aW9uLkxlZnQ6XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgbmV3IExvY2F0aW9uKDAsIDApLFxuICAgICAgICAgIG5ldyBMb2NhdGlvbigwLCAtMSksXG4gICAgICAgICAgbmV3IExvY2F0aW9uKCsxLCAwKSxcbiAgICAgICAgXTtcbiAgICAgIC8qKlxuICAgICAgICogI1xuICAgICAgICogIyNcbiAgICAgICAqL1xuICAgICAgY2FzZSBPcmllbnRhdGlvbi5SaWdodDpcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBuZXcgTG9jYXRpb24oMCwgMCksXG4gICAgICAgICAgbmV3IExvY2F0aW9uKDAsICsxKSxcbiAgICAgICAgICBuZXcgTG9jYXRpb24oLTEsIDApLFxuICAgICAgICBdO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgY29uc29sZS5lcnJvcihgT3JpZW50YXRpb24gJyR7b3JpZW50YXRpb259JyBub3Qga25vd24uYCk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9yaWVudGF0aW9uPzogT3JpZW50YXRpb24pIHtcbiAgICBzdXBlcihvcmllbnRhdGlvbik7XG4gIH1cbn1cbiIsImltcG9ydCB7IExvY2F0aW9uIH0gZnJvbSBcIi4uL0xvY2F0aW9uXCI7XG5pbXBvcnQgeyBPcmllbnRhdGlvbiB9IGZyb20gXCIuLi9PcmllbnRhdGlvblwiO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUGllY2Uge1xuICBwdWJsaWMgb3JpZW50YXRpb246IE9yaWVudGF0aW9uO1xuICBwdWJsaWMgYWJzdHJhY3QgZ2V0UmVsYXRpdmVJbmRpY2VzKG9yaWVudGF0aW9uPzogT3JpZW50YXRpb24pOiBMb2NhdGlvbltdO1xuICBjb25zdHJ1Y3RvcihvcmllbnRhdGlvbj86IE9yaWVudGF0aW9uKSB7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICB9XG59XG4iLCJpbXBvcnQgeyBQaWVjZSB9IGZyb20gXCIuL1BpZWNlXCI7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCIuLi9Mb2NhdGlvblwiO1xuaW1wb3J0IHsgT3JpZW50YXRpb24gfSBmcm9tIFwiLi4vT3JpZW50YXRpb25cIjtcblxuZXhwb3J0IGNsYXNzIFNpbmdsZVBpZWNlIGV4dGVuZHMgUGllY2Uge1xuICBwdWJsaWMgZ2V0UmVsYXRpdmVJbmRpY2VzKCk6IExvY2F0aW9uW10ge1xuICAgIHJldHVybiBbbmV3IExvY2F0aW9uKDAsIDApXTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKG9yaWVudGF0aW9uPzogT3JpZW50YXRpb24pIHtcbiAgICBzdXBlcihvcmllbnRhdGlvbik7XG4gIH1cbn1cbiIsImltcG9ydCB7IE1vdmUgfSBmcm9tIFwiLi4vTW92ZVwiO1xuaW1wb3J0IHsgTG9jYXRpb24gfSBmcm9tIFwiLi4vTG9jYXRpb25cIjtcbmltcG9ydCB7IFNvbHZlciB9IGZyb20gXCIuL1NvbHZlclwiO1xuaW1wb3J0IHsgU2luZ2xlUGllY2UgfSBmcm9tIFwiLi4vUGllY2VzL1NpbmdsZVBpZWNlXCI7XG5pbXBvcnQgeyBMUGllY2UgfSBmcm9tIFwiLi4vUGllY2VzL0xQaWVjZVwiO1xuaW1wb3J0IHsgT3JpZW50YXRpb24gfSBmcm9tIFwiLi4vT3JpZW50YXRpb25cIjtcblxuXG5leHBvcnQgY2xhc3MgQkZTU29sdmVyIGV4dGVuZHMgU29sdmVyIHtcbiAgcHJpdmF0ZSBsb2NhdGlvbjogTG9jYXRpb247XG4gIHByaXZhdGUgZ3JpZDogYm9vbGVhbltdW107XG4gIHByaXZhdGUgcXVldWU6IE1vdmVbXTtcblxuICBwdWJsaWMgcmVzZXQoazogbnVtYmVyKTogdm9pZCB7XG4gICAgc3VwZXIucmVzZXQoayk7XG4gICAgdGhpcy5yZXNldEdyaWQoaylcbiAgICB0aGlzLnF1ZXVlID0gW25ldyBNb3ZlKG5ldyBTaW5nbGVQaWVjZSgpLCBuZXcgTG9jYXRpb24oMCwgMCkpXTtcbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRHcmlkKGs6IG51bWJlcikge1xuICAgIHRoaXMuZ3JpZCA9IFtdO1xuICAgIGZvciAobGV0IHIgPSAwOyByIDwgKDEgPDwgayk7IHIrKykge1xuICAgICAgbGV0IHJvdzogYm9vbGVhbltdID0gW107XG4gICAgICBmb3IgKGxldCBjID0gMDsgYyA8ICgxIDw8IGspOyBjKyspIHtcbiAgICAgICAgcm93LnB1c2goZmFsc2UpO1xuICAgICAgfVxuICAgICAgdGhpcy5ncmlkLnB1c2gocm93KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0TmV4dE1vdmUoKTogTW92ZSB7XG4gICAgd2hpbGUgKHRoaXMucXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgdG9wTW92ZTogTW92ZSA9IHRoaXMucXVldWVbMF07XG4gICAgICB0aGlzLnF1ZXVlLnNoaWZ0KCk7XG4gICAgICBpZiAodGhpcy5maXRzKHRvcE1vdmUpKSB7XG4gICAgICAgIGZvciAobGV0IGxvYyBvZiB0b3BNb3ZlLnBpZWNlLmdldFJlbGF0aXZlSW5kaWNlcygpKSB7XG4gICAgICAgICAgdGhpcy5ncmlkW3RvcE1vdmUubG9jYXRpb24ucm93ICsgbG9jLnJvd11bdG9wTW92ZS5sb2NhdGlvbi5jb2wgKyBsb2MuY29sXSA9IHRydWU7XG5cbiAgICAgICAgICB0aGlzLnF1ZXVlLnB1c2goXG4gICAgICAgICAgICBuZXcgTW92ZShcbiAgICAgICAgICAgICAgbmV3IExQaWVjZShPcmllbnRhdGlvbi5VcCksXG4gICAgICAgICAgICAgIG5ldyBMb2NhdGlvbih0b3BNb3ZlLmxvY2F0aW9uLnJvdyArIGxvYy5yb3cgKyAxLCB0b3BNb3ZlLmxvY2F0aW9uLmNvbCArIGxvYy5jb2wgKyAxKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKFxuICAgICAgICAgICAgbmV3IE1vdmUoXG4gICAgICAgICAgICAgIG5ldyBMUGllY2UoT3JpZW50YXRpb24uRG93biksXG4gICAgICAgICAgICAgIG5ldyBMb2NhdGlvbih0b3BNb3ZlLmxvY2F0aW9uLnJvdyArIGxvYy5yb3cgLSAxLCB0b3BNb3ZlLmxvY2F0aW9uLmNvbCArIGxvYy5jb2wgLSAxKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKFxuICAgICAgICAgICAgbmV3IE1vdmUoXG4gICAgICAgICAgICAgIG5ldyBMUGllY2UoT3JpZW50YXRpb24uTGVmdCksXG4gICAgICAgICAgICAgIG5ldyBMb2NhdGlvbih0b3BNb3ZlLmxvY2F0aW9uLnJvdyArIGxvYy5yb3cgLSAxLCB0b3BNb3ZlLmxvY2F0aW9uLmNvbCArIGxvYy5jb2wgKyAxKVxuICAgICAgICAgICAgKVxuICAgICAgICAgICk7XG4gICAgICAgICAgdGhpcy5xdWV1ZS5wdXNoKFxuICAgICAgICAgICAgbmV3IE1vdmUoXG4gICAgICAgICAgICAgIG5ldyBMUGllY2UoT3JpZW50YXRpb24uUmlnaHQpLFxuICAgICAgICAgICAgICBuZXcgTG9jYXRpb24odG9wTW92ZS5sb2NhdGlvbi5yb3cgKyBsb2Mucm93ICsgMSwgdG9wTW92ZS5sb2NhdGlvbi5jb2wgKyBsb2MuY29sIC0gMSlcbiAgICAgICAgICAgIClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0b3BNb3ZlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZml0cyhtb3ZlOiBNb3ZlKTogYm9vbGVhbiB7XG4gICAgY29uc29sZS5sb2cobW92ZSk7XG4gICAgY29uc3QgbW92ZUxvY2F0aW9uOiBMb2NhdGlvbiA9IG1vdmUubG9jYXRpb247XG4gICAgZm9yIChsZXQgcmVsYXRpdmVJbmRleCBvZiBtb3ZlLnBpZWNlLmdldFJlbGF0aXZlSW5kaWNlcygpKSB7XG4gICAgICBjb25zdCByb3dQbGFjZW1lbnQgPSBtb3ZlTG9jYXRpb24ucm93ICsgcmVsYXRpdmVJbmRleC5yb3c7XG4gICAgICBjb25zdCBjb2xQbGFjZW1lbnQgPSBtb3ZlTG9jYXRpb24uY29sICsgcmVsYXRpdmVJbmRleC5jb2w7XG4gICAgICBcbiAgICAgIGlmICghKCgwIDw9IHJvd1BsYWNlbWVudCAmJiByb3dQbGFjZW1lbnQgPCB0aGlzLmdyaWQubGVuZ3RoKSAmJlxuICAgICAgICAgICAoMCA8PSBjb2xQbGFjZW1lbnQgJiYgY29sUGxhY2VtZW50IDwgdGhpcy5ncmlkWzBdLmxlbmd0aCkpKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ncmlkW3Jvd1BsYWNlbWVudF1bY29sUGxhY2VtZW50XSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoazogbnVtYmVyKSB7XG4gICAgc3VwZXIoayk7XG4gICAgdGhpcy5yZXNldChrKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuLi9Nb3ZlXCI7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCIuLi9Mb2NhdGlvblwiO1xuaW1wb3J0IHsgU29sdmVyIH0gZnJvbSBcIi4vU29sdmVyXCI7XG5pbXBvcnQgeyBTaW5nbGVQaWVjZSB9IGZyb20gXCIuLi9QaWVjZXMvU2luZ2xlUGllY2VcIjtcbmltcG9ydCB7IExQaWVjZSB9IGZyb20gXCIuLi9QaWVjZXMvTFBpZWNlXCI7XG5pbXBvcnQgeyBPcmllbnRhdGlvbiB9IGZyb20gXCIuLi9PcmllbnRhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgTFNvbHZlciBleHRlbmRzIFNvbHZlciB7XG4gIHByaXZhdGUgbW92ZXM6IEl0ZXJhdG9yPE1vdmU+O1xuXG4gIHB1YmxpYyByZXNldChrOiBudW1iZXIpOiB2b2lkIHtcbiAgICBzdXBlci5yZXNldChrKTtcbiAgICB0aGlzLm1vdmVzID0gdGhpcy5nZXRNb3ZlcyhrKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROZXh0TW92ZSgpOiBNb3ZlIHtcbiAgICBjb25zdCBtb3ZlOiBNb3ZlID0gdGhpcy5tb3Zlcy5uZXh0KCkudmFsdWU7XG4gICAgcmV0dXJuIG1vdmU7XG4gIH1cblxuICAvKipcbiAgICogcXVhZHJhbnRzXG4gICAqIDAgMVxuICAgKiAzIDJcbiAgICovXG4gIHByaXZhdGUgcm90YXRlKG1vdmU6IE1vdmUsIHF1YWRyYW50OiBudW1iZXIsIGs6IG51bWJlcik6IE1vdmUge1xuICAgIGxldCBvcmllbnRhdGlvbjogT3JpZW50YXRpb24gPSBtb3ZlLnBpZWNlLm9yaWVudGF0aW9uO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgKHF1YWRyYW50ICUgNCkgJiYgcXVhZHJhbnQgJSAyID09PSAxOyBpKyspIHtcbiAgICAgIHN3aXRjaCAoK29yaWVudGF0aW9uKSB7XG4gICAgICAgIGNhc2UgT3JpZW50YXRpb24uVXA6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSBPcmllbnRhdGlvbi5MZWZ0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIE9yaWVudGF0aW9uLlJpZ2h0OlxuICAgICAgICAgIG9yaWVudGF0aW9uID0gT3JpZW50YXRpb24uVXA7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgT3JpZW50YXRpb24uRG93bjpcbiAgICAgICAgICBvcmllbnRhdGlvbiA9IE9yaWVudGF0aW9uLlJpZ2h0O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIE9yaWVudGF0aW9uLkxlZnQ6XG4gICAgICAgICAgb3JpZW50YXRpb24gPSBPcmllbnRhdGlvbi5Eb3duO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCByb3RhdGVkUGllY2U6IExQaWVjZSA9IG5ldyBMUGllY2Uob3JpZW50YXRpb24pO1xuXG4gICAgbGV0IHJvdyA9IDA7XG4gICAgbGV0IGNvbCA9IDA7XG4gICAgc3dpdGNoIChxdWFkcmFudCAlIDQpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGNvbCA9ICgxIDw8IChrIC0gMSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcm93ID0gKDEgPDwgKGsgLSAxKSk7XG4gICAgICAgIGNvbCA9ICgxIDw8IChrIC0gMSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgcm93ID0gKDEgPDwgKGsgLSAxKSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBsZXQgcnJvdyA9IG1vdmUubG9jYXRpb24ucm93O1xuICAgIGxldCByY29sID0gbW92ZS5sb2NhdGlvbi5jb2w7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IChxdWFkcmFudCAlIDQpICYmIHF1YWRyYW50ICUgMiA9PT0gMTsgaSsrKSB7XG4gICAgICBjb25zdCBvbGRSUm93ID0gcnJvdztcbiAgICAgIHJyb3cgPSAoMSA8PCAoayAtIDEpKSAtIHJjb2wgLSAxO1xuICAgICAgcmNvbCA9IG9sZFJSb3c7XG4gICAgfVxuICAgIGNvbnN0IHJvdGF0ZWRMb2NhdGlvbjogTG9jYXRpb24gPSBuZXcgTG9jYXRpb24oXG4gICAgICByb3cgKyBycm93LCBcbiAgICAgIGNvbCArIHJjb2wgXG4gICAgKTtcbiAgICBjb25zdCByb3RhdGVkTW92ZTogTW92ZSA9IG5ldyBNb3ZlKHJvdGF0ZWRQaWVjZSwgcm90YXRlZExvY2F0aW9uKTtcbiAgICByZXR1cm4gcm90YXRlZE1vdmU7XG4gIH1cblxuICBwcml2YXRlICpnZXRNb3ZlcyhrOiBudW1iZXIpOiBJdGVyYXRvcjxNb3ZlPiB7XG4gICAgaWYgKGsgPT09IDApIHtcbiAgICAgIHlpZWxkIG5ldyBNb3ZlKG5ldyBTaW5nbGVQaWVjZSgpLCBuZXcgTG9jYXRpb24oMCwgMCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0b3BMZWZ0OiBJdGVyYXRvcjxNb3ZlPiA9IHRoaXMuZ2V0TW92ZXMoayAtIDEpO1xuICAgICAgbGV0IG1vdmVzOiBNb3ZlW10gPSBbXTtcblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgY29uc3QgbmV4dE1vdmU6IE1vdmUgPSB0b3BMZWZ0Lm5leHQoKS52YWx1ZTtcbiAgICAgICAgaWYgKCFuZXh0TW92ZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIG1vdmVzLnB1c2gobmV4dE1vdmUpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBtb3ZlIG9mIG1vdmVzKSB7XG4gICAgICAgIGlmIChtb3ZlLnBpZWNlIGluc3RhbmNlb2YgU2luZ2xlUGllY2UpIHtcbiAgICAgICAgICB5aWVsZCBtb3ZlO1xuICAgICAgICB9IGVsc2UgaWYgKG1vdmUucGllY2UgaW5zdGFuY2VvZiBMUGllY2UpIHtcbiAgICAgICAgICB5aWVsZCB0aGlzLnJvdGF0ZShtb3ZlLCAwLCBrKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB5aWVsZCBuZXcgTW92ZShcbiAgICAgICAgbmV3IExQaWVjZShPcmllbnRhdGlvbi5VcCksIFxuICAgICAgICBuZXcgTG9jYXRpb24oMSA8PCAoayAtIDEpLCAxIDw8IChrIC0gMSkpXG4gICAgICApO1xuXG4gICAgICBmb3IgKGxldCBxdWFkcmFudCBvZiBbMSwgMiwgM10pIHtcbiAgICAgICAgZm9yIChsZXQgbW92ZSBvZiBtb3Zlcykge1xuICAgICAgICAgIGlmIChtb3ZlLnBpZWNlIGluc3RhbmNlb2YgTFBpZWNlKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLnJvdGF0ZShtb3ZlLCBxdWFkcmFudCwgayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblxuIiwiaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuLi9Nb3ZlXCI7XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTb2x2ZXIge1xuICBwcm90ZWN0ZWQgazogbnVtYmVyO1xuXG4gIHB1YmxpYyByZXNldChrOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmsgPSBrO1xuICB9XG4gIFxuICBwdWJsaWMgYWJzdHJhY3QgZ2V0TmV4dE1vdmUoKTogTW92ZTtcblxuICBjb25zdHJ1Y3RvcihrOiBudW1iZXIpIHtcbiAgICB0aGlzLnJlc2V0KGspO1xuICB9IFxufVxuIiwiaW1wb3J0IHsgTW92ZSB9IGZyb20gXCIuLi9Nb3ZlXCI7XG5pbXBvcnQgeyBMb2NhdGlvbiB9IGZyb20gXCIuLi9Mb2NhdGlvblwiO1xuaW1wb3J0IHsgU29sdmVyIH0gZnJvbSBcIi4vU29sdmVyXCI7XG5pbXBvcnQgeyBTaW5nbGVQaWVjZSB9IGZyb20gXCIuLi9QaWVjZXMvU2luZ2xlUGllY2VcIjtcbmltcG9ydCB7IExQaWVjZSB9IGZyb20gXCIuLi9QaWVjZXMvTFBpZWNlXCI7XG5pbXBvcnQgeyBPcmllbnRhdGlvbiB9IGZyb20gXCIuLi9PcmllbnRhdGlvblwiO1xuXG5leHBvcnQgY2xhc3MgU3BpcmFsU29sdmVyIGV4dGVuZHMgU29sdmVyIHtcbiAgcHJpdmF0ZSBtb3ZlczogSXRlcmF0b3I8TW92ZT47XG5cbiAgcHVibGljIHJlc2V0KGs6IG51bWJlcik6IHZvaWQge1xuICAgIHN1cGVyLnJlc2V0KGspO1xuICAgIHRoaXMubW92ZXMgPSB0aGlzLmdldE1vdmVzKGspO1xuICB9XG5cbiAgcHVibGljIGdldE5leHRNb3ZlKCk6IE1vdmUge1xuICAgIGNvbnN0IG1vdmU6IE1vdmUgPSB0aGlzLm1vdmVzLm5leHQoKS52YWx1ZTtcbiAgICBjb25zb2xlLmxvZyhtb3ZlKTtcbiAgICByZXR1cm4gbW92ZTtcbiAgfVxuICBcbiAgcHJpdmF0ZSAqZ2V0TW92ZXMoazogbnVtYmVyKTogSXRlcmF0b3I8TW92ZT4ge1xuICAgIGlmIChrID09PSAwKSB7XG4gICAgICB5aWVsZCBuZXcgTW92ZShuZXcgU2luZ2xlUGllY2UoKSwgbmV3IExvY2F0aW9uKDAsIDApKTtcbiAgICB9IGVsc2UgaWYgKGsgPT09IDEpIHtcbiAgICAgIHlpZWxkIG5ldyBNb3ZlKG5ldyBTaW5nbGVQaWVjZSgpLCBuZXcgTG9jYXRpb24oMCwgMCkpO1xuICAgICAgeWllbGQgbmV3IE1vdmUobmV3IExQaWVjZShPcmllbnRhdGlvbi5VcCksIG5ldyBMb2NhdGlvbigxLCAxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlubmVyRnJhbWU6IEl0ZXJhdG9yPE1vdmU+ID0gdGhpcy5nZXRNb3ZlcyhrIC0gMSk7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBjb25zdCBuZXh0TW92ZTogTW92ZSA9IGlubmVyRnJhbWUubmV4dCgpLnZhbHVlO1xuICAgICAgICBjb25zb2xlLmxvZyhuZXh0TW92ZSk7XG4gICAgICAgIGlmICghbmV4dE1vdmUpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB5aWVsZCBuZXcgTW92ZShcbiAgICAgICAgICBuZXh0TW92ZS5waWVjZSxcbiAgICAgICAgICBuZXcgTG9jYXRpb24oXG4gICAgICAgICAgICAoMSA8PCAoayAtIDIpKSArIG5leHRNb3ZlLmxvY2F0aW9uLnJvdyxcbiAgICAgICAgICAgICgxIDw8IChrIC0gMikpICsgbmV4dE1vdmUubG9jYXRpb24uY29sXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgXG4gICAgICBpZiAoayA9PT0gMikge1xuICAgICAgICB5aWVsZCBuZXcgTW92ZShuZXcgTFBpZWNlKE9yaWVudGF0aW9uLkRvd24pLCBuZXcgTG9jYXRpb24oMCwgMCkpO1xuICAgICAgICB5aWVsZCBuZXcgTW92ZShuZXcgTFBpZWNlKE9yaWVudGF0aW9uLkxlZnQpLCBuZXcgTG9jYXRpb24oMCwgMykpO1xuICAgICAgICB5aWVsZCBuZXcgTW92ZShuZXcgTFBpZWNlKE9yaWVudGF0aW9uLlVwKSwgbmV3IExvY2F0aW9uKDMsIDMpKTtcbiAgICAgICAgeWllbGQgbmV3IE1vdmUobmV3IExQaWVjZShPcmllbnRhdGlvbi5SaWdodCksIG5ldyBMb2NhdGlvbigzLCAwKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBidWlsZCBvdXRlciBmcmFtZVxuICAgICAgICBmb3IgKGxldCBsYXllciA9ICgxIDw8IChrIC0gMikpIC0gMjsgbGF5ZXIgPj0gMDsgbGF5ZXIgLT0gMikge1xuICAgICAgICAgIC8vIHRvcFxuICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8ICgxIDw8IChrIC0gMikpOyBjb2wrKykge1xuICAgICAgICAgICAgeWllbGQgbmV3IE1vdmUoXG4gICAgICAgICAgICAgIG5ldyBMUGllY2UoT3JpZW50YXRpb24uUmlnaHQpLFxuICAgICAgICAgICAgICBuZXcgTG9jYXRpb24obGF5ZXIgKyAxLCAzICogY29sKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHlpZWxkIG5ldyBNb3ZlKFxuICAgICAgICAgICAgICBuZXcgTFBpZWNlKE9yaWVudGF0aW9uLkxlZnQpLFxuICAgICAgICAgICAgICBuZXcgTG9jYXRpb24obGF5ZXIsIDMgKiBjb2wgKyAyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyByaWdodFxuICAgICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8ICgxIDw8IChrIC0gMikpOyByb3crKykge1xuICAgICAgICAgICAgeWllbGQgbmV3IE1vdmUoXG4gICAgICAgICAgICAgIG5ldyBMUGllY2UoT3JpZW50YXRpb24uRG93biksXG4gICAgICAgICAgICAgIG5ldyBMb2NhdGlvbigzICogcm93LCAoMSA8PCBrKSAtIGxheWVyIC0gMilcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB5aWVsZCBuZXcgTW92ZShcbiAgICAgICAgICAgICAgbmV3IExQaWVjZShPcmllbnRhdGlvbi5VcCksXG4gICAgICAgICAgICAgIG5ldyBMb2NhdGlvbigzICogcm93ICsgMiwgKDEgPDwgaykgLSBsYXllciAtIDEpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGJvdHRvbVxuICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEgPDwgKGsgLSAyKTsgY29sKyspIHtcbiAgICAgICAgICAgIHlpZWxkIG5ldyBNb3ZlKFxuICAgICAgICAgICAgICBuZXcgTFBpZWNlKE9yaWVudGF0aW9uLkxlZnQpLFxuICAgICAgICAgICAgICBuZXcgTG9jYXRpb24oKDEgPDwgaykgLSBsYXllciAtIDIsICgxIDw8IGspIC0gMyAqIGNvbCAtIDEpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgeWllbGQgbmV3IE1vdmUoXG4gICAgICAgICAgICAgIG5ldyBMUGllY2UoT3JpZW50YXRpb24uUmlnaHQpLFxuICAgICAgICAgICAgICBuZXcgTG9jYXRpb24oKDEgPDwgaykgLSBsYXllciAtIDEsICgxIDw8IGspIC0gMyAqIGNvbCAtIDMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGxlZnRcbiAgICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAoMSA8PCAoayAtIDIpKTsgcm93KyspIHtcbiAgICAgICAgICAgIHlpZWxkIG5ldyBNb3ZlKFxuICAgICAgICAgICAgICBuZXcgTFBpZWNlKE9yaWVudGF0aW9uLlVwKSxcbiAgICAgICAgICAgICAgbmV3IExvY2F0aW9uKCgxIDw8IGspIC0gMyAqIHJvdyAtIDEsIGxheWVyICsgMSlcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB5aWVsZCBuZXcgTW92ZShcbiAgICAgICAgICAgICAgbmV3IExQaWVjZShPcmllbnRhdGlvbi5Eb3duKSxcbiAgICAgICAgICAgICAgbmV3IExvY2F0aW9uKCgxIDw8IGspIC0gMyAqIHJvdyAtIDMsIGxheWVyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENvbG9yIHtcbiAgcHJpdmF0ZSBfcjogbnVtYmVyO1xuICBwcml2YXRlIF9nOiBudW1iZXI7XG4gIHByaXZhdGUgX2I6IG51bWJlcjtcbiAgcHJpdmF0ZSBfYTogbnVtYmVyO1xuICBwcml2YXRlIF9oZXhTdHJpbmc6IHN0cmluZztcbiAgcHJpdmF0ZSBfcmdiYVN0cmluZzogc3RyaW5nO1xuXG4gIHByaXZhdGUgc3RhdGljIF9yZWQ6IENvbG9yID0gbmV3IENvbG9yKDB4ZjQsIDB4MzYsIDB4NDMpO1xuICBwcml2YXRlIHN0YXRpYyBfb3JhbmdlOiBDb2xvciA9IG5ldyBDb2xvcigweGZmLCAweDAwLCAweDk4KTtcbiAgcHJpdmF0ZSBzdGF0aWMgX3llbGxvdzogQ29sb3IgPSBuZXcgQ29sb3IoMHhmZiwgMHgzYiwgMHhlYik7XG4gIHByaXZhdGUgc3RhdGljIF9ncmVlbjogQ29sb3IgPSBuZXcgQ29sb3IoMHg0YywgMHg1MCwgMHhhZik7XG4gIHByaXZhdGUgc3RhdGljIF9ibHVlOiBDb2xvciA9IG5ldyBDb2xvcigweDIxLCAweGYzLCAweDk2KTtcbiAgcHJpdmF0ZSBzdGF0aWMgX2luZGlnbzogQ29sb3IgPSBuZXcgQ29sb3IoMHgzZiwgMHhiNSwgMHg1MSk7XG4gIHByaXZhdGUgc3RhdGljIF92aW9sZXQ6IENvbG9yID0gbmV3IENvbG9yKDB4OWMsIDB4YjAsIDB4MjcpO1xuICBwcml2YXRlIHN0YXRpYyBfd2hpdGU6IENvbG9yID0gbmV3IENvbG9yKDB4ZmYsIDB4ZmYsIDB4ZmYpO1xuICBwcml2YXRlIHN0YXRpYyBfYmxhY2s6IENvbG9yID0gbmV3IENvbG9yKDB4MDAsIDB4MDAsIDB4MDApO1xuXG4gIHN0YXRpYyBnZXQgUmVkKCk6IENvbG9yIHsgcmV0dXJuIENvbG9yLl9yZWQ7IH1cbiAgc3RhdGljIGdldCBPcmFuZ2UoKTogQ29sb3IgeyByZXR1cm4gQ29sb3IuX29yYW5nZTsgfVxuICBzdGF0aWMgZ2V0IFllbGxvdygpOiBDb2xvciB7IHJldHVybiBDb2xvci5feWVsbG93OyB9XG4gIHN0YXRpYyBnZXQgR3JlZW4oKTogQ29sb3IgeyByZXR1cm4gQ29sb3IuX2dyZWVuOyB9XG4gIHN0YXRpYyBnZXQgQmx1ZSgpOiBDb2xvciB7IHJldHVybiBDb2xvci5fYmx1ZTsgfVxuICBzdGF0aWMgZ2V0IEluZGlnbygpOiBDb2xvciB7IHJldHVybiBDb2xvci5faW5kaWdvOyB9XG4gIHN0YXRpYyBnZXQgVmlvbGV0KCk6IENvbG9yIHsgcmV0dXJuIENvbG9yLl92aW9sZXQ7IH1cbiAgc3RhdGljIGdldCBXaGl0ZSgpOiBDb2xvciB7IHJldHVybiBDb2xvci5fd2hpdGU7IH1cbiAgc3RhdGljIGdldCBCbGFjaygpOiBDb2xvciB7IHJldHVybiBDb2xvci5fYmxhY2s7IH1cblxuICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyLCBhOiBudW1iZXIgPSAweGZmKSB7XG4gICAgW3IsIGcsIGIsIGFdLmZvckVhY2goY29sb3IgPT4gXG4gICAgICBjb25zb2xlLmFzc2VydChcbiAgICAgICAgMCA8PSBjb2xvciAmJiBjb2xvciA8PSAweGZmLFxuICAgICAgICAnSHVlcyBtdXN0IGJlIGluIHRoZSBpbnRlcnZhbCBbMCwgMjU1XS4nICsgW3IsIGcsIGIsIGFdXG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLl9yID0gcjtcbiAgICB0aGlzLl9nID0gZztcbiAgICB0aGlzLl9iID0gYjtcbiAgICB0aGlzLl9hID0gYTtcblxuICAgIHRoaXMuX2hleFN0cmluZyA9ICcjJyArIFxuICAgICAgW3RoaXMuX3IsIHRoaXMuX2IsIHRoaXMuX2ddXG4gICAgICAgIC5tYXAoKGMpID0+IHRoaXMucGFkKGMudG9TdHJpbmcoMTYpKSlcbiAgICAgICAgLmpvaW4oJycpO1xuICAgIFxuICAgIHRoaXMuX3JnYmFTdHJpbmcgPSAncmdiYSgnICsgW3RoaXMuX3IsIHRoaXMuX2csIHRoaXMuX2IsIHRoaXMuX2FdLmpvaW4oKSArICcpJztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgKnJhaW5ib3coazogbnVtYmVyKSB7XG4gICAgY29uc29sZS5hc3NlcnQoMCA8PSAyICogayAmJiAyICogayA8PSAyNCk7XG4gICAgY29uc3QgbnVtQ29sb3JzID0gMSA8PCAoMiAqIGspO1xuICAgIGNvbnNvbGUubG9nKGssIG51bUNvbG9ycyk7XG4gICAgY29uc3QgeCA9IDEgPDwgKDI0IC0gMiAqIGspO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ29sb3JzOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbG9yTnVtID0gaSAqIHg7XG4gICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcigoY29sb3JOdW0gPj4gMHgxMCkgJiAweGZmLCAoY29sb3JOdW0gPj4gMHg4KSAmIDB4ZmYsIGNvbG9yTnVtICYgMHhmZik7XG4gICAgICBjb25zb2xlLmxvZyhpLCB4LCBjb2xvck51bSk7XG4gICAgICBjb25zb2xlLmxvZyhjb2xvcik7XG4gICAgICB5aWVsZCBjb2xvcjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ2ZpbnNoZWQgY29sb3JpbmcnKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgKmN5Y2xlKGs6IG51bWJlcikge1xuICAgIGNvbnNvbGUuYXNzZXJ0KDAgPD0gMiAqIGsgJiYgMiAqIGsgPD0gMjQpO1xuICAgIGNvbnN0IG51bUNvbG9ycyA9IDEgPDwgKDIgKiBrKTtcbiAgICBcbiAgICBmb3IgKGxldCBpZHggPSAwOyBpZHggPCBudW1Db2xvcnM7IGlkeCsrICkge1xuICAgICAgeWllbGQgbmV3IENvbG9yKE1hdGguZmxvb3IoMHhmZiAqICgxIC8gbnVtQ29sb3JzKSksIDAsIDAsIDApO1xuICAgIH1cblxuLy8gICAgbGV0IGlkeCA9IDA7XG4vLyAgICBmb3IgKGxldCBiID0gMDsgYiA8IDB4ZmYgJiYgaWR4IDwgbnVtQ29sb3JzOyBiKyspIHtcbi8vICAgICAgZm9yIChsZXQgZyA9IDA7IGcgPCAweGZmICYmIGlkeCA8IG51bUNvbG9yczsgZysrKSB7XG4vLyAgICAgICAgZm9yIChsZXQgciA9IDA7IHIgPCAweGZmICYmIGlkeCA8IG51bUNvbG9yczsgcisrKSB7XG4vLyAgICAgICAgICBmb3IgKGxldCBhID0gMDsgYSA8IDB4ZmYgJiYgaWR4IDwgbnVtQ29sb3JzOyBhKyspIHtcbi8vICAgICAgICAgICAgeWllbGQgbmV3IENvbG9yKHIsIGcsIGIsIGEpO1xuLy8gICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgICAgfVxuLy8gICAgfVxuICB9XG5cbiAgcHVibGljIGdldCBoZXhTdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5faGV4U3RyaW5nO1xuICB9XG5cbiAgcHVibGljIGdldCByZ2JhU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuX3JnYmFTdHJpbmc7XG4gIH1cblxuICBwcml2YXRlIHBhZChudW06IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG51bS5sZW5ndGggPT09IDIgPyBudW0gOiAnMCcgKyBudW07XG4gIH1cbn1cbiIsIi8vIHZpbTp0cz00OnN0cz00OnN3PTQ6XG4vKiFcbiAqXG4gKiBDb3B5cmlnaHQgMjAwOS0yMDE3IEtyaXMgS293YWwgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVRcbiAqIGxpY2Vuc2UgZm91bmQgYXQgaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrb3dhbC9xL2Jsb2IvdjEvTElDRU5TRVxuICpcbiAqIFdpdGggcGFydHMgYnkgVHlsZXIgQ2xvc2VcbiAqIENvcHlyaWdodCAyMDA3LTIwMDkgVHlsZXIgQ2xvc2UgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBNSVQgWCBsaWNlbnNlIGZvdW5kXG4gKiBhdCBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLmh0bWxcbiAqIEZvcmtlZCBhdCByZWZfc2VuZC5qcyB2ZXJzaW9uOiAyMDA5LTA1LTExXG4gKlxuICogV2l0aCBwYXJ0cyBieSBNYXJrIE1pbGxlclxuICogQ29weXJpZ2h0IChDKSAyMDExIEdvb2dsZSBJbmMuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuICovXG5cbihmdW5jdGlvbiAoZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy8gVGhpcyBmaWxlIHdpbGwgZnVuY3Rpb24gcHJvcGVybHkgYXMgYSA8c2NyaXB0PiB0YWcsIG9yIGEgbW9kdWxlXG4gICAgLy8gdXNpbmcgQ29tbW9uSlMgYW5kIE5vZGVKUyBvciBSZXF1aXJlSlMgbW9kdWxlIGZvcm1hdHMuICBJblxuICAgIC8vIENvbW1vbi9Ob2RlL1JlcXVpcmVKUywgdGhlIG1vZHVsZSBleHBvcnRzIHRoZSBRIEFQSSBhbmQgd2hlblxuICAgIC8vIGV4ZWN1dGVkIGFzIGEgc2ltcGxlIDxzY3JpcHQ+LCBpdCBjcmVhdGVzIGEgUSBnbG9iYWwgaW5zdGVhZC5cblxuICAgIC8vIE1vbnRhZ2UgUmVxdWlyZVxuICAgIGlmICh0eXBlb2YgYm9vdHN0cmFwID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYm9vdHN0cmFwKFwicHJvbWlzZVwiLCBkZWZpbml0aW9uKTtcblxuICAgIC8vIENvbW1vbkpTXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuXG4gICAgLy8gUmVxdWlyZUpTXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG5cbiAgICAvLyBTRVMgKFNlY3VyZSBFY21hU2NyaXB0KVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNlcyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAoIXNlcy5vaygpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZXMubWFrZVEgPSBkZWZpbml0aW9uO1xuICAgICAgICB9XG5cbiAgICAvLyA8c2NyaXB0PlxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiB8fCB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBQcmVmZXIgd2luZG93IG92ZXIgc2VsZiBmb3IgYWRkLW9uIHNjcmlwdHMuIFVzZSBzZWxmIGZvclxuICAgICAgICAvLyBub24td2luZG93ZWQgY29udGV4dHMuXG4gICAgICAgIHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDogc2VsZjtcblxuICAgICAgICAvLyBHZXQgdGhlIGB3aW5kb3dgIG9iamVjdCwgc2F2ZSB0aGUgcHJldmlvdXMgUSBnbG9iYWxcbiAgICAgICAgLy8gYW5kIGluaXRpYWxpemUgUSBhcyBhIGdsb2JhbC5cbiAgICAgICAgdmFyIHByZXZpb3VzUSA9IGdsb2JhbC5RO1xuICAgICAgICBnbG9iYWwuUSA9IGRlZmluaXRpb24oKTtcblxuICAgICAgICAvLyBBZGQgYSBub0NvbmZsaWN0IGZ1bmN0aW9uIHNvIFEgY2FuIGJlIHJlbW92ZWQgZnJvbSB0aGVcbiAgICAgICAgLy8gZ2xvYmFsIG5hbWVzcGFjZS5cbiAgICAgICAgZ2xvYmFsLlEubm9Db25mbGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGdsb2JhbC5RID0gcHJldmlvdXNRO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGlzIGVudmlyb25tZW50IHdhcyBub3QgYW50aWNpcGF0ZWQgYnkgUS4gUGxlYXNlIGZpbGUgYSBidWcuXCIpO1xuICAgIH1cblxufSkoZnVuY3Rpb24gKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBoYXNTdGFja3MgPSBmYWxzZTtcbnRyeSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCk7XG59IGNhdGNoIChlKSB7XG4gICAgaGFzU3RhY2tzID0gISFlLnN0YWNrO1xufVxuXG4vLyBBbGwgY29kZSBhZnRlciB0aGlzIHBvaW50IHdpbGwgYmUgZmlsdGVyZWQgZnJvbSBzdGFjayB0cmFjZXMgcmVwb3J0ZWRcbi8vIGJ5IFEuXG52YXIgcVN0YXJ0aW5nTGluZSA9IGNhcHR1cmVMaW5lKCk7XG52YXIgcUZpbGVOYW1lO1xuXG4vLyBzaGltc1xuXG4vLyB1c2VkIGZvciBmYWxsYmFjayBpbiBcImFsbFJlc29sdmVkXCJcbnZhciBub29wID0gZnVuY3Rpb24gKCkge307XG5cbi8vIFVzZSB0aGUgZmFzdGVzdCBwb3NzaWJsZSBtZWFucyB0byBleGVjdXRlIGEgdGFzayBpbiBhIGZ1dHVyZSB0dXJuXG4vLyBvZiB0aGUgZXZlbnQgbG9vcC5cbnZhciBuZXh0VGljayA9KGZ1bmN0aW9uICgpIHtcbiAgICAvLyBsaW5rZWQgbGlzdCBvZiB0YXNrcyAoc2luZ2xlLCB3aXRoIGhlYWQgbm9kZSlcbiAgICB2YXIgaGVhZCA9IHt0YXNrOiB2b2lkIDAsIG5leHQ6IG51bGx9O1xuICAgIHZhciB0YWlsID0gaGVhZDtcbiAgICB2YXIgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICB2YXIgcmVxdWVzdFRpY2sgPSB2b2lkIDA7XG4gICAgdmFyIGlzTm9kZUpTID0gZmFsc2U7XG4gICAgLy8gcXVldWUgZm9yIGxhdGUgdGFza3MsIHVzZWQgYnkgdW5oYW5kbGVkIHJlamVjdGlvbiB0cmFja2luZ1xuICAgIHZhciBsYXRlclF1ZXVlID0gW107XG5cbiAgICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICAgICAgLyoganNoaW50IGxvb3BmdW5jOiB0cnVlICovXG4gICAgICAgIHZhciB0YXNrLCBkb21haW47XG5cbiAgICAgICAgd2hpbGUgKGhlYWQubmV4dCkge1xuICAgICAgICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgICAgICAgIHRhc2sgPSBoZWFkLnRhc2s7XG4gICAgICAgICAgICBoZWFkLnRhc2sgPSB2b2lkIDA7XG4gICAgICAgICAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcblxuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgIGhlYWQuZG9tYWluID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVuU2luZ2xlKHRhc2ssIGRvbWFpbik7XG5cbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAobGF0ZXJRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRhc2sgPSBsYXRlclF1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgcnVuU2luZ2xlKHRhc2spO1xuICAgICAgICB9XG4gICAgICAgIGZsdXNoaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIHJ1bnMgYSBzaW5nbGUgZnVuY3Rpb24gaW4gdGhlIGFzeW5jIHF1ZXVlXG4gICAgZnVuY3Rpb24gcnVuU2luZ2xlKHRhc2ssIGRvbWFpbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGFzaygpO1xuXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmIChpc05vZGVKUykge1xuICAgICAgICAgICAgICAgIC8vIEluIG5vZGUsIHVuY2F1Z2h0IGV4Y2VwdGlvbnMgYXJlIGNvbnNpZGVyZWQgZmF0YWwgZXJyb3JzLlxuICAgICAgICAgICAgICAgIC8vIFJlLXRocm93IHRoZW0gc3luY2hyb25vdXNseSB0byBpbnRlcnJ1cHQgZmx1c2hpbmchXG5cbiAgICAgICAgICAgICAgICAvLyBFbnN1cmUgY29udGludWF0aW9uIGlmIHRoZSB1bmNhdWdodCBleGNlcHRpb24gaXMgc3VwcHJlc3NlZFxuICAgICAgICAgICAgICAgIC8vIGxpc3RlbmluZyBcInVuY2F1Z2h0RXhjZXB0aW9uXCIgZXZlbnRzIChhcyBkb21haW5zIGRvZXMpLlxuICAgICAgICAgICAgICAgIC8vIENvbnRpbnVlIGluIG5leHQgZXZlbnQgdG8gYXZvaWQgdGljayByZWN1cnNpb24uXG4gICAgICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZsdXNoLCAwKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRocm93IGU7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gSW4gYnJvd3NlcnMsIHVuY2F1Z2h0IGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC5cbiAgICAgICAgICAgICAgICAvLyBSZS10aHJvdyB0aGVtIGFzeW5jaHJvbm91c2x5IHRvIGF2b2lkIHNsb3ctZG93bnMuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dFRpY2sgPSBmdW5jdGlvbiAodGFzaykge1xuICAgICAgICB0YWlsID0gdGFpbC5uZXh0ID0ge1xuICAgICAgICAgICAgdGFzazogdGFzayxcbiAgICAgICAgICAgIGRvbWFpbjogaXNOb2RlSlMgJiYgcHJvY2Vzcy5kb21haW4sXG4gICAgICAgICAgICBuZXh0OiBudWxsXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKCFmbHVzaGluZykge1xuICAgICAgICAgICAgZmx1c2hpbmcgPSB0cnVlO1xuICAgICAgICAgICAgcmVxdWVzdFRpY2soKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgcHJvY2Vzcy50b1N0cmluZygpID09PSBcIltvYmplY3QgcHJvY2Vzc11cIiAmJiBwcm9jZXNzLm5leHRUaWNrKSB7XG4gICAgICAgIC8vIEVuc3VyZSBRIGlzIGluIGEgcmVhbCBOb2RlIGVudmlyb25tZW50LCB3aXRoIGEgYHByb2Nlc3MubmV4dFRpY2tgLlxuICAgICAgICAvLyBUbyBzZWUgdGhyb3VnaCBmYWtlIE5vZGUgZW52aXJvbm1lbnRzOlxuICAgICAgICAvLyAqIE1vY2hhIHRlc3QgcnVubmVyIC0gZXhwb3NlcyBhIGBwcm9jZXNzYCBnbG9iYWwgd2l0aG91dCBhIGBuZXh0VGlja2BcbiAgICAgICAgLy8gKiBCcm93c2VyaWZ5IC0gZXhwb3NlcyBhIGBwcm9jZXNzLm5leFRpY2tgIGZ1bmN0aW9uIHRoYXQgdXNlc1xuICAgICAgICAvLyAgIGBzZXRUaW1lb3V0YC4gSW4gdGhpcyBjYXNlIGBzZXRJbW1lZGlhdGVgIGlzIHByZWZlcnJlZCBiZWNhdXNlXG4gICAgICAgIC8vICAgIGl0IGlzIGZhc3Rlci4gQnJvd3NlcmlmeSdzIGBwcm9jZXNzLnRvU3RyaW5nKClgIHlpZWxkc1xuICAgICAgICAvLyAgIFwiW29iamVjdCBPYmplY3RdXCIsIHdoaWxlIGluIGEgcmVhbCBOb2RlIGVudmlyb25tZW50XG4gICAgICAgIC8vICAgYHByb2Nlc3MudG9TdHJpbmcoKWAgeWllbGRzIFwiW29iamVjdCBwcm9jZXNzXVwiLlxuICAgICAgICBpc05vZGVKUyA9IHRydWU7XG5cbiAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICAgICAgfTtcblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIC8vIEluIElFMTAsIE5vZGUuanMgMC45Kywgb3IgaHR0cHM6Ly9naXRodWIuY29tL05vYmxlSlMvc2V0SW1tZWRpYXRlXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICByZXF1ZXN0VGljayA9IHNldEltbWVkaWF0ZS5iaW5kKHdpbmRvdywgZmx1c2gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlKGZsdXNoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIE1lc3NhZ2VDaGFubmVsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIG1vZGVybiBicm93c2Vyc1xuICAgICAgICAvLyBodHRwOi8vd3d3Lm5vbmJsb2NraW5nLmlvLzIwMTEvMDYvd2luZG93bmV4dHRpY2suaHRtbFxuICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICAvLyBBdCBsZWFzdCBTYWZhcmkgVmVyc2lvbiA2LjAuNSAoODUzNi4zMC4xKSBpbnRlcm1pdHRlbnRseSBjYW5ub3QgY3JlYXRlXG4gICAgICAgIC8vIHdvcmtpbmcgbWVzc2FnZSBwb3J0cyB0aGUgZmlyc3QgdGltZSBhIHBhZ2UgbG9hZHMuXG4gICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVxdWVzdFRpY2sgPSByZXF1ZXN0UG9ydFRpY2s7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGZsdXNoO1xuICAgICAgICAgICAgZmx1c2goKTtcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIHJlcXVlc3RQb3J0VGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIE9wZXJhIHJlcXVpcmVzIHVzIHRvIHByb3ZpZGUgYSBtZXNzYWdlIHBheWxvYWQsIHJlZ2FyZGxlc3Mgb2ZcbiAgICAgICAgICAgIC8vIHdoZXRoZXIgd2UgdXNlIGl0LlxuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSgwKTtcbiAgICAgICAgfTtcbiAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZsdXNoLCAwKTtcbiAgICAgICAgICAgIHJlcXVlc3RQb3J0VGljaygpO1xuICAgICAgICB9O1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gb2xkIGJyb3dzZXJzXG4gICAgICAgIHJlcXVlc3RUaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChmbHVzaCwgMCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIHJ1bnMgYSB0YXNrIGFmdGVyIGFsbCBvdGhlciB0YXNrcyBoYXZlIGJlZW4gcnVuXG4gICAgLy8gdGhpcyBpcyB1c2VmdWwgZm9yIHVuaGFuZGxlZCByZWplY3Rpb24gdHJhY2tpbmcgdGhhdCBuZWVkcyB0byBoYXBwZW5cbiAgICAvLyBhZnRlciBhbGwgYHRoZW5gZCB0YXNrcyBoYXZlIGJlZW4gcnVuLlxuICAgIG5leHRUaWNrLnJ1bkFmdGVyID0gZnVuY3Rpb24gKHRhc2spIHtcbiAgICAgICAgbGF0ZXJRdWV1ZS5wdXNoKHRhc2spO1xuICAgICAgICBpZiAoIWZsdXNoaW5nKSB7XG4gICAgICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0VGljaygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gbmV4dFRpY2s7XG59KSgpO1xuXG4vLyBBdHRlbXB0IHRvIG1ha2UgZ2VuZXJpY3Mgc2FmZSBpbiB0aGUgZmFjZSBvZiBkb3duc3RyZWFtXG4vLyBtb2RpZmljYXRpb25zLlxuLy8gVGhlcmUgaXMgbm8gc2l0dWF0aW9uIHdoZXJlIHRoaXMgaXMgbmVjZXNzYXJ5LlxuLy8gSWYgeW91IG5lZWQgYSBzZWN1cml0eSBndWFyYW50ZWUsIHRoZXNlIHByaW1vcmRpYWxzIG5lZWQgdG8gYmVcbi8vIGRlZXBseSBmcm96ZW4gYW55d2F5LCBhbmQgaWYgeW91IGRvbuKAmXQgbmVlZCBhIHNlY3VyaXR5IGd1YXJhbnRlZSxcbi8vIHRoaXMgaXMganVzdCBwbGFpbiBwYXJhbm9pZC5cbi8vIEhvd2V2ZXIsIHRoaXMgKiptaWdodCoqIGhhdmUgdGhlIG5pY2Ugc2lkZS1lZmZlY3Qgb2YgcmVkdWNpbmcgdGhlIHNpemUgb2Zcbi8vIHRoZSBtaW5pZmllZCBjb2RlIGJ5IHJlZHVjaW5nIHguY2FsbCgpIHRvIG1lcmVseSB4KClcbi8vIFNlZSBNYXJrIE1pbGxlcuKAmXMgZXhwbGFuYXRpb24gb2Ygd2hhdCB0aGlzIGRvZXMuXG4vLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1jb252ZW50aW9uczpzYWZlX21ldGFfcHJvZ3JhbW1pbmdcbnZhciBjYWxsID0gRnVuY3Rpb24uY2FsbDtcbmZ1bmN0aW9uIHVuY3VycnlUaGlzKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2FsbC5hcHBseShmLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG4vLyBUaGlzIGlzIGVxdWl2YWxlbnQsIGJ1dCBzbG93ZXI6XG4vLyB1bmN1cnJ5VGhpcyA9IEZ1bmN0aW9uX2JpbmQuYmluZChGdW5jdGlvbl9iaW5kLmNhbGwpO1xuLy8gaHR0cDovL2pzcGVyZi5jb20vdW5jdXJyeXRoaXNcblxudmFyIGFycmF5X3NsaWNlID0gdW5jdXJyeVRoaXMoQXJyYXkucHJvdG90eXBlLnNsaWNlKTtcblxudmFyIGFycmF5X3JlZHVjZSA9IHVuY3VycnlUaGlzKFxuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgfHwgZnVuY3Rpb24gKGNhbGxiYWNrLCBiYXNpcykge1xuICAgICAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIC8vIGNvbmNlcm5pbmcgdGhlIGluaXRpYWwgdmFsdWUsIGlmIG9uZSBpcyBub3QgcHJvdmlkZWRcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIHNlZWsgdG8gdGhlIGZpcnN0IHZhbHVlIGluIHRoZSBhcnJheSwgYWNjb3VudGluZ1xuICAgICAgICAgICAgLy8gZm9yIHRoZSBwb3NzaWJpbGl0eSB0aGF0IGlzIGlzIGEgc3BhcnNlIGFycmF5XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IGluIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzaXMgPSB0aGlzW2luZGV4KytdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCsraW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICgxKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWR1Y2VcbiAgICAgICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBhY2NvdW50IGZvciB0aGUgcG9zc2liaWxpdHkgdGhhdCB0aGUgYXJyYXkgaXMgc3BhcnNlXG4gICAgICAgICAgICBpZiAoaW5kZXggaW4gdGhpcykge1xuICAgICAgICAgICAgICAgIGJhc2lzID0gY2FsbGJhY2soYmFzaXMsIHRoaXNbaW5kZXhdLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhc2lzO1xuICAgIH1cbik7XG5cbnZhciBhcnJheV9pbmRleE9mID0gdW5jdXJyeVRoaXMoXG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5vdCBhIHZlcnkgZ29vZCBzaGltLCBidXQgZ29vZCBlbm91Z2ggZm9yIG91ciBvbmUgdXNlIG9mIGl0XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbik7XG5cbnZhciBhcnJheV9tYXAgPSB1bmN1cnJ5VGhpcyhcbiAgICBBcnJheS5wcm90b3R5cGUubWFwIHx8IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc3ApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29sbGVjdCA9IFtdO1xuICAgICAgICBhcnJheV9yZWR1Y2Uoc2VsZiwgZnVuY3Rpb24gKHVuZGVmaW5lZCwgdmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICBjb2xsZWN0LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzcCwgdmFsdWUsIGluZGV4LCBzZWxmKSk7XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICAgIHJldHVybiBjb2xsZWN0O1xuICAgIH1cbik7XG5cbnZhciBvYmplY3RfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAocHJvdG90eXBlKSB7XG4gICAgZnVuY3Rpb24gVHlwZSgpIHsgfVxuICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHJldHVybiBuZXcgVHlwZSgpO1xufTtcblxudmFyIG9iamVjdF9kZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB8fCBmdW5jdGlvbiAob2JqLCBwcm9wLCBkZXNjcmlwdG9yKSB7XG4gICAgb2JqW3Byb3BdID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICByZXR1cm4gb2JqO1xufTtcblxudmFyIG9iamVjdF9oYXNPd25Qcm9wZXJ0eSA9IHVuY3VycnlUaGlzKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG52YXIgb2JqZWN0X2tleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3RfaGFzT3duUHJvcGVydHkob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbn07XG5cbnZhciBvYmplY3RfdG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKTtcblxuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8vIGdlbmVyYXRvciByZWxhdGVkIHNoaW1zXG5cbi8vIEZJWE1FOiBSZW1vdmUgdGhpcyBmdW5jdGlvbiBvbmNlIEVTNiBnZW5lcmF0b3JzIGFyZSBpbiBTcGlkZXJNb25rZXkuXG5mdW5jdGlvbiBpc1N0b3BJdGVyYXRpb24oZXhjZXB0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgb2JqZWN0X3RvU3RyaW5nKGV4Y2VwdGlvbikgPT09IFwiW29iamVjdCBTdG9wSXRlcmF0aW9uXVwiIHx8XG4gICAgICAgIGV4Y2VwdGlvbiBpbnN0YW5jZW9mIFFSZXR1cm5WYWx1ZVxuICAgICk7XG59XG5cbi8vIEZJWE1FOiBSZW1vdmUgdGhpcyBoZWxwZXIgYW5kIFEucmV0dXJuIG9uY2UgRVM2IGdlbmVyYXRvcnMgYXJlIGluXG4vLyBTcGlkZXJNb25rZXkuXG52YXIgUVJldHVyblZhbHVlO1xuaWYgKHR5cGVvZiBSZXR1cm5WYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFFSZXR1cm5WYWx1ZSA9IFJldHVyblZhbHVlO1xufSBlbHNlIHtcbiAgICBRUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH07XG59XG5cbi8vIGxvbmcgc3RhY2sgdHJhY2VzXG5cbnZhciBTVEFDS19KVU1QX1NFUEFSQVRPUiA9IFwiRnJvbSBwcmV2aW91cyBldmVudDpcIjtcblxuZnVuY3Rpb24gbWFrZVN0YWNrVHJhY2VMb25nKGVycm9yLCBwcm9taXNlKSB7XG4gICAgLy8gSWYgcG9zc2libGUsIHRyYW5zZm9ybSB0aGUgZXJyb3Igc3RhY2sgdHJhY2UgYnkgcmVtb3ZpbmcgTm9kZSBhbmQgUVxuICAgIC8vIGNydWZ0LCB0aGVuIGNvbmNhdGVuYXRpbmcgd2l0aCB0aGUgc3RhY2sgdHJhY2Ugb2YgYHByb21pc2VgLiBTZWUgIzU3LlxuICAgIGlmIChoYXNTdGFja3MgJiZcbiAgICAgICAgcHJvbWlzZS5zdGFjayAmJlxuICAgICAgICB0eXBlb2YgZXJyb3IgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgZXJyb3IgIT09IG51bGwgJiZcbiAgICAgICAgZXJyb3Iuc3RhY2tcbiAgICApIHtcbiAgICAgICAgdmFyIHN0YWNrcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBwID0gcHJvbWlzZTsgISFwOyBwID0gcC5zb3VyY2UpIHtcbiAgICAgICAgICAgIGlmIChwLnN0YWNrICYmICghZXJyb3IuX19taW5pbXVtU3RhY2tDb3VudGVyX18gfHwgZXJyb3IuX19taW5pbXVtU3RhY2tDb3VudGVyX18gPiBwLnN0YWNrQ291bnRlcikpIHtcbiAgICAgICAgICAgICAgICBvYmplY3RfZGVmaW5lUHJvcGVydHkoZXJyb3IsIFwiX19taW5pbXVtU3RhY2tDb3VudGVyX19cIiwge3ZhbHVlOiBwLnN0YWNrQ291bnRlciwgY29uZmlndXJhYmxlOiB0cnVlfSk7XG4gICAgICAgICAgICAgICAgc3RhY2tzLnVuc2hpZnQocC5zdGFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3RhY2tzLnVuc2hpZnQoZXJyb3Iuc3RhY2spO1xuXG4gICAgICAgIHZhciBjb25jYXRlZFN0YWNrcyA9IHN0YWNrcy5qb2luKFwiXFxuXCIgKyBTVEFDS19KVU1QX1NFUEFSQVRPUiArIFwiXFxuXCIpO1xuICAgICAgICB2YXIgc3RhY2sgPSBmaWx0ZXJTdGFja1N0cmluZyhjb25jYXRlZFN0YWNrcyk7XG4gICAgICAgIG9iamVjdF9kZWZpbmVQcm9wZXJ0eShlcnJvciwgXCJzdGFja1wiLCB7dmFsdWU6IHN0YWNrLCBjb25maWd1cmFibGU6IHRydWV9KTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGZpbHRlclN0YWNrU3RyaW5nKHN0YWNrU3RyaW5nKSB7XG4gICAgdmFyIGxpbmVzID0gc3RhY2tTdHJpbmcuc3BsaXQoXCJcXG5cIik7XG4gICAgdmFyIGRlc2lyZWRMaW5lcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGxpbmUgPSBsaW5lc1tpXTtcblxuICAgICAgICBpZiAoIWlzSW50ZXJuYWxGcmFtZShsaW5lKSAmJiAhaXNOb2RlRnJhbWUobGluZSkgJiYgbGluZSkge1xuICAgICAgICAgICAgZGVzaXJlZExpbmVzLnB1c2gobGluZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlc2lyZWRMaW5lcy5qb2luKFwiXFxuXCIpO1xufVxuXG5mdW5jdGlvbiBpc05vZGVGcmFtZShzdGFja0xpbmUpIHtcbiAgICByZXR1cm4gc3RhY2tMaW5lLmluZGV4T2YoXCIobW9kdWxlLmpzOlwiKSAhPT0gLTEgfHxcbiAgICAgICAgICAgc3RhY2tMaW5lLmluZGV4T2YoXCIobm9kZS5qczpcIikgIT09IC0xO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlTmFtZUFuZExpbmVOdW1iZXIoc3RhY2tMaW5lKSB7XG4gICAgLy8gTmFtZWQgZnVuY3Rpb25zOiBcImF0IGZ1bmN0aW9uTmFtZSAoZmlsZW5hbWU6bGluZU51bWJlcjpjb2x1bW5OdW1iZXIpXCJcbiAgICAvLyBJbiBJRTEwIGZ1bmN0aW9uIG5hbWUgY2FuIGhhdmUgc3BhY2VzIChcIkFub255bW91cyBmdW5jdGlvblwiKSBPX29cbiAgICB2YXIgYXR0ZW1wdDEgPSAvYXQgLisgXFwoKC4rKTooXFxkKyk6KD86XFxkKylcXCkkLy5leGVjKHN0YWNrTGluZSk7XG4gICAgaWYgKGF0dGVtcHQxKSB7XG4gICAgICAgIHJldHVybiBbYXR0ZW1wdDFbMV0sIE51bWJlcihhdHRlbXB0MVsyXSldO1xuICAgIH1cblxuICAgIC8vIEFub255bW91cyBmdW5jdGlvbnM6IFwiYXQgZmlsZW5hbWU6bGluZU51bWJlcjpjb2x1bW5OdW1iZXJcIlxuICAgIHZhciBhdHRlbXB0MiA9IC9hdCAoW14gXSspOihcXGQrKTooPzpcXGQrKSQvLmV4ZWMoc3RhY2tMaW5lKTtcbiAgICBpZiAoYXR0ZW1wdDIpIHtcbiAgICAgICAgcmV0dXJuIFthdHRlbXB0MlsxXSwgTnVtYmVyKGF0dGVtcHQyWzJdKV07XG4gICAgfVxuXG4gICAgLy8gRmlyZWZveCBzdHlsZTogXCJmdW5jdGlvbkBmaWxlbmFtZTpsaW5lTnVtYmVyIG9yIEBmaWxlbmFtZTpsaW5lTnVtYmVyXCJcbiAgICB2YXIgYXR0ZW1wdDMgPSAvLipAKC4rKTooXFxkKykkLy5leGVjKHN0YWNrTGluZSk7XG4gICAgaWYgKGF0dGVtcHQzKSB7XG4gICAgICAgIHJldHVybiBbYXR0ZW1wdDNbMV0sIE51bWJlcihhdHRlbXB0M1syXSldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gaXNJbnRlcm5hbEZyYW1lKHN0YWNrTGluZSkge1xuICAgIHZhciBmaWxlTmFtZUFuZExpbmVOdW1iZXIgPSBnZXRGaWxlTmFtZUFuZExpbmVOdW1iZXIoc3RhY2tMaW5lKTtcblxuICAgIGlmICghZmlsZU5hbWVBbmRMaW5lTnVtYmVyKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgZmlsZU5hbWUgPSBmaWxlTmFtZUFuZExpbmVOdW1iZXJbMF07XG4gICAgdmFyIGxpbmVOdW1iZXIgPSBmaWxlTmFtZUFuZExpbmVOdW1iZXJbMV07XG5cbiAgICByZXR1cm4gZmlsZU5hbWUgPT09IHFGaWxlTmFtZSAmJlxuICAgICAgICBsaW5lTnVtYmVyID49IHFTdGFydGluZ0xpbmUgJiZcbiAgICAgICAgbGluZU51bWJlciA8PSBxRW5kaW5nTGluZTtcbn1cblxuLy8gZGlzY292ZXIgb3duIGZpbGUgbmFtZSBhbmQgbGluZSBudW1iZXIgcmFuZ2UgZm9yIGZpbHRlcmluZyBzdGFja1xuLy8gdHJhY2VzXG5mdW5jdGlvbiBjYXB0dXJlTGluZSgpIHtcbiAgICBpZiAoIWhhc1N0YWNrcykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB2YXIgbGluZXMgPSBlLnN0YWNrLnNwbGl0KFwiXFxuXCIpO1xuICAgICAgICB2YXIgZmlyc3RMaW5lID0gbGluZXNbMF0uaW5kZXhPZihcIkBcIikgPiAwID8gbGluZXNbMV0gOiBsaW5lc1syXTtcbiAgICAgICAgdmFyIGZpbGVOYW1lQW5kTGluZU51bWJlciA9IGdldEZpbGVOYW1lQW5kTGluZU51bWJlcihmaXJzdExpbmUpO1xuICAgICAgICBpZiAoIWZpbGVOYW1lQW5kTGluZU51bWJlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgcUZpbGVOYW1lID0gZmlsZU5hbWVBbmRMaW5lTnVtYmVyWzBdO1xuICAgICAgICByZXR1cm4gZmlsZU5hbWVBbmRMaW5lTnVtYmVyWzFdO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlKGNhbGxiYWNrLCBuYW1lLCBhbHRlcm5hdGl2ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgdHlwZW9mIGNvbnNvbGUud2FybiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4obmFtZSArIFwiIGlzIGRlcHJlY2F0ZWQsIHVzZSBcIiArIGFsdGVybmF0aXZlICtcbiAgICAgICAgICAgICAgICAgICAgICAgICBcIiBpbnN0ZWFkLlwiLCBuZXcgRXJyb3IoXCJcIikuc3RhY2spO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseShjYWxsYmFjaywgYXJndW1lbnRzKTtcbiAgICB9O1xufVxuXG4vLyBlbmQgb2Ygc2hpbXNcbi8vIGJlZ2lubmluZyBvZiByZWFsIHdvcmtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgcHJvbWlzZSBmb3IgYW4gaW1tZWRpYXRlIHJlZmVyZW5jZSwgcGFzc2VzIHByb21pc2VzIHRocm91Z2gsIG9yXG4gKiBjb2VyY2VzIHByb21pc2VzIGZyb20gZGlmZmVyZW50IHN5c3RlbXMuXG4gKiBAcGFyYW0gdmFsdWUgaW1tZWRpYXRlIHJlZmVyZW5jZSBvciBwcm9taXNlXG4gKi9cbmZ1bmN0aW9uIFEodmFsdWUpIHtcbiAgICAvLyBJZiB0aGUgb2JqZWN0IGlzIGFscmVhZHkgYSBQcm9taXNlLCByZXR1cm4gaXQgZGlyZWN0bHkuICBUaGlzIGVuYWJsZXNcbiAgICAvLyB0aGUgcmVzb2x2ZSBmdW5jdGlvbiB0byBib3RoIGJlIHVzZWQgdG8gY3JlYXRlZCByZWZlcmVuY2VzIGZyb20gb2JqZWN0cyxcbiAgICAvLyBidXQgdG8gdG9sZXJhYmx5IGNvZXJjZSBub24tcHJvbWlzZXMgdG8gcHJvbWlzZXMuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gYXNzaW1pbGF0ZSB0aGVuYWJsZXNcbiAgICBpZiAoaXNQcm9taXNlQWxpa2UodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBjb2VyY2UodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmdWxmaWxsKHZhbHVlKTtcbiAgICB9XG59XG5RLnJlc29sdmUgPSBRO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgdGFzayBpbiBhIGZ1dHVyZSB0dXJuIG9mIHRoZSBldmVudCBsb29wLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdGFza1xuICovXG5RLm5leHRUaWNrID0gbmV4dFRpY2s7XG5cbi8qKlxuICogQ29udHJvbHMgd2hldGhlciBvciBub3QgbG9uZyBzdGFjayB0cmFjZXMgd2lsbCBiZSBvblxuICovXG5RLmxvbmdTdGFja1N1cHBvcnQgPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgY291bnRlciBpcyB1c2VkIHRvIGRldGVybWluZSB0aGUgc3RvcHBpbmcgcG9pbnQgZm9yIGJ1aWxkaW5nXG4gKiBsb25nIHN0YWNrIHRyYWNlcy4gSW4gbWFrZVN0YWNrVHJhY2VMb25nIHdlIHdhbGsgYmFja3dhcmRzIHRocm91Z2hcbiAqIHRoZSBsaW5rZWQgbGlzdCBvZiBwcm9taXNlcywgb25seSBzdGFja3Mgd2hpY2ggd2VyZSBjcmVhdGVkIGJlZm9yZVxuICogdGhlIHJlamVjdGlvbiBhcmUgY29uY2F0ZW5hdGVkLlxuICovXG52YXIgbG9uZ1N0YWNrQ291bnRlciA9IDE7XG5cbi8vIGVuYWJsZSBsb25nIHN0YWNrcyBpZiBRX0RFQlVHIGlzIHNldFxuaWYgKHR5cGVvZiBwcm9jZXNzID09PSBcIm9iamVjdFwiICYmIHByb2Nlc3MgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuUV9ERUJVRykge1xuICAgIFEubG9uZ1N0YWNrU3VwcG9ydCA9IHRydWU7XG59XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHtwcm9taXNlLCByZXNvbHZlLCByZWplY3R9IG9iamVjdC5cbiAqXG4gKiBgcmVzb2x2ZWAgaXMgYSBjYWxsYmFjayB0byBpbnZva2Ugd2l0aCBhIG1vcmUgcmVzb2x2ZWQgdmFsdWUgZm9yIHRoZVxuICogcHJvbWlzZS4gVG8gZnVsZmlsbCB0aGUgcHJvbWlzZSwgaW52b2tlIGByZXNvbHZlYCB3aXRoIGFueSB2YWx1ZSB0aGF0IGlzXG4gKiBub3QgYSB0aGVuYWJsZS4gVG8gcmVqZWN0IHRoZSBwcm9taXNlLCBpbnZva2UgYHJlc29sdmVgIHdpdGggYSByZWplY3RlZFxuICogdGhlbmFibGUsIG9yIGludm9rZSBgcmVqZWN0YCB3aXRoIHRoZSByZWFzb24gZGlyZWN0bHkuIFRvIHJlc29sdmUgdGhlXG4gKiBwcm9taXNlIHRvIGFub3RoZXIgdGhlbmFibGUsIHRodXMgcHV0dGluZyBpdCBpbiB0aGUgc2FtZSBzdGF0ZSwgaW52b2tlXG4gKiBgcmVzb2x2ZWAgd2l0aCB0aGF0IG90aGVyIHRoZW5hYmxlLlxuICovXG5RLmRlZmVyID0gZGVmZXI7XG5mdW5jdGlvbiBkZWZlcigpIHtcbiAgICAvLyBpZiBcIm1lc3NhZ2VzXCIgaXMgYW4gXCJBcnJheVwiLCB0aGF0IGluZGljYXRlcyB0aGF0IHRoZSBwcm9taXNlIGhhcyBub3QgeWV0XG4gICAgLy8gYmVlbiByZXNvbHZlZC4gIElmIGl0IGlzIFwidW5kZWZpbmVkXCIsIGl0IGhhcyBiZWVuIHJlc29sdmVkLiAgRWFjaFxuICAgIC8vIGVsZW1lbnQgb2YgdGhlIG1lc3NhZ2VzIGFycmF5IGlzIGl0c2VsZiBhbiBhcnJheSBvZiBjb21wbGV0ZSBhcmd1bWVudHMgdG9cbiAgICAvLyBmb3J3YXJkIHRvIHRoZSByZXNvbHZlZCBwcm9taXNlLiAgV2UgY29lcmNlIHRoZSByZXNvbHV0aW9uIHZhbHVlIHRvIGFcbiAgICAvLyBwcm9taXNlIHVzaW5nIHRoZSBgcmVzb2x2ZWAgZnVuY3Rpb24gYmVjYXVzZSBpdCBoYW5kbGVzIGJvdGggZnVsbHlcbiAgICAvLyBub24tdGhlbmFibGUgdmFsdWVzIGFuZCBvdGhlciB0aGVuYWJsZXMgZ3JhY2VmdWxseS5cbiAgICB2YXIgbWVzc2FnZXMgPSBbXSwgcHJvZ3Jlc3NMaXN0ZW5lcnMgPSBbXSwgcmVzb2x2ZWRQcm9taXNlO1xuXG4gICAgdmFyIGRlZmVycmVkID0gb2JqZWN0X2NyZWF0ZShkZWZlci5wcm90b3R5cGUpO1xuICAgIHZhciBwcm9taXNlID0gb2JqZWN0X2NyZWF0ZShQcm9taXNlLnByb3RvdHlwZSk7XG5cbiAgICBwcm9taXNlLnByb21pc2VEaXNwYXRjaCA9IGZ1bmN0aW9uIChyZXNvbHZlLCBvcCwgb3BlcmFuZHMpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgICAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goYXJncyk7XG4gICAgICAgICAgICBpZiAob3AgPT09IFwid2hlblwiICYmIG9wZXJhbmRzWzFdKSB7IC8vIHByb2dyZXNzIG9wZXJhbmRcbiAgICAgICAgICAgICAgICBwcm9ncmVzc0xpc3RlbmVycy5wdXNoKG9wZXJhbmRzWzFdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFEubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS5wcm9taXNlRGlzcGF0Y2guYXBwbHkocmVzb2x2ZWRQcm9taXNlLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFhYWCBkZXByZWNhdGVkXG4gICAgcHJvbWlzZS52YWx1ZU9mID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZWFyZXJWYWx1ZSA9IG5lYXJlcihyZXNvbHZlZFByb21pc2UpO1xuICAgICAgICBpZiAoaXNQcm9taXNlKG5lYXJlclZhbHVlKSkge1xuICAgICAgICAgICAgcmVzb2x2ZWRQcm9taXNlID0gbmVhcmVyVmFsdWU7IC8vIHNob3J0ZW4gY2hhaW5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmVhcmVyVmFsdWU7XG4gICAgfTtcblxuICAgIHByb21pc2UuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiBcInBlbmRpbmdcIiB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlZFByb21pc2UuaW5zcGVjdCgpO1xuICAgIH07XG5cbiAgICBpZiAoUS5sb25nU3RhY2tTdXBwb3J0ICYmIGhhc1N0YWNrcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IGRvbid0IHRyeSB0byB1c2UgYEVycm9yLmNhcHR1cmVTdGFja1RyYWNlYCBvciB0cmFuc2ZlciB0aGVcbiAgICAgICAgICAgIC8vIGFjY2Vzc29yIGFyb3VuZDsgdGhhdCBjYXVzZXMgbWVtb3J5IGxlYWtzIGFzIHBlciBHSC0xMTEuIEp1c3RcbiAgICAgICAgICAgIC8vIHJlaWZ5IHRoZSBzdGFjayB0cmFjZSBhcyBhIHN0cmluZyBBU0FQLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEF0IHRoZSBzYW1lIHRpbWUsIGN1dCBvZmYgdGhlIGZpcnN0IGxpbmU7IGl0J3MgYWx3YXlzIGp1c3RcbiAgICAgICAgICAgIC8vIFwiW29iamVjdCBQcm9taXNlXVxcblwiLCBhcyBwZXIgdGhlIGB0b1N0cmluZ2AuXG4gICAgICAgICAgICBwcm9taXNlLnN0YWNrID0gZS5zdGFjay5zdWJzdHJpbmcoZS5zdGFjay5pbmRleE9mKFwiXFxuXCIpICsgMSk7XG4gICAgICAgICAgICBwcm9taXNlLnN0YWNrQ291bnRlciA9IGxvbmdTdGFja0NvdW50ZXIrKztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5PVEU6IHdlIGRvIHRoZSBjaGVja3MgZm9yIGByZXNvbHZlZFByb21pc2VgIGluIGVhY2ggbWV0aG9kLCBpbnN0ZWFkIG9mXG4gICAgLy8gY29uc29saWRhdGluZyB0aGVtIGludG8gYGJlY29tZWAsIHNpbmNlIG90aGVyd2lzZSB3ZSdkIGNyZWF0ZSBuZXdcbiAgICAvLyBwcm9taXNlcyB3aXRoIHRoZSBsaW5lcyBgYmVjb21lKHdoYXRldmVyKHZhbHVlKSlgLiBTZWUgZS5nLiBHSC0yNTIuXG5cbiAgICBmdW5jdGlvbiBiZWNvbWUobmV3UHJvbWlzZSkge1xuICAgICAgICByZXNvbHZlZFByb21pc2UgPSBuZXdQcm9taXNlO1xuXG4gICAgICAgIGlmIChRLmxvbmdTdGFja1N1cHBvcnQgJiYgaGFzU3RhY2tzKSB7XG4gICAgICAgICAgICAvLyBPbmx5IGhvbGQgYSByZWZlcmVuY2UgdG8gdGhlIG5ldyBwcm9taXNlIGlmIGxvbmcgc3RhY2tzXG4gICAgICAgICAgICAvLyBhcmUgZW5hYmxlZCB0byByZWR1Y2UgbWVtb3J5IHVzYWdlXG4gICAgICAgICAgICBwcm9taXNlLnNvdXJjZSA9IG5ld1Byb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBhcnJheV9yZWR1Y2UobWVzc2FnZXMsIGZ1bmN0aW9uICh1bmRlZmluZWQsIG1lc3NhZ2UpIHtcbiAgICAgICAgICAgIFEubmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG5ld1Byb21pc2UucHJvbWlzZURpc3BhdGNoLmFwcGx5KG5ld1Byb21pc2UsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHZvaWQgMCk7XG5cbiAgICAgICAgbWVzc2FnZXMgPSB2b2lkIDA7XG4gICAgICAgIHByb2dyZXNzTGlzdGVuZXJzID0gdm9pZCAwO1xuICAgIH1cblxuICAgIGRlZmVycmVkLnByb21pc2UgPSBwcm9taXNlO1xuICAgIGRlZmVycmVkLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHJlc29sdmVkUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVjb21lKFEodmFsdWUpKTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQuZnVsZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAocmVzb2x2ZWRQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBiZWNvbWUoZnVsZmlsbCh2YWx1ZSkpO1xuICAgIH07XG4gICAgZGVmZXJyZWQucmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBpZiAocmVzb2x2ZWRQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBiZWNvbWUocmVqZWN0KHJlYXNvbikpO1xuICAgIH07XG4gICAgZGVmZXJyZWQubm90aWZ5ID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgIGlmIChyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFycmF5X3JlZHVjZShwcm9ncmVzc0xpc3RlbmVycywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgcHJvZ3Jlc3NMaXN0ZW5lcikge1xuICAgICAgICAgICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3NMaXN0ZW5lcihwcm9ncmVzcyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgdm9pZCAwKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmVycmVkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBOb2RlLXN0eWxlIGNhbGxiYWNrIHRoYXQgd2lsbCByZXNvbHZlIG9yIHJlamVjdCB0aGUgZGVmZXJyZWRcbiAqIHByb21pc2UuXG4gKiBAcmV0dXJucyBhIG5vZGViYWNrXG4gKi9cbmRlZmVyLnByb3RvdHlwZS5tYWtlTm9kZVJlc29sdmVyID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24gKGVycm9yLCB2YWx1ZSkge1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHNlbGYucmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgc2VsZi5yZXNvbHZlKGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH07XG59O1xuXG4vKipcbiAqIEBwYXJhbSByZXNvbHZlciB7RnVuY3Rpb259IGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIG5vdGhpbmcgYW5kIGFjY2VwdHNcbiAqIHRoZSByZXNvbHZlLCByZWplY3QsIGFuZCBub3RpZnkgZnVuY3Rpb25zIGZvciBhIGRlZmVycmVkLlxuICogQHJldHVybnMgYSBwcm9taXNlIHRoYXQgbWF5IGJlIHJlc29sdmVkIHdpdGggdGhlIGdpdmVuIHJlc29sdmUgYW5kIHJlamVjdFxuICogZnVuY3Rpb25zLCBvciByZWplY3RlZCBieSBhIHRocm93biBleGNlcHRpb24gaW4gcmVzb2x2ZXJcbiAqL1xuUS5Qcm9taXNlID0gcHJvbWlzZTsgLy8gRVM2XG5RLnByb21pc2UgPSBwcm9taXNlO1xuZnVuY3Rpb24gcHJvbWlzZShyZXNvbHZlcikge1xuICAgIGlmICh0eXBlb2YgcmVzb2x2ZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwicmVzb2x2ZXIgbXVzdCBiZSBhIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICB0cnkge1xuICAgICAgICByZXNvbHZlcihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QsIGRlZmVycmVkLm5vdGlmeSk7XG4gICAgfSBjYXRjaCAocmVhc29uKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChyZWFzb24pO1xuICAgIH1cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxucHJvbWlzZS5yYWNlID0gcmFjZTsgLy8gRVM2XG5wcm9taXNlLmFsbCA9IGFsbDsgLy8gRVM2XG5wcm9taXNlLnJlamVjdCA9IHJlamVjdDsgLy8gRVM2XG5wcm9taXNlLnJlc29sdmUgPSBROyAvLyBFUzZcblxuLy8gWFhYIGV4cGVyaW1lbnRhbC4gIFRoaXMgbWV0aG9kIGlzIGEgd2F5IHRvIGRlbm90ZSB0aGF0IGEgbG9jYWwgdmFsdWUgaXNcbi8vIHNlcmlhbGl6YWJsZSBhbmQgc2hvdWxkIGJlIGltbWVkaWF0ZWx5IGRpc3BhdGNoZWQgdG8gYSByZW1vdGUgdXBvbiByZXF1ZXN0LFxuLy8gaW5zdGVhZCBvZiBwYXNzaW5nIGEgcmVmZXJlbmNlLlxuUS5wYXNzQnlDb3B5ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIC8vZnJlZXplKG9iamVjdCk7XG4gICAgLy9wYXNzQnlDb3BpZXMuc2V0KG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnBhc3NCeUNvcHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy9mcmVlemUob2JqZWN0KTtcbiAgICAvL3Bhc3NCeUNvcGllcy5zZXQob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogSWYgdHdvIHByb21pc2VzIGV2ZW50dWFsbHkgZnVsZmlsbCB0byB0aGUgc2FtZSB2YWx1ZSwgcHJvbWlzZXMgdGhhdCB2YWx1ZSxcbiAqIGJ1dCBvdGhlcndpc2UgcmVqZWN0cy5cbiAqIEBwYXJhbSB4IHtBbnkqfVxuICogQHBhcmFtIHkge0FueSp9XG4gKiBAcmV0dXJucyB7QW55Kn0gYSBwcm9taXNlIGZvciB4IGFuZCB5IGlmIHRoZXkgYXJlIHRoZSBzYW1lLCBidXQgYSByZWplY3Rpb25cbiAqIG90aGVyd2lzZS5cbiAqXG4gKi9cblEuam9pbiA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgcmV0dXJuIFEoeCkuam9pbih5KTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmpvaW4gPSBmdW5jdGlvbiAodGhhdCkge1xuICAgIHJldHVybiBRKFt0aGlzLCB0aGF0XSkuc3ByZWFkKGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIGlmICh4ID09PSB5KSB7XG4gICAgICAgICAgICAvLyBUT0RPOiBcIj09PVwiIHNob3VsZCBiZSBPYmplY3QuaXMgb3IgZXF1aXZcbiAgICAgICAgICAgIHJldHVybiB4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUSBjYW4ndCBqb2luOiBub3QgdGhlIHNhbWU6IFwiICsgeCArIFwiIFwiICsgeSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmaXJzdCBvZiBhbiBhcnJheSBvZiBwcm9taXNlcyB0byBiZWNvbWUgc2V0dGxlZC5cbiAqIEBwYXJhbSBhbnN3ZXJzIHtBcnJheVtBbnkqXX0gcHJvbWlzZXMgdG8gcmFjZVxuICogQHJldHVybnMge0FueSp9IHRoZSBmaXJzdCBwcm9taXNlIHRvIGJlIHNldHRsZWRcbiAqL1xuUS5yYWNlID0gcmFjZTtcbmZ1bmN0aW9uIHJhY2UoYW5zd2VyUHMpIHtcbiAgICByZXR1cm4gcHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIFN3aXRjaCB0byB0aGlzIG9uY2Ugd2UgY2FuIGFzc3VtZSBhdCBsZWFzdCBFUzVcbiAgICAgICAgLy8gYW5zd2VyUHMuZm9yRWFjaChmdW5jdGlvbiAoYW5zd2VyUCkge1xuICAgICAgICAvLyAgICAgUShhbnN3ZXJQKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIC8vIH0pO1xuICAgICAgICAvLyBVc2UgdGhpcyBpbiB0aGUgbWVhbnRpbWVcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGFuc3dlclBzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBRKGFuc3dlclBzW2ldKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUucmFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKFEucmFjZSk7XG59O1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBQcm9taXNlIHdpdGggYSBwcm9taXNlIGRlc2NyaXB0b3Igb2JqZWN0IGFuZCBvcHRpb25hbCBmYWxsYmFja1xuICogZnVuY3Rpb24uICBUaGUgZGVzY3JpcHRvciBjb250YWlucyBtZXRob2RzIGxpa2Ugd2hlbihyZWplY3RlZCksIGdldChuYW1lKSxcbiAqIHNldChuYW1lLCB2YWx1ZSksIHBvc3QobmFtZSwgYXJncyksIGFuZCBkZWxldGUobmFtZSksIHdoaWNoIGFsbFxuICogcmV0dXJuIGVpdGhlciBhIHZhbHVlLCBhIHByb21pc2UgZm9yIGEgdmFsdWUsIG9yIGEgcmVqZWN0aW9uLiAgVGhlIGZhbGxiYWNrXG4gKiBhY2NlcHRzIHRoZSBvcGVyYXRpb24gbmFtZSwgYSByZXNvbHZlciwgYW5kIGFueSBmdXJ0aGVyIGFyZ3VtZW50cyB0aGF0IHdvdWxkXG4gKiBoYXZlIGJlZW4gZm9yd2FyZGVkIHRvIHRoZSBhcHByb3ByaWF0ZSBtZXRob2QgYWJvdmUgaGFkIGEgbWV0aG9kIGJlZW5cbiAqIHByb3ZpZGVkIHdpdGggdGhlIHByb3BlciBuYW1lLiAgVGhlIEFQSSBtYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IHRoZSBuYXR1cmVcbiAqIG9mIHRoZSByZXR1cm5lZCBvYmplY3QsIGFwYXJ0IGZyb20gdGhhdCBpdCBpcyB1c2FibGUgd2hlcmVldmVyIHByb21pc2VzIGFyZVxuICogYm91Z2h0IGFuZCBzb2xkLlxuICovXG5RLm1ha2VQcm9taXNlID0gUHJvbWlzZTtcbmZ1bmN0aW9uIFByb21pc2UoZGVzY3JpcHRvciwgZmFsbGJhY2ssIGluc3BlY3QpIHtcbiAgICBpZiAoZmFsbGJhY2sgPT09IHZvaWQgMCkge1xuICAgICAgICBmYWxsYmFjayA9IGZ1bmN0aW9uIChvcCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgXCJQcm9taXNlIGRvZXMgbm90IHN1cHBvcnQgb3BlcmF0aW9uOiBcIiArIG9wXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGluc3BlY3QgPT09IHZvaWQgMCkge1xuICAgICAgICBpbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtzdGF0ZTogXCJ1bmtub3duXCJ9O1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBwcm9taXNlID0gb2JqZWN0X2NyZWF0ZShQcm9taXNlLnByb3RvdHlwZSk7XG5cbiAgICBwcm9taXNlLnByb21pc2VEaXNwYXRjaCA9IGZ1bmN0aW9uIChyZXNvbHZlLCBvcCwgYXJncykge1xuICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3Jbb3BdKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZGVzY3JpcHRvcltvcF0uYXBwbHkocHJvbWlzZSwgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZhbGxiYWNrLmNhbGwocHJvbWlzZSwgb3AsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHJlamVjdChleGNlcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNvbHZlKSB7XG4gICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcHJvbWlzZS5pbnNwZWN0ID0gaW5zcGVjdDtcblxuICAgIC8vIFhYWCBkZXByZWNhdGVkIGB2YWx1ZU9mYCBhbmQgYGV4Y2VwdGlvbmAgc3VwcG9ydFxuICAgIGlmIChpbnNwZWN0KSB7XG4gICAgICAgIHZhciBpbnNwZWN0ZWQgPSBpbnNwZWN0KCk7XG4gICAgICAgIGlmIChpbnNwZWN0ZWQuc3RhdGUgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgICAgICAgcHJvbWlzZS5leGNlcHRpb24gPSBpbnNwZWN0ZWQucmVhc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJvbWlzZS52YWx1ZU9mID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGluc3BlY3RlZCA9IGluc3BlY3QoKTtcbiAgICAgICAgICAgIGlmIChpbnNwZWN0ZWQuc3RhdGUgPT09IFwicGVuZGluZ1wiIHx8XG4gICAgICAgICAgICAgICAgaW5zcGVjdGVkLnN0YXRlID09PSBcInJlamVjdGVkXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpbnNwZWN0ZWQudmFsdWU7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5cblByb21pc2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgUHJvbWlzZV1cIjtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbiAoZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3NlZCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIHZhciBkb25lID0gZmFsc2U7ICAgLy8gZW5zdXJlIHRoZSB1bnRydXN0ZWQgcHJvbWlzZSBtYWtlcyBhdCBtb3N0IGFcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmdsZSBjYWxsIHRvIG9uZSBvZiB0aGUgY2FsbGJhY2tzXG5cbiAgICBmdW5jdGlvbiBfZnVsZmlsbGVkKHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZ1bGZpbGxlZCA9PT0gXCJmdW5jdGlvblwiID8gZnVsZmlsbGVkKHZhbHVlKSA6IHZhbHVlO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXhjZXB0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9yZWplY3RlZChleGNlcHRpb24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiByZWplY3RlZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBtYWtlU3RhY2tUcmFjZUxvbmcoZXhjZXB0aW9uLCBzZWxmKTtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdGVkKGV4Y2VwdGlvbik7XG4gICAgICAgICAgICB9IGNhdGNoIChuZXdFeGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ld0V4Y2VwdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlamVjdChleGNlcHRpb24pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9wcm9ncmVzc2VkKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcHJvZ3Jlc3NlZCA9PT0gXCJmdW5jdGlvblwiID8gcHJvZ3Jlc3NlZCh2YWx1ZSkgOiB2YWx1ZTtcbiAgICB9XG5cbiAgICBRLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5wcm9taXNlRGlzcGF0Y2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKF9mdWxmaWxsZWQodmFsdWUpKTtcbiAgICAgICAgfSwgXCJ3aGVuXCIsIFtmdW5jdGlvbiAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKF9yZWplY3RlZChleGNlcHRpb24pKTtcbiAgICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgLy8gUHJvZ3Jlc3MgcHJvcGFnYXRvciBuZWVkIHRvIGJlIGF0dGFjaGVkIGluIHRoZSBjdXJyZW50IHRpY2suXG4gICAgc2VsZi5wcm9taXNlRGlzcGF0Y2godm9pZCAwLCBcIndoZW5cIiwgW3ZvaWQgMCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZTtcbiAgICAgICAgdmFyIHRocmV3ID0gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IF9wcm9ncmVzc2VkKHZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyZXcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKFEub25lcnJvcikge1xuICAgICAgICAgICAgICAgIFEub25lcnJvcihlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhyZXcpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLm5vdGlmeShuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cblEudGFwID0gZnVuY3Rpb24gKHByb21pc2UsIGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIFEocHJvbWlzZSkudGFwKGNhbGxiYWNrKTtcbn07XG5cbi8qKlxuICogV29ya3MgYWxtb3N0IGxpa2UgXCJmaW5hbGx5XCIsIGJ1dCBub3QgY2FsbGVkIGZvciByZWplY3Rpb25zLlxuICogT3JpZ2luYWwgcmVzb2x1dGlvbiB2YWx1ZSBpcyBwYXNzZWQgdGhyb3VnaCBjYWxsYmFjayB1bmFmZmVjdGVkLlxuICogQ2FsbGJhY2sgbWF5IHJldHVybiBhIHByb21pc2UgdGhhdCB3aWxsIGJlIGF3YWl0ZWQgZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAqIEByZXR1cm5zIHtRLlByb21pc2V9XG4gKiBAZXhhbXBsZVxuICogZG9Tb21ldGhpbmcoKVxuICogICAudGhlbiguLi4pXG4gKiAgIC50YXAoY29uc29sZS5sb2cpXG4gKiAgIC50aGVuKC4uLik7XG4gKi9cblByb21pc2UucHJvdG90eXBlLnRhcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gUShjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2suZmNhbGwodmFsdWUpLnRoZW5SZXNvbHZlKHZhbHVlKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXJzIGFuIG9ic2VydmVyIG9uIGEgcHJvbWlzZS5cbiAqXG4gKiBHdWFyYW50ZWVzOlxuICpcbiAqIDEuIHRoYXQgZnVsZmlsbGVkIGFuZCByZWplY3RlZCB3aWxsIGJlIGNhbGxlZCBvbmx5IG9uY2UuXG4gKiAyLiB0aGF0IGVpdGhlciB0aGUgZnVsZmlsbGVkIGNhbGxiYWNrIG9yIHRoZSByZWplY3RlZCBjYWxsYmFjayB3aWxsIGJlXG4gKiAgICBjYWxsZWQsIGJ1dCBub3QgYm90aC5cbiAqIDMuIHRoYXQgZnVsZmlsbGVkIGFuZCByZWplY3RlZCB3aWxsIG5vdCBiZSBjYWxsZWQgaW4gdGhpcyB0dXJuLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSB0byBvYnNlcnZlXG4gKiBAcGFyYW0gZnVsZmlsbGVkICBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCB0aGUgZnVsZmlsbGVkIHZhbHVlXG4gKiBAcGFyYW0gcmVqZWN0ZWQgICBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCB0aGUgcmVqZWN0aW9uIGV4Y2VwdGlvblxuICogQHBhcmFtIHByb2dyZXNzZWQgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGFueSBwcm9ncmVzcyBub3RpZmljYXRpb25zXG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgaW52b2tlZCBjYWxsYmFja1xuICovXG5RLndoZW4gPSB3aGVuO1xuZnVuY3Rpb24gd2hlbih2YWx1ZSwgZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3NlZCkge1xuICAgIHJldHVybiBRKHZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzZWQpO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuUmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0pO1xufTtcblxuUS50aGVuUmVzb2x2ZSA9IGZ1bmN0aW9uIChwcm9taXNlLCB2YWx1ZSkge1xuICAgIHJldHVybiBRKHByb21pc2UpLnRoZW5SZXNvbHZlKHZhbHVlKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW5SZWplY3QgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbiAoKSB7IHRocm93IHJlYXNvbjsgfSk7XG59O1xuXG5RLnRoZW5SZWplY3QgPSBmdW5jdGlvbiAocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgcmV0dXJuIFEocHJvbWlzZSkudGhlblJlamVjdChyZWFzb24pO1xufTtcblxuLyoqXG4gKiBJZiBhbiBvYmplY3QgaXMgbm90IGEgcHJvbWlzZSwgaXQgaXMgYXMgXCJuZWFyXCIgYXMgcG9zc2libGUuXG4gKiBJZiBhIHByb21pc2UgaXMgcmVqZWN0ZWQsIGl0IGlzIGFzIFwibmVhclwiIGFzIHBvc3NpYmxlIHRvby5cbiAqIElmIGl04oCZcyBhIGZ1bGZpbGxlZCBwcm9taXNlLCB0aGUgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmVhcmVyLlxuICogSWYgaXTigJlzIGEgZGVmZXJyZWQgcHJvbWlzZSBhbmQgdGhlIGRlZmVycmVkIGhhcyBiZWVuIHJlc29sdmVkLCB0aGVcbiAqIHJlc29sdXRpb24gaXMgXCJuZWFyZXJcIi5cbiAqIEBwYXJhbSBvYmplY3RcbiAqIEByZXR1cm5zIG1vc3QgcmVzb2x2ZWQgKG5lYXJlc3QpIGZvcm0gb2YgdGhlIG9iamVjdFxuICovXG5cbi8vIFhYWCBzaG91bGQgd2UgcmUtZG8gdGhpcz9cblEubmVhcmVyID0gbmVhcmVyO1xuZnVuY3Rpb24gbmVhcmVyKHZhbHVlKSB7XG4gICAgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIGluc3BlY3RlZCA9IHZhbHVlLmluc3BlY3QoKTtcbiAgICAgICAgaWYgKGluc3BlY3RlZC5zdGF0ZSA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGluc3BlY3RlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgcHJvbWlzZS5cbiAqIE90aGVyd2lzZSBpdCBpcyBhIGZ1bGZpbGxlZCB2YWx1ZS5cbiAqL1xuUS5pc1Byb21pc2UgPSBpc1Byb21pc2U7XG5mdW5jdGlvbiBpc1Byb21pc2Uob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIFByb21pc2U7XG59XG5cblEuaXNQcm9taXNlQWxpa2UgPSBpc1Byb21pc2VBbGlrZTtcbmZ1bmN0aW9uIGlzUHJvbWlzZUFsaWtlKG9iamVjdCkge1xuICAgIHJldHVybiBpc09iamVjdChvYmplY3QpICYmIHR5cGVvZiBvYmplY3QudGhlbiA9PT0gXCJmdW5jdGlvblwiO1xufVxuXG4vKipcbiAqIEByZXR1cm5zIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIHBlbmRpbmcgcHJvbWlzZSwgbWVhbmluZyBub3RcbiAqIGZ1bGZpbGxlZCBvciByZWplY3RlZC5cbiAqL1xuUS5pc1BlbmRpbmcgPSBpc1BlbmRpbmc7XG5mdW5jdGlvbiBpc1BlbmRpbmcob2JqZWN0KSB7XG4gICAgcmV0dXJuIGlzUHJvbWlzZShvYmplY3QpICYmIG9iamVjdC5pbnNwZWN0KCkuc3RhdGUgPT09IFwicGVuZGluZ1wiO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5pc1BlbmRpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zcGVjdCgpLnN0YXRlID09PSBcInBlbmRpbmdcIjtcbn07XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgdmFsdWUgb3IgZnVsZmlsbGVkXG4gKiBwcm9taXNlLlxuICovXG5RLmlzRnVsZmlsbGVkID0gaXNGdWxmaWxsZWQ7XG5mdW5jdGlvbiBpc0Z1bGZpbGxlZChvYmplY3QpIHtcbiAgICByZXR1cm4gIWlzUHJvbWlzZShvYmplY3QpIHx8IG9iamVjdC5pbnNwZWN0KCkuc3RhdGUgPT09IFwiZnVsZmlsbGVkXCI7XG59XG5cblByb21pc2UucHJvdG90eXBlLmlzRnVsZmlsbGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmluc3BlY3QoKS5zdGF0ZSA9PT0gXCJmdWxmaWxsZWRcIjtcbn07XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgcmVqZWN0ZWQgcHJvbWlzZS5cbiAqL1xuUS5pc1JlamVjdGVkID0gaXNSZWplY3RlZDtcbmZ1bmN0aW9uIGlzUmVqZWN0ZWQob2JqZWN0KSB7XG4gICAgcmV0dXJuIGlzUHJvbWlzZShvYmplY3QpICYmIG9iamVjdC5pbnNwZWN0KCkuc3RhdGUgPT09IFwicmVqZWN0ZWRcIjtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuaXNSZWplY3RlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNwZWN0KCkuc3RhdGUgPT09IFwicmVqZWN0ZWRcIjtcbn07XG5cbi8vLy8gQkVHSU4gVU5IQU5ETEVEIFJFSkVDVElPTiBUUkFDS0lOR1xuXG4vLyBUaGlzIHByb21pc2UgbGlicmFyeSBjb25zdW1lcyBleGNlcHRpb25zIHRocm93biBpbiBoYW5kbGVycyBzbyB0aGV5IGNhbiBiZVxuLy8gaGFuZGxlZCBieSBhIHN1YnNlcXVlbnQgcHJvbWlzZS4gIFRoZSBleGNlcHRpb25zIGdldCBhZGRlZCB0byB0aGlzIGFycmF5IHdoZW5cbi8vIHRoZXkgYXJlIGNyZWF0ZWQsIGFuZCByZW1vdmVkIHdoZW4gdGhleSBhcmUgaGFuZGxlZC4gIE5vdGUgdGhhdCBpbiBFUzYgb3Jcbi8vIHNoaW1tZWQgZW52aXJvbm1lbnRzLCB0aGlzIHdvdWxkIG5hdHVyYWxseSBiZSBhIGBTZXRgLlxudmFyIHVuaGFuZGxlZFJlYXNvbnMgPSBbXTtcbnZhciB1bmhhbmRsZWRSZWplY3Rpb25zID0gW107XG52YXIgcmVwb3J0ZWRVbmhhbmRsZWRSZWplY3Rpb25zID0gW107XG52YXIgdHJhY2tVbmhhbmRsZWRSZWplY3Rpb25zID0gdHJ1ZTtcblxuZnVuY3Rpb24gcmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zKCkge1xuICAgIHVuaGFuZGxlZFJlYXNvbnMubGVuZ3RoID0gMDtcbiAgICB1bmhhbmRsZWRSZWplY3Rpb25zLmxlbmd0aCA9IDA7XG5cbiAgICBpZiAoIXRyYWNrVW5oYW5kbGVkUmVqZWN0aW9ucykge1xuICAgICAgICB0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMgPSB0cnVlO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdHJhY2tSZWplY3Rpb24ocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgaWYgKCF0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHByb2Nlc3MuZW1pdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIFEubmV4dFRpY2sucnVuQWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGFycmF5X2luZGV4T2YodW5oYW5kbGVkUmVqZWN0aW9ucywgcHJvbWlzZSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5lbWl0KFwidW5oYW5kbGVkUmVqZWN0aW9uXCIsIHJlYXNvbiwgcHJvbWlzZSk7XG4gICAgICAgICAgICAgICAgcmVwb3J0ZWRVbmhhbmRsZWRSZWplY3Rpb25zLnB1c2gocHJvbWlzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuaGFuZGxlZFJlamVjdGlvbnMucHVzaChwcm9taXNlKTtcbiAgICBpZiAocmVhc29uICYmIHR5cGVvZiByZWFzb24uc3RhY2sgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgdW5oYW5kbGVkUmVhc29ucy5wdXNoKHJlYXNvbi5zdGFjayk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdW5oYW5kbGVkUmVhc29ucy5wdXNoKFwiKG5vIHN0YWNrKSBcIiArIHJlYXNvbik7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB1bnRyYWNrUmVqZWN0aW9uKHByb21pc2UpIHtcbiAgICBpZiAoIXRyYWNrVW5oYW5kbGVkUmVqZWN0aW9ucykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGF0ID0gYXJyYXlfaW5kZXhPZih1bmhhbmRsZWRSZWplY3Rpb25zLCBwcm9taXNlKTtcbiAgICBpZiAoYXQgIT09IC0xKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgcHJvY2Vzcy5lbWl0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIFEubmV4dFRpY2sucnVuQWZ0ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdFJlcG9ydCA9IGFycmF5X2luZGV4T2YocmVwb3J0ZWRVbmhhbmRsZWRSZWplY3Rpb25zLCBwcm9taXNlKTtcbiAgICAgICAgICAgICAgICBpZiAoYXRSZXBvcnQgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3MuZW1pdChcInJlamVjdGlvbkhhbmRsZWRcIiwgdW5oYW5kbGVkUmVhc29uc1thdF0sIHByb21pc2UpO1xuICAgICAgICAgICAgICAgICAgICByZXBvcnRlZFVuaGFuZGxlZFJlamVjdGlvbnMuc3BsaWNlKGF0UmVwb3J0LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB1bmhhbmRsZWRSZWplY3Rpb25zLnNwbGljZShhdCwgMSk7XG4gICAgICAgIHVuaGFuZGxlZFJlYXNvbnMuc3BsaWNlKGF0LCAxKTtcbiAgICB9XG59XG5cblEucmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zID0gcmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zO1xuXG5RLmdldFVuaGFuZGxlZFJlYXNvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gTWFrZSBhIGNvcHkgc28gdGhhdCBjb25zdW1lcnMgY2FuJ3QgaW50ZXJmZXJlIHdpdGggb3VyIGludGVybmFsIHN0YXRlLlxuICAgIHJldHVybiB1bmhhbmRsZWRSZWFzb25zLnNsaWNlKCk7XG59O1xuXG5RLnN0b3BVbmhhbmRsZWRSZWplY3Rpb25UcmFja2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXNldFVuaGFuZGxlZFJlamVjdGlvbnMoKTtcbiAgICB0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMgPSBmYWxzZTtcbn07XG5cbnJlc2V0VW5oYW5kbGVkUmVqZWN0aW9ucygpO1xuXG4vLy8vIEVORCBVTkhBTkRMRUQgUkVKRUNUSU9OIFRSQUNLSU5HXG5cbi8qKlxuICogQ29uc3RydWN0cyBhIHJlamVjdGVkIHByb21pc2UuXG4gKiBAcGFyYW0gcmVhc29uIHZhbHVlIGRlc2NyaWJpbmcgdGhlIGZhaWx1cmVcbiAqL1xuUS5yZWplY3QgPSByZWplY3Q7XG5mdW5jdGlvbiByZWplY3QocmVhc29uKSB7XG4gICAgdmFyIHJlamVjdGlvbiA9IFByb21pc2Uoe1xuICAgICAgICBcIndoZW5cIjogZnVuY3Rpb24gKHJlamVjdGVkKSB7XG4gICAgICAgICAgICAvLyBub3RlIHRoYXQgdGhlIGVycm9yIGhhcyBiZWVuIGhhbmRsZWRcbiAgICAgICAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICAgICAgICAgIHVudHJhY2tSZWplY3Rpb24odGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0ZWQgPyByZWplY3RlZChyZWFzb24pIDogdGhpcztcbiAgICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uIGZhbGxiYWNrKCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LCBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICAgICAgICByZXR1cm4geyBzdGF0ZTogXCJyZWplY3RlZFwiLCByZWFzb246IHJlYXNvbiB9O1xuICAgIH0pO1xuXG4gICAgLy8gTm90ZSB0aGF0IHRoZSByZWFzb24gaGFzIG5vdCBiZWVuIGhhbmRsZWQuXG4gICAgdHJhY2tSZWplY3Rpb24ocmVqZWN0aW9uLCByZWFzb24pO1xuXG4gICAgcmV0dXJuIHJlamVjdGlvbjtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEgZnVsZmlsbGVkIHByb21pc2UgZm9yIGFuIGltbWVkaWF0ZSByZWZlcmVuY2UuXG4gKiBAcGFyYW0gdmFsdWUgaW1tZWRpYXRlIHJlZmVyZW5jZVxuICovXG5RLmZ1bGZpbGwgPSBmdWxmaWxsO1xuZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkge1xuICAgIHJldHVybiBQcm9taXNlKHtcbiAgICAgICAgXCJ3aGVuXCI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJnZXRcIjogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZVtuYW1lXTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJzZXRcIjogZnVuY3Rpb24gKG5hbWUsIHJocykge1xuICAgICAgICAgICAgdmFsdWVbbmFtZV0gPSByaHM7XG4gICAgICAgIH0sXG4gICAgICAgIFwiZGVsZXRlXCI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBkZWxldGUgdmFsdWVbbmFtZV07XG4gICAgICAgIH0sXG4gICAgICAgIFwicG9zdFwiOiBmdW5jdGlvbiAobmFtZSwgYXJncykge1xuICAgICAgICAgICAgLy8gTWFyayBNaWxsZXIgcHJvcG9zZXMgdGhhdCBwb3N0IHdpdGggbm8gbmFtZSBzaG91bGQgYXBwbHkgYVxuICAgICAgICAgICAgLy8gcHJvbWlzZWQgZnVuY3Rpb24uXG4gICAgICAgICAgICBpZiAobmFtZSA9PT0gbnVsbCB8fCBuYW1lID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYXBwbHkodm9pZCAwLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlW25hbWVdLmFwcGx5KHZhbHVlLCBhcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgXCJhcHBseVwiOiBmdW5jdGlvbiAodGhpc3AsIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5hcHBseSh0aGlzcCwgYXJncyk7XG4gICAgICAgIH0sXG4gICAgICAgIFwia2V5c1wiOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0X2tleXModmFsdWUpO1xuICAgICAgICB9XG4gICAgfSwgdm9pZCAwLCBmdW5jdGlvbiBpbnNwZWN0KCkge1xuICAgICAgICByZXR1cm4geyBzdGF0ZTogXCJmdWxmaWxsZWRcIiwgdmFsdWU6IHZhbHVlIH07XG4gICAgfSk7XG59XG5cbi8qKlxuICogQ29udmVydHMgdGhlbmFibGVzIHRvIFEgcHJvbWlzZXMuXG4gKiBAcGFyYW0gcHJvbWlzZSB0aGVuYWJsZSBwcm9taXNlXG4gKiBAcmV0dXJucyBhIFEgcHJvbWlzZVxuICovXG5mdW5jdGlvbiBjb2VyY2UocHJvbWlzZSkge1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwcm9taXNlLnRoZW4oZGVmZXJyZWQucmVzb2x2ZSwgZGVmZXJyZWQucmVqZWN0LCBkZWZlcnJlZC5ub3RpZnkpO1xuICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChleGNlcHRpb24pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbi8qKlxuICogQW5ub3RhdGVzIGFuIG9iamVjdCBzdWNoIHRoYXQgaXQgd2lsbCBuZXZlciBiZVxuICogdHJhbnNmZXJyZWQgYXdheSBmcm9tIHRoaXMgcHJvY2VzcyBvdmVyIGFueSBwcm9taXNlXG4gKiBjb21tdW5pY2F0aW9uIGNoYW5uZWwuXG4gKiBAcGFyYW0gb2JqZWN0XG4gKiBAcmV0dXJucyBwcm9taXNlIGEgd3JhcHBpbmcgb2YgdGhhdCBvYmplY3QgdGhhdFxuICogYWRkaXRpb25hbGx5IHJlc3BvbmRzIHRvIHRoZSBcImlzRGVmXCIgbWVzc2FnZVxuICogd2l0aG91dCBhIHJlamVjdGlvbi5cbiAqL1xuUS5tYXN0ZXIgPSBtYXN0ZXI7XG5mdW5jdGlvbiBtYXN0ZXIob2JqZWN0KSB7XG4gICAgcmV0dXJuIFByb21pc2Uoe1xuICAgICAgICBcImlzRGVmXCI6IGZ1bmN0aW9uICgpIHt9XG4gICAgfSwgZnVuY3Rpb24gZmFsbGJhY2sob3AsIGFyZ3MpIHtcbiAgICAgICAgcmV0dXJuIGRpc3BhdGNoKG9iamVjdCwgb3AsIGFyZ3MpO1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIFEob2JqZWN0KS5pbnNwZWN0KCk7XG4gICAgfSk7XG59XG5cbi8qKlxuICogU3ByZWFkcyB0aGUgdmFsdWVzIG9mIGEgcHJvbWlzZWQgYXJyYXkgb2YgYXJndW1lbnRzIGludG8gdGhlXG4gKiBmdWxmaWxsbWVudCBjYWxsYmFjay5cbiAqIEBwYXJhbSBmdWxmaWxsZWQgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyB2YXJpYWRpYyBhcmd1bWVudHMgZnJvbSB0aGVcbiAqIHByb21pc2VkIGFycmF5XG4gKiBAcGFyYW0gcmVqZWN0ZWQgY2FsbGJhY2sgdGhhdCByZWNlaXZlcyB0aGUgZXhjZXB0aW9uIGlmIHRoZSBwcm9taXNlXG4gKiBpcyByZWplY3RlZC5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZSBvciB0aHJvd24gZXhjZXB0aW9uIG9mXG4gKiBlaXRoZXIgY2FsbGJhY2suXG4gKi9cblEuc3ByZWFkID0gc3ByZWFkO1xuZnVuY3Rpb24gc3ByZWFkKHZhbHVlLCBmdWxmaWxsZWQsIHJlamVjdGVkKSB7XG4gICAgcmV0dXJuIFEodmFsdWUpLnNwcmVhZChmdWxmaWxsZWQsIHJlamVjdGVkKTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuc3ByZWFkID0gZnVuY3Rpb24gKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gdGhpcy5hbGwoKS50aGVuKGZ1bmN0aW9uIChhcnJheSkge1xuICAgICAgICByZXR1cm4gZnVsZmlsbGVkLmFwcGx5KHZvaWQgMCwgYXJyYXkpO1xuICAgIH0sIHJlamVjdGVkKTtcbn07XG5cbi8qKlxuICogVGhlIGFzeW5jIGZ1bmN0aW9uIGlzIGEgZGVjb3JhdG9yIGZvciBnZW5lcmF0b3IgZnVuY3Rpb25zLCB0dXJuaW5nXG4gKiB0aGVtIGludG8gYXN5bmNocm9ub3VzIGdlbmVyYXRvcnMuICBBbHRob3VnaCBnZW5lcmF0b3JzIGFyZSBvbmx5IHBhcnRcbiAqIG9mIHRoZSBuZXdlc3QgRUNNQVNjcmlwdCA2IGRyYWZ0cywgdGhpcyBjb2RlIGRvZXMgbm90IGNhdXNlIHN5bnRheFxuICogZXJyb3JzIGluIG9sZGVyIGVuZ2luZXMuICBUaGlzIGNvZGUgc2hvdWxkIGNvbnRpbnVlIHRvIHdvcmsgYW5kIHdpbGxcbiAqIGluIGZhY3QgaW1wcm92ZSBvdmVyIHRpbWUgYXMgdGhlIGxhbmd1YWdlIGltcHJvdmVzLlxuICpcbiAqIEVTNiBnZW5lcmF0b3JzIGFyZSBjdXJyZW50bHkgcGFydCBvZiBWOCB2ZXJzaW9uIDMuMTkgd2l0aCB0aGVcbiAqIC0taGFybW9ueS1nZW5lcmF0b3JzIHJ1bnRpbWUgZmxhZyBlbmFibGVkLiAgU3BpZGVyTW9ua2V5IGhhcyBoYWQgdGhlbVxuICogZm9yIGxvbmdlciwgYnV0IHVuZGVyIGFuIG9sZGVyIFB5dGhvbi1pbnNwaXJlZCBmb3JtLiAgVGhpcyBmdW5jdGlvblxuICogd29ya3Mgb24gYm90aCBraW5kcyBvZiBnZW5lcmF0b3JzLlxuICpcbiAqIERlY29yYXRlcyBhIGdlbmVyYXRvciBmdW5jdGlvbiBzdWNoIHRoYXQ6XG4gKiAgLSBpdCBtYXkgeWllbGQgcHJvbWlzZXNcbiAqICAtIGV4ZWN1dGlvbiB3aWxsIGNvbnRpbnVlIHdoZW4gdGhhdCBwcm9taXNlIGlzIGZ1bGZpbGxlZFxuICogIC0gdGhlIHZhbHVlIG9mIHRoZSB5aWVsZCBleHByZXNzaW9uIHdpbGwgYmUgdGhlIGZ1bGZpbGxlZCB2YWx1ZVxuICogIC0gaXQgcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWUgKHdoZW4gdGhlIGdlbmVyYXRvclxuICogICAgc3RvcHMgaXRlcmF0aW5nKVxuICogIC0gdGhlIGRlY29yYXRlZCBmdW5jdGlvbiByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICogICAgb2YgdGhlIGdlbmVyYXRvciBvciB0aGUgZmlyc3QgcmVqZWN0ZWQgcHJvbWlzZSBhbW9uZyB0aG9zZVxuICogICAgeWllbGRlZC5cbiAqICAtIGlmIGFuIGVycm9yIGlzIHRocm93biBpbiB0aGUgZ2VuZXJhdG9yLCBpdCBwcm9wYWdhdGVzIHRocm91Z2hcbiAqICAgIGV2ZXJ5IGZvbGxvd2luZyB5aWVsZCB1bnRpbCBpdCBpcyBjYXVnaHQsIG9yIHVudGlsIGl0IGVzY2FwZXNcbiAqICAgIHRoZSBnZW5lcmF0b3IgZnVuY3Rpb24gYWx0b2dldGhlciwgYW5kIGlzIHRyYW5zbGF0ZWQgaW50byBhXG4gKiAgICByZWplY3Rpb24gZm9yIHRoZSBwcm9taXNlIHJldHVybmVkIGJ5IHRoZSBkZWNvcmF0ZWQgZ2VuZXJhdG9yLlxuICovXG5RLmFzeW5jID0gYXN5bmM7XG5mdW5jdGlvbiBhc3luYyhtYWtlR2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gd2hlbiB2ZXJiIGlzIFwic2VuZFwiLCBhcmcgaXMgYSB2YWx1ZVxuICAgICAgICAvLyB3aGVuIHZlcmIgaXMgXCJ0aHJvd1wiLCBhcmcgaXMgYW4gZXhjZXB0aW9uXG4gICAgICAgIGZ1bmN0aW9uIGNvbnRpbnVlcih2ZXJiLCBhcmcpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgICAgIC8vIFVudGlsIFY4IDMuMTkgLyBDaHJvbWl1bSAyOSBpcyByZWxlYXNlZCwgU3BpZGVyTW9ua2V5IGlzIHRoZSBvbmx5XG4gICAgICAgICAgICAvLyBlbmdpbmUgdGhhdCBoYXMgYSBkZXBsb3llZCBiYXNlIG9mIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBnZW5lcmF0b3JzLlxuICAgICAgICAgICAgLy8gSG93ZXZlciwgU00ncyBnZW5lcmF0b3JzIHVzZSB0aGUgUHl0aG9uLWluc3BpcmVkIHNlbWFudGljcyBvZlxuICAgICAgICAgICAgLy8gb3V0ZGF0ZWQgRVM2IGRyYWZ0cy4gIFdlIHdvdWxkIGxpa2UgdG8gc3VwcG9ydCBFUzYsIGJ1dCB3ZSdkIGFsc29cbiAgICAgICAgICAgIC8vIGxpa2UgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byB1c2UgZ2VuZXJhdG9ycyBpbiBkZXBsb3llZCBicm93c2Vycywgc29cbiAgICAgICAgICAgIC8vIHdlIGFsc28gc3VwcG9ydCBQeXRob24tc3R5bGUgZ2VuZXJhdG9ycy4gIEF0IHNvbWUgcG9pbnQgd2UgY2FuIHJlbW92ZVxuICAgICAgICAgICAgLy8gdGhpcyBibG9jay5cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBTdG9wSXRlcmF0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgLy8gRVM2IEdlbmVyYXRvcnNcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBnZW5lcmF0b3JbdmVyYl0oYXJnKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChleGNlcHRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFEocmVzdWx0LnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2hlbihyZXN1bHQudmFsdWUsIGNhbGxiYWNrLCBlcnJiYWNrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFNwaWRlck1vbmtleSBHZW5lcmF0b3JzXG4gICAgICAgICAgICAgICAgLy8gRklYTUU6IFJlbW92ZSB0aGlzIGNhc2Ugd2hlbiBTTSBkb2VzIEVTNiBnZW5lcmF0b3JzLlxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGdlbmVyYXRvclt2ZXJiXShhcmcpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTdG9wSXRlcmF0aW9uKGV4Y2VwdGlvbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBRKGV4Y2VwdGlvbi52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHdoZW4ocmVzdWx0LCBjYWxsYmFjaywgZXJyYmFjayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGdlbmVyYXRvciA9IG1ha2VHZW5lcmF0b3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gY29udGludWVyLmJpbmQoY29udGludWVyLCBcIm5leHRcIik7XG4gICAgICAgIHZhciBlcnJiYWNrID0gY29udGludWVyLmJpbmQoY29udGludWVyLCBcInRocm93XCIpO1xuICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICB9O1xufVxuXG4vKipcbiAqIFRoZSBzcGF3biBmdW5jdGlvbiBpcyBhIHNtYWxsIHdyYXBwZXIgYXJvdW5kIGFzeW5jIHRoYXQgaW1tZWRpYXRlbHlcbiAqIGNhbGxzIHRoZSBnZW5lcmF0b3IgYW5kIGFsc28gZW5kcyB0aGUgcHJvbWlzZSBjaGFpbiwgc28gdGhhdCBhbnlcbiAqIHVuaGFuZGxlZCBlcnJvcnMgYXJlIHRocm93biBpbnN0ZWFkIG9mIGZvcndhcmRlZCB0byB0aGUgZXJyb3JcbiAqIGhhbmRsZXIuIFRoaXMgaXMgdXNlZnVsIGJlY2F1c2UgaXQncyBleHRyZW1lbHkgY29tbW9uIHRvIHJ1blxuICogZ2VuZXJhdG9ycyBhdCB0aGUgdG9wLWxldmVsIHRvIHdvcmsgd2l0aCBsaWJyYXJpZXMuXG4gKi9cblEuc3Bhd24gPSBzcGF3bjtcbmZ1bmN0aW9uIHNwYXduKG1ha2VHZW5lcmF0b3IpIHtcbiAgICBRLmRvbmUoUS5hc3luYyhtYWtlR2VuZXJhdG9yKSgpKTtcbn1cblxuLy8gRklYTUU6IFJlbW92ZSB0aGlzIGludGVyZmFjZSBvbmNlIEVTNiBnZW5lcmF0b3JzIGFyZSBpbiBTcGlkZXJNb25rZXkuXG4vKipcbiAqIFRocm93cyBhIFJldHVyblZhbHVlIGV4Y2VwdGlvbiB0byBzdG9wIGFuIGFzeW5jaHJvbm91cyBnZW5lcmF0b3IuXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgaXMgYSBzdG9wLWdhcCBtZWFzdXJlIHRvIHN1cHBvcnQgZ2VuZXJhdG9yIHJldHVyblxuICogdmFsdWVzIGluIG9sZGVyIEZpcmVmb3gvU3BpZGVyTW9ua2V5LiAgSW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEVTNlxuICogZ2VuZXJhdG9ycyBsaWtlIENocm9taXVtIDI5LCBqdXN0IHVzZSBcInJldHVyblwiIGluIHlvdXIgZ2VuZXJhdG9yXG4gKiBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHZhbHVlIHRoZSByZXR1cm4gdmFsdWUgZm9yIHRoZSBzdXJyb3VuZGluZyBnZW5lcmF0b3JcbiAqIEB0aHJvd3MgUmV0dXJuVmFsdWUgZXhjZXB0aW9uIHdpdGggdGhlIHZhbHVlLlxuICogQGV4YW1wbGVcbiAqIC8vIEVTNiBzdHlsZVxuICogUS5hc3luYyhmdW5jdGlvbiogKCkge1xuICogICAgICB2YXIgZm9vID0geWllbGQgZ2V0Rm9vUHJvbWlzZSgpO1xuICogICAgICB2YXIgYmFyID0geWllbGQgZ2V0QmFyUHJvbWlzZSgpO1xuICogICAgICByZXR1cm4gZm9vICsgYmFyO1xuICogfSlcbiAqIC8vIE9sZGVyIFNwaWRlck1vbmtleSBzdHlsZVxuICogUS5hc3luYyhmdW5jdGlvbiAoKSB7XG4gKiAgICAgIHZhciBmb28gPSB5aWVsZCBnZXRGb29Qcm9taXNlKCk7XG4gKiAgICAgIHZhciBiYXIgPSB5aWVsZCBnZXRCYXJQcm9taXNlKCk7XG4gKiAgICAgIFEucmV0dXJuKGZvbyArIGJhcik7XG4gKiB9KVxuICovXG5RW1wicmV0dXJuXCJdID0gX3JldHVybjtcbmZ1bmN0aW9uIF9yZXR1cm4odmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgUVJldHVyblZhbHVlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgcHJvbWlzZWQgZnVuY3Rpb24gZGVjb3JhdG9yIGVuc3VyZXMgdGhhdCBhbnkgcHJvbWlzZSBhcmd1bWVudHNcbiAqIGFyZSBzZXR0bGVkIGFuZCBwYXNzZWQgYXMgdmFsdWVzIChgdGhpc2AgaXMgYWxzbyBzZXR0bGVkIGFuZCBwYXNzZWRcbiAqIGFzIGEgdmFsdWUpLiAgSXQgd2lsbCBhbHNvIGVuc3VyZSB0aGF0IHRoZSByZXN1bHQgb2YgYSBmdW5jdGlvbiBpc1xuICogYWx3YXlzIGEgcHJvbWlzZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGFkZCA9IFEucHJvbWlzZWQoZnVuY3Rpb24gKGEsIGIpIHtcbiAqICAgICByZXR1cm4gYSArIGI7XG4gKiB9KTtcbiAqIGFkZChRKGEpLCBRKEIpKTtcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBUaGUgZnVuY3Rpb24gdG8gZGVjb3JhdGVcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn0gYSBmdW5jdGlvbiB0aGF0IGhhcyBiZWVuIGRlY29yYXRlZC5cbiAqL1xuUS5wcm9taXNlZCA9IHByb21pc2VkO1xuZnVuY3Rpb24gcHJvbWlzZWQoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3ByZWFkKFt0aGlzLCBhbGwoYXJndW1lbnRzKV0sIGZ1bmN0aW9uIChzZWxmLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2suYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cbi8qKlxuICogc2VuZHMgYSBtZXNzYWdlIHRvIGEgdmFsdWUgaW4gYSBmdXR1cmUgdHVyblxuICogQHBhcmFtIG9iamVjdCogdGhlIHJlY2lwaWVudFxuICogQHBhcmFtIG9wIHRoZSBuYW1lIG9mIHRoZSBtZXNzYWdlIG9wZXJhdGlvbiwgZS5nLiwgXCJ3aGVuXCIsXG4gKiBAcGFyYW0gYXJncyBmdXJ0aGVyIGFyZ3VtZW50cyB0byBiZSBmb3J3YXJkZWQgdG8gdGhlIG9wZXJhdGlvblxuICogQHJldHVybnMgcmVzdWx0IHtQcm9taXNlfSBhIHByb21pc2UgZm9yIHRoZSByZXN1bHQgb2YgdGhlIG9wZXJhdGlvblxuICovXG5RLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG5mdW5jdGlvbiBkaXNwYXRjaChvYmplY3QsIG9wLCBhcmdzKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kaXNwYXRjaChvcCwgYXJncyk7XG59XG5cblByb21pc2UucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gKG9wLCBhcmdzKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgUS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucHJvbWlzZURpc3BhdGNoKGRlZmVycmVkLnJlc29sdmUsIG9wLCBhcmdzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBwcm9wZXJ0eSB0byBnZXRcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHByb3BlcnR5IHZhbHVlXG4gKi9cblEuZ2V0ID0gZnVuY3Rpb24gKG9iamVjdCwga2V5KSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kaXNwYXRjaChcImdldFwiLCBba2V5XSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJnZXRcIiwgW2tleV0pO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3Igb2JqZWN0IG9iamVjdFxuICogQHBhcmFtIG5hbWUgICAgICBuYW1lIG9mIHByb3BlcnR5IHRvIHNldFxuICogQHBhcmFtIHZhbHVlICAgICBuZXcgdmFsdWUgb2YgcHJvcGVydHlcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICovXG5RLnNldCA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwic2V0XCIsIFtrZXksIHZhbHVlXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwic2V0XCIsIFtrZXksIHZhbHVlXSk7XG59O1xuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBwcm9wZXJ0eSB0byBkZWxldGVcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICovXG5RLmRlbCA9IC8vIFhYWCBsZWdhY3lcblFbXCJkZWxldGVcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwiZGVsZXRlXCIsIFtrZXldKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmRlbCA9IC8vIFhYWCBsZWdhY3lcblByb21pc2UucHJvdG90eXBlW1wiZGVsZXRlXCJdID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwiZGVsZXRlXCIsIFtrZXldKTtcbn07XG5cbi8qKlxuICogSW52b2tlcyBhIG1ldGhvZCBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBtZXRob2QgdG8gaW52b2tlXG4gKiBAcGFyYW0gdmFsdWUgICAgIGEgdmFsdWUgdG8gcG9zdCwgdHlwaWNhbGx5IGFuIGFycmF5IG9mXG4gKiAgICAgICAgICAgICAgICAgIGludm9jYXRpb24gYXJndW1lbnRzIGZvciBwcm9taXNlcyB0aGF0XG4gKiAgICAgICAgICAgICAgICAgIGFyZSB1bHRpbWF0ZWx5IGJhY2tlZCB3aXRoIGByZXNvbHZlYCB2YWx1ZXMsXG4gKiAgICAgICAgICAgICAgICAgIGFzIG9wcG9zZWQgdG8gdGhvc2UgYmFja2VkIHdpdGggVVJMc1xuICogICAgICAgICAgICAgICAgICB3aGVyZWluIHRoZSBwb3N0ZWQgdmFsdWUgY2FuIGJlIGFueVxuICogICAgICAgICAgICAgICAgICBKU09OIHNlcmlhbGl6YWJsZSBvYmplY3QuXG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWVcbiAqL1xuLy8gYm91bmQgbG9jYWxseSBiZWNhdXNlIGl0IGlzIHVzZWQgYnkgb3RoZXIgbWV0aG9kc1xuUS5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUS5wb3N0ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcmdzXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUHJvbWlzZS5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcmdzXSk7XG59O1xuXG4vKipcbiAqIEludm9rZXMgYSBtZXRob2QgaW4gYSBmdXR1cmUgdHVybi5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgb2JqZWN0XG4gKiBAcGFyYW0gbmFtZSAgICAgIG5hbWUgb2YgbWV0aG9kIHRvIGludm9rZVxuICogQHBhcmFtIC4uLmFyZ3MgICBhcnJheSBvZiBpbnZvY2F0aW9uIGFyZ3VtZW50c1xuICogQHJldHVybiBwcm9taXNlIGZvciB0aGUgcmV0dXJuIHZhbHVlXG4gKi9cblEuc2VuZCA9IC8vIFhYWCBNYXJrIE1pbGxlcidzIHByb3Bvc2VkIHBhcmxhbmNlXG5RLm1jYWxsID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblEuaW52b2tlID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSAvKi4uLmFyZ3MqLykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDIpXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5zZW5kID0gLy8gWFhYIE1hcmsgTWlsbGVyJ3MgcHJvcG9zZWQgcGFybGFuY2VcblByb21pc2UucHJvdG90eXBlLm1jYWxsID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblByb21pc2UucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uIChuYW1lIC8qLi4uYXJncyovKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpXSk7XG59O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIHByb21pc2VkIGZ1bmN0aW9uIGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3IgdGFyZ2V0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gYXJncyAgICAgIGFycmF5IG9mIGFwcGxpY2F0aW9uIGFyZ3VtZW50c1xuICovXG5RLmZhcHBseSA9IGZ1bmN0aW9uIChvYmplY3QsIGFyZ3MpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwiYXBwbHlcIiwgW3ZvaWQgMCwgYXJnc10pO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZmFwcGx5ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaChcImFwcGx5XCIsIFt2b2lkIDAsIGFyZ3NdKTtcbn07XG5cbi8qKlxuICogQ2FsbHMgdGhlIHByb21pc2VkIGZ1bmN0aW9uIGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3IgdGFyZ2V0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gLi4uYXJncyAgIGFycmF5IG9mIGFwcGxpY2F0aW9uIGFyZ3VtZW50c1xuICovXG5RW1widHJ5XCJdID1cblEuZmNhbGwgPSBmdW5jdGlvbiAob2JqZWN0IC8qIC4uLmFyZ3MqLykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJhcHBseVwiLCBbdm9pZCAwLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5mY2FsbCA9IGZ1bmN0aW9uICgvKi4uLmFyZ3MqLykge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwiYXBwbHlcIiwgW3ZvaWQgMCwgYXJyYXlfc2xpY2UoYXJndW1lbnRzKV0pO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcHJvbWlzZWQgZnVuY3Rpb24sIHRyYW5zZm9ybWluZyByZXR1cm4gdmFsdWVzIGludG8gYSBmdWxmaWxsZWRcbiAqIHByb21pc2UgYW5kIHRocm93biBlcnJvcnMgaW50byBhIHJlamVjdGVkIG9uZS5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgZnVuY3Rpb25cbiAqIEBwYXJhbSAuLi5hcmdzICAgYXJyYXkgb2YgYXBwbGljYXRpb24gYXJndW1lbnRzXG4gKi9cblEuZmJpbmQgPSBmdW5jdGlvbiAob2JqZWN0IC8qLi4uYXJncyovKSB7XG4gICAgdmFyIHByb21pc2UgPSBRKG9iamVjdCk7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbiBmYm91bmQoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmRpc3BhdGNoKFwiYXBwbHlcIiwgW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpXG4gICAgICAgIF0pO1xuICAgIH07XG59O1xuUHJvbWlzZS5wcm90b3R5cGUuZmJpbmQgPSBmdW5jdGlvbiAoLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgIHJldHVybiBmdW5jdGlvbiBmYm91bmQoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmRpc3BhdGNoKFwiYXBwbHlcIiwgW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpXG4gICAgICAgIF0pO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJlcXVlc3RzIHRoZSBuYW1lcyBvZiB0aGUgb3duZWQgcHJvcGVydGllcyBvZiBhIHByb21pc2VkXG4gKiBvYmplY3QgaW4gYSBmdXR1cmUgdHVybi5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSBrZXlzIG9mIHRoZSBldmVudHVhbGx5IHNldHRsZWQgb2JqZWN0XG4gKi9cblEua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwia2V5c1wiLCBbXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwia2V5c1wiLCBbXSk7XG59O1xuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIHByb21pc2VzIGludG8gYSBwcm9taXNlIGZvciBhbiBhcnJheS4gIElmIGFueSBvZlxuICogdGhlIHByb21pc2VzIGdldHMgcmVqZWN0ZWQsIHRoZSB3aG9sZSBhcnJheSBpcyByZWplY3RlZCBpbW1lZGlhdGVseS5cbiAqIEBwYXJhbSB7QXJyYXkqfSBhbiBhcnJheSAob3IgcHJvbWlzZSBmb3IgYW4gYXJyYXkpIG9mIHZhbHVlcyAob3JcbiAqIHByb21pc2VzIGZvciB2YWx1ZXMpXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIGFuIGFycmF5IG9mIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlc1xuICovXG4vLyBCeSBNYXJrIE1pbGxlclxuLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9c3RyYXdtYW46Y29uY3VycmVuY3kmcmV2PTEzMDg3NzY1MjEjYWxsZnVsZmlsbGVkXG5RLmFsbCA9IGFsbDtcbmZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICAgIHJldHVybiB3aGVuKHByb21pc2VzLCBmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgICAgICAgdmFyIHBlbmRpbmdDb3VudCA9IDA7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgICAgIGFycmF5X3JlZHVjZShwcm9taXNlcywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgcHJvbWlzZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzbmFwc2hvdDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpc1Byb21pc2UocHJvbWlzZSkgJiZcbiAgICAgICAgICAgICAgICAoc25hcHNob3QgPSBwcm9taXNlLmluc3BlY3QoKSkuc3RhdGUgPT09IFwiZnVsZmlsbGVkXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IHNuYXBzaG90LnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICArK3BlbmRpbmdDb3VudDtcbiAgICAgICAgICAgICAgICB3aGVuKFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0tcGVuZGluZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnkoeyBpbmRleDogaW5kZXgsIHZhbHVlOiBwcm9ncmVzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICAgIGlmIChwZW5kaW5nQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJvbWlzZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0pO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFsbCh0aGlzKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3QgcmVzb2x2ZWQgcHJvbWlzZSBvZiBhbiBhcnJheS4gUHJpb3IgcmVqZWN0ZWQgcHJvbWlzZXMgYXJlXG4gKiBpZ25vcmVkLiAgUmVqZWN0cyBvbmx5IGlmIGFsbCBwcm9taXNlcyBhcmUgcmVqZWN0ZWQuXG4gKiBAcGFyYW0ge0FycmF5Kn0gYW4gYXJyYXkgY29udGFpbmluZyB2YWx1ZXMgb3IgcHJvbWlzZXMgZm9yIHZhbHVlc1xuICogQHJldHVybnMgYSBwcm9taXNlIGZ1bGZpbGxlZCB3aXRoIHRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgcmVzb2x2ZWQgcHJvbWlzZSxcbiAqIG9yIGEgcmVqZWN0ZWQgcHJvbWlzZSBpZiBhbGwgcHJvbWlzZXMgYXJlIHJlamVjdGVkLlxuICovXG5RLmFueSA9IGFueTtcblxuZnVuY3Rpb24gYW55KHByb21pc2VzKSB7XG4gICAgaWYgKHByb21pc2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gUS5yZXNvbHZlKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHZhciBwZW5kaW5nQ291bnQgPSAwO1xuICAgIGFycmF5X3JlZHVjZShwcm9taXNlcywgZnVuY3Rpb24gKHByZXYsIGN1cnJlbnQsIGluZGV4KSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gcHJvbWlzZXNbaW5kZXhdO1xuXG4gICAgICAgIHBlbmRpbmdDb3VudCsrO1xuXG4gICAgICAgIHdoZW4ocHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQsIG9uUHJvZ3Jlc3MpO1xuICAgICAgICBmdW5jdGlvbiBvbkZ1bGZpbGxlZChyZXN1bHQpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBvblJlamVjdGVkKGVycikge1xuICAgICAgICAgICAgcGVuZGluZ0NvdW50LS07XG4gICAgICAgICAgICBpZiAocGVuZGluZ0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlamVjdGlvbiA9IGVyciB8fCBuZXcgRXJyb3IoXCJcIiArIGVycik7XG5cbiAgICAgICAgICAgICAgICByZWplY3Rpb24ubWVzc2FnZSA9IChcIlEgY2FuJ3QgZ2V0IGZ1bGZpbGxtZW50IHZhbHVlIGZyb20gYW55IHByb21pc2UsIGFsbCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwicHJvbWlzZXMgd2VyZSByZWplY3RlZC4gTGFzdCBlcnJvciBtZXNzYWdlOiBcIiArIHJlamVjdGlvbi5tZXNzYWdlKTtcblxuICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdChyZWplY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIG9uUHJvZ3Jlc3MocHJvZ3Jlc3MpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLm5vdGlmeSh7XG4gICAgICAgICAgICAgICAgaW5kZXg6IGluZGV4LFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwcm9ncmVzc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9LCB1bmRlZmluZWQpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cblByb21pc2UucHJvdG90eXBlLmFueSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gYW55KHRoaXMpO1xufTtcblxuLyoqXG4gKiBXYWl0cyBmb3IgYWxsIHByb21pc2VzIHRvIGJlIHNldHRsZWQsIGVpdGhlciBmdWxmaWxsZWQgb3JcbiAqIHJlamVjdGVkLiAgVGhpcyBpcyBkaXN0aW5jdCBmcm9tIGBhbGxgIHNpbmNlIHRoYXQgd291bGQgc3RvcFxuICogd2FpdGluZyBhdCB0aGUgZmlyc3QgcmVqZWN0aW9uLiAgVGhlIHByb21pc2UgcmV0dXJuZWQgYnlcbiAqIGBhbGxSZXNvbHZlZGAgd2lsbCBuZXZlciBiZSByZWplY3RlZC5cbiAqIEBwYXJhbSBwcm9taXNlcyBhIHByb21pc2UgZm9yIGFuIGFycmF5IChvciBhbiBhcnJheSkgb2YgcHJvbWlzZXNcbiAqIChvciB2YWx1ZXMpXG4gKiBAcmV0dXJuIGEgcHJvbWlzZSBmb3IgYW4gYXJyYXkgb2YgcHJvbWlzZXNcbiAqL1xuUS5hbGxSZXNvbHZlZCA9IGRlcHJlY2F0ZShhbGxSZXNvbHZlZCwgXCJhbGxSZXNvbHZlZFwiLCBcImFsbFNldHRsZWRcIik7XG5mdW5jdGlvbiBhbGxSZXNvbHZlZChwcm9taXNlcykge1xuICAgIHJldHVybiB3aGVuKHByb21pc2VzLCBmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgICAgICAgcHJvbWlzZXMgPSBhcnJheV9tYXAocHJvbWlzZXMsIFEpO1xuICAgICAgICByZXR1cm4gd2hlbihhbGwoYXJyYXlfbWFwKHByb21pc2VzLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuIHdoZW4ocHJvbWlzZSwgbm9vcCwgbm9vcCk7XG4gICAgICAgIH0pKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2VzO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuYWxsUmVzb2x2ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFsbFJlc29sdmVkKHRoaXMpO1xufTtcblxuLyoqXG4gKiBAc2VlIFByb21pc2UjYWxsU2V0dGxlZFxuICovXG5RLmFsbFNldHRsZWQgPSBhbGxTZXR0bGVkO1xuZnVuY3Rpb24gYWxsU2V0dGxlZChwcm9taXNlcykge1xuICAgIHJldHVybiBRKHByb21pc2VzKS5hbGxTZXR0bGVkKCk7XG59XG5cbi8qKlxuICogVHVybnMgYW4gYXJyYXkgb2YgcHJvbWlzZXMgaW50byBhIHByb21pc2UgZm9yIGFuIGFycmF5IG9mIHRoZWlyIHN0YXRlcyAoYXNcbiAqIHJldHVybmVkIGJ5IGBpbnNwZWN0YCkgd2hlbiB0aGV5IGhhdmUgYWxsIHNldHRsZWQuXG4gKiBAcGFyYW0ge0FycmF5W0FueSpdfSB2YWx1ZXMgYW4gYXJyYXkgKG9yIHByb21pc2UgZm9yIGFuIGFycmF5KSBvZiB2YWx1ZXMgKG9yXG4gKiBwcm9taXNlcyBmb3IgdmFsdWVzKVxuICogQHJldHVybnMge0FycmF5W1N0YXRlXX0gYW4gYXJyYXkgb2Ygc3RhdGVzIGZvciB0aGUgcmVzcGVjdGl2ZSB2YWx1ZXMuXG4gKi9cblByb21pc2UucHJvdG90eXBlLmFsbFNldHRsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgICAgICAgcmV0dXJuIGFsbChhcnJheV9tYXAocHJvbWlzZXMsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgICAgICBwcm9taXNlID0gUShwcm9taXNlKTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlZ2FyZGxlc3MoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2UuaW5zcGVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihyZWdhcmRsZXNzLCByZWdhcmRsZXNzKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBDYXB0dXJlcyB0aGUgZmFpbHVyZSBvZiBhIHByb21pc2UsIGdpdmluZyBhbiBvcG9ydHVuaXR5IHRvIHJlY292ZXJcbiAqIHdpdGggYSBjYWxsYmFjay4gIElmIHRoZSBnaXZlbiBwcm9taXNlIGlzIGZ1bGZpbGxlZCwgdGhlIHJldHVybmVkXG4gKiBwcm9taXNlIGlzIGZ1bGZpbGxlZC5cbiAqIEBwYXJhbSB7QW55Kn0gcHJvbWlzZSBmb3Igc29tZXRoaW5nXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayB0byBmdWxmaWxsIHRoZSByZXR1cm5lZCBwcm9taXNlIGlmIHRoZVxuICogZ2l2ZW4gcHJvbWlzZSBpcyByZWplY3RlZFxuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZSBjYWxsYmFja1xuICovXG5RLmZhaWwgPSAvLyBYWFggbGVnYWN5XG5RW1wiY2F0Y2hcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCByZWplY3RlZCkge1xuICAgIHJldHVybiBRKG9iamVjdCkudGhlbih2b2lkIDAsIHJlamVjdGVkKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmZhaWwgPSAvLyBYWFggbGVnYWN5XG5Qcm9taXNlLnByb3RvdHlwZVtcImNhdGNoXCJdID0gZnVuY3Rpb24gKHJlamVjdGVkKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbih2b2lkIDAsIHJlamVjdGVkKTtcbn07XG5cbi8qKlxuICogQXR0YWNoZXMgYSBsaXN0ZW5lciB0aGF0IGNhbiByZXNwb25kIHRvIHByb2dyZXNzIG5vdGlmaWNhdGlvbnMgZnJvbSBhXG4gKiBwcm9taXNlJ3Mgb3JpZ2luYXRpbmcgZGVmZXJyZWQuIFRoaXMgbGlzdGVuZXIgcmVjZWl2ZXMgdGhlIGV4YWN0IGFyZ3VtZW50c1xuICogcGFzc2VkIHRvIGBgZGVmZXJyZWQubm90aWZ5YGAuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2UgZm9yIHNvbWV0aGluZ1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgdG8gcmVjZWl2ZSBhbnkgcHJvZ3Jlc3Mgbm90aWZpY2F0aW9uc1xuICogQHJldHVybnMgdGhlIGdpdmVuIHByb21pc2UsIHVuY2hhbmdlZFxuICovXG5RLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG5mdW5jdGlvbiBwcm9ncmVzcyhvYmplY3QsIHByb2dyZXNzZWQpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLnRoZW4odm9pZCAwLCB2b2lkIDAsIHByb2dyZXNzZWQpO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5wcm9ncmVzcyA9IGZ1bmN0aW9uIChwcm9ncmVzc2VkKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbih2b2lkIDAsIHZvaWQgMCwgcHJvZ3Jlc3NlZCk7XG59O1xuXG4vKipcbiAqIFByb3ZpZGVzIGFuIG9wcG9ydHVuaXR5IHRvIG9ic2VydmUgdGhlIHNldHRsaW5nIG9mIGEgcHJvbWlzZSxcbiAqIHJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGUgcHJvbWlzZSBpcyBmdWxmaWxsZWQgb3IgcmVqZWN0ZWQuICBGb3J3YXJkc1xuICogdGhlIHJlc29sdXRpb24gdG8gdGhlIHJldHVybmVkIHByb21pc2Ugd2hlbiB0aGUgY2FsbGJhY2sgaXMgZG9uZS5cbiAqIFRoZSBjYWxsYmFjayBjYW4gcmV0dXJuIGEgcHJvbWlzZSB0byBkZWZlciBjb21wbGV0aW9uLlxuICogQHBhcmFtIHtBbnkqfSBwcm9taXNlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayB0byBvYnNlcnZlIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBnaXZlblxuICogcHJvbWlzZSwgdGFrZXMgbm8gYXJndW1lbnRzLlxuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgZ2l2ZW4gcHJvbWlzZSB3aGVuXG4gKiBgYGZpbmBgIGlzIGRvbmUuXG4gKi9cblEuZmluID0gLy8gWFhYIGxlZ2FjeVxuUVtcImZpbmFsbHlcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBjYWxsYmFjaykge1xuICAgIHJldHVybiBRKG9iamVjdClbXCJmaW5hbGx5XCJdKGNhbGxiYWNrKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmZpbiA9IC8vIFhYWCBsZWdhY3lcblByb21pc2UucHJvdG90eXBlW1wiZmluYWxseVwiXSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIGlmICghY2FsbGJhY2sgfHwgdHlwZW9mIGNhbGxiYWNrLmFwcGx5ICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUSBjYW4ndCBhcHBseSBmaW5hbGx5IGNhbGxiYWNrXCIpO1xuICAgIH1cbiAgICBjYWxsYmFjayA9IFEoY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5mY2FsbCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRPRE8gYXR0ZW1wdCB0byByZWN5Y2xlIHRoZSByZWplY3Rpb24gd2l0aCBcInRoaXNcIi5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmZjYWxsKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBUZXJtaW5hdGVzIGEgY2hhaW4gb2YgcHJvbWlzZXMsIGZvcmNpbmcgcmVqZWN0aW9ucyB0byBiZVxuICogdGhyb3duIGFzIGV4Y2VwdGlvbnMuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2UgYXQgdGhlIGVuZCBvZiBhIGNoYWluIG9mIHByb21pc2VzXG4gKiBAcmV0dXJucyBub3RoaW5nXG4gKi9cblEuZG9uZSA9IGZ1bmN0aW9uIChvYmplY3QsIGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kb25lKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiAoZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3MpIHtcbiAgICB2YXIgb25VbmhhbmRsZWRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAvLyBmb3J3YXJkIHRvIGEgZnV0dXJlIHR1cm4gc28gdGhhdCBgYHdoZW5gYFxuICAgICAgICAvLyBkb2VzIG5vdCBjYXRjaCBpdCBhbmQgdHVybiBpdCBpbnRvIGEgcmVqZWN0aW9uLlxuICAgICAgICBRLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG1ha2VTdGFja1RyYWNlTG9uZyhlcnJvciwgcHJvbWlzZSk7XG4gICAgICAgICAgICBpZiAoUS5vbmVycm9yKSB7XG4gICAgICAgICAgICAgICAgUS5vbmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBgbmV4dFRpY2tgaW5nIHZpYSBhbiB1bm5lY2Vzc2FyeSBgd2hlbmAuXG4gICAgdmFyIHByb21pc2UgPSBmdWxmaWxsZWQgfHwgcmVqZWN0ZWQgfHwgcHJvZ3Jlc3MgP1xuICAgICAgICB0aGlzLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3MpIDpcbiAgICAgICAgdGhpcztcblxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyA9PT0gXCJvYmplY3RcIiAmJiBwcm9jZXNzICYmIHByb2Nlc3MuZG9tYWluKSB7XG4gICAgICAgIG9uVW5oYW5kbGVkRXJyb3IgPSBwcm9jZXNzLmRvbWFpbi5iaW5kKG9uVW5oYW5kbGVkRXJyb3IpO1xuICAgIH1cblxuICAgIHByb21pc2UudGhlbih2b2lkIDAsIG9uVW5oYW5kbGVkRXJyb3IpO1xufTtcblxuLyoqXG4gKiBDYXVzZXMgYSBwcm9taXNlIHRvIGJlIHJlamVjdGVkIGlmIGl0IGRvZXMgbm90IGdldCBmdWxmaWxsZWQgYmVmb3JlXG4gKiBzb21lIG1pbGxpc2Vjb25kcyB0aW1lIG91dC5cbiAqIEBwYXJhbSB7QW55Kn0gcHJvbWlzZVxuICogQHBhcmFtIHtOdW1iZXJ9IG1pbGxpc2Vjb25kcyB0aW1lb3V0XG4gKiBAcGFyYW0ge0FueSp9IGN1c3RvbSBlcnJvciBtZXNzYWdlIG9yIEVycm9yIG9iamVjdCAob3B0aW9uYWwpXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBnaXZlbiBwcm9taXNlIGlmIGl0IGlzXG4gKiBmdWxmaWxsZWQgYmVmb3JlIHRoZSB0aW1lb3V0LCBvdGhlcndpc2UgcmVqZWN0ZWQuXG4gKi9cblEudGltZW91dCA9IGZ1bmN0aW9uIChvYmplY3QsIG1zLCBlcnJvcikge1xuICAgIHJldHVybiBRKG9iamVjdCkudGltZW91dChtcywgZXJyb3IpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uIChtcywgZXJyb3IpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIHZhciB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFlcnJvciB8fCBcInN0cmluZ1wiID09PSB0eXBlb2YgZXJyb3IpIHtcbiAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKGVycm9yIHx8IFwiVGltZWQgb3V0IGFmdGVyIFwiICsgbXMgKyBcIiBtc1wiKTtcbiAgICAgICAgICAgIGVycm9yLmNvZGUgPSBcIkVUSU1FRE9VVFwiO1xuICAgICAgICB9XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChlcnJvcik7XG4gICAgfSwgbXMpO1xuXG4gICAgdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSh2YWx1ZSk7XG4gICAgfSwgZnVuY3Rpb24gKGV4Y2VwdGlvbikge1xuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgfSwgZGVmZXJyZWQubm90aWZ5KTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIGdpdmVuIHZhbHVlIChvciBwcm9taXNlZCB2YWx1ZSksIHNvbWVcbiAqIG1pbGxpc2Vjb25kcyBhZnRlciBpdCByZXNvbHZlZC4gUGFzc2VzIHJlamVjdGlvbnMgaW1tZWRpYXRlbHkuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBtaWxsaXNlY29uZHNcbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlc29sdXRpb24gb2YgdGhlIGdpdmVuIHByb21pc2UgYWZ0ZXIgbWlsbGlzZWNvbmRzXG4gKiB0aW1lIGhhcyBlbGFwc2VkIHNpbmNlIHRoZSByZXNvbHV0aW9uIG9mIHRoZSBnaXZlbiBwcm9taXNlLlxuICogSWYgdGhlIGdpdmVuIHByb21pc2UgcmVqZWN0cywgdGhhdCBpcyBwYXNzZWQgaW1tZWRpYXRlbHkuXG4gKi9cblEuZGVsYXkgPSBmdW5jdGlvbiAob2JqZWN0LCB0aW1lb3V0KSB7XG4gICAgaWYgKHRpbWVvdXQgPT09IHZvaWQgMCkge1xuICAgICAgICB0aW1lb3V0ID0gb2JqZWN0O1xuICAgICAgICBvYmplY3QgPSB2b2lkIDA7XG4gICAgfVxuICAgIHJldHVybiBRKG9iamVjdCkuZGVsYXkodGltZW91dCk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5kZWxheSA9IGZ1bmN0aW9uICh0aW1lb3V0KSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfSwgdGltZW91dCk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBQYXNzZXMgYSBjb250aW51YXRpb24gdG8gYSBOb2RlIGZ1bmN0aW9uLCB3aGljaCBpcyBjYWxsZWQgd2l0aCB0aGUgZ2l2ZW5cbiAqIGFyZ3VtZW50cyBwcm92aWRlZCBhcyBhbiBhcnJheSwgYW5kIHJldHVybnMgYSBwcm9taXNlLlxuICpcbiAqICAgICAgUS5uZmFwcGx5KEZTLnJlYWRGaWxlLCBbX19maWxlbmFtZV0pXG4gKiAgICAgIC50aGVuKGZ1bmN0aW9uIChjb250ZW50KSB7XG4gKiAgICAgIH0pXG4gKlxuICovXG5RLm5mYXBwbHkgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGFyZ3MpIHtcbiAgICByZXR1cm4gUShjYWxsYmFjaykubmZhcHBseShhcmdzKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLm5mYXBwbHkgPSBmdW5jdGlvbiAoYXJncykge1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgdmFyIG5vZGVBcmdzID0gYXJyYXlfc2xpY2UoYXJncyk7XG4gICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgIHRoaXMuZmFwcGx5KG5vZGVBcmdzKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIFBhc3NlcyBhIGNvbnRpbnVhdGlvbiB0byBhIE5vZGUgZnVuY3Rpb24sIHdoaWNoIGlzIGNhbGxlZCB3aXRoIHRoZSBnaXZlblxuICogYXJndW1lbnRzIHByb3ZpZGVkIGluZGl2aWR1YWxseSwgYW5kIHJldHVybnMgYSBwcm9taXNlLlxuICogQGV4YW1wbGVcbiAqIFEubmZjYWxsKEZTLnJlYWRGaWxlLCBfX2ZpbGVuYW1lKVxuICogLnRoZW4oZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAqIH0pXG4gKlxuICovXG5RLm5mY2FsbCA9IGZ1bmN0aW9uIChjYWxsYmFjayAvKi4uLmFyZ3MqLykge1xuICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICByZXR1cm4gUShjYWxsYmFjaykubmZhcHBseShhcmdzKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLm5mY2FsbCA9IGZ1bmN0aW9uICgvKi4uLmFyZ3MqLykge1xuICAgIHZhciBub2RlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cyk7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgdGhpcy5mYXBwbHkobm9kZUFyZ3MpLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogV3JhcHMgYSBOb2RlSlMgY29udGludWF0aW9uIHBhc3NpbmcgZnVuY3Rpb24gYW5kIHJldHVybnMgYW4gZXF1aXZhbGVudFxuICogdmVyc2lvbiB0aGF0IHJldHVybnMgYSBwcm9taXNlLlxuICogQGV4YW1wbGVcbiAqIFEubmZiaW5kKEZTLnJlYWRGaWxlLCBfX2ZpbGVuYW1lKShcInV0Zi04XCIpXG4gKiAudGhlbihjb25zb2xlLmxvZylcbiAqIC5kb25lKClcbiAqL1xuUS5uZmJpbmQgPVxuUS5kZW5vZGVpZnkgPSBmdW5jdGlvbiAoY2FsbGJhY2sgLyouLi5hcmdzKi8pIHtcbiAgICBpZiAoY2FsbGJhY2sgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJRIGNhbid0IHdyYXAgYW4gdW5kZWZpbmVkIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICB2YXIgYmFzZUFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlQXJncyA9IGJhc2VBcmdzLmNvbmNhdChhcnJheV9zbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICAgICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgICAgICBRKGNhbGxiYWNrKS5mYXBwbHkobm9kZUFyZ3MpLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLm5mYmluZCA9XG5Qcm9taXNlLnByb3RvdHlwZS5kZW5vZGVpZnkgPSBmdW5jdGlvbiAoLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cyk7XG4gICAgYXJncy51bnNoaWZ0KHRoaXMpO1xuICAgIHJldHVybiBRLmRlbm9kZWlmeS5hcHBseSh2b2lkIDAsIGFyZ3MpO1xufTtcblxuUS5uYmluZCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc3AgLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgYmFzZUFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDIpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBub2RlQXJncyA9IGJhc2VBcmdzLmNvbmNhdChhcnJheV9zbGljZShhcmd1bWVudHMpKTtcbiAgICAgICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICAgICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgICAgICBmdW5jdGlvbiBib3VuZCgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseSh0aGlzcCwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBRKGJvdW5kKS5mYXBwbHkobm9kZUFyZ3MpLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLm5iaW5kID0gZnVuY3Rpb24gKC8qdGhpc3AsIC4uLmFyZ3MqLykge1xuICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAwKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcyk7XG4gICAgcmV0dXJuIFEubmJpbmQuYXBwbHkodm9pZCAwLCBhcmdzKTtcbn07XG5cbi8qKlxuICogQ2FsbHMgYSBtZXRob2Qgb2YgYSBOb2RlLXN0eWxlIG9iamVjdCB0aGF0IGFjY2VwdHMgYSBOb2RlLXN0eWxlXG4gKiBjYWxsYmFjayB3aXRoIGEgZ2l2ZW4gYXJyYXkgb2YgYXJndW1lbnRzLCBwbHVzIGEgcHJvdmlkZWQgY2FsbGJhY2suXG4gKiBAcGFyYW0gb2JqZWN0IGFuIG9iamVjdCB0aGF0IGhhcyB0aGUgbmFtZWQgbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtZXRob2Qgb2Ygb2JqZWN0XG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIGFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBtZXRob2Q7IHRoZSBjYWxsYmFja1xuICogd2lsbCBiZSBwcm92aWRlZCBieSBRIGFuZCBhcHBlbmRlZCB0byB0aGVzZSBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSB2YWx1ZSBvciBlcnJvclxuICovXG5RLm5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUS5ucG9zdCA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIGFyZ3MpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLm5wb3N0KG5hbWUsIGFyZ3MpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubm1hcHBseSA9IC8vIFhYWCBBcyBwcm9wb3NlZCBieSBcIlJlZHNhbmRyb1wiXG5Qcm9taXNlLnByb3RvdHlwZS5ucG9zdCA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgdmFyIG5vZGVBcmdzID0gYXJyYXlfc2xpY2UoYXJncyB8fCBbXSk7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgdGhpcy5kaXNwYXRjaChcInBvc3RcIiwgW25hbWUsIG5vZGVBcmdzXSkuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLyoqXG4gKiBDYWxscyBhIG1ldGhvZCBvZiBhIE5vZGUtc3R5bGUgb2JqZWN0IHRoYXQgYWNjZXB0cyBhIE5vZGUtc3R5bGVcbiAqIGNhbGxiYWNrLCBmb3J3YXJkaW5nIHRoZSBnaXZlbiB2YXJpYWRpYyBhcmd1bWVudHMsIHBsdXMgYSBwcm92aWRlZFxuICogY2FsbGJhY2sgYXJndW1lbnQuXG4gKiBAcGFyYW0gb2JqZWN0IGFuIG9iamVjdCB0aGF0IGhhcyB0aGUgbmFtZWQgbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBuYW1lIG9mIHRoZSBtZXRob2Qgb2Ygb2JqZWN0XG4gKiBAcGFyYW0gLi4uYXJncyBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbWV0aG9kOyB0aGUgY2FsbGJhY2sgd2lsbFxuICogYmUgcHJvdmlkZWQgYnkgUSBhbmQgYXBwZW5kZWQgdG8gdGhlc2UgYXJndW1lbnRzLlxuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgdmFsdWUgb3IgZXJyb3JcbiAqL1xuUS5uc2VuZCA9IC8vIFhYWCBCYXNlZCBvbiBNYXJrIE1pbGxlcidzIHByb3Bvc2VkIFwic2VuZFwiXG5RLm5tY2FsbCA9IC8vIFhYWCBCYXNlZCBvbiBcIlJlZHNhbmRybydzXCIgcHJvcG9zYWxcblEubmludm9rZSA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUgLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgbm9kZUFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDIpO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgIFEob2JqZWN0KS5kaXNwYXRjaChcInBvc3RcIiwgW25hbWUsIG5vZGVBcmdzXSkuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubnNlbmQgPSAvLyBYWFggQmFzZWQgb24gTWFyayBNaWxsZXIncyBwcm9wb3NlZCBcInNlbmRcIlxuUHJvbWlzZS5wcm90b3R5cGUubm1jYWxsID0gLy8gWFhYIEJhc2VkIG9uIFwiUmVkc2FuZHJvJ3NcIiBwcm9wb3NhbFxuUHJvbWlzZS5wcm90b3R5cGUubmludm9rZSA9IGZ1bmN0aW9uIChuYW1lIC8qLi4uYXJncyovKSB7XG4gICAgdmFyIG5vZGVBcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICB0aGlzLmRpc3BhdGNoKFwicG9zdFwiLCBbbmFtZSwgbm9kZUFyZ3NdKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIElmIGEgZnVuY3Rpb24gd291bGQgbGlrZSB0byBzdXBwb3J0IGJvdGggTm9kZSBjb250aW51YXRpb24tcGFzc2luZy1zdHlsZSBhbmRcbiAqIHByb21pc2UtcmV0dXJuaW5nLXN0eWxlLCBpdCBjYW4gZW5kIGl0cyBpbnRlcm5hbCBwcm9taXNlIGNoYWluIHdpdGhcbiAqIGBub2RlaWZ5KG5vZGViYWNrKWAsIGZvcndhcmRpbmcgdGhlIG9wdGlvbmFsIG5vZGViYWNrIGFyZ3VtZW50LiAgSWYgdGhlIHVzZXJcbiAqIGVsZWN0cyB0byB1c2UgYSBub2RlYmFjaywgdGhlIHJlc3VsdCB3aWxsIGJlIHNlbnQgdGhlcmUuICBJZiB0aGV5IGRvIG5vdFxuICogcGFzcyBhIG5vZGViYWNrLCB0aGV5IHdpbGwgcmVjZWl2ZSB0aGUgcmVzdWx0IHByb21pc2UuXG4gKiBAcGFyYW0gb2JqZWN0IGEgcmVzdWx0IChvciBhIHByb21pc2UgZm9yIGEgcmVzdWx0KVxuICogQHBhcmFtIHtGdW5jdGlvbn0gbm9kZWJhY2sgYSBOb2RlLmpzLXN0eWxlIGNhbGxiYWNrXG4gKiBAcmV0dXJucyBlaXRoZXIgdGhlIHByb21pc2Ugb3Igbm90aGluZ1xuICovXG5RLm5vZGVpZnkgPSBub2RlaWZ5O1xuZnVuY3Rpb24gbm9kZWlmeShvYmplY3QsIG5vZGViYWNrKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5ub2RlaWZ5KG5vZGViYWNrKTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUubm9kZWlmeSA9IGZ1bmN0aW9uIChub2RlYmFjaykge1xuICAgIGlmIChub2RlYmFjaykge1xuICAgICAgICB0aGlzLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBRLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBub2RlYmFjayhudWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBRLm5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBub2RlYmFjayhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufTtcblxuUS5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiUS5ub0NvbmZsaWN0IG9ubHkgd29ya3Mgd2hlbiBRIGlzIHVzZWQgYXMgYSBnbG9iYWxcIik7XG59O1xuXG4vLyBBbGwgY29kZSBiZWZvcmUgdGhpcyBwb2ludCB3aWxsIGJlIGZpbHRlcmVkIGZyb20gc3RhY2sgdHJhY2VzLlxudmFyIHFFbmRpbmdMaW5lID0gY2FwdHVyZUxpbmUoKTtcblxucmV0dXJuIFE7XG5cbn0pO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiJdfQ==
