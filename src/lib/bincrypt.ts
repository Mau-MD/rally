export const numToBinary = (
	num: number,
	charIfTrue: string = '1',
	charIfFalse: string = '0'
): string => {
	let bin = '';
	// This gives the binary in a reversed order
	while (num > 0) {
		bin += num % 2 ? charIfTrue : charIfFalse;
		num = Math.floor(num / 2);
	}
	return bin.split('').reverse().join('');
};

export const binaryToNum = (
	bin: string,
	charIfTrue: string = '1',
	charIfFalse: string = '0'
): number => {
	let num = 0;

	console.log(bin);
	for (let i = 0; i < bin.length; i++) {
		if (bin[i] === charIfTrue) {
			num += Math.pow(2, bin.length - i - 1);
		}
	}
	return num;
};
