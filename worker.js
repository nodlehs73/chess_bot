


function rook_attack (pieces, row, col, color) {
    let positions = [];
    for (const dy of [0, 1, -1]) {
        for (const dx of [0, 1, -1]) {
            if (Math.abs(dx) === Math.abs(dy)) {
                continue;
            }
            let new_row = row + dy, new_col = col + dx;
            while (new_row < 8 && new_col < 8 && new_row >= 0 && new_col >= 0) {
                if (pieces[new_row][new_col] !== '.') {
                    if (pieces[new_row][new_col][0] != color) {
                        positions.push ([new_row, new_col]);
                    }
                    break;
                }
                positions.push ([new_row, new_col]);
                new_row += dy, new_col += dx;
            }
        }
    }
    return positions;
}

function bishop_attack (pieces, row, col, color) {
    let positions = [];
    for (const dy of [-1, 1]) {
        for (const dx of [-1, 1]) {
            let new_row = row + dy, new_col = col + dx;
            while (new_row < 8 && new_col < 8 && new_row >= 0 && new_col >= 0) {
                if (pieces[new_row][new_col] !== '.') {
                    if (pieces[new_row][new_col][0] != color) {
                        positions.push ([new_row, new_col]);
                    }
                    break;
                }
                positions.push ([new_row, new_col]);
                new_row += dy, new_col += dx;
            }
        }
    }
    return positions;
}

function knight_attack (pieces, row, col, color) {
    let positions = [];
    for (const dy of [-2, -1, 1, 2]) {
        for (const dx of [-2, -1, 1, 2]) {
            if (Math.abs (dy) === Math.abs (dx)) {
                continue;
            }
            let new_row = row + dy, new_col = col + dx;
            if (new_row < 8 && new_row >= 0 && new_col >= 0 && new_col < 8 && 
                    pieces[new_row][new_col][0] !== color) {
                positions.push ([new_row, new_col]);
            }
        }
    }
    return positions;
}

function pawn_attack (pieces, row, col, color) {
    let positions = [];
    if (color === 'w') {
        if (row === 6) {
            for (const new_row of [5, 4]) {
                if (pieces[new_row][col] != '.') {
                    break;
                }
                positions.push ([new_row, col]);
            }
        } else {
            if (row - 1 >= 0 && pieces[row - 1][col] === '.') {
                positions.push ([row - 1, col]);
            }
        }
        for (const dx of [-1, 1]) {
            let new_col = col + dx;
            if (row - 1 >= 0 && new_col >= 0 && new_col < 8 && pieces[row - 1][new_col] !== '.' && 
                    pieces[row - 1][new_col][0] !== color) {

                positions.push ([row - 1, new_col]);
            }
        }
    }
    if (color === 'b') {
        if (row === 1) {
            for (const new_row of [2, 3]) {
                if (pieces[new_row][col] !== '.') {
                    break;
                }
                positions.push ([new_row, col]);
            }
        } else {
            if (row + 1 < 8 && pieces[row + 1][col] === '.') {
                positions.push ([row + 1, col]);
            }
        }
        for (const dx of [-1, 1]) {
            let new_col = col + dx;
            if (row + 1 < 8 && new_col >= 0 && new_col < 8 && pieces[row + 1][new_col] !== '.' && 
                pieces[row + 1][new_col][0] !== color) {
                positions.push ([row + 1, new_col]);
            }
        }
    }
    return positions;
}
function king_attack (pieces, row, col, color) {
    let positions = [];
    for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
            if (dx === 0 && dy === 0) {
                continue;
            }          
            let new_row = row + dy, new_col = col + dx;  
            if (new_row >= 0 && new_row < 8 && new_col >= 0 && new_col < 8 && 
                    (pieces[new_row][new_col] === '.' || pieces[new_row][new_col][0] != color)) {
                positions.push ([new_row, new_col]);
            }
        }
    }
    return positions;
}

