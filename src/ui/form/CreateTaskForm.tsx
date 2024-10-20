import { FaPlus, FaSave } from "react-icons/fa";
import { currentMonth, currentYear } from "../calendar/Calendar";
import { setTaskValue, setShowAddTaskForm, removeProjectSelected, addProjectSelected, addProjectSourced, removeProjectSourced } from "../redux/reducers/_createTaskForm";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addTask } from "../redux/reducers/_calendar";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import TimeRunner from "./TimeRunner";
import { BsFillClockFill } from "react-icons/bs";
import moment from "moment";

function CreateTaskForm() {
	const { taskValue, dayAddedTask, isShowAddTaskForm, addingTaskTime, projectsSource, projectsSelected } = useAppSelector((state) => state.createTaskFormReducer);
	const { dataTasks } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	const indexOfTheDaySelectedForAddedTask = dayAddedTask && dayAddedTask - 1;
	const projectsSelectedString = projectsSelected.map((project) => project.name).join(", ");
	return (
		isShowAddTaskForm &&
		indexOfTheDaySelectedForAddedTask !== null && (
			<div className="flex flex-col bg-slate-50">
				<div className="flex gap-3 items-center bg-slate-100 w-fit px-2 py-1 select-none">
					<span>
						{dayAddedTask}/{currentMonth}/{currentYear}
					</span>
					<button
						type="button"
						className="w-fit text-slate-400 hover:text-slate-500 rotate-45"
						onClick={() => {
							dispatch(setShowAddTaskForm(false));
						}}>
						<FaPlus />
					</button>
				</div>
				<table className="bg-white">
					<thead>
						<tr>
							<th>At</th>
							<th>Project(s)</th>
							<th>Task</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{dataTasks?.days[indexOfTheDaySelectedForAddedTask].tasks.map((task) => {
							return (
								<tr key={task._id}>
									<td>{task.createdAt}</td>
									<td>{task.project}</td>
									<td>{task.name}</td>
									<td>
										<div className="flex gap-2 items-center justify-center">
											<div className="text-purple-600 cursor-pointer px-2 py-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
												<BiSolidEditAlt />
											</div>
											<div className="text-red-600 cursor-pointer px-2 py-1 rounded-sm hover:outline-1 outline-0 outline outline-slate-500">
												<MdDelete />
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
									<button
										type="button"
										className="w-fit px-2 py-1 rounded-sm text-green-600 hover:outline-1 outline-0 outline outline-slate-500"
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
													dispatch(addTask({ indexOfTheDaySelectedForAddedTask, record }));
												}
											} else {
												console.log("Missing data");
											}
										}}>
										<FaSave />
									</button>
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
											className="bg-green-100 w-fit rounded-md whitespace-nowrap px-2 py-1 text-xs cursor-pointer border-[1px] border-green-600 select-none hover:bg-red-300 hover:border-red-600"
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
											className="w-fit rounded-md whitespace-nowrap px-2 py-1 text-xs cursor-pointer hover:bg-slate-100 border-[1px] border-slate-600 select-none"
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
					}}></textarea>
			</div>
		)
	);
}

export default CreateTaskForm;
