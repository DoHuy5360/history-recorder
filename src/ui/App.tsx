import "./App.css";
import Calendar from "./calendar/Calendar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
	// const [dataList, setDataList] = useState<Data[]>([]);
	// useEffect(() => {
	// 	window.electron.receive((dataFromServer: any) => {
	// 		setDataList(dataFromServer);
	// 	});
	// }, []);
	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Calendar />} />
				</Routes>
			</Router>

			{/* <ul>
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
			</button> */}
		</div>
	);
}

export default App;
