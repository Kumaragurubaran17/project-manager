import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Clock, Users, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const colorOptions = [
  'from-violet-500 to-indigo-600',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-blue-500 to-indigo-500',
  'from-rose-500 to-pink-500',
];

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: '',
    team: 'Design',
    color: colorOptions[0],
  });

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('projects')
      .insert([newProject])
      .select();

    if (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Have you run the SQL schema in Supabase?');
    } else {
      setIsModalOpen(false);
      setNewProject({ name: '', team: 'Design', color: colorOptions[0] });
      fetchProjects();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 h-full">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and track all ongoing workspace projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary rounded-xl text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-fit"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </header>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
          ))
        ) : (
          <>
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-full"
              >
                <div className="relative h-full p-7 rounded-3xl border border-slate-100 bg-white shadow-soft flex flex-col gap-6 hover:border-primary/20 transition-all hover:shadow-xl hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl bg-linear-to-br flex items-center justify-center font-bold text-xl text-white shadow-lg",
                      project.color
                    )}>
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-xl text-muted-foreground transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-xl font-display font-bold text-slate-800 group-hover:text-primary transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{project.team} Team</span>
                       <span className="w-1 h-1 rounded-full bg-slate-300" />
                       <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{project.status}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      <span>Overall Progress</span>
                      <span className="text-slate-800">{project.progress}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress || 0}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full bg-linear-to-r", project.color)}
                      />
                    </div>
                  </div>

                  <footer className="mt-auto flex items-center justify-between pt-5 border-t border-slate-50">
                    <div className="flex -space-x-2">
                       {Array.from({ length: 3 }).map((_, i) => (
                         <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-xs">
                           <img src={`https://i.pravatar.cc/100?u=${i + project.id}`} alt="User" />
                         </div>
                       ))}
                    </div>
                    <Link 
                      to={`/projects/${project.id}`}
                      className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors bg-indigo-50 px-3 py-1.5 rounded-lg"
                    >
                      View Board
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </footer>
                </div>
              </motion.div>
            ))}

            {/* Empty Placeholder / Add New Project */}
            {!isLoading && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-full min-h-[260px] p-8 rounded-3xl border-2 border-dashed border-slate-100 hover:border-primary/40 hover:bg-slate-50/50 transition-all group flex flex-col items-center justify-center gap-5 text-center shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all border border-slate-100">
                  <Plus className="w-7 h-7" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 group-hover:text-primary transition-colors">Create Workspace Project</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">New campaign or research...</p>
                </div>
              </button>
            )}
          </>
        )}
      </div>

      {/* Modal - Create Project */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden border border-slate-100"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display font-bold text-slate-800">Add New Project</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Project Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. NFT Research Concept"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl p-4 text-sm font-bold transition-all outline-hidden"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Team Tag</label>
                    <select 
                      value={newProject.team}
                      onChange={(e) => setNewProject({ ...newProject, team: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl p-4 text-sm font-bold transition-all outline-hidden appearance-none cursor-pointer"
                    >
                      {['Design', 'Backend', 'Frontend', 'Marketing', 'Product'].map(team => (
                        <option key={team} value={team}>{team} Team</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Theme Color</label>
                    <div className="flex gap-3">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewProject({ ...newProject, color })}
                          className={cn(
                            "w-10 h-10 rounded-xl bg-linear-to-br transition-all flex items-center justify-center border-4",
                            color,
                            newProject.color === color ? "border-slate-800 scale-110 shadow-lg" : "border-white"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1C2E] hover:bg-black text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-black/10 transition-all mt-4 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Project'}
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
