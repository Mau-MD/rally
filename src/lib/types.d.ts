interface IQuestion {
	id: number;
	question: string;
	photo: string;
	answers: IAnswer[];
	correctAnswer: number;
	set: number;
	contest: number;
}

interface ITeams {
	id: number;
	name: string;
	solved: number;
	timeStarted: string;
	timeFinished: string;
	created_at: Date;
	contest: number;
}

interface IAnswer {
	id: number;
	answer: string;
}

interface IClue {
	id: number;
	clue: string;
	set: number;
	contest: number;
}

interface IContest {
	id: number;
	started: boolean;
	contest: number;
}