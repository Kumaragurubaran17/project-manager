import { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Download,
  Share2,
  FileText,
  List,
  Columns,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '../lib/supabase';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const sidebarColors = [
  { icon: LayoutDashboard, color: 'bg-indigo-500/10 text-indigo-500 shadow-indigo-500/20' },
  { icon: FolderKanban, color: 'bg-orange-500/10 text-orange-500 shadow-orange-500/20' },
  { icon: Users, color: 'bg-emerald-500/10 text-emerald-500 shadow-emerald-500/20' },
  { icon: Bell, color: 'bg-rose-500/10 text-rose-500 shadow-rose-500/20' },
];

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProjectsOpen, setIsProjectsOpen] = useState(true);
  const [realProjects, setRealProjects] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSidebarProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name')
        .order('created_at', { ascending: false });
      
      if (data) {
        setRealProjects(data);
      }
    };

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
    };

    fetchSidebarProjects();
    fetchUser();

    // Subscribe to changes for real-time sidebar updates
    const channel = supabase
      .channel('sidebar-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchSidebarProjects)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "relative z-50 flex flex-col transition-all duration-300 border-r border-border bg-white shadow-soft",
          isSidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 h-20 px-6 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Plus className="w-6 h-6 text-white rotate-45" />
          </div>
          {isSidebarOpen && (
            <span className="text-2xl font-display font-extrabold tracking-tight text-primary">Zenith</span>
          )}
        </div>

        {/* User Profile in Sidebar */}
        {isSidebarOpen && (
          <div className="px-6 mb-8 mt-2">
            <div className="p-3 bg-secondary/50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-400 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/100?u=${currentUser?.id || 'admin'}`} alt="James Walker" className="w-full h-full object-crop" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate leading-none mb-1">{currentUser?.email?.split('@')[0] || 'User'}</p>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest truncate">Product Lead</p>
              </div>
            </div>
          </div>
        )}

        {/* Sidebar Search */}
        {isSidebarOpen && (
          <div className="px-6 mb-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="w-full bg-secondary focus:bg-white border border-transparent focus:border-primary/20 rounded-xl py-2 px-10 text-sm outline-hidden transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation Groups */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
          {isSidebarOpen ? (
            <>
              <div>
                <button className="flex items-center justify-between w-full px-2 mb-2 group">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">My Team</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              </div>

              <div>
                <button 
                  onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                  className="flex items-center justify-between w-full px-2 mb-3 group"
                >
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Projects</span>
                  {isProjectsOpen ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isProjectsOpen && (
                  <div className="space-y-1 pl-2">
                    <NavLink
                        to="/projects"
                        className={({ isActive }) => cn(
                          "block py-2 px-3 rounded-xl text-sm font-semibold transition-all",
                          isActive && location.pathname === '/projects'
                            ? "bg-primary/5 text-primary shadow-sm" 
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        All project ({realProjects.length})
                    </NavLink>
                    
                    <div className="space-y-1 mt-2">
                      {realProjects.map((p) => (
                        <NavLink
                          key={p.id}
                          to={`/projects/${p.id}`}
                          className={({ isActive }) => cn(
                            "block py-2 px-3 rounded-xl text-sm font-semibold transition-all",
                            isActive 
                              ? "bg-primary/5 text-primary shadow-sm" 
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                          )}
                        >
                          {p.name}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button className="flex items-center justify-between w-full px-2 mb-2 group">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    Reminder <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">6</span>
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4 flex flex-col items-center">
              {sidebarColors.map((item, i) => (
                <div key={i} className={cn("p-2.5 rounded-xl shadow-sm cursor-pointer hover:scale-110 active:scale-95 transition-all", item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-border mt-auto space-y-1">
          <button className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
            <Settings className="w-5 h-5" />
            {isSidebarOpen && <span>Settings</span>}
          </button>
          <button 
             onClick={handleLogout}
             className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-8 z-40">
          <div className="flex items-center h-full gap-8">
            <div className="flex h-full items-center gap-4">
               <NavLink to="/" className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
                 <LayoutDashboard className="w-6 h-6" />
               </NavLink>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2.5 bg-secondary hover:bg-muted rounded-xl text-muted-foreground transition-all group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary border-2 border-white rounded-full shadow-sm" />
            </button>
            <button className="flex items-center gap-3 pl-3 pr-2 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs group">
                <div className="w-7 h-7 rounded-lg bg-orange-400 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${currentUser?.id || 'admin'}`} alt="James Walker" />
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="flex-1 overflow-y-auto p-8 bg-background">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
