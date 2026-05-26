import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Users, Shield, Zap, MessageSquare,
  ArrowRight, Lock, Layers, BarChart3,
  Code2, Cpu, ArrowDown, ChevronDown, Check, HelpCircle
} from 'lucide-react';

const FADE_IN_UP = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
};

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Subscribe & Match',
    description: 'Select an application operations plan. We immediately match you with a dedicated career associate aligned with your background.',
    icon: Users,
    detail: 'Manual matching takes under 24 hours.'
  },
  {
    step: '02',
    title: 'Search & Tailor',
    description: 'Your associate searches across top portals, filters by your criteria, and crafts customized application profiles.',
    icon: Briefcase,
    detail: 'Every resume version is logged transparently.'
  },
  {
    step: '03',
    title: 'Outsource the Administrative Chaos',
    description: 'We handle the forms, external portals, and basic listings. You receive high-clarity alerts for interviews.',
    icon: Layers,
    detail: 'Eliminates up to 15 hours of fatigue weekly.'
  },
  {
    step: '04',
    title: 'Cohesive Live Pipeline',
    description: 'Watch your career workspace update in real time. Coordinate next steps, interview dates, and offer letters.',
    icon: BarChart3,
    detail: 'Full historical audit trail included.'
  }
];

const FEATURES = [
  { 
    title: 'Operational Transparency', 
    description: 'Zero black holes. View every application resume, link, tracking code, and timestamp instantly inside your dashboard.', 
    icon: Shield 
  },
  { 
    title: 'Built-in Real-time Chat', 
    description: 'Communicate directly with your assigned associate using instant message sync powered by Socket.io.', 
    icon: MessageSquare 
  },
  { 
    title: 'JWT Protected Access', 
    description: 'Your resumes, applications, private emails, and personal information are secured with state-of-the-art authentication.', 
    icon: Lock 
  },
  { 
    title: 'High-Response Workflows', 
    description: 'Update application states seamlessly (Applied → Interview → Offer). We sync caching using Redis for instant dashboard loads.', 
    icon: Zap 
  },
  { 
    title: 'Dedicated Focus', 
    description: 'We are structured for NRS job seekers, busy professionals, and international graduates requiring rigorous operational support.', 
    icon: Users 
  },
  { 
    title: 'No Automation Gimmicks', 
    description: 'We do not run spam bot applications. Real professionals execute real, high-quality applications manually.', 
    icon: Cpu 
  }
];

const FAQS = [
  {
    q: "How does the dedicated associate workflow function?",
    a: "Once subscribed, you upload your resume variants, criteria, and target roles. A dedicated associate is manually matched to your account. They actively source and submit job applications on your behalf daily, keeping a highly organized ledger of every single submission inside your dashboard."
  },
  {
    q: "Are the applications high-quality or automated bots?",
    a: "We are strictly against bot spam. Automated bots trigger platform flags and lead to mass rejections. Your associate reviews descriptions, checks qualifications, aligns your resume variants, and applies manually just as you would—only faster and without the mental fatigue."
  },
  {
    q: "Can I communicate with my associate?",
    a: "Yes. Handlr has a dedicated, built-in real-time chat platform. You can coordinate resume tweaks, clarify role criteria, ask questions, or provide updates immediately."
  },
  {
    q: "What countries and roles do you support?",
    a: "We support job seekers looking for professional opportunities globally, with a strong focus on high-demand tech, engineering, business, operations, and finance roles in the US, UK, Canada, and Europe."
  }
];

const PRICING_PLANS = [
  {
    name: 'Core',
    price: '$99',
    period: '/month',
    desc: 'A streamlined application management plan with dedicated human support.',
    features: [
      'Up to 350 tailored applications / month',
      'Dedicated associate support',
      'Real-time workspace tracking',
      'Resume customization support',
      'Interview update notifications',
      'Built-in chat access'
    ],
    popular: false,
    cta: 'Get Started'
  },
  {
    name: 'Momentum',
    price: '$149',
    period: '/month',
    desc: 'Higher-volume outreach with faster execution and priority coordination.',
    features: [
      'Up to 500 tailored applications / month',
      'Priority associate matching',
      'Faster application turnaround',
      'Resume variant optimization',
      'Priority live support',
      'Interview coordination assistance'
    ],
    popular: true,
    cta: 'Start Momentum'
  }
];

