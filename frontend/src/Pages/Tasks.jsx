import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Navbar } from "../components/Navbar";
import { useForm } from "../hooks/useForm";
import { Footer } from "../components/Footer";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);
  //   const [deleteTask, setDeleteTask] = useState(null);
  const { form, handleChange, handleReset, setForm } = useForm({
    title: "",
    description: "",
    is_completed: false,
  });
  const navigate = useNavigate();

  const getTasks = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/tasks-by-user", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener tareas");
      setTasks(await res.json());
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  // Crear o actualizar tarea
  const handleSubmit = async (e, taskId = null) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim())
      return alert("Completa todos los campos");
    // aca dependiendo de que reciba una task id entonces está editando entonces usa put
    const url = taskId
      ? `http://localhost:3000/api/tasks/${taskId}`
      : //   por ejemplo tasks/5
        "http://localhost:3000/api/tasks";
    //   sino esta creando y usa el método post
    const method = taskId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al guardar la tarea");
      alert(taskId ? "Tarea actualizada" : "Tarea creada");

      handleReset();
      setEditingTaskId(null);
      getTasks();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar la tarea");
    }
  };

  // Cargar tarea en modo edición
  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      is_completed: task.is_completed,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar esta tarea?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Error al eliminar la tarea");

      setTasks(tasks.filter((task) => task.id !== id));
      alert("Tarea eliminada con éxito");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar (fetch))");
    }
  };
  const checkTaskComplete = async (task) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            is_completed: !task.is_completed,
          }),
        }
      );
      if (!response.ok) throw new Error("Error al marcar completado");
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, is_completed: !t.is_completed } : t
        )
      );
    } catch (error) {
      console.log(Error);
    }
  };
  useEffect(() => {
    getTasks();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <>
      <Navbar />

      {/* Formulario para crear tarea */}
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="bg-white p-6 max-w-xl mx-auto rounded-xl shadow-md mb-6 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          Crear nueva tarea
        </h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="w-full border p-2 rounded-lg"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border p-2 rounded-lg"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_completed"
            checked={form.is_completed}
            onChange={(e) =>
              handleChange({
                target: { name: "is_completed", value: e.target.checked },
              })
            }
          />
          <span>¿Completada?</span>
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700"
        >
          Crear tarea
        </button>
      </form>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-xl p-4 mb-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Resumen de tareas</h3>
        <p>
          Total: <span className="font-bold">{tasks.length}</span>
        </p>
        <p>
          Completadas:{" "}
          <span className="text-green-600 font-bold">
            {tasks.filter((t) => t.is_completed).length}
          </span>
        </p>
        <p>
          Pendientes:{" "}
          <span className="text-yellow-600 font-bold">
            {tasks.filter((t) => !t.is_completed).length}
          </span>
        </p>
      </div>

      <div className="p-6 max-w-xl mx-auto space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-600">No hay tareas.</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-white shadow p-4 rounded-xl">
              {editingTaskId === task.id ? (
                <form
                  onSubmit={(e) => handleSubmit(e, task.id)}
                  className="space-y-3"
                >
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  />
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border p-2 rounded-lg"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_completed"
                      checked={form.is_completed}
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "is_completed",
                            value: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>¿Completada?</span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTaskId(null);
                        handleReset();
                      }}
                      className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <p
                    className={`font-medium mt-2 ${
                      task.is_completed ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {task.is_completed ? "Completada" : "Pendiente"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(task)}
                      className="flex-1 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="flex-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => checkTaskComplete(task)}
                      className={`flex-1 px-3 py-1 rounded-lg text-white ${
                        task.is_completed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {task.is_completed
                        ? "Marcar como pendiente"
                        : "Marcar como completada"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      <Footer />
    </>
  );
};
