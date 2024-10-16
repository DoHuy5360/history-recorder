import { useCallback, useState, Fragment, useRef } from "react";
import "./calendar.css";
import moment from "moment";

const currentMonth = moment().month() + 1;
const currentMonthName = moment().format("MMMM");
const currentDay = moment().date();
const daysInMonth = moment().daysInMonth();
const currentYear = moment().year();
const arrayOfDays = Array.from({ length: daysInMonth }, (v, k) => ++k);

const histories = [
	{
		day: 1,
		month: 9,
		year: 2024,
		tasks: [
			{ id: "t1", name: "Task 1", status: "Done" },
			{ id: "t2", name: "Task 2", status: "Done" },
			{ id: "t2", name: "Task 2", status: "Done" },
			{ id: "t2", name: "Task 2", status: "Done" },
		],
	},
	{
		day: 2,
		month: 9,
		year: 2024,
		tasks: [{ id: "t3", name: "Task 3", status: "Done" }],
	},
	{
		day: 3,
		month: 9,
		year: 2024,
		tasks: [
			{ id: "t5", name: "Task 5", status: "Done" },
			{ id: "t6", name: "Task 6", status: "Done" },
		],
	},
];

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
	const [isShowStatusColumn, setShowStatusColumn] = useState(true);
	let amountOfTaskSelected = 0;
	return (
		<div>
			<div className="table_border_style grid grid-cols-7 border-[1px] m-4">
				{histories.map((time, index) => {
					return (
						<div key={index}>
							<div
								onClick={() => {
									handleSelectDays(time.day);
								}}
								className={`${time.day === currentDay && "border-red-400"}
								${startDate && startDate === time.day && "bg-green-200"}
								${endDate && endDate === time.day && "bg-blue-200"}
								${startDate && endDate && time.day > startDate && time.day < endDate && "bg-yellow-200"}
										cell_border_style border-[1px] p-4 select-none`}>
								{time.day}
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex">
				<input type="date" value={`${moment(`${currentYear}-${currentMonth}-${startDate}`, "YYYY-M-DD").format("YYYY-MM-DD")}`} readOnly />
				<input type="date" value={`${moment(`${currentYear}-${currentMonth}-${endDate}`, "YYYY-M-DD").format("YYYY-MM-DD")}`} readOnly />
			</div>

			<div className="flex gap-1">
				<label htmlFor="">Show status</label>
				<input
					onChange={(e) => {
						setShowStatusColumn(e.target.checked);
					}}
					type="checkbox"
				/>
			</div>
			<table>
				<thead>
					<tr>
						<th>Day</th>
						<th>Task</th>
						{isShowStatusColumn && <th>status</th>}
					</tr>
				</thead>
				<tbody>
					{histories.slice(startDate ? startDate - 1 : endDate ? endDate - 1 : 0, endDate ? endDate : startDate ? startDate : 0).map((time, index) => {
						amountOfTaskSelected += time.tasks.length;
						return (
							<Fragment key={"fragment-" + index}>
								<tr>
									<td rowSpan={time.tasks.length}>{`${moment(`${time.year}-${time.month}-${time.day}`, "YYYY-M-DD").format("DD/MM/YYYY")}`}</td>
									<td>{time.tasks[0].name}</td>
									{isShowStatusColumn && <td>{time.tasks[0].status}</td>}
								</tr>
								{time.tasks.slice(1, time.tasks.length).map((task, index) => {
									return (
										<tr key={"r" + index}>
											<td>{task.name}</td>
											{isShowStatusColumn && <td>{task.status}</td>}
										</tr>
									);
								})}
							</Fragment>
						);
					})}
				</tbody>
				<tfoot>
					<tr>
						<td>
							{Math.abs((startDate ? startDate - 1 : endDate ? endDate - 1 : 0) - (endDate ? endDate : startDate ? startDate : 0))}
							&#160;day(s)
						</td>
						<td>{amountOfTaskSelected} task(s)</td>
						{isShowStatusColumn && <td>0 Done</td>}
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export default View;
