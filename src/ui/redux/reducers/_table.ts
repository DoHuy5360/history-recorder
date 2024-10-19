import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface TableState {
	isShowStatusColumn: boolean;
}

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
