import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Shield, Zap, Database, Globe, MessageSquare,
  ArrowRight, CheckCircle2, Lock, Server, Layers, BarChart3,
  Smartphone, Code2, ChevronRight, Cpu, ArrowDown,
} from 'lucide-react';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Client Subscribes',
    description: 'Client signs up, chooses a subscription plan, and gets automatically assigned a dedicated associate.',
    icon: Users,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    step: '02',
    title: 'Associate Applies for Jobs',
    description: 'The assigned associate searches for relevant positions and submits applications on behalf of the client.',
    icon: Briefcase,
    color: 'from-indigo-500 to-violet-600',
  },
  {
    step: '03',
    title: 'Applications Are Tracked',
    description: 'Every application is logged with company, role, status, resume link, and notes — all visible to both parties.',
    icon: BarChart3,
    color: 'from-violet-500 to-purple-600',
  },
  {
    step: '04',
    title: 'Status Updates in Real-Time',
    description: 'Client updates job status (Applied → Interview → Offer/Rejected). Associate adds notes and context.',
    icon: Zap,
    color: 'from-purple-500 to-pink-600',
  },
  {
    step: '05',
    title: 'Real-Time Communication',
    description: 'Client and associate communicate via built-in real-time chat powered by Socket.io.',
    icon: MessageSquare,
    color: 'from-pink-500 to-rose-600',
  },
  {
    step: '06',
    title: 'Data Persisted & Cached',
    description: 'All data is stored in MongoDB with Redis caching for fast retrieval. JWT secures every request.',
    icon: Database,
    color: 'from-rose-500 to-red-600',
  },
];

