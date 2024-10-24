import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CreateEventFormState {
	isShowAddEventForm: boolean;
	eventValue: string;
	eventFrom: string;
	eventTo: string;
	dayAddedEvent: null | number;
	projectsSource: Project[];
	projectsSelected: Project[];
	indexOfTheEventSelectedForEdit: null | number;
	updateEventValue: string;
	updateEventFrom: string;
	updateEventTo: string;
}

const initialState: CreateEventFormState = {
	isShowAddEventForm: false,
	eventValue: "",
	eventFrom: "",
	eventTo: "",
	dayAddedEvent: null,
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
	indexOfTheEventSelectedForEdit: null,
	updateEventValue: "",
	updateEventFrom: "",
	updateEventTo: "",
};

export const slice = createSlice({
	name: "CreateEventFormState",
	initialState,
	reducers: {
		setEventValue: (state, action: PayloadAction<string>) => {
			state.eventValue = action.payload;
		},
		setEventFrom: (state, action: PayloadAction<string>) => {
			state.eventFrom = action.payload;
		},
		setEventTo: (state, action: PayloadAction<string>) => {
			state.eventTo = action.payload;
		},
		setUpdateEventValue: (state, action: PayloadAction<string>) => {
			state.updateEventValue = action.payload;
		},
		setDayAddedEvent: (state, action: PayloadAction<number>) => {
			state.dayAddedEvent = action.payload;
		},
		setShowAddEventForm: (state, action: PayloadAction<boolean>) => {
			state.isShowAddEventForm = action.payload;
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
			state.projectsSelected.length = 0;
		},
		setIndexOfTheEventSelectedForEdit: (state, action: PayloadAction<number | null>) => {
			state.indexOfTheEventSelectedForEdit = action.payload;
		},
		setUpdateEventFrom: (state, action: PayloadAction<string>) => {
			state.updateEventFrom = action.payload;
		},
		setUpdateEventTo: (state, action: PayloadAction<string>) => {
			state.updateEventTo = action.payload;
		},
	},
});

export const {
	setEventValue,
	setDayAddedEvent,
	setShowAddEventForm,
	addProjectSelected,
	deleteProjectSelected,
	addProjectSourced,
	deleteProjectSourced,
	setIndexOfTheEventSelectedForEdit,
	setUpdateEventValue,
	clearProjectSelected,
	setUpdateEventFrom,
	setUpdateEventTo,
	setEventFrom,
	setEventTo,
} = slice.actions;

export default slice.reducer;
