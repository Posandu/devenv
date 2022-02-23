import { useState, useEffect } from "react";
import Item from "./Item";

function MyItems() {
	const [items, setItems] = useState([]);
	return (
		<div>
			<h1>My Items</h1>
		</div>
	);
}
export default MyItems;
