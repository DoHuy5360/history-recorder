import { Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleStatus } from "../redux/reducers/_table";
import moment from "moment";

function Table() {
	const isShowStatusColumn = useAppSelector((state) => state.rootReducer.isShowStatusColumn);
	const { dataTasks, startDate, endDate, currentMonth, currentDay, daysInMonth, currentYear } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	let numberOfTasksSelected = 0;
	let numberOfSelectedDaysHasTask = 0;
	return (
		<Fragment>
			<div className="flex gap-1">
				<label htmlFor="">Show status</label>
				<input
					onChange={(e) => {
						dispatch(toggleStatus(e.target.checked));
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
						<th>At</th>
						{isShowStatusColumn && <th>Status</th>}
					</tr>
				</thead>
				<tbody>
					{dataTasks &&
						dataTasks.days.slice(startDate ? startDate - 1 : endDate ? endDate - 1 : 0, endDate ? endDate : startDate ? startDate : 0).map((day, index) => {
							if (day && day.tasks.length !== 0) {
								numberOfTasksSelected += day.tasks.length;
								numberOfSelectedDaysHasTask += 1;
								return (
									<Fragment key={"fragment-" + index}>
										<tr>
											<td rowSpan={day.tasks.length}>{`${moment(`${currentYear}-${currentMonth}-${day.day}`, "YYYY-M-DD").format("DD/MM/YYYY")}`}</td>
											<td>{day.tasks[0]?.project}</td>
											<td>{day.tasks[0]?.name}</td>
											<td>{day.tasks[0]?.createdAt}</td>
											{isShowStatusColumn && <td>{day.tasks[0]?.status}</td>}
										</tr>
										{day.tasks.slice(1, day.tasks.length).map((task, index) => {
											return (
												<tr key={"r" + index}>
													<td>{task?.project}</td>
													<td>{task?.name}</td>
													<td>{task?.createdAt}</td>
													{isShowStatusColumn && <td>{task?.status}</td>}
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
						<td>-</td>
						{isShowStatusColumn && <td>0 Done</td>}
					</tr>
				</tfoot>
			</table>
		</Fragment>
	);
}

export default Table;
