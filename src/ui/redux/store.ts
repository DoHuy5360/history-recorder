import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/_table";
import calendarReducer from "./reducers/_calendar";
import createTaskFormReducer from "./reducers/_createTaskForm";
import createEventFormReducer from "./reducers/_createEventForm";

export const store = configureStore({
	reducer: {
		rootReducer,
		calendarReducer,
		createTaskFormReducer,
		createEventFormReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
