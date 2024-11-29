import { QueryProviderType } from './types.ts';
import { QueryContext } from './QueryContext.ts';

export const QueryProvider = ({ children, client }: QueryProviderType) => (
	<QueryContext.Provider value={client}>{children}</QueryContext.Provider>
);
