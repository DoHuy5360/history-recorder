import { Fragment } from "react/jsx-runtime";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleStatus } from "../redux/reducers/_table";
import moment from "moment";

function Table() {
	const isShowStatusColumn = useAppSelector((state) => state.rootReducer.isShowStatusColumn);
	const { dataTasks, startDate, endDate, currentMonth, currentYear } = useAppSelector((state) => state.calendarReducer);
	const dispatch = useAppDispatch();
	let numberOfTasksSelected = 0;
	let numberOfSelectedDaysHasTask = 0;
	const rangeOfDaysSelected = dataTasks && dataTasks.days.slice(startDate ? startDate - 1 : endDate ? endDate - 1 : 0, endDate ? endDate : startDate ? startDate : 0);
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
						<th>Task/Event</th>
						<th>Did at</th>
						<th>From</th>
						<th>To</th>
						<th>Created at</th>
						{isShowStatusColumn && <th>Status</th>}
					</tr>
				</thead>
				<tbody>
					{rangeOfDaysSelected &&
						rangeOfDaysSelected.map((day, index) => {
							const date = moment(`${currentYear}-${currentMonth}-${day.day}`, "YYYY-M-DD").format("DD/MM/YYYY");
							numberOfTasksSelected += day.tasks.length;
							numberOfSelectedDaysHasTask += 1;
							const totalTaskAndEvents = day.tasks.length + day.events.length;
							const isIdleDay = totalTaskAndEvents === 0;
							const isNoTask = day.tasks.length === 0;
							return (
								<Fragment key={"fragment-" + index}>
									<tr>
										<td rowSpan={isIdleDay ? 1 : totalTaskAndEvents} colSpan={isIdleDay ? 8 : 1} className={`${isIdleDay && "empty"}`}>
											{date}
										</td>
										{!isIdleDay && (
											<Fragment>
												<td>{day.tasks[0]?.project}</td>
												<td>{day.tasks[0]?.name || day.events[0]?.name}</td>
												<td>{day.tasks[0]?.createdAt}</td>
												<td>{isNoTask && day.events[0]?.from}</td>
												<td>{isNoTask && day.events[0]?.to}</td>
												<td>{isNoTask && `${day.events[0].createdAtDay} ${day.events[0].createdAtTime}`}</td>
												{isShowStatusColumn && <td>{day.tasks[0]?.status || day.events[0]?.status}</td>}
											</Fragment>
										)}
									</tr>
									{!isIdleDay &&
										[...day.tasks, ...day.events].slice(isIdleDay ? 0 : 1, day.tasks.length + day.events.length).map((work, index) => {
											return (
												<tr key={"r" + index}>
													<td>{"project" in work && work?.project}</td>
													<td>{"name" in work && work?.name}</td>
													<td>{"createdAt" in work && work?.createdAt}</td>
													<td>{"from" in work && work?.from}</td>
													<td>{"to" in work && work?.to}</td>
													<td>
														{"createdAtDay" in work && work?.createdAtDay} {"createdAtTime" in work && work?.createdAtTime}
													</td>
													{isShowStatusColumn && <td>{work?.status}</td>}
												</tr>
											);
										})}
								</Fragment>
							);
						})}
				</tbody>
				<tfoot>
					<tr>
						<td>{numberOfSelectedDaysHasTask} day(s)</td>
						<td>? project(s)</td>
						<td>{numberOfTasksSelected} task(s)</td>
						<td>-</td>
						<td>-</td>
						<td>-</td>
						<td>-</td>
						{isShowStatusColumn && <td>0 Done</td>}
					</tr>
				</tfoot>
			</table>
		</Fragment>
	);
}

export default Table;
