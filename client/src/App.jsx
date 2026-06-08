import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
const API = "https://task-manager-project-ed2s.onrender.com";
function App() {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get(
  `${API}/tasks`
    );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      const response = await axios.post(`${API}/tasks`, {
  title,
  description,
  dueDate,
});

setTasks(prev => [response.data.task, ...prev]);

setTitle("");
setDescription("");
setDueDate("");
}
catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
     await axios.delete(
  `${API}/tasks/${id}`
);

     await loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTask = async (id) => {
    try {
     await axios.patch(
  `${API}/tasks/${id}/toggle`
);

    await  loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDueDate(task.dueDate || "");
  };

  const saveEdit = async () => {
    try {
      await axios.put(
  `${API}/tasks/${editingId}`,
  {
    title: editTitle,
    description: editDescription,
    dueDate: editDueDate,
  }
);

      setEditingId(null);

     await loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = filteredTasks.filter(
      (task) => !task.completed
    );
  }

  if (filter === "completed") {
    filteredTasks = filteredTasks.filter(
      (task) => task.completed
    );
  }

  if (search.trim() !== "") {
    filteredTasks = filteredTasks.filter((task) =>
      task.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }



  return (
    
    <div className={darkMode ? "dark" : "light"}>
      <h1>Studio Graphene Task Manager</h1>
    

<button
  className="theme-toggle"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>
      <h2>Add Task</h2>

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />
      <br />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <br />
      <br />

      <button onClick={addTask}>
        Add Task
      </button>

      <hr />

      <h2>Task Statistics</h2>

<div className="stats">
  <div>
    <h3>Active Tasks</h3>
    <p>
      {tasks.filter(
        task => !task.completed
      ).length}
    </p>
  </div>

  <div>
    <h3>Completed Tasks</h3>
    <p>
      {tasks.filter(
        task => task.completed
      ).length}
    </p>
  </div>
</div>

      <hr />

      <h2>Filter Tasks</h2>

      <button
        onClick={() => setFilter("all")}
      >
        All
      </button>

      <button
        onClick={() => setFilter("active")}
        style={{ marginLeft: "10px" }}
      >
        Active
      </button>

      <button
        onClick={() =>
          setFilter("completed")
        }
        style={{ marginLeft: "10px" }}
      >
        Completed
      </button>

      <hr />
      <h2>Search Tasks</h2>

      <input
        type="text"
        placeholder="Search task title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <hr />
      <h2>Tasks</h2>

      {filteredTasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        filteredTasks.map((task) => (
          <div
  key={task.id}
  className={`card ${
  task.dueDate &&
  !task.completed &&
  new Date(task.dueDate) < new Date()
    ? "overdue"
    : ""
}`}
  style={{
    border:
      task.dueDate &&
      !task.completed &&
      new Date(task.dueDate) < new Date()
        ? "2px solid red"
        : "none"
  }}
>
            {editingId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <textarea
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) =>
                    setEditDueDate(
                      e.target.value
                    )
                  }
                />

                <br />
                <br />

                <button onClick={saveEdit}>
                  Save
                </button>

                <button
                  onClick={cancelEdit}
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3>{task.title}</h3>

                <p>{task.description}</p>

                <p>
                  Due Date:{" "}
                  {task.dueDate ||
                    "Not Set"}
                </p>
                {
                  task.dueDate &&
                  !task.completed &&
                  new Date(task.dueDate) < new Date() && (
                    <p style={{ color: "red", fontWeight: "bold" }}>

                    </p>
                  )
                }
                <p>
                  Status:{" "}
                  <span className={task.completed ? "status-completed" : "status-active"}>
  {task.completed ? "Completed" : "Active"}
</span>
                </p>

                <button
                  onClick={() =>
                    toggleTask(task.id)
                  }
                >
                  Toggle Status
                </button>

                <button
                  onClick={() =>
                    startEdit(task)
                  }
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  style={{
                    marginLeft: "10px",
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;