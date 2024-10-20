import { memo } from "react";

function RangeOfEmptyDay({ number }: { number: number }) {
	return Array.from({ length: number }, (_, index) => (
		<div key={"empty-start-" + index} className="bg-white">
			<div className="empty w-full h-full"></div>
		</div>
	));
}
export default memo(RangeOfEmptyDay);
