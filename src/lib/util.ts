export const MAX_PROBLEMS = 9;

export const getIdx = (solved: number, id: number) => {
	return ((solved + (id % MAX_PROBLEMS) + 1) % MAX_PROBLEMS) + 1;
};
