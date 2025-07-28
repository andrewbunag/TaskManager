import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./App.css";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import clsx from "clsx";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

// ————————————————————————————————————————
// Helpers
// ————————————————————————————————————————
const sortBySoonest = (a, b) => {
  const tsA = a.dueDate ? Date.parse(a.dueDate) : Infinity;
  const tsB = b.dueDate ? Date.parse(b.dueDate) : Infinity;
  return tsA - tsB;
};

const eventStyleGetter = (event) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const due = new Date(event.start).setHours(0, 0, 0, 0);
  let bg = "#0d6efd"; // default blue
  if (due < today) bg = "#dc3545"; // overdue (red)
  else if (due - today < 3 * 864e5) bg = "#fd7e14"; // within 3 days (orange)

  return { style: { backgroundColor: bg, color: "white" } };
};

// ————————————————————————————————————————
// Main component
// ————————————————————————————————————————
function App() {
  const API_URL = "http://localhost:5289";
  const tasksPerPage = 5;

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("list"); // "list" | "calendar"

  // --------------------------------- Fetch ---------------------------------
  const fetchTasks = useCallback(() => {
    axios
      .get(`${API_URL}/tasks`)
      .then(({ data }) => setTasks([...data].sort(sortBySoonest)))
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setTasks([]); // keep UI alive even if API is down
      });
  }, [API_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --------------------------------- Add -----------------------------------
  const addTask = () => {
    if (!newTask.title || !newTask.description) return;

    axios
      .post(`${API_URL}/tasks`, newTask)
      .then(({ data }) => {
        const updated = [...tasks, data].sort(sortBySoonest);
        setTasks(updated);
        setNewTask({ title: "", description: "", dueDate: "" });
        setCurrentPage(Math.ceil(updated.length / tasksPerPage));
      })
      .catch((err) => console.error("Error adding task:", err));
  };

  // --------------------------------- Delete --------------------------------
  const deleteTask = (id) => {
    axios
      .delete(`${API_URL}/tasks/${id}`)
      .then(() => {
        const updated = tasks.filter((t) => t.id !== id);
        setTasks(updated);
        const totalPages = Math.ceil(updated.length / tasksPerPage);
        setCurrentPage((p) => Math.min(p, totalPages));
      })
      .catch((err) => console.error("Error deleting task:", err));
  };

  // -------------------------------- Pagination ------------------------------
  const startIndex = (currentPage - 1) * tasksPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + tasksPerPage);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  // ------------------------------ Calendar map ------------------------------
  const events = tasks
    .filter((t) => !!t.dueDate) // skip no-date tasks
    .map((t) => {
      const date = new Date(t.dueDate);
      if (isNaN(date)) return null; // skip invalid
      return {
        id: t.id,
        title: t.title,
        start: date,
        end: date,
        allDay: true,
        raw: t,
      };
    })
    .filter(Boolean);

  // ──────────────────────────────────────────────────────────────── UI ─────
  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* View toggle + refresh */}
      <div className="view-toggle">
        <button
          className={clsx({ active: viewMode === "list" })}
          onClick={() => setViewMode("list")}
        >
          📄 List
        </button>
        <button
          className={clsx({ active: viewMode === "calendar" })}
          onClick={() => setViewMode("calendar")}
        >
          📅 Calendar
        </button>
        <button onClick={fetchTasks} className="refresh-button">
          Refresh
        </button>
      </div>

      {/* Add-task form (shared) */}
      <div className="add-task-form">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* ------------------------------ LIST VIEW ----------------------------- */}
      {viewMode === "list" && (
        <>
          <ul className="task-list">
            {currentTasks.map((task) => (
              <li key={task.id} className="task-item">
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  {task.dueDate ? (
                    <p className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  ) : (
                    <p className="due-date no-date">No due date</p>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ◀ Prev
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next ▶
            </button>
          </div>
        </>
      )}

      {/* --------------------------- CALENDAR VIEW --------------------------- */}
      {viewMode === "calendar" && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, margin: "2rem 0" }}
          views={["month", "agenda"]}
          defaultView="month"
          eventPropGetter={eventStyleGetter}
          selectable
          onSelectSlot={({ start }) =>
            setNewTask({
              ...newTask,
              dueDate: start.toISOString().slice(0, 10),
            })
          }
          onSelectEvent={(evt) =>
            alert(`${evt.raw.title}\n\n${evt.raw.description}`)
          }
        />
      )}
    </div>
  );
}

export default App;
