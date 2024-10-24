import { FaPlus, FaSave } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
	setEventValue,
	setShowAddEventForm,
	setIndexOfTheEventSelectedForEdit,
	deleteProjectSelected,
	addProjectSelected,
	addProjectSourced,
	deleteProjectSourced,
	setUpdateEventValue,
	clearProjectSelected,
	setUpdateEventFrom,
	setUpdateEventTo,
	setEventFrom,
	setEventTo,
} from "../redux/reducers/_createEventForm";
import { addEvent, deleteEvent, updateEvent } from "../redux/reducers/_calendar";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import moment from "moment";
import { FaArrowRotateRight } from "react-icons/fa6";
import { Fragment } from "react/jsx-runtime";

function CreateEventForm() {
	const { eventValue, eventFrom, eventTo, dayAddedEvent, isShowAddEventForm, projectsSource, projectsSelected, indexOfTheEventSelectedForEdit, updateEventValue, updateEventFrom, updateEventTo } =
		useAppSelector((state) => state.createEventFormReducer);
	const { dataTasks, currentMonth, currentYear } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	const indexOfTheDaySelectedForAddedEvent = dayAddedEvent && dayAddedEvent - 1;
	const projectsSelectedString = projectsSelected.map((project) => project.name).join(", ");
	const today = `${dayAddedEvent}/${currentMonth}/${currentYear}`;
	return (
		isShowAddEventForm &&
		indexOfTheDaySelectedForAddedEvent !== null && (
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
												dispatch(setIndexOfTheEventSelectedForEdit(null));
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
						{dataTasks?.days[indexOfTheDaySelectedForAddedEvent].events.map((event: EventDay<string>, index) => {
							const isEditing = indexOfTheEventSelectedForEdit === index;
							return isEditing ? (
								<tr key={event._id}>
									<td>
										<input
											type="time"
											value={updateEventFrom}
											onChange={(e) => {
												dispatch(setUpdateEventFrom(e.currentTarget.value));
											}}
										/>
									</td>
									<td>
										<input
											type="time"
											value={updateEventTo}
											onChange={(e) => {
												dispatch(setUpdateEventTo(e.currentTarget.value));
											}}
										/>
									</td>
									<td>
										<textarea
											className="resize-none overflow-hidden border-[1px] p-2 w-full"
											value={updateEventValue}
											autoFocus={isEditing}
											onFocus={(e) => {
												e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
											}}
											onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
												e.currentTarget.style.height = "5px";
												e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
												dispatch(setUpdateEventValue(e.currentTarget.value));
											}}></textarea>
									</td>
									<td>{event.status}</td>
									<td>
										{event.createdAtDay} - {event.createdAtTime}
									</td>
									<td>
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

											{isEditing && (
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
																from: updateEventFrom,
																to: updateEventTo,
															};
															// @ts-ignore
															const { acknowledged } = await window.calendarEvent.update({
																_id: event._id,
																record,
															});
															if (acknowledged) {
																dispatch(
																	updateEvent({
																		indexOfTheDaySelectedForUpdatedEvent: indexOfTheDaySelectedForAddedEvent,
																		eventIndex: index,
																		record,
																	}),
																);
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
													const { acknowledged } = await window.calendarEvent.delete({
														_id: event._id,
													});
													if (acknowledged) {
														dispatch(
															deleteEvent({
																indexOfTheDaySelectedFordeletedEvent: indexOfTheDaySelectedForAddedEvent,
																eventIndex: index,
															}),
														);
													}
												}}
												className="text-red-600 cursor-pointer p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
												<MdDelete />
											</div>
										</div>
									</td>
								</tr>
							) : (
								<tr key={event._id}>
									<td>{event.from}</td>
									<td>{event.to}</td>
									<td>{event.name}</td>
									<td>{event.status}</td>
									<td>
										{event.createdAtDay} - {event.createdAtTime}
									</td>
									<td>
										<div className="flex gap-1 items-center justify-center">
											<div
												onClick={() => {
													dispatch(setUpdateEventValue(event.name));
													dispatch(setIndexOfTheEventSelectedForEdit(index));
													dispatch(setUpdateEventFrom(event.from));
													dispatch(setUpdateEventTo(event.to));
												}}
												className="text-purple-600 cursor-pointer p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
												<BiSolidEditAlt />
											</div>
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
									<input
										type="time"
										value={eventFrom}
										onChange={(e) => {
											dispatch(setEventFrom(e.currentTarget.value));
										}}
									/>
								</div>
							</td>
							<td>
								<div className="flex gap-1 items-center">
									<input
										type="time"
										value={eventTo}
										onChange={(e) => {
											dispatch(setEventTo(e.currentTarget.value));
										}}
									/>
								</div>
							</td>
							<td>
								<textarea
									className="resize-none overflow-hidden border-[1px] p-2 w-full"
									value={eventValue}
									onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
										e.currentTarget.style.height = "5px";
										e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
										dispatch(setEventValue(e.currentTarget.value));
									}}></textarea>
							</td>
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
															from: eventFrom,
															to: eventTo,
															name: eventValue,
															status: "<?>",
															createdAtDay: today,
															createdAtTime: moment().format("HH:mm:ss"),
														},
													});
													if (acknowledged) {
														dispatch(setIndexOfTheEventSelectedForEdit(null));
														dispatch(setEventValue(""));
														dispatch(addEvent({ indexOfTheDaySelectedForAddedEvent, record }));
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
			</div>
		)
	);
}

export default CreateEventForm;
