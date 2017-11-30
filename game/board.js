import _ from 'lodash';

export class Board {
  /**
   * Create an instance of a board based on width, height and number
   * of mines.
   *
   * @param [width=30] integer number of boxes in each row
   * @param [height=15] integer number of boxes in each column
   * @param [mines=20] integer number of mines in the board
   */
  constructor(width = 30, height = 15, mines = 20) {
    this.width = width
    this.height = height
    this.mines = mines
    this.lost = false
    // create an array for the board
    this.generateBoard()
    // add mines to the board
    this.addMines()
  }

  /**
   * Create an array for the board.
   *
   * Creates each spot on the board with data on if it's
   * been cleared and if it is a mine.
   */
  generateBoard() {
    this.spots = []
    for (var i = 0; i < this.height * this.width; i++) {
      this.spots.push({ cleared: false, mine: false })
    }
  }

  /**
   * Add the number of mines to the board expected.
   *
   * Randomly generates locations for the mines.
   * Then adds the mines to the board.
   */
  addMines() {
    var mineLocations = []
    while (mineLocations.length < this.mines) {
      var randomLocation = _.random(this.spots.length - 1)
      if (mineLocations.indexOf(randomLocation) === -1) {
        mineLocations.push(randomLocation)
      }
    }

    // add the mines to the board
    for (var i = 0; i < mineLocations.length; i++) {
      this.spots[mineLocations[i]].mine = true
    }
  }

  /**
   * Clear spot on board. If the spot is a zero clear surrounding locations.
   *
   * @param i the index of the space to clear.
   */
  clearSpot(i) {
    if (!this.spots[i].cleared) {
      this.spots[i].cleared = true;
      if (this.spots[i].mine) {
        this.lost = true;
      }
      else {
        // recursively clear neighbors if there are no mines
        const mineCount = this.mineCount(i);
        if (mineCount === 0) {
          const neighbors = this.neighbors(i);
          for (let i = 0; i < neighbors.length; i++) {
            this.clearSpot(neighbors[i]);
          }
        }
      }
    }
  }

  /**
   * Checks if the point is in the first column
   *
   * @param i index of the spot being considered.
   * @returns a boolean indicating if the point is in the first colmun.
   */
  firstColumn(i) {
    return i % this.width == 0
  }

  /**
   * Checks if the point is in the first row
   *
   * @param i index of the spot being considered.
   * @returns a boolean indicating if the point is in the first row.
   */
  firstRow(i) {
    return i < this.width
  }

  /**
   * Checks if the point is in the last row
   *
   * @param i index of the spot being considered.
   * @returns a boolean indicating if the point is in the last row.
   */
  lastRow(i) {
    return i > this.width * this.height - (this.width + 1)
  }

  /**
   * Checks if the point is in the last column
   *
   * @param i index of the spot being considered.
   * @returns a boolean indicating if the point is in the last colmun.
   */
  lastColumn(i) {
    return (i + 1) % this.width == 0
  }

  /**
   * Returns a list fo all the points that are neighbors of the point.
   *
   * @param i the index of the point being considered.
   * @returns
   */
  neighbors(i) {
    var firstRow = this.firstRow(i)
    var lastRow = this.lastRow(i)
    var firstColumn = this.firstColumn(i)
    var lastColumn = this.lastColumn(i)

    // if neighbors are already determined return them.
    if (this.spots[i].neighbor_blocks) {
      return this.spots[i].neighbor_blocks
    }

    var neighbor_blocks = []
    if (!firstRow && !firstColumn) {
      neighbor_blocks.push(i - this.width - 1)
    }
    if (!firstRow) {
      neighbor_blocks.push(i - this.width)
    }
    if (!firstRow && !lastColumn) {
      neighbor_blocks.push(i - this.width + 1)
    }
    if (!firstColumn) {
      neighbor_blocks.push(i - 1)
    }
    if (!lastColumn) {
      neighbor_blocks.push(i + 1)
    }
    if (!lastRow && !firstColumn) {
      neighbor_blocks.push(i + this.width - 1)
    }
    if (!lastRow) {
      neighbor_blocks.push(i + this.width)
    }
    if (!lastRow && !lastColumn) {
      neighbor_blocks.push(i + this.width + 1)
    }
    this.spots[i].neighbor_blocks = neighbor_blocks
    return this.spots[i].neighbor_blocks
  }

  /**
   * Returns the count of mines that surround the point
   *
   * @param i the point to check
   * @returns the number of mines surrounding the point
   */
  mineCount(i) {
    var neighbors = this.neighbors(i)
    var number_mines = 0

    // if this is previously calculated return it
    if (this.spots[i].mineCount) {
      return this.spots[i].mineCount
    }

    // count mines in neighbor tiles
    for (var j = 0; j < neighbors.length; j++) {
      if (this.spots[neighbors[j]].mine) {
        number_mines++
      }
    }

    this.spots[i].mineCount = number_mines
    return this.spots[i].mineCount
  }

  /**
   * Clears the entire board.
   */
  clearAll() {
    for (var i = 0; i < this.spots.length; i++) {
      this.spots[i].cleared = true
    }
  }

  /**
   * Checks if the game has been won.
   *
   * @returns true if the game has been won.
   */
  won() {
    for (var i = 0; i < this.spots.length; i++) {
      if (this.spots[i].cleared == false && this.spots[i].mine == false) {
        return false
      }
    }
    return true
  }
}
