import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CreateTaskFormState {
	isShowAddTaskForm: boolean;
	taskValue: string;
	dayAddedTask: null | number;
	projectsSource: Project[];
	projectsSelected: Project[];
	indexOfTheTaskSelectedForEdit: null | number;
	updateTaskValue: string;
}

const initialState: CreateTaskFormState = {
	isShowAddTaskForm: false,
	taskValue: "",
	dayAddedTask: null,
	projectsSource: [
		{ _id: "0", name: "Other" },
		{ _id: "1", name: "Course Learning Outcomes" },
		{ _id: "2", name: "Student Information Lookup" },
		{ _id: "3", name: "Visiting Lecturer Management" },
		{ _id: "4", name: "Objective Structure Clinical Examination" },
		{ _id: "5", name: "Course Feedback" },
		{ _id: "6", name: "Lecturer Attendance Management" },
	],
	projectsSelected: [],
	indexOfTheTaskSelectedForEdit: null,
	updateTaskValue: "",
};

export const slice = createSlice({
	name: "CreateTaskFormState",
	initialState,
	reducers: {
		setTaskValue: (state, action: PayloadAction<string>) => {
			state.taskValue = action.payload;
		},
		setUpdateTaskValue: (state, action: PayloadAction<string>) => {
			state.updateTaskValue = action.payload;
		},
		setDayAddedTask: (state, action: PayloadAction<number>) => {
			state.dayAddedTask = action.payload;
		},
		setShowAddTaskForm: (state, action: PayloadAction<boolean>) => {
			state.isShowAddTaskForm = action.payload;
		},
		addProjectSourced: (state, action: PayloadAction<Project>) => {
			state.projectsSource.push(action.payload);
		},
		deleteProjectSourced: (state, action: PayloadAction<number>) => {
			state.projectsSource.splice(action.payload, 1);
		},
		addProjectSelected: (state, action: PayloadAction<Project>) => {
			state.projectsSelected.push(action.payload);
		},
		deleteProjectSelected: (state, action: PayloadAction<number>) => {
			state.projectsSelected.splice(action.payload, 1);
		},
		clearProjectSelected: (state) => {
			Array.prototype.push.apply(state.projectsSource, state.projectsSelected);
			state.projectsSelected.length = 0;
		},
		setIndexOfTheTaskSelectedForEdit: (state, action: PayloadAction<number | null>) => {
			state.indexOfTheTaskSelectedForEdit = action.payload;
		},
	},
});

export const {
	setTaskValue,
	setDayAddedTask,
	setShowAddTaskForm,
	addProjectSelected,
	deleteProjectSelected,
	addProjectSourced,
	deleteProjectSourced,
	setIndexOfTheTaskSelectedForEdit,
	setUpdateTaskValue,
	clearProjectSelected,
} = slice.actions;

export default slice.reducer;
