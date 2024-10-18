type Data = {
	id: number;
};

interface Window {
	electron: {
		receive: (callback: (params: any) => void) => void;
		fetch: () => Promise<Data>;
	};
}

type Task = {
	id: string;
	project: string;
	name: string;
	status: string;
};

type Day = {
	day: number;
	month: number;
	year: number;
	tasks: Task[];
};

type Month = {
	days: Day[];
};

type DataTask<T> = {
	_id: T;
	account: T;
	months: Month[];
};
