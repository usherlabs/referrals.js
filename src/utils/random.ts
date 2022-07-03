const defaultCharacters = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;

export const randomString = (length: number, chars = defaultCharacters) => {
	let result = "";
	for (let i = length; i > 0; i -= 1) {
		result += chars[Math.floor(Math.random() * chars.length)];
	}
	return result;
};
