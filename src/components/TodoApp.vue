<template>
  <div class="todo-container">
    <h2>🧾 할 일 관리 (수정 포함)</h2>
    <div class="form">
      <input v-model="newTodo" placeholder="할 일을 입력하세요" />
      <button @click="addTodo">추가</button>
    </div>
    <ul class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :content="todo.title"
        :completed="todo.completed"
        :editing="editingId === todo.id"
        @delete="removeTodo(todo.id)"
        @edit="startEdit(todo.id)"
        @update="updateTodo(todo.id, $event)"
        @toggle="toggleComplete(todo.id)"
      />
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import TodoItem from './TodoItem.vue';

const API_URL = '/api/todos';

export default {
  components: { TodoItem },
  data() {
    return {
      newTodo: '',
      todos: [],
      editingId: null,
      token: localStorage.getItem('token'), // ✅ token 저장
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    // ✅ 공통 헤더
    authHeader() {
      return {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      };
    },

    async fetchTodos() {
      try {
        const res = await axios.get(API_URL, this.authHeader());
        this.todos = res.data;
      } catch (err) {
        console.error('할 일 불러오기 실패:', err);
      }
    },

    async addTodo() {
      const title = this.newTodo.trim();
      if (!title) return;
      try {
        const res = await axios.post(
          API_URL,
          { title, completed: false },
          this.authHeader()
        );
        this.todos.unshift(res.data);
        this.newTodo = '';
      } catch (err) {
        console.error('할 일 추가 실패:', err);
      }
    },

    async removeTodo(id) {
      try {
        await axios.delete(`${API_URL}/${id}`, this.authHeader());
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (err) {
        console.error('삭제 실패:', err);
      }
    },

    startEdit(id) {
      this.editingId = id;
    },

    async updateTodo(id, newTitle) {
      if (newTitle === null) {
        this.editingId = null;
        return;
      }
      const title = newTitle.trim();
      if (!title) return;
      try {
        await axios.put(`${API_URL}/${id}`, { title }, this.authHeader());
        this.todos = this.todos.map((todo) =>
          todo.id === id ? { ...todo, title } : todo
        );
        this.editingId = null;
      } catch (err) {
        console.error('수정 실패:', err);
      }
    },

    async toggleComplete(id) {
      const target = this.todos.find((todo) => todo.id === id);
      if (!target) return;
      const updated = { ...target, completed: !target.completed };
      try {
        await axios.put(
          `${API_URL}/${id}`,
          { completed: updated.completed },
          this.authHeader()
        );
        this.todos = this.todos.map((todo) =>
          todo.id === id ? updated : todo
        );
      } catch (err) {
        console.error('체크 상태 변경 실패:', err);
      }
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
