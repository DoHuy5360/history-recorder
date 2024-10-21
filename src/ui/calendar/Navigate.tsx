import { memo } from "react";
import { Link } from "react-router-dom";

function Navigate() {
	return (
		<div className="flex border-b-[1px] border-slate-100">
			<nav className="flex gap-2 px-2 bg-slate-100">
				<Link to="/">calendar</Link>
			</nav>
			<nav className="flex gap-2 px-2">
				<Link to="/">calendar</Link>
			</nav>
		</div>
	);
}

export default memo(Navigate);
