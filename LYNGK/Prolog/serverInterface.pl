:- include('main.pl').


%define the actions that can be triggered

%main functions
executeCommand(handshake, handshake).
executeCommand(reconsult, 'reconsulted'):-reconsult('C:/xampp/htdocs/FEUP-LAIG/LYNGK/Prolog/server.pl').
executeCommand(quit, goodbye).


%start a new game given a modeType
executeCommand(init(GameType), 'New Game started'):-init(GameType).

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