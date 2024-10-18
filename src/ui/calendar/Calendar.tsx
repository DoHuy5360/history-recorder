import { useCallback, useState, Fragment, useEffect } from "react";
import "./calendar.css";
import moment from "moment";
import { BiSolidFlag } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FcCloseUpMode } from "react-icons/fc";

const currentMonth = moment().month() + 1;
const currentMonthName = moment().format("MMMM");
const currentDay = moment().date();
const daysInMonth = moment().daysInMonth();
const currentYear = moment().year();
const arrayOfDays = Array.from({ length: daysInMonth }, (v, k) => ++k);

const dayInWeek = moment(`${currentYear}-${currentMonth}-01`);

function View() {
	const [dataTasks, setDataTasks] = useState<DataTask<string> | null>(null);
	useEffect(() => {
		async function readCalendar() {
			// @ts-ignore
			const data = await window.calendar.read();
			setDataTasks(data);
		}
		readCalendar();
	}, []);
	const [startDate, setStartDate] = useState<number | null>(currentDay);
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
	const [isShowAddTaskForm, setShowAddTaskForm] = useState(false);
	const [addingTaskTime, setAddingTaskTime] = useState("");
	const [isShowStatusColumn, setShowStatusColumn] = useState(true);
	const [dayAddedTask, setDayAddedTask] = useState<number | null>(null);
	let numberOfTasksSelected = 0;
	let numberOfSelectedDaysHasTask = 0;

	return (
		<div className="p-3">
			<nav className="flex gap-2">
				<Link to="/">/calendar</Link>
			</nav>
			<div className="flex">
				<button
					className="flex bg-slate-200 rounded-sm px-2"
					onClick={async () => {
						// @ts-ignore
						window.frame.shrink();
					}}
					type="button">
					Shrink
				</button>
				<button
					className="flex bg-slate-200 rounded-sm px-2"
					onClick={async () => {
						// @ts-ignore
						window.frame.grow();
					}}
					type="button">
					Grow
				</button>
			</div>
			<div className="flex gap-2">
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
			<div className="grid grid-cols-7 gap-[1px] bg-slate-100 border-slate-100 border-[1px]">
				<div className="p-2 cell_month_name">{currentMonthName}</div>
				<div className="p-2 bg-slate-50">T2</div>
				<div className="p-2 bg-slate-50">T3</div>
				<div className="p-2 bg-slate-50">T4</div>
				<div className="p-2 bg-slate-50">T5</div>
				<div className="p-2 bg-slate-50">T6</div>
				<div className="p-2 bg-slate-50">T7</div>
				<div className="p-2 bg-slate-50">CN</div>
				{arrayOfDays.map((day: number, index) => {
					const time = dataTasks?.months[currentMonth - 1].days[day - 1];
					const date = moment(`${currentYear}-${currentMonth}-${day < 10 ? `0${day}` : day}`);
					const dayInWeek = date.day();
					const isToday = day === currentDay;
					const isSunday = dayInWeek === 0;
					return (
						<div
							key={index}
							className={`${isToday && ""}
							${
								startDate && endDate && day > startDate && day < endDate ? "bg-yellow-200" : day !== startDate && day !== endDate && "bg-white"
							} h-full p-2 select-non outline outline-0 outline-blue-300 hover:outline-1 cursor-pointer
							${startDate && startDate === day && "bg-green-200"}
							${endDate && endDate === day && "bg-blue-200"}
							`}
							style={{
								gridColumn: dayInWeek,
							}}
							onClick={() => {
								handleSelectDays(day);
							}}>
							<div className={`${isSunday && "sunday"}`}>
								<div className="flex justify-between items-center">
									<div>
										{day} - <FcCloseUpMode />
									</div>
									{isToday && (
										<div className="text-red-500 h-fit">
											<BiSolidFlag />
										</div>
									)}
								</div>
								<div className="flex">
									<div
										className={`
										${time && "grid items-center text-red-500 font-bold"} w-fit px-2 py-1 ml-auto
										`}>
										{time ? time.tasks.length : "\u200b"}
									</div>
									<div
										className="grid items-center w-fit text-transparent hover:text-slate-500"
										onClick={(e) => {
											e.stopPropagation();
											setShowAddTaskForm(true);
											setDayAddedTask(day);
											setAddingTaskTime(moment().format("HH:mm:ss"));
										}}>
										<FaPlus />
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{isShowAddTaskForm && (
				<div className="flex flex-col border-[1px] border-black">
					<div className="flex gap-3 items-center bg-slate-200 w-fit px-2 py-1 select-none">
						<span>
							{dayAddedTask}/{currentMonth}/{currentYear}
						</span>
						<button
							type="button"
							className="w-fit text-slate-400 hover:text-slate-500 rotate-45"
							onClick={() => {
								setShowAddTaskForm(false);
							}}>
							<FaPlus />
						</button>
					</div>
					<div>{addingTaskTime}</div>
					<textarea
						className="resize-none min-h-20 overflow-hidden border-[1px] p-2"
						onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
							e.currentTarget.style.height = "5px";
							e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
						}}></textarea>
					<div className="flex gap-2 items-center">
						<label htmlFor="">Category</label>
						<select className="border-[1px] bg-slate-100">
							<option value="">Coding</option>
							<option value="">Writing</option>
						</select>
					</div>
					<button
						type="button"
						className="bg-green-300 w-fit px-2 py-1 ml-auto"
						onClick={async () => {
							// @ts-ignore
							const acknowledged = await window.task.save(task_input.value);
							if (acknowledged) {
								alert("success");
							}
						}}>
						Submit
					</button>
				</div>
			)}

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
						const time = dataTasks?.months[currentMonth - 1].days[day - 1];
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
