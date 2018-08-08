

function getGridProperties(p) {

	let style = {
		gridColumnStart: p.x?p.x:"initial",
		msGridColumnStart: p.x?p.x:"initial",
		gridRowStart: p.y?p.y:"initial",
		msGridRowStart: p.y?p.y:"initial",
		msGridColumnSpan: p.w?p.w:"initial",
		msGridRowSpan: p.h?p.h:"initial",
		//optional
		gridColumnEnd: p.endX?p.endX:"initial",
		msGridColumnEnd: p.endX?p.endX:"initial",
		gridRowEnd: p.endY?p.endY:"initial",
		msGridRowEnd: p.endY?p.endY:"initial",
	};
	if (p.x && p.w) {
		style.gridColumn = p.x + " / span " + p.w;
	}
	if (p.y && p.h) {
		style.gridRow = p.y + " / span " + p.h;
	}
	return style;
}

export default getGridProperties;

