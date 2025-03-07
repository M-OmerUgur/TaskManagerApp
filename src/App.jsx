import { useState, useEffect } from "react";

function App() {


  // State yönetimi
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ heading: "", script: "" });
  const [expandedTask, setExpandedTask] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });


  // Görevleri localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);


  // Yeni görev ekleme fonksiyonu
  const addTask = () => {
    if (!newTask.heading.trim()) return;
    const newTaskData = {
      id: Date.now(),
      heading: newTask.heading,
      script: newTask.script,
      completed: false,
      date: new Date().toLocaleDateString("tr-TR")
    };
    setTasks([...tasks, newTaskData]);
    setNewTask({ heading: "", script: "" });
    setShowForm(false);
  };


  // Görev tamamlama durumunu değiştirme
  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };


  // Görev silme fonksiyonu
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };


  // Görevleri sıralama (Tamamlananlar en sona gider)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return new Date(b.id) - new Date(a.id);
    }
    return a.completed ? 1 : -1;
  });


  // Filtreleme işlemi
  const filteredTasks = sortedTasks.filter(task =>
    filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
  );

  return (
    <div className={`min-h-screen flex flex-col items-center py-10 relative ${darkMode ? "dark bg-[#1E1B29] text-[#B8ACF6]" : "bg-[FFFFFF] text-[#206A83]"}`}>
      {/* ----------------Uygulama ana çerçevesi---------------- */}
      <div className={"w-full max-w-lg p-6 rounded-lg border border-gray-300 dark:border-gray-700 shadow-lg relative" }>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-5xl font-serif text-center flex-1">To Do List</h2>
          {/* ----------------Dark mode switch---------------- */}
          <label className="flex items-center cursor-pointer">
            <span className="mr-2 ">Dark Mode</span>
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} className="hidden" />
            <div className="w-10 h-5 bg-gray-400 dark:bg-purple-700 rounded-full relative">
              <div className={`w-4 h-4 bg-white dark:bg-black rounded-full absolute top-0.5 transition-all ${darkMode ? "right-1" : "left-1"}`}></div>
            </div>
          </label>
        </div>
        {/* ----------------Filtreleme menüsü---------------- */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`" px-4 py-2 rounded-lg border  appearance-none cursor-pointer w-full mb-4 ${darkMode ? "dark bg-[#2B273F] text-[#D1C4E9]" : "bg-[#F5F5F5] text-[#37474F]"}"`}
        >
          <option value="all">All Tasks</option>
          <option value="completed">Finished Tasks</option>
          <option value="pending">Unfinished Tasks</option>
        </select>
        {/* ----------------Görev listesi---------------- */}
        <ul className="w-full">
          {filteredTasks.map(task => (
            <li key={task.id} className={`text-2xl flex items-center mb-2 p-2 border rounded-lg w-full ${task.completed ? 'opacity-60' : ''} ${darkMode ? "dark bg-[#2B273F] text-[#8F7EE7]" : "bg-[#DEE4EA] text-[#37474F]"} relative group`}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="mr-2 cursor-pointer w-8 h-8"
              />
              <span className="text-base mr-2 whitespace-nowrap">{task.date}</span>
              <div className="flex flex-col w-full overflow-hidden">
                <div className="flex justify-between w-full font-serif">
                  <span onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)} className={`cursor-pointer uppercase ${task.completed ? 'line-through': ""} truncate w-full`}>{task.heading}</span>
                  <button onClick={() => deleteTask(task.id)} className="px-2 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">Sil</button>
                </div>
                <p className={`mt-2 text-lg capitalize transition-opacity break-words w-full`}>{expandedTask === task.id && task.script}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* ----------------Görev ekleme butonu---------------- */}
        <button onClick={() => setShowForm(true)} className={`"text-xl font-bold mt-4 px-5 py-2 rounded-lg self-end "${darkMode ? "dark bg-[#DA62AC] text-[#50253F]" : "bg-[#8C9BAB] text-[#37474F]"}`}>Add</button>
      </div>
      {/* ----------------Görev ekleme formu---------------- */}
      {showForm && (
        <div className="fixed inset-0 text-gray-800 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 ml">Add Task</h2>
            <input
              type="text"
              value={newTask.heading}
              onChange={(e) => setNewTask({ ...newTask, heading: e.target.value })}
              className="p-2 border rounded-lg w-full mb-2"
              placeholder="Heading"
            />
            <input
              type="text"
              value={newTask.script}
              onChange={(e) => setNewTask({ ...newTask, script: e.target.value })}
              className="p-2 border rounded-lg w-full mb-2"
              placeholder="Script"
            />
            <button onClick={addTask} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Add</button>
            <button onClick={() => setShowForm(false)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
