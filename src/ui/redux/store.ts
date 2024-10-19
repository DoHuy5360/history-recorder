import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/_table";
import calendarReducer from "./reducers/_calendar";
import createTaskFormReducer from "./reducers/_createTaskForm";

export const store = configureStore({
	reducer: {
		rootReducer,
		calendarReducer,
		createTaskFormReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
