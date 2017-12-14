:- include('main.pl').


%define the actions that can be triggered

%main functions
executeCommand(handshake, handshake).
executeCommand(reconsult, 'reconsulted'):-reconsult('C:/xampp/htdocs/FEUP-LAIG/LYNGK/Prolog/server.pl').
executeCommand(quit, goodbye).


% init(GameType) - humanVhuman - humanVbot - botVbot
% start a new game given a modeType
% returns the next player
executeCommand(init(GameType), Player):-init(GameType), player(Player).

% action(move, Xf, Yf, Xt, Yt)
% executes a move for the current user
% returns 'success' if all ok and an error message otherwise
executeCommand(action(move, Xf, Yf, Xt, Yt), 'success'):-processMove(Xf, Yf, Xt, Yt).
executeCommand(action(move, _Xf, _Yf, _Xt, _Yt), OutputMessage):-outputMessage(OutputMessage).

executeCommand(action(claim, Color), 'success'):-claimColor(Color).
executeCommand(action(claim, _Color), OutputMessage):-outputMessage(OutputMessage).

%functions for the interface
init(GameType):-
	clearInit,
    displayMenu,
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
    saveGetStacks(NextPlayer, []).


% utils functions
% error message functions
setOutputMessage(Message):-
	retract(outputMessage(_)),
	assert(outputMessage(Message)).
writeOutputMessage(Message):-
	write(Message),
	setOutputMessage(Message).