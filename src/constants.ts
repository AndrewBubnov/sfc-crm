export const BASE_URL = 'http://localhost:8000';
export const BASE_LIMIT = 10;
export const MIN_SEARCH_STRING_LENGTH = 3;
export const MAX_SEARCH_STRING_LENGTH = 50;

export const searchResolver = (text: string) =>
	!text.length || (text.length >= MIN_SEARCH_STRING_LENGTH && text.length <= MAX_SEARCH_STRING_LENGTH);
