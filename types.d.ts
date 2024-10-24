type Data = {
	id: number;
};

interface Window {
	electron: {
		receive: (callback: (params: any) => void) => void;
		fetch: () => Promise<Data>;
	};
}

type Task<T> = {
	_id: T;
	project: string;
	name: string;
	status: string;
	createdAt: string;
};
type EventDay<T> = {
	_id: T;
	name: string;
	from: string;
	to: string;
	status: string;
	createdAtDay: string;
	createdAtTime: string;
};

type Day<T> = {
	_id: T;
	day: number;
	tasks: Task<T>[];
	events: EventDay<T>[];
	hasSpecialEvent?: boolean;
};

type Month<T> = {
	month: number;
	days: Day<T>[];
};

type DataTask<T> = {
	_id: T;
	account: T;
	months: Month<T>[];
};

type Project = {
	_id: string;
	name?: string;
};
