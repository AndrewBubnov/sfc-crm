export const createIndexesList = (page: number, lastPage: number) => {
	const currentPage = Math.min(page, lastPage);
	const length = Math.min(lastPage, 3);
	if (currentPage === 1) {
		return Array.from({ length }, (_, index) => index + 1);
	}
	if (currentPage === lastPage) {
		return Array.from({ length }, (_, index) => {
			if (index === length - 1) return currentPage;
			if (index === length - 2) return currentPage - 1;
			return currentPage - 2;
		});
	}
	return Array.from({ length }, (_, index) => {
		if (!index) return currentPage - 1;
		if (index === 1) return currentPage;
		return currentPage + 1;
	});
};
