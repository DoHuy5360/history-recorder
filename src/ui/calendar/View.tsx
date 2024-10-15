import { useCallback, useState } from "react";
import "./calendar.css";
import moment from "moment";

const days = [
	{ number: 1 },
	{ number: 2 },
	{ number: 3 },
	{ number: 4 },
	{ number: 5 },
	{ number: 6 },
	{ number: 7 },
	{ number: 8 },
	{ number: 9 },
	{ number: 10 },
	{ number: 11 },
	{ number: 12 },
	{ number: 13 },
	{ number: 14 },
	{ number: 15 },
	{ number: 16 },
	{ number: 17 },
	{ number: 18 },
	{ number: 19 },
	{ number: 20 },
	{ number: 21 },
	{ number: 22 },
	{ number: 23 },
	{ number: 24 },
	{ number: 25 },
	{ number: 26 },
	{ number: 27 },
	{ number: 28 },
	{ number: 29 },
	{ number: 30 },
	{ number: 31 },
];

const today = 15;
const currentYear = 2024;
const currentMonth = 9;
function View() {
	const [startDate, setStartDate] = useState<number | null>(null);
	const [endDate, setEndDate] = useState<number | null>(null);
	const handleSelectDays = useCallback(
		(selectedDay: number) => {
			if (startDate === selectedDay) {
				setStartDate(null);
				return;
			}
			if (endDate === selectedDay) {
				setEndDate(null);
				return;
			}
			if (startDate === null) {
				if (endDate && selectedDay > endDate) {
					setStartDate(endDate);
					setEndDate(selectedDay);
				} else {
					setStartDate(selectedDay);
				}
				return;
			}
			if (endDate === null) {
				if (selectedDay < startDate) {
					setStartDate(selectedDay);
					setEndDate(startDate);
				} else {
					setEndDate(selectedDay);
				}
				return;
			}
		},
		[startDate, endDate],
	);
	return (
		<div>
			<div className="table_border_style grid grid-cols-7 border-[1px] m-4">
				{days.map((day, index) => {
					return (
						<div key={index}>
							<div
								onClick={() => {
									handleSelectDays(day.number);
								}}
								className={`${
									day.number === today && "border-red-400"
								}
								${startDate && startDate === day.number && "bg-green-200"}
								${endDate && endDate === day.number && "bg-blue-200"}
								${
									startDate &&
									endDate &&
									day.number > startDate &&
									day.number < endDate &&
									"bg-yellow-200"
								}
										cell_border_style border-[1px] p-4 select-none`}>
								{day.number}
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex">
				<input
					type="date"
					name=""
					id=""
					value={`${moment(
						`${currentYear}-${currentMonth}-${startDate}`,
						"YYYY-M-DD",
					).format("YYYY-MM-DD")}`}
					readOnly
				/>
				<input
					type="date"
					name=""
					id=""
					value={`${moment(
						`${currentYear}-${currentMonth}-${endDate}`,
						"YYYY-M-DD",
					).format("YYYY-MM-DD")}`}
					readOnly
				/>
			</div>
		</div>
	);
}

export default View;
