type Filters = {
	filterBy?: string[];
	filterField?: string[];
};

type RawFilters = {
	filterBy: string[] | string | undefined;
	filterField: string[] | string | undefined;
};

type OffsetLimit = {
	offset: number;
	limit: number;
};

export let filters: Filters = {
	filterBy: [],
	filterField: [],
};

export let offsetLimits: OffsetLimit = {
	offset: 0,
	limit: 0,
};

export const updateFilters = (updatedFilters: RawFilters) => {
	const filterBy = updatedFilters.filterBy
		? Array.isArray(updatedFilters.filterBy)
			? updatedFilters.filterBy
			: [updatedFilters.filterBy]
		: undefined;
	const filterField = updatedFilters.filterField
		? Array.isArray(updatedFilters.filterField)
			? updatedFilters.filterField
			: [updatedFilters.filterField]
		: undefined;
	filters = {
		filterBy,
		filterField,
	};
};

export const updateOffsetLimits = (updatedLimits: OffsetLimit) => {
	offsetLimits = updatedLimits;
};
