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
	timeEnd: string | Date;
	created_at: Date;
	contest: number;
	teamId: string;
	hasSolvedYet: boolean;
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
