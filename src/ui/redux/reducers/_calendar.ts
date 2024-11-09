import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import { addZeroFormat } from "../../utils";

interface CalendarState {
	currentMonth: number;
	currentDay: number;
	currentYear: number;
	daysInMonth: number;
	dataTasks: null | Month<string>;
	startDate: null | number;
	endDate: null | number;
	currentMonthName: string;
	numberOfEmptyCellsBeforeFirstDayOfTheMonth: number;
	numberOfEmptyCellsAfterLastDayOfTheMonth: number;
}
function getFirstDateInMonth(year: number, month: number) {
	return moment(`${year}-${addZeroFormat(month)}-01`);
}
function getNumberOfEmptyCellsBeforeFirstDayOfTheMonth(firstDayAsWeek: number) {
	return firstDayAsWeek === 0 ? 6 : firstDayAsWeek - 1;
}
function getNumberOfEmptyCellsAfterLastDayOfTheMonth(daysInMonth: number, numberOfEmptyCellsBeforeFirstDayOfTheMonth: number) {
	return (numberOfEmptyCellsBeforeFirstDayOfTheMonth == 6 ? 42 : 35) - daysInMonth - numberOfEmptyCellsBeforeFirstDayOfTheMonth;
}
const thisMoment = moment();
const currentMonthName = thisMoment.format("MMMM");
export const currentActualMonth = thisMoment.month() + 1;
const currentDay = thisMoment.date();
const daysInMonth = thisMoment.daysInMonth();
const currentYear = thisMoment.year();
const firstDateInMonth = getFirstDateInMonth(currentYear, currentActualMonth);
const firstDayAsWeek = firstDateInMonth.day();
const numberOfEmptyCellsBeforeFirstDayOfTheMonth = getNumberOfEmptyCellsBeforeFirstDayOfTheMonth(firstDayAsWeek);
const numberOfEmptyCellsAfterLastDayOfTheMonth = getNumberOfEmptyCellsAfterLastDayOfTheMonth(daysInMonth, numberOfEmptyCellsBeforeFirstDayOfTheMonth);

const initialState: CalendarState = {
	currentMonth: currentActualMonth,
	currentDay,
	currentYear,
	daysInMonth,
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
		setCurrentMonth: (state, action: PayloadAction<number>) => {
			state.currentMonth = action.payload;
			state.daysInMonth = moment(`${state.currentYear}-${addZeroFormat(state.currentMonth)}`).daysInMonth();
			state.numberOfEmptyCellsBeforeFirstDayOfTheMonth = getNumberOfEmptyCellsBeforeFirstDayOfTheMonth(getFirstDateInMonth(state.currentYear, state.currentMonth).day());
			state.numberOfEmptyCellsAfterLastDayOfTheMonth = getNumberOfEmptyCellsAfterLastDayOfTheMonth(state.daysInMonth, state.numberOfEmptyCellsBeforeFirstDayOfTheMonth);
			state.startDate = null;
			state.endDate = null;
		},
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
		addEvent: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedForAddedEvent: number;
				record: EventDay<string>;
			}>,
		) => {
			state.dataTasks?.days[action.payload.indexOfTheDaySelectedForAddedEvent].events.push(action.payload.record);
		},
		deleteTask: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedFordeletedTask: number;
				taskIndex: number;
			}>,
		) => {
			state.dataTasks?.days[action.payload.indexOfTheDaySelectedFordeletedTask].tasks.splice(action.payload.taskIndex, 1);
		},
		deleteEvent: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedFordeletedEvent: number;
				eventIndex: number;
			}>,
		) => {
			state.dataTasks?.days[action.payload.indexOfTheDaySelectedFordeletedEvent].events.splice(action.payload.eventIndex, 1);
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
		updateEvent: (
			state,
			action: PayloadAction<{
				indexOfTheDaySelectedForUpdatedEvent: number;
				eventIndex: number;
				record: EventDay<string>;
			}>,
		) => {
			if (state.dataTasks) state.dataTasks.days[action.payload.indexOfTheDaySelectedForUpdatedEvent].events[action.payload.eventIndex] = action.payload.record;
		},
		setStartDate: (state, action: PayloadAction<number | null>) => {
			state.startDate = action.payload;
		},
		setEndDate: (state, action: PayloadAction<number | null>) => {
			state.endDate = action.payload;
		},
	},
});

export const { setCurrentMonth, setDataTasks, setStartDate, setEndDate, addTask, deleteTask, updateTask, addEvent, updateEvent, deleteEvent } = slice.actions;

export default slice.reducer;
