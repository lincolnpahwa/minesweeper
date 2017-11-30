import { Board } from '../game/board.js'
import _ from 'lodash';

describe("Board", function () {
  var board;

  describe("creating a board", function () {

    it("should return a board object when it is called with new", () => {
      var board = new Board()
      expect(board instanceof Board).toBeTruthy()
    })
  })
});
