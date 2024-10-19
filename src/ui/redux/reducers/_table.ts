import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface TableState {
	isShowStatusColumn: boolean;
}

// Define the initial state using that type
const initialState: TableState = {
	isShowStatusColumn: false,
};

export const slice = createSlice({
	name: "TableState",
	initialState,
	reducers: {
		toggleStatus: (state, action: PayloadAction<boolean>) => {
			state.isShowStatusColumn = action.payload;
		},
	},
});

export const { toggleStatus } = slice.actions;

export default slice.reducer;
