export default function getCurrentScreenSize() {
	return window.getComputedStyle(document.body, ":before").content.replace(/"/g, '');
}