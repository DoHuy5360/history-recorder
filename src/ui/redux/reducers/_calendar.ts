import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CalendarState {
	dataTasks: null | Month<string>;
	startDate: null | number;
	endDate: null | number;
}

const initialState: CalendarState = {
	dataTasks: null,
	startDate: null,
	endDate: null,
};

export const slice = createSlice({
	name: "CalendarState",
	initialState,
	reducers: {
		setDataTasks: (state, action: PayloadAction<Month<string>>) => {
			state.dataTasks = action.payload;
		},
		setStartDate: (state, action: PayloadAction<number | null>) => {
			state.startDate = action.payload;
		},
		setEndDate: (state, action: PayloadAction<number | null>) => {
			state.endDate = action.payload;
		},
	},
});

export const { setDataTasks, setStartDate, setEndDate } = slice.actions;

export default slice.reducer;
