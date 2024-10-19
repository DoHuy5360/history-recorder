import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CreateTaskFormState {
	isShowAddTaskForm: boolean;
	taskValue: string;
	dayAddedTask: null | number;
	addingTaskTime: string;
}

const initialState: CreateTaskFormState = {
	isShowAddTaskForm: false,
	taskValue: "",
	dayAddedTask: null,
	addingTaskTime: "",
};

export const slice = createSlice({
	name: "CreateTaskFormState",
	initialState,
	reducers: {
		setTaskValue: (state, action: PayloadAction<string>) => {
			state.taskValue = action.payload;
		},
		setDayAddedTask: (state, action: PayloadAction<number>) => {
			state.dayAddedTask = action.payload;
		},
		setShowAddTaskForm: (state, action: PayloadAction<boolean>) => {
			state.isShowAddTaskForm = action.payload;
		},
		setAddingTaskTime: (state, action: PayloadAction<string>) => {
			state.addingTaskTime = action.payload;
		},
	},
});

export const { setTaskValue, setDayAddedTask, setShowAddTaskForm, setAddingTaskTime } = slice.actions;

export default slice.reducer;
