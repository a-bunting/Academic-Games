import { Component, OnInit } from '@angular/core';
import { Game, GameService, Round, Team } from '../services/game.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  teams: Team[] = [];
  rounds: Round[] = [];
  questionStyle: 1 | 2 = 1;
  gameName: string = ``;
  customGame: boolean = false;

  savedGames: Game[] = [
    {
      "name": "Academic Games Practice",
      "teams": [
        { "id": 0, "teamName": "Team 1", "correct": 0, "incorrect": 0, "score": 0, "log": [] },
        { "id": 1, "teamName": "Team 2", "correct": 0, "incorrect": 0, "score": 0, "log": [] }
      ],
      "rounds": [
        { "id": 0, "quickfire": false, "steal": true, "questions": 20, "questionValue": 1, "questionTime": 15, "first": "first" },
        { "id": 1, "quickfire": true, "steal": true, "questions": 10, "questionValue": 1, "questionTime": 15, "first": "lowest" },
        { "id": 2, "quickfire": false, "steal": true, "questions": 14, "questionValue": 2, "questionTime": 15, "first": "last" }
      ],
      "currentRound": 0,
      "currentQuestion": 0,
      "currentTeam": 0,
      "forStealId": -1,
      "questionStyle": 1,
      "playDirection": 1
    },
    {
      "name": "Academic Games Scrimmage",
      "teams": [
        { "id": 0, "teamName": "ASD", "correct": 0, "incorrect": 0, "score": 0, "log": [] },
        { "id": 1, "teamName": "AES", "correct": 0, "incorrect": 0, "score": 0, "log": [] }
      ],
      "rounds": [
        { "id": 0, "quickfire": false, "steal": true, "questions": 10, "questionValue": 1, "questionTime": 15, "first": "first" },
        { "id": 1, "quickfire": true, "steal": true, "questions": 10, "questionValue": 1, "questionTime": 15, "first": "lowest" },
        { "id": 2, "quickfire": false, "steal": true, "questions": 10, "questionValue": 2, "questionTime": 15, "first": "last" }
      ],
      "currentRound": 0,
      "currentQuestion": 0,
      "currentTeam": 0,
      "forStealId": -1,
      "questionStyle": 1,
      "playDirection": 1
    }
  ];

  constructor(
    private gameService: GameService
  ) {
    const date: Date = new Date();
    const gameName: string = `New Setup (${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()})`
    this.gameName = gameName;
  }

  ngOnInit(): void {
    this.setTeamCount(2); // set two teams to start
    this.setRoundCount(2); // set two teams to start
    this.getSavedGames();
  }

  customGameSetup(): void {
    this.customGame = true;
  }

  getSavedGames(): void {
    const local: Game[] = JSON.parse(localStorage.getItem('ad-gameSettings')!);
    if(local) { this.savedGames.push(...local); }
    console.log(local);
  }

  setTeamCount(teamNumber: any): void {
    const teams: number = teamNumber.target?.value || teamNumber;
    const deficit: number = teams - this.teams.length;

    if(deficit > 0) {
      // fill in the end with empty teams
      for(let i = 0 ; i < deficit ; i++) { this.teams.push({ id: this.teams.length, teamName: `Team ${this.teams.length + 1}`, correct: 0, incorrect: 0, score: Math.floor(Math.random() * 150), log: [] }); }
    } else if(deficit < 0) {
      // remove from the end of the array
      this.teams.splice(teams, Math.abs(deficit));
    }
  }

  setRoundCount(roundNumber: any): void {
    const rounds: number = roundNumber.target?.value || roundNumber;
    const deficit: number = rounds - this.rounds.length;

    if(deficit > 0) {
      // fill in the end with empty teams
      for(let i = 0 ; i < deficit ; i++) { this.rounds.push({ id: this.rounds.length, quickfire: false, steal: true, questions: 10, questionValue: 1, questionTime: 15, first: 'first' }); }
    } else if(deficit < 0) {
      // remove from the end of the array
      this.rounds.splice(rounds, Math.abs(deficit));
    }
  }

  /**
   * Build a new game setting
   */
  setGame(): void {
    const game: Game = this.buildGame();
    this.startGame(game);
  }

  /**
   * Load a game setting from memory
   * @param index
   */
  loadGame(index: number): void {
    const game: Game = this.savedGames[index];
    this.teams = game.teams;
    this.rounds = game.rounds;
    this.questionStyle = game.questionStyle;
    this.gameName = game.name ?? '';
  }

  /**
   * Actually starts the game off..
   * @param game
   */
  startGame(game: Game): void {
    this.gameService.newGameSetup(game);
  }

  buildGame(): Game {
    const game: Game = {
      name: this.gameName,
      teams: this.teams,
      rounds: this.rounds,
      currentRound: 0,
      currentQuestion: 0,
      currentTeam: 0,
      forStealId: -1,
      questionStyle: this.questionStyle,
      playDirection: 1
    }

    return game;
  }

  saveGameSettings(): void {
    const gameSettings: Game = this.buildGame();
    // get anyc urrent saved games.
    let local: Game[] = JSON.parse(localStorage.getItem('ad-gameSettings')!) || [];
    local.push(gameSettings);
    localStorage.setItem('ad-gameSettings', JSON.stringify(local));
    this.savedGames = local
  }

  deleteFromLocal(index: number): void {
    this.savedGames.splice(index, 1);
    localStorage.setItem('ad-gameSettings', JSON.stringify(this.savedGames));
  }

  playFromLocal(index: number): void {
    this.loadGame(index);
    this.setGame();
  }

  setQuestionStyle(value: 1 | 2): void { this.questionStyle = value; }

  setStartingTeam(id: number, event: any): void {
    if(event.target.value) this.rounds[id].first = event.target.value;
  }

}
