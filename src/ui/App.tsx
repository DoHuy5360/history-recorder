import { useEffect, useState } from "react";
import "./App.css";

function App() {
	const [dataList, setDataList] = useState<Data[]>([]);
	useEffect(() => {
		window.electron.receive((dataFromServer: any) => {
			setDataList(dataFromServer);
		});
	}, []);

	return (
		<div>
			<ul>
				{dataList.map((data: any, index: number) => {
					return <li key={index}>{data.id}</li>;
				})}
			</ul>
			<button
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
