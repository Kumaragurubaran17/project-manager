import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  MoreHorizontal, 
  Calendar,
  MessageSquare,
  Link as LinkIcon,
  ChevronDown,
  Filter,
  ArrowUpDown,
  MoreVertical,
  CheckSquare,
  Users,
  Grid,
  List as ListIcon,
  FileText,
  Activity,
  X
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'text-primary' },
  { id: 'progress', title: 'In Progress', color: 'text-[#0EA5E9]' },
  { id: 'done', title: 'Done', color: 'text-[#10B981]' },
  { id: 'review', title: 'Need Review', color: 'text-[#8B5CF6]' },
];

const taskColorOptions = [
  'bg-white',
  'bg-orange-50',
  'bg-indigo-50',
  'bg-sky-50',
  'bg-emerald-50',
  'bg-violet-50',
];

export default function ProjectDetail() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'board';
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('todo');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    color: 'bg-white',
    tags: ['#Design'],
    due_date: 'Nov 16',
  });

  const fetchData = async () => {
    setIsLoading(true);
    
    // Fetch Project Info
    const { data: projectData } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    setProject(projectData);

    // Fetch Tasks
    const { data: tasksData, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', id)
      .order('position', { ascending: true });
    
    if (!error) {
      setTasks(tasksData || []);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic Update
    const movedTask = tasks.find(t => t.id === draggableId);
    const otherTasks = tasks.filter(t => t.id !== draggableId);
    
    const byStatus = {};
    COLUMNS.forEach(c => {
      byStatus[c.id] = otherTasks.filter(t => t.column_id === c.id);
    });

    const updatedTask = { ...movedTask, column_id: destination.droppableId };
    byStatus[destination.droppableId].splice(destination.index, 0, updatedTask);
    
    const finalTasks = COLUMNS.flatMap(c => byStatus[c.id]);
    setTasks(finalTasks);

    // Update in Supabase
    const { error } = await supabase
      .from('tasks')
      .update({ column_id: destination.droppableId })
      .eq('id', draggableId);
    
    if (error) {
      console.error('Error updating task status:', error);
      fetchData(); // Rollback on error
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from('tasks')
      .insert([{
        ...newTask,
        project_id: id,
        column_id: selectedColumn,
        position: tasks.filter(t => t.column_id === selectedColumn).length
      }]);

    if (!error) {
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', color: 'bg-white', tags: ['#Design'], due_date: 'Nov 16' });
      fetchData();
    } else {
      console.error('Error creating task:', error);
      alert('Failed to create task. Verify your Supabase schema!');
    }
    setIsSubmitting(false);
  };

  const setView = (v) => {
    setSearchParams({ view: v });
  };

  if (isLoading && !project) return <div className="p-8 text-slate-400 font-bold animate-pulse">Loading Board...</div>;

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'board', label: 'Board', icon: Grid },
          { id: 'list', label: 'List', icon: ListIcon },
          { id: 'files', label: 'Files', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all relative rounded-xl",
              view === tab.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-2xl bg-linear-to-br flex items-center justify-center font-bold text-white shadow-lg", project?.color)}>
             {project?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-slate-800 tracking-tight">{project?.name || 'Project Detail'}</h1>
            <div className="flex items-center gap-3 mt-1.5">
               <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">{project?.team} Team</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-xs">
             Sort By <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1C2E] rounded-xl text-xs font-bold text-white shadow-lg hover:shadow-black/10 transition-all"
          >
             New Task <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {view === 'board' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-[600px] overflow-hidden p-1">
            {COLUMNS.map((column) => (
              <div key={column.id} className="flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-slate-800">{column.title}</h3>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                       {tasks.filter(t => t.column_id === column.id).length} Card Task
                    </span>
                  </div>
                  <button 
                    onClick={() => { setSelectedColumn(column.id); setIsModalOpen(true); }}
                    className="p-1 w-7 h-7 bg-white rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex-1 flex flex-col gap-4 rounded-3xl transition-colors duration-200 h-full p-1",
                        snapshot.isDraggingOver ? "bg-slate-50/50 outline-2 outline-dashed outline-slate-100" : "bg-transparent"
                      )}
                    >
                      {tasks
                        .filter(task => task.column_id === column.id)
                        .map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  "p-5 rounded-3xl border-2 transition-all group",
                                  snapshot.isDragging ? "shadow-2xl scale-[1.02] border-primary z-50 bg-white" : "shadow-sm border-transparent",
                                  !snapshot.isDragging && (task.color || "bg-white")
                                )}
                              >
                                <div className="flex items-center justify-between mb-4">
                                   <div className="flex flex-wrap gap-2">
                                      {task.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-white/60 text-slate-600 border border-slate-100 uppercase tracking-tighter">
                                           {tag.replace('#', '')}
                                        </span>
                                      ))}
                                   </div>
                                </div>

                                <h4 className="font-bold text-slate-800 leading-tight mb-2 group-hover:text-primary transition-colors">{task.title}</h4>
                                <p className="text-[11px] text-muted-foreground font-medium mb-5 line-clamp-2">{task.description}</p>

                                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/60 rounded-lg border border-slate-100 text-[10px] font-extrabold text-slate-600 mb-6 w-fit shadow-xs">
                                    <Calendar className="w-3 h-3 text-orange-500" />
                                    <span>{task.due_date}</span>
                                </div>

                                <div className="space-y-2 mb-6">
                                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase tracking-widest text-slate-300">
                                    <span>Progress</span>
                                    <span className="text-slate-800 font-black">{(task.progress/task.total)*100}%</span>
                                  </div>
                                  <div className="dots-progress">
                                    {Array.from({ length: task.total || 10 }).map((_, i) => (
                                      <div key={i} className={cn("dot", i < (task.progress || 0) && "active", i < (task.progress || 0) && (task.color === 'bg-white' ? 'bg-primary' : 'bg-slate-800'))} />
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                                   <img src={`https://i.pravatar.cc/100?u=${task.id}`} alt="User" className="w-6 h-6 rounded-full border border-white" />
                                   <div className="flex items-center gap-3 text-slate-300">
                                      <div className="flex items-center gap-1 text-[9px] font-bold"><MessageSquare className="w-2.5 h-2.5" /> <span>2</span></div>
                                   </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Task Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(t => (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
                  <td className="px-6 py-5 font-bold text-slate-800">{t.title}</td>
                  <td className="px-6 py-5"><span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 text-slate-400">{t.column_id}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal - Create Task */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100]" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-display font-bold text-slate-800">New Task in <span className="text-primary capitalize">{selectedColumn}</span></h2>
                        <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
                    </div>
                    <form onSubmit={handleCreateTask} className="space-y-6">
                        <input 
                           type="text" 
                           placeholder="What's to be done?" 
                           value={newTask.title} 
                           onChange={e => setNewTask({...newTask, title: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-hidden focus:bg-white" 
                           required 
                        />
                        <textarea 
                           placeholder="Additional details..." 
                           value={newTask.description} 
                           onChange={e => setNewTask({...newTask, description: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-hidden focus:bg-white min-h-[100px]" 
                        />
                        <div className="flex gap-2">
                           {taskColorOptions.map(c => (
                             <button key={c} type="button" onClick={() => setNewTask({...newTask, color: c})} className={cn("w-8 h-8 rounded-lg border-2", c, newTask.color === c ? "border-slate-800" : "border-slate-100")} />
                           ))}
                        </div>
                        <button disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl transition-all">
                            {isSubmitting ? 'Adding...' : 'Create Task'}
                        </button>
                    </form>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
