function spillerMotRandomAI() {
    var board = null
    var game = new Chess()

    function onDragStart (source, piece, position, orientation) {
      // do not pick up pieces if the game is over
      if (game.game_over()) return false

      // only pick up pieces for White
      if (piece.search(/^b/) !== -1) return false
    }

    function makeRandomMove () {
      var possibleMoves = game.moves()

      // game over
      if (possibleMoves.length === 0) {
        const para = document.createElement("h1")
        const node = document.createTextNode("White wins!")
        para.appendChild(node)
        const element = document.getElementById("victoryWhite")
        element.appendChild(para);
      return
      }
      var randomIdx = Math.floor(Math.random() * possibleMoves.length)
      game.move(possibleMoves[randomIdx])
      board.position(game.fen())
    }

    var whiteSquareGrey = '#a9a9a9'
    var blackSquareGrey = '#696969'

    function removeGreySquares () {
      $('#myBoard .square-55d63').css('background', '')
    }

    function greySquare (square) {
      var $square = $('#myBoard .square-' + square)

      var background = whiteSquareGrey
      if ($square.hasClass('black-3c85d')) {
        background = blackSquareGrey
      }

      $square.css('background', background)
    }

    function onDragStart (source, piece) {
      // do not pick up pieces if the game is over
      if (game.game_over()) return false

      // or if it's not that side's turn
      if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
          (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false
      }
    }

    function onDrop (source, target) {
      // see if the move is legal
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      })

      // illegal move
      if (move === null) return 'snapback'

      // make random legal move for black
      window.setTimeout(makeRandomMove, 250)
    }
    function onMouseoverSquare (square, piece) {
      // get list of possible moves for this square
      var moves = game.moves({
        square: square,
        verbose: true
      })
    
      // exit if there are no moves available for this square
      if (moves.length === 0) return
    
      // highlight the square they moused over
      greySquare(square)
    
      // highlight the possible squares for this piece
      for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
      }
    }
    
    function onMouseoutSquare (square, piece) {
      removeGreySquares()
    }

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    function onSnapEnd () {
      board.position(game.fen())
    }

    var config = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onMouseoutSquare: onMouseoutSquare,
      onMouseoverSquare: onMouseoverSquare,
      onSnapEnd: onSnapEnd
    }

    board = Chessboard('myBoard', config)
}
