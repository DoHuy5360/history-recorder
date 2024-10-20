import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CreateTaskFormState {
	isShowAddTaskForm: boolean;
	taskValue: string;
	dayAddedTask: null | number;
	addingTaskTime: string;
	projectsSource: Project[];
	projectsSelected: Project[];
}

const initialState: CreateTaskFormState = {
	isShowAddTaskForm: false,
	taskValue: "",
	dayAddedTask: null,
	addingTaskTime: "",
	projectsSource: [
		{ _id: "1", name: "Course Learning Outcomes" },
		{ _id: "2", name: "Student Information Lookup" },
		{ _id: "3", name: "Visiting Lecturer Management" },
		{ _id: "4", name: "Objective Structure Clinical Examination" },
		{ _id: "5", name: "Course Feedback" },
		{ _id: "6", name: "Lecturer Attendance Management" },
	],
	projectsSelected: [],
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
		addProjectSourced: (state, action: PayloadAction<Project>) => {
			state.projectsSource.push(action.payload);
		},
		removeProjectSourced: (state, action: PayloadAction<number>) => {
			state.projectsSource.splice(action.payload, 1);
		},
		addProjectSelected: (state, action: PayloadAction<Project>) => {
			state.projectsSelected.push(action.payload);
		},
		removeProjectSelected: (state, action: PayloadAction<number>) => {
			state.projectsSelected.splice(action.payload, 1);
		},
	},
});

export const { setTaskValue, setDayAddedTask, setShowAddTaskForm, setAddingTaskTime, addProjectSelected, removeProjectSelected, addProjectSourced, removeProjectSourced } = slice.actions;

export default slice.reducer;
