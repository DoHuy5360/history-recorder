import moment from "moment";
import { useEffect, useState } from "react";

function TimeRunner() {
	const [time, setTime] = useState(moment().format("HH:mm:ss"));
	useEffect(() => {
		setInterval(() => {
			setTime(moment().format("HH:mm:ss"));
		}, 2000);
	}, []);
	return <span>{time}</span>;
}

export default TimeRunner;
