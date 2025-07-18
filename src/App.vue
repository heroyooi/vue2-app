<template>
  <div class="todo-container">
    <h2>🧾 할 일 관리 (내 서버)</h2>
    <div class="form">
      <input v-model="newTodo" placeholder="할 일을 입력하세요" />
      <button @click="addTodo">추가</button>
    </div>
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

const API_URL = 'http://localhost:3000/todos';

export default {
  components: { TodoItem },
  data() {
    return {
      newTodo: '',
      todos: [],
    };
  },
  methods: {
    async fetchTodos() {
      try {
        const res = await axios.get(API_URL);
        this.todos = res.data;
      } catch (e) {
        alert('불러오기 실패');
      }
    },
    async addTodo() {
      const title = this.newTodo.trim();
      if (!title) return;

      try {
        const res = await axios.post(API_URL, {
          title,
          completed: false,
        });
        this.todos.unshift(res.data);
        this.newTodo = '';
      } catch (e) {
        alert('추가 실패');
      }
    },
    async removeTodo(id) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (e) {
        alert('삭제 실패');
      }
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

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #aaa;
  border-radius: 6px;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background-color: #36956d;
}

ul {
  list-style: none;
  padding: 0;
}
</style>
