import { useCallback, useEffect } from "react";
import "./_calendar.css";
import moment from "moment";
import { BiSolidEditAlt, BiSolidFlag } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaPlus, FaStar } from "react-icons/fa";
import { FcCloseUpMode } from "react-icons/fc";
import Table from "../table/Table";

import { setDayAddedTask, setIndexOfTheTaskSelectedForEdit, setShowAddTaskForm } from "../redux/reducers/_createTaskForm";
import { setDataTasks, setStartDate, setEndDate } from "../redux/reducers/_calendar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import CreateTaskForm from "../form/CreateTaskForm";
import RangeOfEmptyDay from "./RangeOfEmptyDay";
import Navigate from "./Navigate";
import CreateEventForm from "../form/CreateEventForm";
import { setDayAddedEvent, setIndexOfTheEventSelectedForEdit, setShowAddEventForm } from "../redux/reducers/_createEventForm";

function View() {
	const { isShowAddTaskForm, dayAddedTask } = useAppSelector((state) => state.createTaskFormReducer);
	const { isShowAddEventForm } = useAppSelector((state) => state.createEventFormReducer);
	const { dataTasks, startDate, endDate, currentDay, currentMonth, currentYear, currentMonthName, numberOfEmptyCellsAfterLastDayOfTheMonth, numberOfEmptyCellsBeforeFirstDayOfTheMonth } =
		useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	useEffect(() => {
		async function readCalendar() {
			// @ts-ignore
			const data = await window.calendar.read({ month: currentMonth });
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
	return (
		<div className="p-3">
			<Navigate />
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
				<RangeOfEmptyDay number={numberOfEmptyCellsBeforeFirstDayOfTheMonth} />
				{dataTasks &&
					dataTasks.days.map((day: Day<string>, index) => {
						const date = moment(`${currentYear}-${currentMonth}-${day.day < 10 ? `0${day.day}` : day.day}`);
						const dayInWeek = date.day();

						const isToday = day.day === currentDay;
						const isSunday = dayInWeek === 0;
						const numberOfTasks = day.tasks.length;
						const isStartDay = startDate === day.day;
						const isEndDay = endDate === day.day;
						const isDaysBetweenStartAndEnd = startDate && endDate && day.day > startDate && day.day < endDate;
						const isDayEdited = isShowAddTaskForm && dayAddedTask === day.day;
						return (
							<div
								key={index}
								className={`${isToday && ""}
							${
								isDaysBetweenStartAndEnd ? `bg-yellow-100` : day.day !== startDate && day.day !== endDate && "bg-white"
							} h-full p-2 select-non outline outline-0 outline-slate-400 hover:outline-1 cursor-pointer transition-colors ease-in-out duration-100
							${isStartDay && "bg-green-100"}
							${isEndDay && "bg-blue-100"}
							${isDayEdited && "outline-2 outline-dashed outline-purple-1 z-10"}
							`}
								style={{
									gridColumn: dayInWeek,
									transitionDelay: isStartDay || isEndDay ? "0ms" : `${day.day}0ms`,
								}}
								onClick={() => {
									handleSelectDays(day.day);
								}}>
								<div className={`${isSunday && "sunday"}`}>
									<div className="flex flex-col">
										<div className="flex justify-between items-center">
											<div>{day.day}</div>
											{isToday && (
												<div className="text-red-500 h-fit">
													<BiSolidFlag />
												</div>
											)}
										</div>
										<div className="flex items-center gap-1">
											{day.hasSpecialEvent && <FcCloseUpMode />}
											{day.events.length > 0 && (
												<div className="text-yellow-600">
													<FaStar />
												</div>
											)}
										</div>
									</div>
									<div className="flex justify-between">
										{isDayEdited ? (
											<div
												onClick={(e) => {
													e.stopPropagation();
												}}
												className="grid items-center w-fit text-purple-600 hover:text-slate-500">
												<BiSolidEditAlt />
											</div>
										) : (
											<div
												className="grid items-center w-fit text-transparent hover:text-slate-500"
												onClick={(e) => {
													e.stopPropagation();
													dispatch(setShowAddTaskForm(true));
													dispatch(setShowAddEventForm(true));
													dispatch(setDayAddedTask(day.day));
													dispatch(setDayAddedEvent(day.day));
													dispatch(setIndexOfTheTaskSelectedForEdit(null));
													dispatch(setIndexOfTheEventSelectedForEdit(null));
												}}>
												<FaPlus />
											</div>
										)}
										<div
											className={`
										${day.day && "grid items-center text-red-500 font-bold"} w-fit px-2 py-1
										`}>
											{day.day && numberOfTasks > 0 ? numberOfTasks : "\u200b"}
										</div>
									</div>
								</div>
							</div>
						);
					})}

				<RangeOfEmptyDay number={numberOfEmptyCellsAfterLastDayOfTheMonth} />
			</div>
			{(startDate || endDate) && (
				<div className="flex">
					<div className="flex">
						<label htmlFor="">From</label>
						<input type="date" value={`${moment(`${currentYear}-${currentMonth}-${startDate}`, "YYYY-M-DD").format("YYYY-MM-DD")}`} readOnly />
					</div>
					{endDate && (
						<div className="flex">
							<label htmlFor="">To</label>
							<input type="date" value={`${moment(`${currentYear}-${currentMonth}-${endDate}`, "YYYY-M-DD").format("YYYY-MM-DD")}`} readOnly />
						</div>
					)}
					<div>
						{Math.abs((startDate ? startDate - 1 : endDate ? endDate - 1 : 0) - (endDate ? endDate : startDate ? startDate : 0))}
						&#160;day(s) selected
					</div>
				</div>
			)}
			<br />
			{isShowAddTaskForm && <CreateTaskForm />}
			<br />
			{isShowAddEventForm && <CreateEventForm />}
			{(startDate || endDate) && <Table />}
		</div>
	);
}

export default View;
