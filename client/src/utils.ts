export const createIndexesList = (page: number, lastPage: number) => {
	const length = Math.min(lastPage, 3);
	if (page === 1) return Array.from({ length }, (_, index) => index + 1);
	if (page === lastPage)
		return Array.from({ length }, (_, index) => {
			if (index === length - 1) return page;
			if (index === length - 2) return page - 1;
			return page - 2;
		});
	return Array.from({ length }, (_, index) => {
		if (!index) return page - 1;
		if (index === 1) return page;
		return page + 1;
	});
};
