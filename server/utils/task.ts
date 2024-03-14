type LogFunction = (...text: unknown[]) => void;
type Task = (o: { log: LogFunction }) => Promise<void>;

export function defineBatchTask(task: Task) {
  return (log: LogFunction) => task({ log });
}
