const board = [];
const pieces = [];

for (let i = 0; i < 8; ++i) {
    board.push (new Array (8));
    pieces.push (new Array (8));
}

const row_pieces = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
const container = document.querySelector (".board");

for (let i = 0; i < 8; ++i) {
    for (let j = 0; j < 8; ++j) {

        const squareColor = ((i + j) % 2 === 0 ? 'white' : 'black');
        const pieceColor = (i <= 1 ? 'b' : 'w');
        let piece;

        if (i === 1 || i === 6) {
            piece = 'P';
        } else if (i === 0 || i === 7) {
            piece = row_pieces[j];
        } else {
            piece = '.';
        }
        
        pieces[i][j] = (piece == '.' ? '.' : pieceColor + piece);
        
        const square = document.createElement ("div");
        square.className = `square ${squareColor}`;
        const circle = document.createElement ("div");
        const image = document.createElement ("img");
        circle.className = "circle";
        
        if (piece !== '.') { 
            image.setAttribute ('src', `./pieces/${pieceColor}${piece}.svg`);
        } else {
            image.setAttribute ('src', "./pieces/empty.svg");
        }

        image.setAttribute ('id', String (i) + String (j))
        image.classList.add ('image');
        square.appendChild (image);
        square.appendChild (circle);

        container.appendChild (square);
        board[i][j] = square;
    }
}

function rook_attack (row, col, color, want) {
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
                        if (!want)
                            board[new_row][new_col].lastChild.className = "circle";
                        else 
                            positions.push ([new_row, new_col]);
                    }
                    break;
                }
                if (!want)
                    board[new_row][new_col].lastChild.className = "circle";
                else 
                    positions.push ([new_row, new_col]);
                new_row += dy, new_col += dx;
            }
        }
    }
    if (want) {
        return positions;
    }
}

function bishop_attack (row, col, color, want) {
    let positions = [];
    for (const dy of [-1, 1]) {
        for (const dx of [-1, 1]) {
            let new_row = row + dy, new_col = col + dx;
            while (new_row < 8 && new_col < 8 && new_row >= 0 && new_col >= 0) {
                if (pieces[new_row][new_col] !== '.') {
                    if (pieces[new_row][new_col][0] != color) {
                        if (!want)
                            board[new_row][new_col].lastChild.className = "circle";
                        else 
                            positions.push ([new_row, new_col]);
                    }
                    break;
                }
                if (!want)
                    board[new_row][new_col].lastChild.className = "circle";
                else 
                    positions.push ([new_row, new_col]);
                new_row += dy, new_col += dx;
            }
        }
    }
    if (want) {
        return positions;
    }
}

function knight_attack (row, col, color, want) {
    let positions = [];
    for (const dy of [-2, -1, 1, 2]) {
        for (const dx of [-2, -1, 1, 2]) {
            if (Math.abs (dy) === Math.abs (dx)) {
                continue;
            }
            let new_row = row + dy, new_col = col + dx;
            if (new_row < 8 && new_row >= 0 && new_col >= 0 && new_col < 8 && 
                    pieces[new_row][new_col][0] !== color) {
                if (!want)
                    board[new_row][new_col].lastChild.className = "circle";
                else 
                    positions.push ([new_row, new_col]);
            }
        }
    }
    if (want) {
        return positions;
    }
}

