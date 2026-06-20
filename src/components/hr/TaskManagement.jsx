import { useState } from 'react';
import Icon from '../Icon';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Review Exit Interview',
      description: 'Complete exit interview for John Doe',
      status: 'pending',
      priority: 'high',
      dueDate: '2025-06-20',
      assignee: 'Sarah Johnson'
    },
    {
      id: 3,
      title: 'Collect Company Assets',
      description: 'Ensure all company assets are returned',
      status: 'pending',
      priority: 'medium',
      dueDate: '2025-06-21',
      assignee: 'Lisa Wong'
    },
    {
      id: 4,
      title: 'Update System Access',
      description: 'Revoke system and application access',
      status: 'completed',
      priority: 'high',
      dueDate: '2025-06-18',
      assignee: 'James Wilson'
    }
  ]);

  const [filter, setFilter] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-[#33fb0a]/10 text-[#33fb0a]';
      case 'in-progress': return 'bg-[#00dbe9]/10 text-[#00dbe9]';
      case 'pending': return 'bg-[#ffb4ab]/10 text-[#ffb4ab]';
      default: return 'bg-[#b9cacb]/10 text-[#b9cacb]';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-[#ffb4ab]';
      case 'medium': return 'text-[#ffc107]';
      case 'low': return 'text-[#33fb0a]';
      default: return 'text-[#b9cacb]';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'in-progress': return 'schedule';
      case 'pending': return 'pending_actions';
      default: return 'help';
    }
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(task => task.status === filter);

  return (
    <div className="pt-24 px-8 pb-12 space-y-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#e4e1e9]">Task Management</h1>
          <p className="text-[#b9cacb] text-sm mt-1">Manage all offboarding and HR tasks</p>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-[#b9cacb] bg-[#1f1f24] px-3 py-1 rounded-full">
            {filteredTasks.length} {filter === 'all' ? 'Total' : filter.charAt(0).toUpperCase() + filter.slice(1)} Tasks
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1f1f24] p-4 rounded-lg border border-[#3b494b] hover:border-[#00dbe9]/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#b9cacb] uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-bold text-[#e4e1e9] mt-2">{tasks.length}</p>
            </div>
            <Icon className="text-[#00dbe9] text-3xl">assignment</Icon>
          </div>
        </div>
        
        <div className="bg-[#1f1f24] p-4 rounded-lg border border-[#3b494b] hover:border-[#00dbe9]/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#b9cacb] uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-[#ffb4ab] mt-2">{tasks.filter(t => t.status === 'pending').length}</p>
            </div>
            <Icon className="text-[#ffb4ab] text-3xl">pending_actions</Icon>
          </div>
        </div>

        <div className="bg-[#1f1f24] p-4 rounded-lg border border-[#3b494b] hover:border-[#00dbe9]/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#b9cacb] uppercase tracking-wider">In Progress</p>
              <p className="text-2xl font-bold text-[#00dbe9] mt-2">{tasks.filter(t => t.status === 'in-progress').length}</p>
            </div>
            <Icon className="text-[#00dbe9] text-3xl">schedule</Icon>
          </div>
        </div>

        <div className="bg-[#1f1f24] p-4 rounded-lg border border-[#3b494b] hover:border-[#00dbe9]/20 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#b9cacb] uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-[#33fb0a] mt-2">{tasks.filter(t => t.status === 'completed').length}</p>
            </div>
            <Icon className="text-[#33fb0a] text-3xl">check_circle</Icon>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'in-progress', 'completed'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-[#00dbe9] text-[#131318]'
                : 'bg-[#1f1f24] border border-[#3b494b] text-[#e4e1e9] hover:border-[#00dbe9]/50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <section className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#1f1f24] rounded-lg border border-[#3b494b] p-12 text-center">
            <Icon className="text-[#b9cacb] text-5xl mx-auto mb-3 opacity-50">assignment_turned_in</Icon>
            <p className="text-[#b9cacb]">No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-[#1f1f24] border border-[#3b494b] rounded-lg p-4 hover:border-[#00dbe9]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={`text-lg ${getStatusIcon(task.status)}`}>{getStatusIcon(task.status)}</Icon>
                    <h3 className="text-base font-semibold text-[#e4e1e9]">{task.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('-', ' ').charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ').slice(1)}
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </span>
                  </div>
                  {task.description && <p className="text-sm text-[#b9cacb] mb-3">{task.description}</p>}
                  <div className="flex items-center gap-4 text-xs text-[#b9cacb]">
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Icon className="text-sm">calendar_today</Icon>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="bg-[#131318] border border-[#3b494b] rounded px-2 py-1 text-xs text-[#e4e1e9] focus:outline-none focus:border-[#00dbe9]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 hover:bg-[#ffb4ab]/10 rounded text-[#ffb4ab] transition-all"
                    title="Delete task"
                  >
                    <Icon className="text-lg">delete</Icon>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
