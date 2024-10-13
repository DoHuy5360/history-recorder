type Data = {
	id: number;
};

interface Window {
	electron: {
		receive: (callback: (params: any) => void) => void;
		fetch: () => Promise<Data>;
	};
}
