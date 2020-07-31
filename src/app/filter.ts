export interface Filter {
    name:  string;
    value: any;
}

/** Checks whether an object is of type Filter. */
export function isFilter(filter: any): filter is Filter {
    return filter.name !== undefined;
}

/** 
 * Finds and returns the first filter within a list that matches the name.
 * @returns undefined if no match is found
 */
export function findFilterByName(name: string, filters: Filter[]): Filter {
    return filters.find(f => f.name === name);
}

/** Get a list of filter names from a filter array. */
export function getFilterNames(filters: Filter[]): string[] {
    return filters.map(f => f.name)
}

/** Get a list of filter values from a filter array. */
export function getFilterValues(filters: Filter[]): any[] {
    return filters.map(f => f.value)
}
