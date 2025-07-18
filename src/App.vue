<template>
  <div class="todo-container">
    <h2>📡 외부에서 불러온 할 일 목록</h2>
    <button @click="fetchTodos">불러오기</button>
    <ul class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :content="todo.title"
        @delete="removeTodo(todo.id)"
      />
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import TodoItem from './components/TodoItem.vue';

export default {
  components: { TodoItem },
  data() {
    return {
      todos: [],
    };
  },
  methods: {
    async fetchTodos() {
      try {
        const res = await axios.get(
          'https://jsonplaceholder.typicode.com/todos?_limit=5'
        );
        this.todos = res.data;
      } catch (err) {
        alert('데이터를 불러오는 데 실패했습니다.');
      }
    },
    removeTodo(id) {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    },
  },
};
</script>

<style scoped>
.todo-container {
  max-width: 480px;
  margin: 40px auto;
  padding: 24px;
  border: 1px solid #ccc;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

button {
  display: block;
  margin: 0 auto 20px;
  padding: 8px 16px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
button:hover {
  background-color: #1976d2;
}
</style>
