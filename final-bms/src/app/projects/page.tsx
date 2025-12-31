'use client';

const kanbanData = {
  backlog: [
    { id: 1, title: 'Design mobile app', priority: 'High', assigned: 'Alex', attachments: 2 },
    { id: 2, title: 'Create API documentation', priority: 'Medium', assigned: 'Sarah', attachments: 1 },
  ],
  inProgress: [
    { id: 3, title: 'Implement authentication', priority: 'High', assigned: 'Mike', attachments: 3 },
    { id: 4, title: 'Database optimization', priority: 'Medium', assigned: 'John', attachments: 0 },
  ],
  review: [
    { id: 5, title: 'Code review - Payment module', priority: 'High', assigned: 'Emma', attachments: 5 },
  ],
  done: [
    { id: 6, title: 'Setup CI/CD pipeline', priority: 'High', assigned: 'David', attachments: 2 },
    { id: 7, title: 'Create project structure', priority: 'Medium', assigned: 'Lisa', attachments: 1 },
  ],
};

const priorityColors = {
  High: 'bg-red-900 text-red-200',
  Medium: 'bg-yellow-900 text-yellow-200',
  Low: 'bg-green-900 text-green-200',
};

function TaskCard({ task }) {
  return (
    <div className="bg-slate-700 rounded-lg p-4 mb-3 cursor-move hover:shadow-lg transition border-l-4 border-blue-500">
      <h3 className="text-white font-medium text-sm mb-2">{task.title}</h3>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="bg-slate-600 px-2 py-1 rounded">{task.assigned}</span>
          {task.attachments > 0 && <span>📎 {task.attachments}</span>}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ title, tasks, count }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 flex-1 max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-semibold">{title}</h2>
        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-sm">{count}</span>
      </div>
      <div className="space-y-2 min-h-96 bg-slate-900 rounded p-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const totalTasks = Object.values(kanbanData).reduce((sum, col) => sum + col.length, 0);
  const completedTasks = kanbanData.done.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Project Management - Kanban Board</h1>
          <p className="text-slate-400 mt-2">Visualize workflow, manage tasks, and track sprint progress</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition">
          + New Task
        </button>
      </div>

      {/* Sprint Info */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Sprint 15 Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-slate-400 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-white">{totalTasks}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-400">{completedTasks}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-blue-400">{kanbanData.inProgress.length}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Progress</p>
            <p className="text-3xl font-bold text-white">{progressPercent}%</p>
          </div>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all" 
            style={{width: `${progressPercent}%`}}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        <KanbanColumn title="🎯 Backlog" tasks={kanbanData.backlog} count={kanbanData.backlog.length} />
        <KanbanColumn title="⚙️ In Progress" tasks={kanbanData.inProgress} count={kanbanData.inProgress.length} />
        <KanbanColumn title="👀 In Review" tasks={kanbanData.review} count={kanbanData.review.length} />
        <KanbanColumn title="✅ Done" tasks={kanbanData.done} count={kanbanData.done.length} />
      </div>

      {/* Team Section */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Team Collaboration</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {['Alex', 'Sarah', 'Mike', 'John', 'Emma'].map(member => (
            <div key={member} className="bg-slate-700 rounded-lg p-4 text-center hover:bg-slate-600 transition">
              <div className="w-12 h-12 rounded-full bg-blue-600 mx-auto mb-2 flex items-center justify-center text-white font-bold">
                {member.charAt(0)}
              </div>
              <p className="text-white font-medium">{member}</p>
              <p className="text-slate-400 text-sm">3 tasks assigned</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
