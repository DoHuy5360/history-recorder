import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers/_table";
import calendarReducer from "./reducers/_calendar";

export const store = configureStore({
	reducer: {
		rootReducer,
		calendarReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