function queen_attack (pieces, row, col, color, want) {
    return rook_attack (row, col, color, want).concat (bishop_attack (row, col, color, want));
}

function get_new_eval (evaluation, piece, color) {
    if (piece === '.') {
        return evaluation;
    }
    return evaluation + (color === 'w' ? value.get (piece) : -value.get (piece));
}

function get_evaluation (pieces) {
    let evaluation = 0;
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            if (pieces[i][j] !== '.') {
                evaluation += ((pieces[i][j][0] === 'w' ? 1 : -1) * value.get (pieces[i][j][1]));
            }
        }
    }
    return evaluation;
}

let initrow = -1, initcol = -1, finrow = -1, fincol = -1;

const attack = new Map ();
const value = new Map ();

attack.set ('P', pawn_attack);
attack.set ('Q', queen_attack);
attack.set ('R', rook_attack);
attack.set ('N', knight_attack);
attack.set ('K', king_attack);
attack.set ('B', bishop_attack);

value.set ('P', 1);
value.set ('Q', 9);
value.set ('R', 5);
value.set ('N', 3);
value.set ('K', 999999);
value.set ('B', 3);

function get_best_move (chessboard, evaluation, max_so_far_white, min_so_far_black, color, depth) {
    if (depth > 5) {
        return evaluation;
    }
    let best = (color === 'w' ? -10000000 : 10000000);
    let rnd = [];
    for (let i = 0; i < 8; ++i) {
        for (let j = 0; j < 8; ++j) {
            rnd.push ([i, j]);
        }
    }
    for (let i = 0; i < 64; ++i) {
        let j = Math.floor (Math.random () * (i + 1));
        let save = rnd[i];
        rnd[i] = rnd[j];
        rnd[j] = save;
    }
    for (const cell of rnd) {
        let i = cell[0], j = cell[1];
        if (chessboard[i][j][0] === color) {
            const func = attack.get (chessboard[i][j][1]);
            const positions = func (chessboard, i, j, color);
            

            for (const tuple of positions) {
                
                const new_row = tuple[0], new_col = tuple[1];
                const piece = (chessboard[new_row][new_col] === '.' ? '.' : chessboard[new_row][new_col][1]);
                const new_evaluation = get_new_eval (evaluation, piece, color), save = chessboard[new_row][new_col];
                chessboard[new_row][new_col] = chessboard[i][j];
                chessboard[i][j] = '.';
                if (color === 'w') {
                    const eval = get_best_move (chessboard, new_evaluation, max_so_far_white, min_so_far_black, (color === 'w' ? 'b' : 'w'), depth + 1);
                    max_so_far_white = Math.max (max_so_far_white, eval);
                    best = Math.max (best, eval);
                    
                    if (min_so_far_black <= max_so_far_white) {
                        chessboard[i][j] = chessboard[new_row][new_col];
                        chessboard[new_row][new_col] = save;
                        break;
                    }
                } else {
                    const eval = get_best_move (chessboard, new_evaluation, max_so_far_white, min_so_far_black, (color === 'w' ? 'b' : 'w'), depth + 1);
                    if (eval < best) {
                        last = depth;
                        best = eval;
                    
                        if (depth === 0) {
                            initrow = i, initcol = j, finrow = new_row, fincol = new_col;
                        }
                    }
                    min_so_far_black = Math.min (min_so_far_black, eval);
                    if (min_so_far_black <= max_so_far_white) {
                        chessboard[i][j] = chessboard[new_row][new_col];
                        chessboard[new_row][new_col] = save;
                        break;
                    }
                }
                chessboard[i][j] = chessboard[new_row][new_col];
                chessboard[new_row][new_col] = save;
            }
        }
    }
    if (depth === 0) {
        return [initrow, initcol, finrow, fincol];
    }
    return best;
}

self.onmessage = function (message) {
    const chessboard = message.data;
    postMessage (get_best_move (chessboard, get_evaluation (chessboard), -10000000000, 1000000000, 'b', 0));
}