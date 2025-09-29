

export function partialFilter<T>(obj: T, filter: string, keys: (keyof T)[]): boolean {
    return keys.some((key) => {
        if(typeof obj[key] === 'string') {
            return obj[key].toLowerCase().includes(filter.toLowerCase());
        } else {
            return obj[key] === filter;
        }
    });
}

export function exactFilter<T>(obj: T, filter: string, keys: (keyof T)[]): boolean {
    return keys.some((key) => {
        if(typeof obj[key] === 'string') {
            return obj[key].toLowerCase() === filter.toLowerCase();
        } else {
            return obj[key] === filter;
        }
    });
}