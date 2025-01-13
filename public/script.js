const STATUS_DICTIONARY = {
	'x_vote': 'Team X is voting',
	'o_vote': 'Team O is voting',
	'x_win': 'Team X won! Starting next game...',
	'o_win': 'Team O won! Starting next game...',
	'tie': 'It\'s a tie! Starting next game...'
};
const socket = io();

/* Startup logic */
let SELECTED_TEAM = localStorage.getItem('team');
if (SELECTED_TEAM)
	$('#team-selector').hide();

$('#team-selector .button').on('click', (e) => {
	SELECTED_TEAM = $(e.target).attr('data-team');
	localStorage.setItem('team', SELECTED_TEAM);
	$('#team-selector').hide();
});
gameData[SELECTED_TEAM].playerCount++;
$(`#scoreboard #${SELECTED_TEAM}-score .player-count`).text(gameData[SELECTED_TEAM].playerCount + ` player${gameData[SELECTED_TEAM].playerCount === 1 ? '' : 's'}`);

$('#team-indicator').text(SELECTED_TEAM.toUpperCase()).css('color', SELECTED_TEAM === 'x' ? 'red' : 'blue');
$('#status-message').text(STATUS_DICTIONARY[gameData.status]);
// Any step in the game (voting, winning, ...) lasts ten seconds.
// The animation is based on that.
const STEP_DURATION = 10_000;
const timeLeft = new Date(gameData.statusTimeStamp).getTime() + STEP_DURATION - Date.now();
$('#status-bar-inner').css('width', (timeLeft / STEP_DURATION * 100) + '%');
$('#status-bar-inner').css('background-color', gameData.status.startsWith('x') ? 'red' : 'blue');
$('#status-bar-inner').animate({width: '0%'}, timeLeft, 'linear');

/* Game logic */

$('.cell').on('click', (e) => {
	console.log(gameData.status);
	if (gameData.status === `${SELECTED_TEAM}_vote`) {
		const cell = $(e.target);
		const cellIndex = cell.attr('id');
		if (cell.text() === '' || cell.text() === SELECTED_TEAM.toUpperCase()) {
			socket.emit('vote', cellIndex);
		}
	}
});

socket.on('vote', (cellIndex) => {
	const currentlyVoting = gameData.status === 'x_vote' ? 'x' : 'o';
	const cell = $(`.cell#${cellIndex}`);
	let votes = parseInt(cell.attr('data-votes')) || 0;
	console.log(votes);
	votes++;
	cell.text(currentlyVoting.toUpperCase());
	cell.attr('data-votes', votes);
});


socket.on('statusChange', (status) => {
	$('.cell').removeAttr('data-votes');
	gameData.status = status;
	$('#status-message').text(STATUS_DICTIONARY[status]);
	if (status === 'x_win' || status === 'o_win' || status === 'tie') {
		setTimeout(() => {
			$('cell').text('');
			$('cell').removeAttr('data-votes');
		}, STEP_DURATION);
	};
});

socket.on('cellChange', (cellIndex, team) => {
	const cell = $(`.cell:nth-child(${cellIndex + 1})`);
	cell.text(team.toUpperCase());
	cell.attr('data-cell', team);
});