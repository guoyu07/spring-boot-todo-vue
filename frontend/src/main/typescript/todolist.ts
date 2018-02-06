import Vue from "vue";

export interface ITodo {
  title: string;
  completed: boolean;
}

function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function normalize(s: string) {
  return s.trim().toLowerCase().split(/\s+/).join(" ");
}

export default (
  todos: ITodo[], suggestions: string[] = [],
  action: string = "", el?: string, template?: string) => new Vue({
    el,
    template,

    data: {
      action,
      changed: false,
      newTodo: "",
      todos: clone(todos),
    },

    filters: {
      json: JSON.stringify,
    },

    computed: {
      openTodos(): ITodo[] {
        return this.todos.filter((t) => !t.completed);
      },

      doneTodos(): ITodo[] {
        return this.todos.filter((t) => t.completed);
      },

      valid(): boolean {
        return this.newTodo.length > 3;
      },

      openSuggestions(): string[] {
        return suggestions.filter((s) => !this.todos.some((t) => normalize(t.title) === normalize(s)));
      },
    },

    methods: {
      close(todo: ITodo) {
        todo.completed = true;
        this.changed = true;
      },

      open(todo: ITodo) {
        todo.completed = false;
        this.changed = true;
      },

      remove(todo: ITodo) {
        this.todos.splice(this.todos.indexOf(todo), 1);
        this.changed = true;
      },

      closeAll() {
        this.todos.forEach((todo) => {
          todo.completed = true;
        });
        this.changed = true;
      },

      addNewTodo() {
        if (this.valid) {
          this.todos.push({
            completed: false,
            title: this.newTodo,
          });
          this.newTodo = "";
          this.changed = true;
        }
      },

      reset() {
        this.todos = clone(todos);
        this.changed = false;
      },

      save() {
        (this.$refs.form as HTMLFormElement).submit();
      },
    },
  });