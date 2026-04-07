import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  MoreVertical,
  Plus,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Active Projects', value: '12', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Total Tasks', value: '148', icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Team Members', value: '24', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Overdue', value: '3', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const recentProjects = [
  { id: 'zenith-ui', name: 'Zenith Platform UI', team: 'Design', progress: 75, status: 'Active' },
  { id: 'supabase-api', name: 'Supabase Integration', team: 'Backend', progress: 40, status: 'In Review' },
  { id: 'marketing-26', name: 'Marketing Website', team: 'Marketing', progress: 90, status: 'Completed' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">Good morning, John</h1>
        <p className="text-muted-foreground font-medium">Here's what's happening with your projects today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 transition-all group shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <button className="text-muted-foreground hover:text-white p-1">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Projects (Two Thirds) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-800">Recent Projects</h2>
            <Link to="/projects" className="text-sm font-medium text-primary hover:text-accent transition-colors">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentProjects.map((project, i) => (
              <Link 
                key={project.id}
                to={`/projects/${project.id}`}
                className="block"
              >
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (i * 0.1) }}
                  className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-6 group hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary border border-slate-100 flex items-center justify-center font-bold text-slate-800">
                    {project.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">{project.name}</h4>
                    <p className="text-xs text-muted-foreground">{project.team} Team</p>
                  </div>
                  <div className="w-40 flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {project.status}
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions / Activity (One Third) */}
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold text-slate-800">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all group">
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span className="font-semibold text-sm text-slate-800">Create New Task</span>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-800 transition-all shadow-sm">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-sm">Invite Team Member</span>
            </button>
          </div>

          <div className="mt-8 p-6 rounded-2xl bg-linear-to-br from-primary/10 via-transparent to-transparent border border-primary/10 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="font-display font-bold text-slate-800 text-lg">Pro Version</h4>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Unlock advanced analytics and unlimited projects.</p>
              <button className="w-full py-2.5 bg-[#1A1C2E] text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition-transform">
                Upgrade Now
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all duration-700" />
          </div>
        </section>
      </div>
    </div>
  );
}
