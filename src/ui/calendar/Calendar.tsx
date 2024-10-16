import { useCallback, useState, Fragment, useRef } from "react";
import "./calendar.css";
import moment from "moment";
import { BiSolidFlag } from "react-icons/bi";

const currentMonth = moment().month() + 1;
const currentMonthName = moment().format("MMMM");
const currentDay = moment().date();
const daysInMonth = moment().daysInMonth();
const currentYear = moment().year();
const arrayOfDays = Array.from({ length: daysInMonth }, (v, k) => ++k);
type History = {
	[Key: number]: Time;
};
type Task = {
	id: string;
	name: string;
	project: string;
	status: string;
};
type Time = {
	day: number;
	month: number;
	year: number;
	tasks: Task[];
};
const histories: History = {
	1: {
		day: 1,
		month: 9,
		year: 2024,
		tasks: [
			{ id: "t1", project: "GVTG", name: "Sửa lỗi GVTG", status: "Done" },
			{ id: "t2", project: "GVTG", name: "Task 2", status: "Done" },
			{ id: "t2", project: "GVTG", name: "Task 2", status: "Done" },
			{ id: "t2", project: "GVTG", name: "Task 2", status: "Done" },
		],
	},
	2: {
		day: 2,
		month: 9,
		year: 2024,
		tasks: [{ id: "t3", project: "GVTG", name: "Task 3", status: "Done" }],
	},
	3: {
		day: 3,
		month: 9,
		year: 2024,
		tasks: [
			{ id: "t5", project: "GVTG", name: "Task 5", status: "Done" },
			{ id: "t6", project: "GVTG", name: "Task 6", status: "Done" },
		],
	},
};

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
	let numberOfTasksSelected = 0;
	let numberOfSelectedDaysHasTask = 0;
	return (
		<div>
			<div className="flex gap-2 px-4">
				<div className="flex gap-1">
					<div>Day: </div>
					<div>{currentDay}</div>
				</div>
				<div className="flex gap-1">
					<div>Month: </div>
					<div>{currentMonth}</div>
				</div>
				<div className="flex gap-1">
					<div>Year: </div>
					<div>{currentYear}</div>
				</div>
			</div>
			<div className="table_border_style grid grid-cols-7 m-4 wrap_body_cell">
				<div className="p-2 cell_month_name cell_border_style">{currentMonthName}</div>
				<div className="p-2 bg-slate-100 cell_border_style">T2</div>
				<div className="p-2 bg-slate-100 cell_border_style">T3</div>
				<div className="p-2 bg-slate-100 cell_border_style">T4</div>
				<div className="p-2 bg-slate-100 cell_border_style">T5</div>
				<div className="p-2 bg-slate-100 cell_border_style">T6</div>
				<div className="p-2 bg-slate-100 cell_border_style">T7</div>
				<div className="p-2 bg-slate-100 cell_border_style">CN</div>
				{arrayOfDays.map((day: number, index) => {
					const time: Time = histories[day as keyof History];
					const isToday = day === currentDay;
					return (
						<div key={index} className="">
							<div
								onClick={() => {
									handleSelectDays(day);
								}}
								className={`${isToday && ""}
								${startDate && startDate === day && "bg-green-200"}
								${endDate && endDate === day && "bg-blue-200"}
								${startDate && endDate && day > startDate && day < endDate && "bg-yellow-200"} h-full p-2 select-none cell_border_style`}>
								<div className="flex justify-between items-center">
									<div>{day}</div>
									{isToday && (
										<div className="text-red-500 h-fit">
											<BiSolidFlag />
										</div>
									)}
								</div>
								{time && <div className="bg-red-500 w-fit px-2 py-1 rounded-full grid items-center text-white text-xs font-bold ml-auto">{time.tasks.length}</div>}
							</div>
						</div>
					);
				})}
			</div>
			<div className="flex">
				<div className="flex">
					<label htmlFor="">From</label>
					<input type="date" value={`${moment(`${currentYear}-${currentMonth}-${startDate}`, "YYYY-M-DD").format("YYYY-MM-DD")}`} readOnly />
				</div>
				<div className="flex">
					<label htmlFor="">To</label>
					<input type="date" value={`${moment(`${currentYear}-${currentMonth}-${endDate}`, "YYYY-M-DD").format("YYYY-MM-DD")}`} readOnly />
				</div>
				<div>
					{Math.abs((startDate ? startDate - 1 : endDate ? endDate - 1 : 0) - (endDate ? endDate : startDate ? startDate : 0))}
					&#160;day(s) selected
				</div>
			</div>

			<div className="flex gap-1">
				<label htmlFor="">Show status</label>
				<input
					onChange={(e) => {
						setShowStatusColumn(e.target.checked);
					}}
					type="checkbox"
					checked={isShowStatusColumn}
				/>
			</div>
			<table>
				<thead>
					<tr>
						<th>Day</th>
						<th>Project</th>
						<th>Task</th>
						{isShowStatusColumn && <th>Status</th>}
					</tr>
				</thead>
				<tbody>
					{arrayOfDays.slice(startDate ? startDate - 1 : endDate ? endDate - 1 : 0, endDate ? endDate : startDate ? startDate : 0).map((day, index) => {
						const time = histories[day as keyof History];
						if (time) {
							numberOfTasksSelected += time.tasks.length;
							numberOfSelectedDaysHasTask += 1;
							return (
								<Fragment key={"fragment-" + index}>
									<tr>
										<td rowSpan={time.tasks.length}>{`${moment(`${time.year}-${time.month}-${time.day}`, "YYYY-M-DD").format("DD/MM/YYYY")}`}</td>
										<td>{time.tasks[0].project}</td>
										<td>{time.tasks[0].name}</td>
										{isShowStatusColumn && <td>{time.tasks[0].status}</td>}
									</tr>
									{time.tasks.slice(1, time.tasks.length).map((task, index) => {
										return (
											<tr key={"r" + index}>
												<td>{task.project}</td>
												<td>{task.name}</td>
												{isShowStatusColumn && <td>{task.status}</td>}
											</tr>
										);
									})}
								</Fragment>
							);
						}
					})}
				</tbody>
				<tfoot>
					<tr>
						<td>{numberOfSelectedDaysHasTask} day(s)</td>
						<td>? project(s)</td>
						<td>{numberOfTasksSelected} task(s)</td>
						{isShowStatusColumn && <td>0 Done</td>}
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export default View;