function pawn_attack (row, col, color, want) {
    let positions = [];
    if (color === 'w') {
        if (row === 6) {
            for (const new_row of [5, 4]) {
                if (pieces[new_row][col] != '.') {
                    break;
                }
                if (!want)
                    board[new_row][col].lastChild.className = "circle";
                else 
                    positions.push ([new_row, col]);
            }
        } else {
            if (row - 1 >= 0 && pieces[row - 1][col] === '.') {
                if (!want)
                    board[row - 1][col].lastChild.className = "circle";
                else 
                    positions.push ([row - 1, col]);
            }
        }
        for (const dx of [-1, 1]) {
            let new_col = col + dx;
            if (row - 1 >= 0 && new_col >= 0 && new_col < 8 && pieces[row - 1][new_col] !== '.' && 
                    pieces[row - 1][new_col][0] !== color) {

                if (!want)
                    board[row - 1][new_col].lastChild.className = "circle";
                else 
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
                if (!want)
                    board[new_row][col].lastChild.className = "circle";
                else 
                    positions.push ([new_row, col]);
            }
        } else {
            if (row + 1 < 8 && pieces[row + 1][col] === '.') {
                if (!want)
                    board[row + 1][col].lastChild.className = "circle";
                else 
                    positions.push ([row + 1, col]);
            }
        }
        for (const dx of [-1, 1]) {
            let new_col = col + dx;
            if (row + 1 < 8 && new_col >= 0 && new_col < 8 && pieces[row + 1][new_col] !== '.' && 
                pieces[row + 1][new_col][0] !== color) {
                if (!want)
                    board[row + 1][new_col].lastChild.className = "circle";
                else 
                    positions.push ([row + 1, new_col]);

            }
        }
    }
    if (want) {
        return positions;
    }
}
function king_attack (row, col, color, want) {
    let positions = [];
    for (const dy of [-1, 0, 1]) {
        for (const dx of [-1, 0, 1]) {
            if (dx === 0 && dy === 0) {
                continue;
            }          
            let new_row = row + dy, new_col = col + dx;  
            if (new_row >= 0 && new_row < 8 && new_col >= 0 && new_col < 8 && 
                    (pieces[new_row][new_col] === '.' || pieces[new_row][new_col][0] != color)) {
                if (!want)
                    board[new_row][new_col].lastChild.className = "circle";
                else 
                    positions.push ([new_row, new_col]);
            }
        }
    }
    if (want) {
        return positions;
    }
}

function queen_attack (row, col, color, want) {
    if (want == 1) {
        return rook_attack (row, col, color, want).concat (bishop_attack (row, col, color, want));
    }
    rook_attack (row, col, color, want);
    bishop_attack (row, col, color, want);
}




function reset_attacks () {
    const being_attacked = document.querySelectorAll ('.circle');
    being_attacked.forEach (attacked => {
        attacked.className = "";
    });
}


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



let initrow, initcol, finrow, fincol, last=0;

const worker = new Worker ('./worker.js');

worker.onmessage = function (message) {
    const info = message.data;
    console.log (info);
    initrow = info[0], initcol = info[1], finrow = info[2], fincol = info[3];
}



let prev_event, turn = 0;


function play_audio (piece) {
    if (piece === '.') {
        const move_piece = new Audio ('./audio/move-self.mp3');
        move_piece.play();
    } else {
        const capture_piece = new Audio ('./audio/capture.mp3');
        capture_piece.play ();
    }
}


function initialize_attacks () {
    document.querySelectorAll ('.image').forEach (image => {
        const row = Number (image.id[0]), col = Number (image.id[1]);
        image.addEventListener ('click', (event) => {
            const circle = image.nextSibling;
            if (circle.className !== "circle") {
                if (pieces[row][col][0] === 'b') {
                    return;
                }
                reset_attacks ();
                prev_event = event;
                const piece = pieces[row][col][1], color = pieces[row][col][0];
                const func = attack.get (piece);
                if (color === 'w') {
                    func (row, col, color, 0);
                }
            } else {
                const from_row = Number (prev_event.target.id[0]), from_col = Number (prev_event.target.id[1]);

                play_audio (pieces[row][col]);

                pieces[row][col] = pieces[from_row][from_col];
                pieces[from_row][from_col] = '.';
                board[row][col].firstChild.setAttribute ('src', board[from_row][from_col].firstChild.getAttribute('src'));
                board[from_row][from_col].firstChild.setAttribute ('src', './pieces/empty.svg');

                reset_attacks ();
                
                worker.postMessage (pieces);
                
                
                pieces[finrow][fincol] = pieces[initrow][initcol];
                pieces[initrow][initcol] = '.';
                board[finrow][fincol].firstChild.setAttribute ('src', board[initrow][initcol].firstChild.getAttribute('src'));
                board[initrow][initcol].firstChild.setAttribute ('src', './pieces/empty.svg');
                console.log (last);
            }
        });
    });
}

reset_attacks();
initialize_attacks ();
