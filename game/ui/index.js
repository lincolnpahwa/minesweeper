import {
    NavBar
}
from './nav-bar';

const MENU_ITEMS = [{
    label: 'New Game',
    action: 'newGameAction',
    enabled: true,
    order: 1
}, {
    label: 'Load Game',
    action: 'loadGameAction',
    enabled: false,
    order: 2
}, {
    label: 'Save Game',
    action: 'saveGameAction',
    enabled: false,
    order: 3
}];

const LEVEL_CONFIG = {
    beginner: {},

    intermediate: {
        mines: 45
    },

    advanced: {
        mines: 100
    }
};

class UI {

    constructor(BoardClass) {
        if (!BoardClass) {
            throw "Board not found";
        }

        this.customConfig = {
            mines: 5
        };

        this.timerEl = document.querySelector('.timer-stat');

        this.level = 'beginner';

        this.navBar = new NavBar(this, MENU_ITEMS);

        this.BoardClass = BoardClass;

        this.statusEl = document.querySelector('.status');

        this.statusWrapperEl = document.querySelector('.status-wrapper');

        this.setupLevelActions();

        this.initBoard();
    }

    setupLevelActions() {
        let levelButtons = document.querySelectorAll('.level-bar .step');

        for (var i = levelButtons.length - 1; i >= 0; i--) {
            let levelButton = levelButtons[i];

            levelButton.addEventListener('click', (function(_button) {
                return function() {
                    for (var i = levelButtons.length - 1; i >= 0; i--) {
                        levelButtons[i].classList.remove('active');
                    };
                    _button.classList.add('active');
                    this.onLevelUpdate(_button);
                }.bind(this)
            }.bind(this))(levelButton), false);
        };

        let customMinesInputWrapper = document.querySelector('.step .input-content');

		let button = customMinesInputWrapper.querySelector('.custom-mine-set');
		let input = customMinesInputWrapper.querySelector('input');

		input.value = this.customConfig.mines;

		button.addEventListener('click', function() {
			this.customConfig.mines = parseInt(input.value);
			this.initBoard();
		}.bind(this), false);
    }

    initBoard() {
    	this.timeElapsed = 0;
        let levelConfig = LEVEL_CONFIG[this.level];
        if (!levelConfig) {
            levelConfig = this.customConfig;
        }
        this.board = new this.BoardClass(30, 15, levelConfig.mines);
        this.spotElList = [];
        this.renderBoard();
    }

    renderBoard(container = document.querySelector('.game-area')) {
        let boardEl = this.createGameGrid();
        container.innerHTML = '';
        container.appendChild(boardEl);
    }

    createGameGrid() {
        let gameSpots = this.board.spots;
        let boardHeight = this.board.height;
        let boardEl = document.createElement('div');
        boardEl.classList.add('board-wrapper');
        for (var i = 0; i < boardHeight; i++) {
            let rowEl = this.createRow(gameSpots, i);
            boardEl.appendChild(rowEl);
        };

        return boardEl;
    }

    createRow(gameSpots, rowIndex) {
        let boardWidth = this.board.width;
        let rowEl = document.createElement('div');
        rowEl.classList.add('row-wrapper');
        for (var i = 0; i < boardWidth; i++) {
            let cellEl = this.createCell(gameSpots, rowIndex, i);
            rowEl.appendChild(cellEl);
        }

        return rowEl;
    }

    createCell(gameSpots, rowIndex, colIndex) {
        let spotIndex = this.board.width * rowIndex + colIndex;
        let spot = gameSpots[spotIndex];

        let spotEl = document.createElement('div');

        spotEl.classList.add('spot');

        spotEl.addEventListener("click", (function(_spot, _i, _r, _c) {
            return function() {
                this.spotClickListener(_spot, _i, _r, _c);
            }.bind(this)
        }).call(this, spot, spotIndex, rowIndex, colIndex), false);

        spotEl.addEventListener("contextmenu", (function(_spot, _el, _i) {
            return function(event) {
                event = event || window.event;

                if (event.preventDefault != undefined) {
                    event.preventDefault();
                }
                if (event.stopPropagation != undefined) {
                    event.stopPropagation();
                }
                event.cancelBubble = true;
                if (_spot.mine) {
                    this.mineSpotClickListener(_spot, _el, _i);
                }
                return false;
            }.bind(this)
        }).call(this, spot, spotEl, spotIndex), false);


        this.spotElList.push(spotEl);
        return spotEl;
    }

    spotClickListener(spot, spotIndex) {
        this.startTimer();
        if (!this.board.lost) {
            this.board.clearSpot(spotIndex);

            this.updateBoard();
        }
    }

    mineSpotClickListener(spot, spotEl) {
    	this.startTimer();
        if (!this.board.lost) {
            spot.mine = false;
            spot.cleared = true;
            spotEl.classList.add('mine-flagged');
            this.updateBoard();
        }
    }

    updateBoard(reset = false) {
        let spots = this.board.spots;
        for (var i = this.spotElList.length - 1; i >= 0; i--) {
            let spotEl = this.spotElList[i];
            let spot = spots[i];

            if (this.board.lost) {
                if (spot.mine) {
                    spotEl.classList.add('mine');
                }
            }

            if (reset) {
                spotEl.innerHTML = '';
                spotEl.classList.remove('cleared', 'mine-flagged');
                continue;
            }

            if (spot.cleared) {
                let spotStatus = spot.mine ? '*' : spot.mineCount || '';

                if (spotStatus !== 0) {
                    spotEl.innerHTML = spotStatus;
                }

                spotEl.classList.add('cleared');
            }
        };

        this.checkWinLoss();
    }

    checkWinLoss() {
    	this.statusWrapperEl.classList.remove('red', 'yellow', 'green');
        if (this.board.won()) {
            this.board.clearAll();
            this.statusEl.innerHTML = 'Won!! <span>Time Taken: ' + this.timeElapsed + ' secs</span>';
            this.statusWrapperEl.classList.add('green');
            this.stopTimer();
        } else if (this.board.lost) {
            this.statusEl.innerHTML = 'Lost!!';
            this.stopTimer();
            this.statusWrapperEl.classList.add('red');
        } else {
            this.statusEl.innerHTML = 'Keep playing...';
            this.statusWrapperEl.classList.add('yellow');
        }
    }

    newGameAction() {
    	this.stopTimer();
        this.initBoard();
        this.updateBoard(true);
        this.statusEl.innerHTML = 'Play';
    }

    onLevelUpdate(button) {
        let level = button.getAttribute('level');

        this.level = level;

        this.newGameAction();
    }

    startTimer() {
    	if (!this.timerInstance) {
    		this.timerInstance = setInterval(function() {
    			this.timeElapsed++;
    			this.timerEl.innerHTML = this.timeElapsed;
    		}.bind(this), 1000);
    	}
    }

    stopTimer() {
    	if (this.timerInstance) {
    		clearInterval(this.timerInstance);
    		this.timeElapsed = 0;
    		this.timerEl.innerHTML = 0;
    	}
    }
}

export default UI;
