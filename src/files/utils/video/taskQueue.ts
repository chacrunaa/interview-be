import { EventEmitter } from "events";

class TaskQueue extends EventEmitter {
  private queue: (() => Promise<void>)[] = [];
  private processing = false;

  async addTask(task: () => Promise<void>) {
    this.queue.push(task);
    this.processNext();
  }

  private async processNext() {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const task = this.queue.shift();
    if (task) {
      try {
        await task();
      } catch (err) {
        console.error("Task error:", err);
      }
    }
    this.processing = false;
    if (this.queue.length > 0) {
      this.processNext();
    }
  }
}

export const taskQueue = new TaskQueue();
