import { FaPlus, FaSave } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
	setEventValue,
	setShowAddEventForm,
	setIndexOfTheEventSelectedForEdit,
	removeProjectSelected,
	addProjectSelected,
	addProjectSourced,
	removeProjectSourced,
	setUpdateEventValue,
	clearProjectSelected,
} from "../redux/reducers/_createEventForm";
import { addEvent, addTask, removeTask, updateTask } from "../redux/reducers/_calendar";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import TimeRunner from "./TimeRunner";
import { BsFillClockFill } from "react-icons/bs";
import moment from "moment";
import { FaArrowRotateRight } from "react-icons/fa6";
import { Fragment } from "react/jsx-runtime";

function CreateEventForm() {
	const { eventValue, dayAddedEvent, isShowAddEventForm, projectsSource, projectsSelected, indexOfTheEventSelectedForEdit, updateEventValue } = useAppSelector(
		(state) => state.createEventFormReducer,
	);
	const { dataTasks, currentMonth, currentYear } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	const indexOfTheDaySelectedForAddedTask = dayAddedEvent && dayAddedEvent - 1;
	const projectsSelectedString = projectsSelected.map((project) => project.name).join(", ");
	const today = `${dayAddedEvent}/${currentMonth}/${currentYear}`;
	return (
		isShowAddEventForm &&
		indexOfTheDaySelectedForAddedTask !== null && (
			<div className="flex flex-col bg-slate-50">
				<table className="bg-white">
					<thead>
						<tr>
							<th colSpan={6}>
								<div className="flex gap-3 justify-between items-center select-none">
									<span>Event(s) | {today}</span>
									<div className="w-fit text-red-600 cursor-pointer p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
										<div
											className="rotate-45"
											onClick={() => {
												dispatch(setShowAddEventForm(false));
											}}>
											<FaPlus />
										</div>
									</div>
								</div>
							</th>
						</tr>
						<tr>
							<th>From</th>
							<th>To</th>
							<th>Name</th>
							<th>Status</th>
							<th>CreatedAt</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{dataTasks?.days[indexOfTheDaySelectedForAddedTask].events.map((event: EventDay<string>, index) => {
							const isEditing = indexOfTheEventSelectedForEdit === index;
							return (
								<tr key={event._id}>
									<td>{event.from}</td>
									<td>{event.to}</td>
									<td>
										{isEditing ? (
											<textarea
												className="resize-none min-h-20 overflow-hidden border-[1px] p-2 w-full"
												autoFocus={isEditing}
												onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
													e.currentTarget.style.height = "5px";
													e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
													dispatch(setUpdateEventValue(e.currentTarget.value));
												}}
												value={updateEventValue ? updateEventValue : event.name}></textarea>
										) : (
											event.name
										)}
									</td>
									<td>{event.status}</td>
									<td>
										{event.createdAtDay} - {event.createdAtTime}
									</td>
									<td>
										<div className="flex gap-1 items-center justify-center">
											{isEditing ? (
												<div className="flex gap-1 items-center">
													<div
														className="text-red-600 p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500 cursor-pointer"
														onClick={() => {
															dispatch(setIndexOfTheEventSelectedForEdit(null));
															dispatch(setUpdateEventValue(""));
														}}>
														<div className="rotate-45">
															<FaPlus />
														</div>
													</div>

													{updateEventValue && updateEventValue !== event.name && (
														<Fragment>
															<div
																className="text-yellow-600 p-1 rounded-sm cursor-pointer hover:outline-1 outline-0 outline outline-slate-500"
																onClick={() => {
																	dispatch(setUpdateEventValue(event.name));
																}}>
																<FaArrowRotateRight />
															</div>
															<div
																className="w-fit p-1 rounded-sm text-green-600 cursor-pointer hover:outline-1 outline-0 outline outline-slate-500"
																onClick={async () => {
																	const record = {
																		...event,
																		name: updateEventValue,
																	};
																	// @ts-ignore
																	const { acknowledged } = await window.calendar.update({
																		_id: event._id,
																		record,
																	});
																	if (acknowledged) {
																		// dispatch(
																		// 	updateEvent({
																		// 		indexOfTheDaySelectedForUpdatedTask: indexOfTheDaySelectedForAddedTask,
																		// 		taskIndex: index,
																		// 		record,
																		// 	}),
																		// );
																		dispatch(setUpdateEventValue(""));
																		dispatch(setIndexOfTheEventSelectedForEdit(null));
																	}
																}}>
																<FaSave />
															</div>
														</Fragment>
													)}
													<div
														onClick={async () => {
															// @ts-ignore
															const { acknowledged } = await window.calendar.delete({
																_id: event._id,
															});
															if (acknowledged) {
																dispatch(
																	removeTask({
																		indexOfTheDaySelectedForRemovedTask: indexOfTheDaySelectedForAddedTask,
																		taskIndex: index,
																	}),
																);
															}
														}}
														className="text-red-600 cursor-pointer p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
														<MdDelete />
													</div>
												</div>
											) : (
												<div
													onClick={() => {
														dispatch(setIndexOfTheEventSelectedForEdit(index));
													}}
													className="text-purple-600 cursor-pointer p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
													<BiSolidEditAlt />
												</div>
											)}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
					<tfoot>
						<tr>
							<td>
								<div className="flex gap-1 items-center">
									<input type="time" />
								</div>
							</td>
							<td>
								<div className="flex gap-1 items-center">
									<input type="time" />
								</div>
							</td>
							<td>{eventValue}</td>
							<td>
								<select name="">
									<option value="">None</option>
									<option value="">Suspend</option>
									<option value="">Done</option>
								</select>
							</td>
							<td>{today}</td>
							<td>
								<div className="flex justify-center">
									{eventValue && (
										<div
											className="w-fit p-1 rounded-sm text-green-600 hover:outline-1 outline-0 outline outline-slate-500 cursor-pointer"
											onClick={async () => {
												if (eventValue.trim() !== "" && dayAddedEvent) {
													const {
														record,
														acknowledged,
													}: // @ts-ignore
													{ record: EventDay<string>; acknowledged: boolean } = await window.calendarEvent.create({
														day: dayAddedEvent,
														month: currentMonth,
														record: {
															from: "<?>",
															to: "<?>",
															name: eventValue,
															status: "<?>",
															createdAtDay: today,
															createdAtTime: moment().format("HH:mm:ss"),
														},
													});
													if (acknowledged) {
														dispatch(setEventValue(""));
														dispatch(addEvent({ indexOfTheDaySelectedForAddedTask, record }));
													}
												} else {
													console.log("Missing data");
												}
											}}>
											<FaSave />
										</div>
									)}
								</div>
							</td>
						</tr>
					</tfoot>
				</table>

				<textarea
					className="resize-none min-h-20 overflow-hidden border-[1px] p-2"
					onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
						e.currentTarget.style.height = "5px";
						e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
						dispatch(setEventValue(e.currentTarget.value));
					}}
					value={eventValue}></textarea>
			</div>
		)
	);
}

export default CreateEventForm;
