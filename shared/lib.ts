export function deepUpdate(obj?: Object | null, updates?: Object | null): void {
	if (!obj || !updates) return;
	for (const key in updates) {
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