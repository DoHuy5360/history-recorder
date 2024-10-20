import { FaPlus, FaSave } from "react-icons/fa";
import { currentMonth, currentYear } from "../calendar/Calendar";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
	setTaskValue,
	setShowAddTaskForm,
	setIndexOfTheTaskSelectedForEdit,
	removeProjectSelected,
	addProjectSelected,
	addProjectSourced,
	removeProjectSourced,
	setUpdateTaskValue,
	clearProjectSelected,
} from "../redux/reducers/_createTaskForm";
import { addTask, removeTask, updateTask } from "../redux/reducers/_calendar";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import TimeRunner from "./TimeRunner";
import { BsFillClockFill } from "react-icons/bs";
import moment from "moment";
import { FaArrowRotateRight } from "react-icons/fa6";
import { Fragment } from "react/jsx-runtime";

function CreateTaskForm() {
	const { taskValue, dayAddedTask, isShowAddTaskForm, addingTaskTime, projectsSource, projectsSelected, indexOfTheTaskSelectedForEdit, updateTaskValue } = useAppSelector(
		(state) => state.createTaskFormReducer,
	);
	const { dataTasks } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	const indexOfTheDaySelectedForAddedTask = dayAddedTask && dayAddedTask - 1;
	const projectsSelectedString = projectsSelected.map((project) => project.name).join(", ");
	return (
		isShowAddTaskForm &&
		indexOfTheDaySelectedForAddedTask !== null && (
			<div className="flex flex-col bg-slate-50">
				<table className="bg-white">
					<thead>
						<tr>
							<th colSpan={4}>
								<div className="flex gap-3 justify-between items-center select-none">
									<span>
										{dayAddedTask}/{currentMonth}/{currentYear}
									</span>
									<div className="w-fit text-red-600 cursor-pointer p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
										<div
											className="rotate-45"
											onClick={() => {
												dispatch(setShowAddTaskForm(false));
											}}>
											<FaPlus />
										</div>
									</div>
								</div>
							</th>
						</tr>
						<tr>
							<th>At</th>
							<th>Project(s)</th>
							<th>Task</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{dataTasks?.days[indexOfTheDaySelectedForAddedTask].tasks.map((task, index) => {
							const isEditing = indexOfTheTaskSelectedForEdit === index;
							return (
								<tr key={task._id}>
									<td>{task.createdAt}</td>
									<td className="max-w-40">{task.project}</td>
									<td>
										{isEditing ? (
											<textarea
												className="resize-none min-h-20 overflow-hidden border-[1px] p-2 w-full"
												autoFocus={isEditing}
												onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
													e.currentTarget.style.height = "5px";
													e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
													dispatch(setUpdateTaskValue(e.currentTarget.value));
												}}
												value={updateTaskValue ? updateTaskValue : task.name}></textarea>
										) : (
											task.name
										)}
									</td>
									<td>
										<div className="flex gap-1 items-center justify-center">
											{isEditing ? (
												<div className="flex gap-1 items-center">
													<div
														className="text-red-600 p-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500 cursor-pointer"
														onClick={() => {
															dispatch(setIndexOfTheTaskSelectedForEdit(null));
															dispatch(setUpdateTaskValue(""));
														}}>
														<div className="rotate-45">
															<FaPlus />
														</div>
													</div>

													{updateTaskValue && updateTaskValue !== task.name && (
														<Fragment>
															<div
																className="text-yellow-600 p-1 rounded-sm cursor-pointer hover:outline-1 outline-0 outline outline-slate-500"
																onClick={() => {
																	dispatch(setUpdateTaskValue(task.name));
																}}>
																<FaArrowRotateRight />
															</div>
															<div
																className="w-fit p-1 rounded-sm text-green-600 cursor-pointer hover:outline-1 outline-0 outline outline-slate-500"
																onClick={async () => {
																	const record = {
																		...task,
																		name: updateTaskValue,
																	};
																	// @ts-ignore
																	const { acknowledged } = await window.calendar.update({
																		_id: task._id,
																		record,
																	});
																	if (acknowledged) {
																		dispatch(
																			updateTask({
																				indexOfTheDaySelectedForUpdatedTask: indexOfTheDaySelectedForAddedTask,
																				taskIndex: index,
																				record,
																			}),
																		);
																		dispatch(setUpdateTaskValue(""));
																		dispatch(setIndexOfTheTaskSelectedForEdit(null));
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
																_id: task._id,
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
														dispatch(setIndexOfTheTaskSelectedForEdit(index));
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
									<TimeRunner />
									<div className="text-blue-600">
										<BsFillClockFill />
									</div>
								</div>
							</td>
							<td className="max-w-40">{projectsSelectedString}</td>
							<td>{taskValue}</td>
							<td>
								<div className="flex justify-center">
									{taskValue && projectsSelectedString && (
										<div
											className="w-fit p-1 rounded-sm text-green-600 hover:outline-1 outline-0 outline outline-slate-500 cursor-pointer"
											onClick={async () => {
												if (taskValue.trim() !== "" && dayAddedTask) {
													const {
														record,
														acknowledged,
													}: // @ts-ignore
													{ record: Task<string>; acknowledged: boolean } = await window.calendar.add({
														day: dayAddedTask,
														month: currentMonth,
														record: {
															project: projectsSelectedString,
															name: taskValue,
															status: "<?>",
															createdAt: moment().format("HH:mm:ss"),
														},
													});
													if (acknowledged) {
														dispatch(setTaskValue(""));
														dispatch(clearProjectSelected());
														dispatch(addTask({ indexOfTheDaySelectedForAddedTask, record }));
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
				<div className="flex flex-col gap-1 bg-white py-1">
					{projectsSelected.length > 0 && (
						<div className="flex items-center gap-1">
							<div>Selected: </div>
							<div className="flex gap-2 items-center flex-wrap">
								{projectsSelected.map((project: Project, index) => {
									return (
										<div
											key={"project-" + index}
											className="bg-green-100 w-fit rounded-md whitespace-nowrap p-1 text-xs cursor-pointer border-[1px] border-green-600 select-none hover:bg-red-300 hover:border-red-600"
											onClick={() => {
												dispatch(removeProjectSelected(index));
												dispatch(addProjectSourced(project));
											}}>
											<div className="flex items-center gap-2">
												<div>{project.name}</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
					{projectsSource.length > 0 && (
						<div className="flex items-center gap-1">
							<div>Project(s): </div>
							<div className="flex gap-2 items-center flex-wrap">
								{projectsSource.map((project: Project, index) => {
									return (
										<div
											key={"project-" + index}
											className="w-fit rounded-md whitespace-nowrap p-1 text-xs cursor-pointer hover:bg-slate-100 border-[1px] border-slate-600 select-none"
											onClick={() => {
												dispatch(addProjectSelected(project));
												dispatch(removeProjectSourced(index));
											}}>
											<div>{project.name}</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
				<textarea
					className="resize-none min-h-20 overflow-hidden border-[1px] p-2"
					onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
						e.currentTarget.style.height = "5px";
						e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
						dispatch(setTaskValue(e.currentTarget.value));
					}}
					value={taskValue}></textarea>
			</div>
		)
	);
}

export default CreateTaskForm;
