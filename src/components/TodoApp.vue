<template>
  <div class="todo-container">
    <h2>🧾 할 일 관리 (Vuex)</h2>
    <div class="form">
      <input v-model="newTodo" placeholder="할 일을 입력하세요" />
      <button @click="handleAdd">추가</button>
    </div>
    <ul class="todo-list">
      <TodoItem
        v-for="todo in allTodos"
        :key="todo.id"
        :content="todo.title"
        :completed="todo.completed"
        :editing="editingId === todo.id"
        @delete="handleDelete(todo.id)"
        @edit="startEdit(todo.id)"
        @update="handleUpdate(todo.id, $event)"
        @toggle="handleToggle(todo.id)"
      />
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import TodoItem from './TodoItem.vue';

export default {
  components: { TodoItem },
  data() {
    return {
      newTodo: '',
      editingId: null,
    };
  },
  computed: {
    ...mapGetters('todo', ['allTodos']),
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    ...mapActions('todo', [
      'fetchTodos',
      'addTodo',
      'deleteTodo',
      'updateTodo',
      'toggleTodo',
    ]),
    async handleAdd() {
      if (!this.newTodo.trim()) return;
      await this.addTodo(this.newTodo);
      this.newTodo = '';
    },
    async handleDelete(id) {
      await this.deleteTodo(id);
    },
    startEdit(id) {
      this.editingId = id;
    },
    async handleUpdate(id, newTitle) {
      if (newTitle !== null && newTitle.trim()) {
        await this.updateTodo({ id, title: newTitle });
      }
      this.editingId = null;
    },
    async handleToggle(id) {
      await this.toggleTodo(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.todo-container {
  max-width: 480px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s, color 0.3s;

  .form {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;

    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #aaa;
      border-radius: 6px;
      font-size: 14px;
      background-color: #fff;
      color: #222;
      transition: background-color 0.3s, color 0.3s;
    }
  }

  button {
    padding: 8px 16px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #36956d;
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }
}

// 다크모드 대응
.dark {
  .todo-container {
    background: #1e1e1e;
    color: #f1f1f1;
    border-color: #444;
    .form {
      input {
        background-color: #2a2a2a;
        color: #f1f1f1;
        border-color: #666;
      }
    }
  }
}
</style>
