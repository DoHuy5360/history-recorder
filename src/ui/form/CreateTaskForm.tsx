import { FaPlus } from "react-icons/fa";
import { currentMonth, currentYear } from "../calendar/Calendar";
import { setTaskValue, setShowAddTaskForm } from "../redux/reducers/_createTaskForm";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addTask, setDataTasks } from "../redux/reducers/_calendar";

function CreateTaskForm() {
	const { taskValue, dayAddedTask, isShowAddTaskForm, addingTaskTime } = useAppSelector((state) => state.createTaskFormReducer);
	const { dataTasks } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	return (
		isShowAddTaskForm && (
			<div className="flex flex-col">
				<div className="flex gap-3 items-center bg-slate-200 w-fit px-2 py-1 select-none">
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
				<div>{addingTaskTime}</div>
				<textarea
					className="resize-none min-h-20 overflow-hidden border-[1px] p-2"
					onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
						e.currentTarget.style.height = "5px";
						e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
						dispatch(setTaskValue(e.currentTarget.value));
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
					className="bg-green-0 w-fit px-2 py-1 ml-auto"
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
									project: "<Project Name>",
									name: taskValue,
									status: "<Done>",
									createdAt: addingTaskTime,
								},
							});
							if (acknowledged) {
								dispatch(addTask({ dayAddedTask, record }));
							}
						} else {
							alert("null");
						}
					}}>
					Submit
				</button>
			</div>
		)
	);
}

export default CreateTaskForm;
