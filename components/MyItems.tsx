import Item from "./Item";

function MyItems() {
	return (
		<div>
			<h1>My Items</h1>
			{[...Array(10)].map((i, _) => (
				<Item
					id="1"
					title="My first item"
					description={`This is my firsdfgdfg df4g df4g 5d4fg54 5df4g5df4 54df5g 45d4g5 4d5gf45df4g5d4f 5d4g5df4g5d 45 \n # dfg4df5g 4d545dfg4 54d5fg4 5d4d54gd54t item`}
					bg={`${Math.floor(Math.random() * 5)}`}
					ispublic={true}
					tags={["tag1", "tag2"]}
				/>
			))}
		</div>
	);
}
export default MyItems;