const HowItWorks = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 selection:bg-[#4866C8]/10 selection:text-[#4866C8]">
      {/* ─── Navigation Header ───────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#fafafa]/85 backdrop-blur-md border-b border-zinc-200/40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center group transition-opacity hover:opacity-90 select-none">
            <img 
              src="/brand/logos/handlr-logo-black.svg" 
              alt="Handlr Logo" 
              className="h-6 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/30 hover:border-zinc-300"
            >
              Sign in
            </Link>
            <Link 
              to="/register" 
              className="text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-800 px-4 py-1.5 rounded-lg transition-all shadow-sm border border-zinc-800"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:32px_32px] opacity-25 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[250px] bg-[#4866C8]/2.5 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200/80 shadow-sm text-[10px] font-bold text-zinc-600 mb-6"
          >
            <Code2 className="w-3.5 h-3.5 text-[#4866C8]" />
            Full-Stack Professional Operations Platform
          </motion.div>

          <motion.h1 
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.15] max-w-3xl mx-auto"
          >
            Job hunting is a chaotic, full-time job. <span className="text-[#4866C8]">We handle the applications.</span>
          </motion.h1>

          <motion.p 
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="mt-5 text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed"
          >
            A dedicated career operations partner applying to vetted roles, organizing tracking workspaces, and eliminating search fatigue on your behalf.
          </motion.p>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={FADE_IN_UP}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xs sm:max-w-none mx-auto"
          >
            <Link 
              to="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-950 text-white font-semibold rounded-lg text-xs hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.985]"
            >
              Access Demo Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a 
              href="#overview" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-zinc-700 font-semibold rounded-lg text-xs border border-zinc-200 hover:bg-zinc-50 shadow-sm transition-all active:scale-[0.985]"
            >
              See How It Works <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ─── Interactive Mock Dashboard ─────────────────────── */}
      <section className="pb-20 px-6 relative max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-zinc-200 rounded-xl shadow-md overflow-hidden"
        >
          {/* Mock Browser Header */}
          <div className="bg-zinc-50 border-b border-zinc-200/80 px-4 py-2.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
            </div>
            <div className="text-[10px] text-zinc-400 font-semibold font-mono select-none">app.handlr.io/dashboard/workspace</div>
            <div className="w-12" />
          </div>

          <div className="grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 h-[340px] bg-white">
            {/* Sidebar Mock */}
            <div className="lg:col-span-3 p-4 bg-zinc-50/50 space-y-4 hidden lg:block">
              <div className="h-5 w-20 bg-zinc-200 rounded" />
              <div className="space-y-1.5">
                <div className="h-7 w-full bg-zinc-200/70 rounded-md" />
                <div className="h-7 w-full bg-zinc-100 rounded-md" />
                <div className="h-7 w-full bg-zinc-100 rounded-md" />
              </div>
            </div>

            {/* Dashboard Content Mock */}
            <div className="lg:col-span-9 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="h-4 w-32 bg-zinc-200 rounded mb-1.5" />
                    <div className="h-3 w-48 bg-zinc-100 rounded" />
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 rounded-full">12 Vetted Apps This Week</span>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Applications', value: '47', border: 'border-zinc-200' },
                    { label: 'Interviews Scheduled', value: '6', border: 'border-zinc-200' },
                    { label: 'Offers Secured', value: '2', border: 'border-[#4866C8]/25' }
                  ].map((stat, i) => (
                    <div key={i} className={`p-3 border rounded-lg bg-zinc-50/20 ${stat.border}`}>
                      <div className="text-[10px] font-bold text-zinc-400">{stat.label}</div>
                      <div className="text-lg font-bold text-zinc-950 mt-0.5">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Mock List */}
                <div className="space-y-2">
                  <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Live Activity Stream</div>
                  {[
                    { company: 'Stripe', role: 'Solutions Engineer', status: 'Interview', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
                    { company: 'Linear', role: 'Frontend Architect', status: 'Applied', badge: 'bg-zinc-100 text-zinc-700 border-zinc-200' },
                    { company: 'Vercel', role: 'Product Designer', status: 'Offer', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2.5 border border-zinc-100 rounded-lg hover:bg-zinc-50/50 transition-colors text-xs">
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-900">{item.company}</span>
                        <span className="text-zinc-500">{item.role}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] font-bold border rounded ${item.badge}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock Status Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 font-medium">
                <div className="flex items-center gap-1.5">Operational status: <span className="text-emerald-500 font-bold inline-flex items-center"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1 inline-block"></span>Active Syncing</span></div>
                <div>Last updated 2 mins ago</div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Founder's Conviction (Overview) ─────────────────── */}
      <section id="overview" className="py-20 px-6 border-t border-zinc-200/40 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold tracking-wider text-[#4866C8] uppercase bg-[#eff3ff] px-2.5 py-1 rounded-full">The Reality of Job Search</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight animate-fade-in">Job searching is broken.</h2>
            <p className="mt-4 text-zinc-500 text-xs sm:text-sm leading-relaxed">
              We know the stress. Endless career boards that lead to automated rejections. Resume customizers that consume your entire evening. Tracking spreadsheets that multiply chaos instead of reducing it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 border border-zinc-200/50 rounded-xl bg-zinc-50/20">
              <span className="text-xl">😓</span>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-950 mt-3 mb-1.5">The Old Chaotic Loop</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Spend 3 hours a day copying resumes, filling identical input screens on Taleo, Workday, or Greenhouse, and watching your inquiries disappear into digital voids.
              </p>
            </div>
            <div className="p-6 border border-[#4866C8]/20 rounded-xl bg-white shadow-sm">
              <span className="text-xl">🤝</span>
              <h3 className="text-xs sm:text-sm font-bold text-[#4866C8] mt-3 mb-1.5">The Vetted Handlr Alternative</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Outsource the operational friction to a dedicated associate. Real human tracking, daily customized submissions, direct transparency, and zero automations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── End-to-End Workflow Timeline ─────────────────────── */}
      <section className="py-20 px-6 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-wider text-[#4866C8] uppercase bg-[#eff3ff] px-2.5 py-1 rounded-full">The Process</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">How Handlr Works</h2>
            <p className="mt-2 text-zinc-500 text-xs sm:text-sm">Four high-fidelity steps to career organization and momentum.</p>
          </div>

          {/* Rebuilt Process Steps: Compact Horizontal Flow on Desktop, Stacks on Mobile */}
          <div className="relative max-w-5xl mx-auto">
            {/* Desktop timeline connection line */}
            <div className="absolute top-[26px] left-[12%] right-[12%] h-[1px] bg-zinc-200 border-dashed border-t hidden lg:block -z-0" />
            
            <div className="grid lg:grid-cols-4 gap-8 relative z-10">
              {WORKFLOW_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="flex flex-col items-center lg:items-start text-center lg:text-left bg-white lg:bg-transparent p-5 lg:p-0 border border-zinc-200/50 lg:border-none rounded-xl">
                    {/* Timeline circle badge */}
                    <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xs font-bold font-mono border-4 border-[#fafafa] lg:border-zinc-50 shadow-sm mb-3.5">
                      {step.step}
                    </div>
                    
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[#4866C8]" />
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{step.description}</p>
                    <span className="inline-block mt-2 text-[9px] font-bold text-zinc-400 font-mono bg-zinc-50 border border-zinc-200/30 px-1.5 py-0.5 rounded">{step.detail}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Grid Feature Showcase ───────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-zinc-200/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold tracking-wider text-[#4866C8] uppercase bg-[#eff3ff] px-2.5 py-1 rounded-full">Platform Capabilities</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">Modern Career Infrastructure</h2>
            <p className="mt-2 text-zinc-500 text-xs sm:text-sm">Engineered for trust, legibility, and reduced chaos.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 border border-zinc-200/50 rounded-xl hover:border-zinc-350 bg-white transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                  <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center mb-4 border border-zinc-100">
                    <Icon className="w-4.5 h-4.5 text-zinc-900" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-zinc-950 mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Founder's Conviction Quote Card (Editorial Rebuild) ─── */}
      <section className="py-20 px-6 bg-[#fafafa] border-t border-zinc-200/40">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-8 sm:p-10 border border-zinc-200/50 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#4866C8]/1 rounded-full blur-2xl" />
            
            {/* Left Column: Author Credentials */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left border-b lg:border-b-0 lg:border-r border-zinc-200/60 pb-6 lg:pb-0 lg:pr-8">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-zinc-400 mb-4 block">Founder Conviction</span>
              <div className="w-12 h-12 rounded-full bg-zinc-950 flex items-center justify-center text-white text-base font-bold shadow-sm mb-3">NR</div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-950">Nishanth Rao</p>
                <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Founder, Handlr</p>
              </div>
            </div>

            {/* Right Column: Quote Statement */}
            <div className="lg:col-span-8">
              <blockquote className="text-zinc-700 text-xs sm:text-sm lg:text-base italic leading-relaxed font-serif">
                "We didn't build Handlr to play games with automated bot scripts or mass-apply to 1,000 jobs in 5 minutes. Spam bot platforms get people flagged and filtered out. We built Handlr because job searching deserves operational maturity and true calmness. Our platform delegates the tedious form details and manual outreach to dedicated professionals, ensuring you walk into interview panels fully rested and prepared."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pricing Section ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-zinc-50 border-t border-zinc-200/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-bold tracking-wider text-[#4866C8] uppercase bg-[#eff3ff] px-2.5 py-1 rounded-full">Pricing Plans</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">Structured for convenient scaling</h2>
            <p className="mt-2 text-zinc-500 text-xs sm:text-sm">Transparent operations. No hidden contracts.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {PRICING_PLANS.map((plan, index) => (
              <div 
                key={index} 
                className={`p-8 rounded-xl border flex flex-col justify-between transition-all bg-white relative ${
                  plan.popular ? 'border-zinc-950 shadow-md ring-1 ring-zinc-950' : 'border-zinc-200/60 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 bg-zinc-950 text-white text-[9px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-zinc-800 shadow-sm">
                    Recommended Plan
                  </span>
                )}
                <div>
                  <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">{plan.name}</h3>
                  <p className="mt-2 text-xs text-zinc-500 leading-normal">{plan.desc}</p>
                  
                  <div className="my-6 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-zinc-950 tracking-tight">{plan.price}</span>
                    <span className="text-xs text-zinc-400 font-semibold">{plan.period}</span>
                  </div>

                  <ul className="space-y-3.5 border-t border-zinc-100 pt-6">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-zinc-600">
                        <Check className="w-3.5 h-3.5 text-zinc-950 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <Link 
                    to="/register" 
                    className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      plan.popular 
                        ? 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm active:scale-[0.985] border border-zinc-800' 
                        : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 shadow-sm active:scale-[0.985]'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ Section ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-t border-zinc-200/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold tracking-wider text-[#4866C8] uppercase bg-[#eff3ff] px-2.5 py-1 rounded-full">Got Questions?</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index} 
                  className="border border-zinc-200/60 rounded-xl overflow-hidden bg-white transition-all duration-200"
                >
                  <button 
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-zinc-50/50 transition-colors gap-4"
                  >
                    <span className="text-xs sm:text-sm font-bold text-zinc-950 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-0.5 text-xs text-zinc-500 border-t border-zinc-100/60 leading-relaxed bg-[#fafafa]/50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Call to Action Section ──────────────────────────── */}
      <section className="py-16 px-6 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#4866C8_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4" style={{ color: "#5B7CFA" }}>Restore sanity and momentum to your career.</h2>
          <p className="text-xs text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
            Choose a plan, get assigned a dedicated associate in hours, and outsource the job application grind professional-style.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xs sm:max-w-none mx-auto">
            <Link 
              to="/register" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-white text-zinc-950 font-bold rounded-lg text-xs hover:bg-zinc-100 transition-colors shadow-sm active:scale-[0.985]"
            >
              Get Started Now
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-zinc-900 text-zinc-300 border border-zinc-800 font-bold rounded-lg text-xs hover:bg-zinc-850 transition-colors active:scale-[0.985]"
            >
              Access Free Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer Area ────────────────────────────────────── */}
      <footer className="py-12 px-6 bg-[#fafafa] border-t border-zinc-200 text-center text-xs text-zinc-400">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img 
              src="/brand/logos/handlr-logo-black.svg" 
              alt="Handlr Logo" 
              className="h-5 w-auto opacity-70"
            />
          </div>
          <p className="max-w-md mx-auto text-[10px] text-zinc-400 leading-relaxed mb-4">
            Handlr is a registered SaaS outsourcing job application management company. All client applications are executed manually under professional guidelines.
          </p>
          <p>&copy; {new Date().getFullYear()} Handlr. We Handle. You Grow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