const TECH_STACK = [
  { name: 'React', category: 'Frontend', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  { name: 'TypeScript', category: 'Frontend', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { name: 'Tailwind CSS', category: 'Styling', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { name: 'React Query', category: 'State', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { name: 'Node.js', category: 'Backend', color: 'bg-green-100 text-green-700 border-green-200' },
  { name: 'Express.js', category: 'Backend', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { name: 'MongoDB', category: 'Database', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { name: 'Redis', category: 'Cache', color: 'bg-red-100 text-red-700 border-red-200' },
  { name: 'JWT', category: 'Auth', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { name: 'Socket.io', category: 'Real-time', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { name: 'Zod', category: 'Validation', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Vite', category: 'Tooling', color: 'bg-violet-100 text-violet-700 border-violet-200' },
];

const FEATURES = [
  { title: 'Secure Authentication', description: 'JWT-based auth with hashed passwords and protected routes', icon: Lock },
  { title: 'Role-Based Access', description: 'Client, Associate, and Admin roles with granular permissions', icon: Shield },
  { title: 'Real-Time Chat', description: 'Socket.io powered messaging between clients and associates', icon: MessageSquare },
  { title: 'Dashboard Analytics', description: 'Track application counts, statuses, and activity overview', icon: BarChart3 },
  { title: 'Job Tracking Pipeline', description: 'Full lifecycle tracking: Applied → Interview → Offer/Rejected', icon: Layers },
  { title: 'Responsive Design', description: 'Fully responsive UI that works seamlessly on all devices', icon: Smartphone },
];

const ARCHITECTURE_LAYERS = [
  { label: 'React Frontend', sub: 'Vite + TypeScript + TailwindCSS', icon: Globe, color: 'from-cyan-500 to-blue-600' },
  { label: 'API Layer', sub: 'Axios + React Query', icon: ChevronRight, color: 'from-blue-500 to-indigo-600' },
  { label: 'Express Backend', sub: 'Node.js + REST API + Socket.io', icon: Server, color: 'from-indigo-500 to-violet-600' },
  { label: 'Data Layer', sub: 'MongoDB + Redis Cache', icon: Database, color: 'from-violet-500 to-purple-600' },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navigation ─────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Briefcase className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Job<span className="text-indigo-600">Flow</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50">
              Login
            </Link>
            <Link to="/register" className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50/50 to-slate-50"></div>
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-sm font-semibold text-indigo-700 mb-6 animate-fade-in">
            <Code2 className="w-4 h-4" />
            Full-Stack MERN Application
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight animate-fade-in-up">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">HireSync</span> Works
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
            A production-grade job application management platform that connects clients with dedicated associates who manage their entire job search pipeline.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
            <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5">
              Try the Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#overview" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all border border-slate-200 shadow-sm">
              Learn More <ArrowDown className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ─── Project Overview ───────────────────────────────── */}
      <section id="overview" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Overview</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">What Problem Does This Solve?</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              Managing job applications across multiple platforms is chaotic. HireSync centralizes the entire process with a delegated workflow model.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'The Problem',
                description: 'Job seekers struggle to track applications across dozens of platforms. The process is manual, unorganized, and time-consuming.',
                icon: '😤',
                bg: 'bg-red-50 border-red-100',
              },
              {
                title: 'The Solution',
                description: 'HireSync delegates job applications to dedicated associates. Clients subscribe, get matched, and watch their pipeline grow.',
                icon: '💡',
                bg: 'bg-green-50 border-green-100',
              },
              {
                title: 'The Users',
                description: 'Clients who need jobs applied on their behalf, and Associates who professionally manage application pipelines for multiple clients.',
                icon: '👥',
                bg: 'bg-blue-50 border-blue-100',
              },
            ].map((item) => (
              <div key={item.title} className={`rounded-2xl border p-8 ${item.bg} card-hover`}>
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── User Roles ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Roles</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Two Sides of the Platform</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Client */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 card-hover shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Client</h3>
              <p className="text-slate-600 mb-6">The job seeker who subscribes and delegates their application process.</p>
              <ul className="space-y-3">
                {['Subscribe to plans', 'View application pipeline', 'Update job statuses', 'Chat with assigned associate', 'Track all applications in one place'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Associate */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 card-hover shadow-sm">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Associate</h3>
              <p className="text-slate-600 mb-6">The professional who manages job applications on behalf of clients.</p>
              <ul className="space-y-3">
                {['Manage multiple clients', 'Submit job applications', 'Add notes and context', 'Track application progress', 'Communicate with clients in real-time'].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── End-to-End Workflow ─────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Workflow</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">End-to-End Flow</h2>
            <p className="mt-4 text-lg text-slate-600">From subscription to job offer — here's how the platform works step by step.</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-rose-500 hidden sm:block"></div>

            <div className="space-y-8 sm:space-y-12">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="relative flex items-start gap-4 sm:gap-6">
                    {/* Icon Circle */}
                    <div className={`relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex-1 card-hover shadow-sm" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Step {step.step}</span>
                        <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Backend Architecture ────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Architecture</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">Backend Flow</h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              A robust, secure, and scalable backend powering every interaction.
            </p>
          </div>

          {/* Architecture Visual */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {ARCHITECTURE_LAYERS.map((layer, idx) => {
              const Icon = layer.icon;
              return (
                <div key={layer.label} className="relative">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center card-hover hover:bg-white/10 transition-colors">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${layer.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{layer.label}</h3>
                    <p className="text-sm text-slate-400">{layer.sub}</p>
                  </div>
                  {idx < ARCHITECTURE_LAYERS.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                      <ChevronRight className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Auth & API Flow Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">Authentication Flow</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">01</span>
                  <p>User submits credentials → Server validates against MongoDB</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">02</span>
                  <p>Bcrypt compares hashed password → JWT token generated with userId + role</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">03</span>
                  <p>Token sent to client → Stored in localStorage → Attached to every API call via Axios interceptor</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">04</span>
                  <p><code className="text-indigo-300">protect</code> middleware verifies token → <code className="text-indigo-300">authorizeRoles</code> checks permissions</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white">API Request Lifecycle</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">01</span>
                  <p>React component triggers action → React Query calls API function</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">02</span>
                  <p>Axios sends request with Bearer token → Express router matches route</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">03</span>
                  <p>Middleware pipeline: auth → role check → subscription check → Zod validation</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-mono text-xs mt-0.5">04</span>
                  <p>Controller checks Redis cache → Falls back to MongoDB → Sets cache → Returns JSON response</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Tech Stack ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Technology</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Tech Stack</h2>
            <p className="mt-4 text-lg text-slate-600">Built with modern, battle-tested technologies.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm ${tech.color} card-hover`}>
                <span>{tech.name}</span>
                <span className="text-xs opacity-60">· {tech.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Key Features ───────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-indigo-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Features</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Key Features</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="bg-white rounded-2xl border border-slate-200 p-6 card-hover shadow-sm group">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                    <Icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">Ready to Explore?</h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
            Try the demo accounts to experience the full platform — both Client and Associate perspectives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:-translate-y-0.5">
              Try Demo Login <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/20">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────── */}
      <footer className="py-8 px-4 bg-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center">
            <Briefcase className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-white">HireSync</span>
        </div>
        <p className="text-xs text-slate-500">
          Built with MERN Stack • © {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HowItWorks;
