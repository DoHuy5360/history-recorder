import { useEffect, useState } from "react";
import "./App.css";
import View from "./calendar/View";

function App() {
	const [dataList, setDataList] = useState<Data[]>([]);
	useEffect(() => {
		window.electron.receive((dataFromServer: any) => {
			setDataList(dataFromServer);
		});
	}, []);

	return (
		<div>
			<View />
			<ul>
				{dataList.map((data: any, index: number) => {
					return <li key={index}>{data.id}</li>;
				})}
			</ul>
			<button
				className="flex"
				onClick={async () => {
					setDataList([...dataList, await window.electron.fetch()]);
				}}
				type="button">
				Fetch
			</button>
		</div>
	);
}

export default App;
