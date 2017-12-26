:- include('main.pl').


%define the actions that can be triggered

%------------------------------------global functions
executeCommand(handshake, handshake).
executeCommand(reconsult, 'reconsulted'):-reconsult('C:/xampp/htdocs/FEUP-LAIG/LYNGK/Prolog/server.pl').
executeCommand(quit, goodbye).
executeCommand(clear, 'done'):-clear.
executeCommand(displayBoard, 'done'):-displayBoard.

%------------------------------------game settings

% init(GameType) - humanVhuman - humanVbot - botVbot
% start a new game given a modeType
% returns the next player
executeCommand(init(humanVhuman), 'success'):-init(humanVhuman).
executeCommand(init(humanVbot, BotLevel), 'success'):-init(humanVbot), chooseBotLevel(bot, BotLevel).
executeCommand(init(botVbot, Bot1Level, Bot2Level), 'success'):-init(botVbot), chooseBotLevel(bot1, Bot1Level), chooseBotLevel(bot2, Bot2Level).

%------------------------------------actions
% action(move, Xf, Yf, Xt, Yt)
% executes a move for the current user
% returns 'success' if all ok or an error message otherwise
executeCommand(action(move, Xf, Yf, Xt, Yt), 'success'+Xf-Yf-Xt-Yt+Removed):-processMove(Xf, Yf, Xt, Yt), endTurn(Removed).

% action(claim, Color)
% makes the current user claim the supplied Color
% returns 'success' if all ok or an error message otherwise
executeCommand(action(claim, Color), 'success'):-claimColor(Color).

% action(playBot)
% if the next player is a bot, the bot executes a move
% returns the Move, like
executeCommand(action(playBot), 'success'+Move+Removed):- movesAvailable, player(Bot),isBot(Bot),playBot(Bot, Move), endTurn(Removed).


% action errors
executeCommand(action(_), OutputMessage):-outputMessage(OutputMessage).
executeCommand(action(_, _), OutputMessage):-outputMessage(OutputMessage).
executeCommand(action(_, _, _, _, _), OutputMessage):-outputMessage(OutputMessage).




%------------------------------------queries
% query(board) - returns the board
executeCommand(query(board), Board):-board(Board).
% query(player)
executeCommand(query(player), Player):-player(Player).
% query(nextPlayer)
executeCommand(query(nextPlayer), NextPlayer):-nextPlayer(NextPlayer).
% query(toClaim) get a list of the next colors to claim
executeCommand(query(toClaim), ToClaim):-toClaim(ToClaim).
% query(getColors) get the colors of the current player
executeCommand(query(getColors), Colors):-getColors(Colors).
% query(getColors,Player) get the colors of a given Player
executeCommand(query(getColors,Player), Colors):-getColors(Player, Colors).
% query(gameOver) returns (draw, player1, player2, bot, bot1, bot2 or false)
executeCommand(query(gameOver), Winner):- \+movesAvailable, getWinner(Winner).
executeCommand(query(gameOver), false). % game not over yet
% default query response
executeCommand(query(_), 'queried variable not set (yet)').

%functions for the interface
init(GameType):-
	clearInit,
    startGame(GameType),
    generateBoard(Board),
    player(CurrentPlayer),
    nextPlayer(NextPlayer),
    claimableColors(C),
    saveToClaim(C), % load the colors that can be claimed
    saveBoard(Board), % save the board initial state
    saveGetColors(CurrentPlayer, []),
    saveGetColors(NextPlayer, []),
    saveGetStacks(CurrentPlayer, []),
    saveGetStacks(NextPlayer, []),
	displayBoard.


% utils functions
% error message functions
setOutputMessage(Message):-
	retract(outputMessage(_)),
	assert(outputMessage(Message)).
writeOutputMessage(Message):-
	write(Message),
	setOutputMessage(Message).