import Image from "next/image";
import React from "react";

interface Backgroundprops {
	id: any;
	size?: number;
	onClick?: any;
}

const GetBgCSS = (id: Number) => {
	if (id >= 1 && id < 5) {
		return id;
	} else {
		return 1;
	}
};

function Background({ id, size = 2, onClick = null }: Backgroundprops) {
	return (
		<>
			{id === "no" && <span></span>}

			{id !== "no" && (
				<Image
					src={"/images/bg/" + GetBgCSS(id) + ".svg"}
					alt="background"
					width={size * 10}
					height={size * 10}
					onClick={onClick}
				/>
			)}
		</>
	);
}

export default Background;
