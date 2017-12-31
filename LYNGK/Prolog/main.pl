:- use_module(library(system)).
:- use_module(library(random)).
:- use_module(library(lists)).

:- include('utils.pl').

:- include('boardGenerator.pl').
:- include('displayBoard.pl').

:- include('evaluate.pl').
:- include('claim.pl').
:- include('move.pl').
:- include('interface.pl').
:- include('bot.pl').

% volatile and dynamic predicates declaration
% all the predicates have the first Variable as being the current game
:- volatile
    game/1,         % the current game to be used, numbers starting in 0
    board/2,        % the current board state
    player/2,       % the current player
    nextPlayer/2,   % the next player
    toClaim/2,      % which colors are yet to claim
    getColors/3,    % a list of the colors claimed by the selected player getColors(player, Colors)
    getStacks/3,    % a list of the stacks collected by the selected player getStacks(player, Stacks)
    hasClaimed/2,   % a flag to indicate wheter the current player has claimed a color in this turn
    botLevel/2,     % the level of difficulty of each bot
	outputMessage/1. % the current error message

:- dynamic
    game/1,
    board/2,
    player/2,
    nextPlayer/2,
    toClaim/2,
    getColors/3,
    getStacks/3,
    hasClaimed/2,
    botLevel/2,
	outputMessage/1.

%make bot start first or human start first, 50% chance
randomizeBotPlay:-
    random_select(Temp, [0, 1], _),
    Temp =:= 0,
    savePlayer(player1),
    saveNextPlayer(bot),
    setOutputMessage('Player 1 goes first...').
randomizeBotPlay:-
    savePlayer(bot),
    saveNextPlayer(player1),
    setOutputMessage('Bot goes first...').

%game type (User x User | User x Bot)
startGame(humanVhuman):- %intialize both players. The real players should randomly choose their turn
    savePlayer(player1),
    saveNextPlayer(player2),
    setOutputMessage('Human Vs Human Selected').

startGame(humanVbot):- % initialize the player and the nextPlayer randomly, the bot may be first
    setOutputMessage('Human Vs Bot Selected'),
    randomizeBotPlay.

startGame(botVbot):- % initialize the player and the nextPlayer randomly, the bot may be first
    setOutputMessage('Bot Vs Bot Selected'),
    savePlayer(bot1),
    saveNextPlayer(bot2).

% inverts the two players
invertPlayers:-
    player(CurrentPlayer),
    nextPlayer(NextPlayer),
    savePlayer(NextPlayer),
    saveNextPlayer(CurrentPlayer).

/* nextPlayerGoes:-%if this is a bot playing
    player(Player),
    isBot(Player), !,
    displayBoard,
    playBot(Player), !,
    endTurn. */
/* nextPlayerGoes:-%else, if this is a human player
    displayBoard,
    repeat,
        setOutputMessage('Enter your instruction (move, claim, quit)\n'),
        waitForInstruction,
    !,
    endTurn. */

%checks the board state, changes the players and starts the nextTurn
endTurn(Removed):-
    clearHasClaimed, % clear the hasClaimed flag.
    removeClaimedStacksWithFive(Removed), %move all the 5 stacks to the players they belong to to their Stacks
    invertPlayers,
	pushGame.

%empties the database
clearInit:-
    abolish(game/1),
    abolish(board/2),
    abolish(player/2),
    abolish(nextPlayer/2),
    abolish(toClaim/2),
    abolish(getColors/3),
    abolish(getStacks/3),
    abolish(botLevel/2),
    abolish(outputMessage/1),
	assert(outputMessage('empty')),
	setOutputMessage('success'),
    assert(game(0)), % the only assert needed, others are in utils.pl
    clearHasClaimed. % abolishes and resets

%where everything begins
% init:-
%     clearInit,
%     displayMenu,
%     getGameType(GameType),
%     startGame(GameType),
%     generateBoard(Board),

%     player(CurrentPlayer),
%     nextPlayer(NextPlayer),

%     claimableColors(C),
%     saveToClaim(C), % load the colors that can be claimed
%     saveBoard(Board), % save the board initial state
%     saveGetColors(CurrentPlayer, []),
%     saveGetColors(NextPlayer, []),
%     saveGetStacks(CurrentPlayer, []),
%     saveGetStacks(NextPlayer, []),
%     !,
%     nextPlayerGoes,
%     clearInit.