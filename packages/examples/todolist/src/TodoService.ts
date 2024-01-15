import { Observe, Auto } from '@vgerbot/solidium';

export interface TodoItem {
    title: string;
    createTime: Date;
}

@Auto
export class TodoService {
    // @Signal
    public tasks: TodoItem[] = [];

    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('todo') || '[]').map(
            (it: { title: string; createTime: string }) => ({
                title: it.title,
                createTime: new Date(it.createTime)
            })
        );
    }

    addTask(title: string) {
        this.tasks = this.tasks.concat({
            title,
            createTime: new Date()
        });
    }
    @Observe()
    storeOnTaskChange() {
        localStorage.setItem('todo', JSON.stringify(this.tasks));
    }
}
