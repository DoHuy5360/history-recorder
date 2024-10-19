import { useCallback, useState, Fragment, useEffect } from "react";
import "./_calendar.css";
import moment, { months } from "moment";
import { BiSolidFlag } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { FcCloseUpMode } from "react-icons/fc";
import Table from "../table/Table";

import { setDataTasks, setStartDate, setEndDate } from "../redux/reducers/_calendar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export const currentMonth = moment().month() + 1;
export const currentMonthName = moment().format("MMMM");
export const currentDay = moment().date();
export const daysInMonth = moment().daysInMonth();
export const currentYear = moment().year();
export const arrayOfDays = Array.from({ length: daysInMonth }, (v, k) => ++k);

const dayInWeek = moment(`${currentYear}-${currentMonth}-01`);

function View() {
	const { dataTasks, startDate, endDate } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	useEffect(() => {
		async function readCalendar() {
			// @ts-ignore
			const data = await window.calendar.read({ month: currentMonth });
			// Convert ObjectId to string to prevent error warning by redux
			// data.data.days.forEach((day: any) => {
			// 	if (day.tasks.length > 0) {
			// 		day.tasks.forEach((task: any) => {
			// 			task._id = task._id.toString();
			// 		});
			// 	}
			// });
			console.log(data.data);
			dispatch(setDataTasks(data.data));
		}
		readCalendar();
	}, []);
	const handleSelectDays = useCallback(
		(selectedDay: number) => {
			if (startDate === selectedDay) {
				dispatch(setStartDate(null));
				return;
			}
			if (endDate === selectedDay) {
				dispatch(setEndDate(null));
				return;
			}
			if (startDate === null) {
				if (endDate && selectedDay > endDate) {
					dispatch(setStartDate(endDate));
					dispatch(setEndDate(selectedDay));
				} else {
					dispatch(setStartDate(selectedDay));
				}
				return;
			}
			if (endDate === null) {
				if (selectedDay < startDate) {
					dispatch(setStartDate(selectedDay));
					dispatch(setEndDate(startDate));
				} else {
					dispatch(setEndDate(selectedDay));
				}
				return;
			}
		},
		[startDate, endDate],
	);
	const [isShowAddTaskForm, setShowAddTaskForm] = useState(false);
	const [addingTaskTime, setAddingTaskTime] = useState("");
	const [taskValue, setTaskValue] = useState("");
	const [dayAddedTask, setDayAddedTask] = useState<number | null>(null);

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
				{dataTasks &&
					dataTasks.days.map((day: Day<string>, index) => {
						const date = moment(`${currentYear}-${currentMonth}-${day.day < 10 ? `0${day.day}` : day.day}`);
						const dayInWeek = date.day();
						const isToday = day.day === currentDay;
						const isSunday = dayInWeek === 0;
						return (
							<div
								key={index}
								className={`${isToday && ""}
							${
								startDate && endDate && day.day > startDate && day.day < endDate ? "bg-yellow-200" : day.day !== startDate && day.day !== endDate && "bg-white"
							} h-full p-2 select-non outline outline-0 outline-blue-300 hover:outline-1 cursor-pointer
							${startDate && startDate === day.day && "bg-green-200"}
							${endDate && endDate === day.day && "bg-blue-200"}
							`}
								style={{
									gridColumn: dayInWeek,
								}}
								onClick={() => {
									handleSelectDays(day.day);
								}}>
								<div className={`${isSunday && "sunday"}`}>
									<div className="flex justify-between items-center">
										<div>
											{day.day} - <FcCloseUpMode />
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
										${day.day && "grid items-center text-red-500 font-bold"} w-fit px-2 py-1 ml-auto
										`}>
											{day.day ? day.tasks.length : "\u200b"}
										</div>
										<div
											className="grid items-center w-fit text-transparent hover:text-slate-500"
											onClick={(e) => {
												e.stopPropagation();
												setShowAddTaskForm(true);
												setDayAddedTask(day.day);
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
							setTaskValue(e.currentTarget.value);
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
							if (taskValue.trim() !== "") {
								// @ts-ignore
								const acknowledged = await window.calendar.add({
									day: dayAddedTask,
									month: currentMonth,
									record: {
										project: "<Project Name>",
										name: taskValue,
										status: "<Done>",
										createdAt: addingTaskTime,
									},
								});
								if (acknowledged) {
									alert("success");
								}
							} else {
								alert("null");
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

			<Table />
		</div>
	);
}

export default View;
