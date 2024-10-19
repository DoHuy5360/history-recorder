import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@reduxjs/toolkit/query";

// Define a type for the slice state
interface CounterState {
	isShowStatusColumn: boolean;
}

// Define the initial state using that type
const initialState: CounterState = {
	isShowStatusColumn: false,
};

export const counterSlice = createSlice({
	name: "rootReducer",
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		toggle: (state, action: PayloadAction<boolean>) => {
			state.isShowStatusColumn = action.payload;
		},
		// Use the PayloadAction type to declare the contents of `action.payload`
		// incrementByAmount: (state, action: PayloadAction<number>) => {
		// 	state.isShowStatusColumn += action.payload;
		// },
	},
});

export const { toggle } = counterSlice.actions;

export default counterSlice.reducer;
