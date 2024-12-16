export const getDeleteToastMessage = (list: string[]) =>
	`Device${list.length > 1 ? 's' : ''} with ID${list.length > 1 ? 's' : ''}: ${list.join()} ha${
		list.length > 1 ? 've' : 's'
	} successfully been deleted`;
