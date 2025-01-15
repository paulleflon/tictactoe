export function deepUpdate(obj?: { [key: string]: any } | null, updates?: { [key: string]: any } | null): void {
	if (!obj || !updates) return;
	for (const key of Object.keys(updates)) {
		if (typeof updates[key] === 'object' && !Array.isArray(updates[key])) {
			if (!obj[key]) {
				obj[key] = {};
			}
			deepUpdate(obj[key], updates[key]);
		} else {
			obj[key] = updates[key];
		}
	}
}