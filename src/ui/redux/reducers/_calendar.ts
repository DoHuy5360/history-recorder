import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

interface CalendarState {
	currentMonth: number;
	currentDay: number;
	currentYear: number;
	dataTasks: null | Month<string>;
	startDate: null | number;
	endDate: null | number;
	currentMonthName: string;
	numberOfEmptyCellsBeforeFirstDayOfTheMonth: number;
	numberOfEmptyCellsAfterLastDayOfTheMonth: number;
}
const thisMoment = moment();
const currentMonthName = thisMoment.format("MMMM");
const currentMonth = thisMoment.month() + 1;
const currentDay = thisMoment.date();
const daysInMonth = thisMoment.daysInMonth();
const currentYear = thisMoment.year();
const firstDateInMonth = moment(`${currentYear}-${currentMonth}-01`);
const firstDayInWeek = firstDateInMonth.day();
const numberOfEmptyCellsBeforeFirstDayOfTheMonth = firstDayInWeek === 0 ? 6 : firstDayInWeek - 1;
const numberOfEmptyCellsAfterLastDayOfTheMonth = 35 - daysInMonth - numberOfEmptyCellsBeforeFirstDayOfTheMonth;

const initialState: CalendarState = {
	currentMonth,
	currentDay,
	currentYear,
	currentMonthName,
	dataTasks: null,
	startDate: null,
	endDate: null,
	numberOfEmptyCellsBeforeFirstDayOfTheMonth,
	numberOfEmptyCellsAfterLastDayOfTheMonth,
};

export const slice = createSlice({
	name: "CalendarState",
	initialState,
	reducers: {
		setDataTasks: (state, action: PayloadAction<Month<string>>) => {
			state.dataTasks = action.payload;
		},
		addTask: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedForAddedTask: number;
				record: Task<string>;
			}>,
		) => {
			state.dataTasks?.days[action.payload.indexOfTheDaySelectedForAddedTask].tasks.push(action.payload.record);
		},
		removeTask: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedForRemovedTask: number;
				taskIndex: number;
			}>,
		) => {
			state.dataTasks?.days[action.payload.indexOfTheDaySelectedForRemovedTask].tasks.splice(action.payload.taskIndex, 1);
		},
		updateTask: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedForUpdatedTask: number;
				taskIndex: number;
				record: Task<string>;
			}>,
		) => {
			if (state.dataTasks) state.dataTasks.days[action.payload.indexOfTheDaySelectedForUpdatedTask].tasks[action.payload.taskIndex] = action.payload.record;
		},
		setStartDate: (state, action: PayloadAction<number | null>) => {
			state.startDate = action.payload;
		},
		setEndDate: (state, action: PayloadAction<number | null>) => {
			state.endDate = action.payload;
		},
	},
});

export const { setDataTasks, setStartDate, setEndDate, addTask, removeTask, updateTask } = slice.actions;

export default slice.reducer;
