function spillerMotRandomAI(farge, id) {
    var board = null
    var game = new Chess()
    var listOverFen = document.getElementById("listOverFen")
    if(farge === "black") {
      window.setTimeout(makeRandomMove, 500)
      getHistory()
      sound()
    }
    function onDragStart (source, piece, position, orientation) {
      // do not pick up pieces if the game is over
      if (game.game_over()) return false

      // only pick up pieces for White
      if (piece.search(/^b/) !== -1) return false
    }

    function makeRandomMove () {
      var possibleMoves = game.moves()
      sound()
      // game over
      if (possibleMoves.length === 0) {
        var white = document.getElementById("victoryWhite")
        white.style = "display: block;"
      return
      } 
      if (possibleMoves.length > 0)   {
        getHistory()
        
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
      window.setTimeout(makeRandomMove, 500)
      getHistory()
      sound()
      
    }
    function onMouseoverSquare (square, piece) {
      // get list of possible moves for this square
      var moves = game.moves({
        square: square,
        verbose: true
      })
    
      // exit if there are no moves available for this square
      if (moves.length === 0) return // HER KAN KASNKJE SVART VINNE
    
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
      orientation: farge,
      onSnapEnd: onSnapEnd
    }
    
    function getHistory() { //Viser trekket etter hvert flytt
      listOverFen.innerHTML = "" 
        var arr = game.history()
        
        for (let i = 0; i < arr.length; i++)
          i % 2 == 0 ? listOverFen.innerHTML += Math.round(((i+1)/2)) + ".  " + arr[i] + ",  " : listOverFen.innerHTML += arr[i] + "<br>"
    }
    
    board = Chessboard(id, config)
}

function loadOpener(id, fen) {
  board = Chessboard(id, fen)
}
function flipFarge() {
  board.flip()
}

function sound() {
  var snd = new Audio("Chess/js/ChessMoveSound.mp3")
  snd.volume = 0.5
  snd.play()
  snd.currentTime = 0
}
