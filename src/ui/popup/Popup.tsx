function Popup() {
	return (
		<div className="h-dvh w-full">
			<div className="w-full h-full bg-orange-200 shadow-md">
				<div className="flex flex-col">
					<button
						type="button"
						onClick={() => {
							// @ts-ignore
							window.popup.close();
						}}>
						Close
					</button>
					<textarea
						className="resize-none min-h-10 overflow-hidden"
						onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
							e.currentTarget.style.height = "5px";
							e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
						}}></textarea>
					<div className="flex">
						<label htmlFor="">Category</label>
						<select name="" id="">
							<option value="">Coding</option>
							<option value="">Writing</option>
						</select>
					</div>
					<button
						type="button"
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
			</div>
		</div>
	);
}
export default Popup;
