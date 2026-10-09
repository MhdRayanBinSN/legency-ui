/** Every effect returns a teardown function; an empty one means "did nothing". */
export type Cleanup = () => void;
