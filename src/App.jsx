import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Network, BookOpen, Search, Play, ExternalLink, ChevronDown, ChevronRight, BookMarked, GraduationCap, ChevronUp, Edit3, Save, X, ZoomIn, ZoomOut, Maximize, Lock, Unlock, KeyRound } from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Safely initialize Firebase so it NEVER crashes the app if the environment is missing variables
let app, auth, db;
try {
  if (typeof __firebase_config !== 'undefined') {
    const firebaseConfig = typeof __firebase_config === 'string' ? JSON.parse(__firebase_config) : __firebase_config;
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Cloud features unavailable, running in local mode.", error);
}

const appId = typeof __app_id !== 'undefined' ? __app_id : 'hrm-master-prep';

const initialHrmData = [
  {
    unit: "Unit I: Introduction",
    subtopics: [
      {
        title: "Core Concepts, Functions, and Objectives",
        searchQuery: "HRM Core Concepts Functions Objectives",
        questions: [
          { q: "Define Human Resource Management.", marks: 3, rep: 1, ans: "HRM means managing people efficiently to achieve organizational and individual goals." },
          { q: "What do you mean by HRM? Explain in detail the functions.", marks: 10, rep: 2, ans: "Meaning of HRM + detailed functions: Managerial (planning, organizing, directing, controlling) and Operative (recruitment, training, compensation, maintenance)." },
          { q: "Explain functions of HRM (managerial & operative).", marks: "7, 10", rep: 4, ans: "Managerial functions (planning, control) and operative functions (hiring, training) with examples." },
          { q: "Explain objectives of HRM.", marks: 7, rep: 1, ans: "Organizational efficiency, employee growth, legal compliance, social welfare." },
          { q: "Explain components of HRM system.", marks: 10, rep: 1, ans: "Recruitment, Selection, Training, Appraisal, Compensation, Employee Relations." }
        ]
      },
      {
        title: "Evolution & Comparisons",
        searchQuery: "Difference between Personnel Management HRD and HRM",
        questions: [
          { q: "Difference between Personnel Management and HRM.", marks: 7, rep: 1, ans: "PM is traditional/admin based; HRM is strategic and people-centered." },
          { q: "Difference between HRM and HRD.", marks: 3, rep: 1, ans: "HRM covers all employee functions; HRD focuses strictly on training and development." },
          { q: "“HRM is old wine in a new bottle.” Comment.", marks: 3, rep: 1, ans: "Traditional labor management existed earlier, HRM is its modern strategic form." }
        ]
      },
      {
        title: "HRM in a Changing Environment",
        searchQuery: "HRM in changing environment challenges trends",
        questions: [
          { q: "Challenges faced by HR Manager / Current HR trends.", marks: 7, rep: 2, ans: "Globalization, hybrid work, diversity, retention, AI, labor law changes." },
          { q: "Changing practices of HRM (critical analysis).", marks: 10, rep: 1, ans: "HR shifted from administrative role to strategic partner, analytics-based decisions." },
          { q: "Importance of human factor with AI, robots, IoT.", marks: 7, rep: 1, ans: "While AI automates, human creativity, empathy, ethics, leadership remain essential." },
          { q: "How can HR Manager maintain workforce diversity?", marks: 3, rep: 1, ans: "Inclusive hiring, anti-discrimination policy, diversity training." }
        ]
      }
    ]
  },
  {
    unit: "Unit II: Staffing and Development",
    subtopics: [
      {
        title: "Human Resource Planning (HRP)",
        searchQuery: "Human Resource Planning HRP HRM",
        questions: [
          { q: "Define Human Resource Planning.", marks: 3, rep: 2, ans: "Forecasting manpower demand and supply for future needs." },
          { q: "Objectives of Human Resource Planning.", marks: 3, rep: 1, ans: "Right number of employees, right skills, succession planning, avoid shortage/excess." }
        ]
      },
      {
        title: "Job Analysis & Job Design",
        searchQuery: "Job Analysis Job Description Job Design HRM",
        questions: [
          { q: "What is Job Analysis?", marks: 3, rep: 2, ans: "Study of duties, responsibilities, skills, working conditions of a job." },
          { q: "Job Analysis (short note / methods / significance).", marks: "3, 7, 10", rep: 3, ans: "Meaning, objectives, importance. Methods: Observation, Interview, Questionnaire, Diary/Logbook." },
          { q: "What is Job Description?", marks: 3, rep: 1, ans: "Written statement of duties, authority, responsibilities of a job." },
          { q: "Job Design (with methods).", marks: 7, rep: 1, ans: "Rotation (moving tasks), Enlargement (horizontal), Enrichment (vertical) for motivation and efficiency." }
        ]
      },
      {
        title: "Recruitment & Selection",
        searchQuery: "Recruitment vs Selection External Sources HRM",
        questions: [
          { q: "Recruitment (definition, importance & difference from selection).", marks: 7, rep: 2, ans: "Recruitment attracts applicants; selection chooses best candidate." },
          { q: "Why Recruitment is positive and Selection negative process?", marks: "3, 7", rep: 2, ans: "Recruitment increases applicants (positive); selection rejects unsuitable candidates (negative)." },
          { q: "External sources of Recruitment.", marks: 7, rep: 1, ans: "Campus, agencies, employment exchange, advertisements, job portals." }
        ]
      },
      {
        title: "Induction, Training & Career Planning",
        searchQuery: "HRM Training Methods Career Planning Induction",
        questions: [
          { q: "What is Induction? Difference between Induction and Orientation.", marks: 3, rep: 2, ans: "Induction is immediate short-term introduction; Orientation is broader cultural adjustment process." },
          { q: "Training (meaning & methods) and Evaluation.", marks: "7, 10", rep: 3, ans: "Improve skills via on-job / off-job methods. Evaluate via Kirkpatrick model: Reaction, Learning, Behavior, Results." },
          { q: "Learning Organisation.", marks: 7, rep: 1, ans: "An organization that continuously learns and adapts to change." },
          { q: "What is Career Planning?", marks: "3, 7", rep: 2, ans: "Setting career goals and growth paths. Benefits retention and succession." }
        ]
      }
    ]
  },
  {
    unit: "Unit III: Compensation & Appraisal",
    subtopics: [
      {
        title: "Wage, Salary & Fixation",
        searchQuery: "Wage Fixation Taylor Merrick Piece Rate System",
        questions: [
          { q: "Define 'Wage' and explain mechanism of wage fixation.", marks: "3, 7", rep: 2, ans: "Monetary remuneration. Fixation via Minimum Wages Act, collective bargaining, wage boards." },
          { q: "What is CTC? Difference from gross and net salary.", marks: 3, rep: 1, ans: "CTC is Total Cost to Company. Gross is before tax. Net is actual take-home cash." },
          { q: "Taylor's & Merrick differential piece rate systems.", marks: 7, rep: 2, ans: "Taylor: 2-tier rate penalizing inefficiency. Merrick: 3-tier system, less harsh on beginners." }
        ]
      },
      {
        title: "Job Evaluation & Fringe Benefits",
        searchQuery: "Job Evaluation Fringe Benefits HRM",
        questions: [
          { q: "Define Job Evaluation.", marks: "3, 7", rep: 3, ans: "Systematic process to determine the relative worth/value of different jobs to set fair pay." },
          { q: "What are fringe benefits? Why are they important?", marks: 3, rep: 2, ans: "Non-wage compensations (insurance, paid leaves). Boosts morale and aids talent retention." }
        ]
      },
      {
        title: "Performance Appraisal",
        searchQuery: "Performance Appraisal Methods Errors HRM",
        questions: [
          { q: "Performance Appraisal (need, modern methods, errors).", marks: "7, 10", rep: 4, ans: "Need: Promotions/hikes. Methods: 360-degree, MBO, BARS. Errors: Halo/Horn effect, leniency bias." }
        ]
      }
    ]
  },
  {
    unit: "Unit IV: Industrial Relations",
    subtopics: [
      {
        title: "Industrial Disputes & Settlement",
        searchQuery: "Industrial Disputes Act 1947 Settlement Machinery",
        questions: [
          { q: "Define Industrial Relations & Disputes. Explain settlement machinery.", marks: "3, 7, 10", rep: 4, ans: "Machinery under ID Act 1947: Works Committees (preventive) -> Conciliation Officers -> Courts of Enquiry -> Adjudication (Tribunals)." }
        ]
      },
      {
        title: "Discipline & Grievance Procedures",
        searchQuery: "Grievance Handling Procedure Disciplinary Action HRM",
        questions: [
          { q: "Write the procedure for disciplinary action.", marks: "7, 10", rep: 2, ans: "Show-cause notice -> Domestic enquiry -> Final action/punishment." },
          { q: "Grievance Handling Procedure.", marks: 7, rep: 2, ans: "Sequential escalation: Supervisor -> Dept Head -> Grievance Committee -> Arbitration." }
        ]
      },
      {
        title: "Collective Bargaining & Empowerment",
        searchQuery: "Collective Bargaining Employee Empowerment HRM",
        questions: [
          { q: "What is collective bargaining?", marks: 3, rep: 1, ans: "Negotiation between unions and management regarding terms of employment." },
          { q: "Objectives of employee empowerment / engagement.", marks: "3, 7", rep: 2, ans: "Giving autonomy to boost innovation, engagement, and competitive advantage." }
        ]
      }
    ]
  },
  {
    unit: "Unit V: Employee Welfare",
    subtopics: [
      {
        title: "Health, Safety & Employee Welfare",
        searchQuery: "Employee Welfare Intramural Extramural Health Safety",
        questions: [
          { q: "Approaches to employee welfare & safety importance.", marks: "3, 7", rep: 3, ans: "Intra-mural (inside: canteens, first-aid) and Extra-mural (outside: housing, transport)." }
        ]
      },
      {
        title: "Social Security Measures",
        searchQuery: "Social Security Measures in India HRM",
        questions: [
          { q: "Outline social security measures in India.", marks: "3, 7", rep: 5, ans: "EPF Act (Provident Fund), ESI Act (Health), Maternity Benefit Act, Workmen's Compensation Act, Gratuity Act." }
        ]
      },
      {
        title: "HR Audit & Personnel Research",
        searchQuery: "HR Audit Personnel Research",
        questions: [
          { q: "What is HR / personnel audit? Objectives?", marks: "3, 7", rep: 5, formal: true, ans: "Systematic evaluation of HR policies to identify gaps and ensure legal compliance. Personnel research solves specific HR problems using data." }
        ]
      }
    ]
  }
];


const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === 'mapokama') {
      setPwd('');
      setError('');
      onSuccess();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
          <h2 className="font-bold flex items-center gap-2"><KeyRound className="w-5 h-5"/> Admin Access</h2>
          <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded-md transition-colors"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Admin Password</label>
            <input 
              type="password" 
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
              placeholder="Password"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors">Unlock</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Header = ({ isAdmin, onLoginClick, onLogout }) => (
  <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-30 flex justify-between items-center">
    <div>
      <div className="flex items-center gap-2">
        <GraduationCap className="w-6 h-6" />
        <h1 className="text-xl font-bold">HRM Master Prep</h1>
      </div>
      <p className="text-indigo-200 text-xs mt-1">2022-2025 Previous Year Analysis</p>
    </div>
    <button 
      onClick={isAdmin ? onLogout : onLoginClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isAdmin ? 'bg-indigo-800 border-indigo-700 text-green-300 hover:bg-indigo-900' : 'bg-indigo-500 border-indigo-400 text-white hover:bg-indigo-400'}`}
    >
      {isAdmin ? <><Unlock className="w-3.5 h-3.5"/> Admin</> : <><Lock className="w-3.5 h-3.5"/> Login</>}
    </button>
  </header>
);

const SubtopicLinks = ({ query }) => {
  const encodedQuery = encodeURIComponent(query);
  return (
    <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
      <a 
        href={`https://www.youtube.com/results?search_query=${encodedQuery}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-red-100 transition-colors flex-1 justify-center"
      >
        <Play className="w-3.5 h-3.5" /> Watch Lectures
      </a>
      <a 
        href={`https://www.google.com/search?q=${encodedQuery}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors flex-1 justify-center"
      >
        <Search className="w-3.5 h-3.5" /> Read Articles
      </a>
    </div>
  );
}

const MarkdownDisplay = ({ content }) => {
  const getHtml = () => {
    if (!content) return { __html: '' };
    let html = content
      // 1. Escape HTML
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // 2. Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 text-gray-100 p-3 rounded-md my-3 overflow-x-auto text-xs font-mono border border-gray-700 shadow-inner"><code>$1</code></pre>')
      // 3. Headings
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-gray-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-gray-900 mt-5 mb-2 border-b border-gray-200 pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-indigo-900 mt-6 mb-3 border-b border-indigo-200 pb-2">$1</h1>')
      // 4. Bold and Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic text-gray-800">$1</em>')
      // 5. Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 underline-offset-2">$1</a>')
      // 6. Inline Code
      .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 border border-gray-200 text-pink-600 px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
      // 7. Blockquotes
      .replace(/^\s*>\s+(.*)/gim, '<blockquote class="border-l-4 border-indigo-400 pl-3 py-1 my-2 bg-indigo-50/50 text-gray-700 italic rounded-r">$1</blockquote>')
      // 8. Numbered Lists
      .replace(/^\s*(\d+\.)\s+(.*)/gim, '<div class="flex items-start gap-2 my-1"><span class="font-bold text-gray-400 text-xs mt-0.5 shrink-0 select-none">$1</span><span class="flex-1">$2</span></div>')
      // 9. Unordered Lists
      .replace(/^\s*[-*]\s+(.*)/gim, '<div class="flex items-start gap-2 my-1"><span class="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span><span class="flex-1">$1</span></div>');
    
    return { __html: html };
  };

  return (
    <div 
      className="bg-white p-4 rounded-md border border-indigo-100 text-gray-800 text-sm shadow-sm leading-relaxed whitespace-pre-wrap markdown-content"
      dangerouslySetInnerHTML={getHtml()}
    />
  );
};

const QuestionContent = ({ q, unitIdx, subIdx, qIdx, onUpdate, isExpandedInit = false, isAdmin, onRequestLogin }) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedInit);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(q.fullAnswer || "");

  useEffect(() => {
    setText(q.fullAnswer || "");
  }, [q.fullAnswer]);

  const handleSave = () => {
    onUpdate(unitIdx, subIdx, qIdx, text);
    setIsEditing(false);
  };

  return (
    <div className={`bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm transition-all ${isExpandedInit ? 'shadow-md bg-white border-indigo-200' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <p className="font-medium text-gray-900 flex-1 pr-4 leading-snug">{q.q}</p>
        {!isExpandedInit && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-gray-400 hover:text-indigo-600 p-1 bg-white rounded-md border border-gray-200 shadow-sm shrink-0"
            title="Expand to read or add notes"
          >
             {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div className="flex gap-2 mb-2">
        <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">Marks: {q.marks}</span>
        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">Repeated: {q.rep}x</span>
      </div>
      <p className="text-gray-600 leading-relaxed mb-2"><span className="font-semibold text-gray-700">Ans outline:</span> {q.ans}</p>

      {(isExpanded || isExpandedInit) && (
        <div className="mt-3 pt-3 border-t border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
           {isEditing ? (
             <div className="space-y-2">
               <textarea
                 className="w-full text-sm p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[160px] bg-white shadow-inner"
                 placeholder="Paste your detailed answer, markdown notes, or links here..."
                 value={text}
                 onChange={(e) => setText(e.target.value)}
                 autoFocus
               />
               <div className="flex justify-end gap-2">
                 <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 rounded-md transition-colors">Cancel</button>
                 <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-md shadow-sm transition-colors">
                   <Save className="w-3.5 h-3.5" /> Save Note
                 </button>
               </div>
             </div>
           ) : (
             <div className="space-y-3">
               {q.fullAnswer ? (
                 <MarkdownDisplay content={q.fullAnswer} />
               ) : (
                 <div className="bg-white p-3 rounded-md border border-dashed border-gray-300 text-center text-gray-500 text-xs italic">
                   No detailed notes added yet.
                 </div>
               )}
               <button 
                 onClick={() => {
                   if (isAdmin) setIsEditing(true);
                   else onRequestLogin();
                 }} 
                 className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors w-fit"
               >
                 <Edit3 className="w-3.5 h-3.5" /> {q.fullAnswer ? "Edit Notes" : "Add Detailed Notes"}
               </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
// --- READ VIEW ---
const ReadView = ({ data, onUpdateAnswer, isAdmin, onRequestLogin }) => {
  const [openUnit, setOpenUnit] = useState(0);

  return (
    <div className="p-4 pb-24 max-w-2xl mx-auto space-y-4">
      {data.map((unit, uIdx) => (
        <div key={uIdx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button 
            onClick={() => setOpenUnit(openUnit === uIdx ? -1 : uIdx)}
            className="w-full text-left p-4 bg-gray-50 flex justify-between items-center font-bold text-gray-800 hover:bg-gray-100 transition-colors"
          >
            {unit.unit}
            {openUnit === uIdx ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
          </button>
          
          {openUnit === uIdx && (
            <div className="p-4 space-y-6">
              {unit.subtopics.map((sub, sIdx) => (
                <div key={sIdx} className="space-y-3">
                  <h3 className="font-semibold text-indigo-700 flex items-center gap-2 pb-1 border-b border-indigo-100">
                    <BookMarked className="w-4 h-4" /> {sub.title}
                  </h3>
                  
                  <div className="space-y-3">
                    {sub.questions.map((q, qIdx) => (
                      <QuestionContent key={qIdx} q={q} unitIdx={uIdx} subIdx={sIdx} qIdx={qIdx} onUpdate={onUpdateAnswer} isAdmin={isAdmin} onRequestLogin={onRequestLogin} />
                    ))}
                  </div>
                  
                  <SubtopicLinks query={sub.searchQuery} />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- OBSIDIAN GRAPH VIEW (CANVAS REWRITE FOR MAXIMUM PERFORMANCE) ---
const ObsidianGraphView = ({ data, onUpdateAnswer, isAdmin, onRequestLogin }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Physics state refs
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const transformRef = useRef({ x: 0, y: 0, k: 0.8 });
  const mouseRef = useRef({ x: 0, y: 0, isDown: false, mode: 'none', startX: 0, startY: 0 });
  const draggedNodeRef = useRef(null);
  const hoveredNodeRef = useRef(null);

  // React state (only for overlay UI)
  const [initialized, setInitialized] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // 1. Flatten Data & Initialize Positions
  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    let n = [];
    let l = [];

    // Root
    n.push({ id: 'root', label: 'HRM', type: 'root', x: w/2, y: h/2, vx: 0, vy: 0, radius: 24, mass: 10 });

    data.forEach((u, uIdx) => {
      let uId = `u_${uIdx}`;
      n.push({ id: uId, label: u.unit.split(':')[0], fullLabel: u.unit, type: 'unit', x: w/2 + (Math.random()-0.5)*200, y: h/2 + (Math.random()-0.5)*200, vx: 0, vy: 0, radius: 16, mass: 5 });
      l.push({ source: 'root', target: uId, distance: 160 });

      u.subtopics.forEach((s, sIdx) => {
        let sId = `s_${uIdx}_${sIdx}`;
        n.push({ id: sId, label: s.title, type: 'subtopic', x: w/2 + (Math.random()-0.5)*400, y: h/2 + (Math.random()-0.5)*400, vx: 0, vy: 0, radius: 10, mass: 2 });
        l.push({ source: uId, target: sId, distance: 100 });

        s.questions.forEach((q, qIdx) => {
          let qId = `q_${uIdx}_${sIdx}_${qIdx}`;
          n.push({ 
            id: qId, label: q.q, type: 'question', qData: q, uIdx, sIdx, qIdx, 
            x: w/2 + (Math.random()-0.5)*600, y: h/2 + (Math.random()-0.5)*600, vx: 0, vy: 0, radius: 6, mass: 1 
          });
          l.push({ source: sId, target: qId, distance: 50 });
        });
      });
    });

    // Map string references to actual object references for links
    l.forEach(link => {
      link.sourceObj = n.find(node => node.id === link.source);
      link.targetObj = n.find(node => node.id === link.target);
    });

    // Sort nodes so smaller nodes are drawn on top
    n.sort((a, b) => b.radius - a.radius);

    nodesRef.current = n;
    linksRef.current = l;
    
    // Center the view initially
    const container = canvasRef.current.parentElement;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    transformRef.current = { x: cw/2 - (w/2)*0.8, y: ch/2 - (h/2)*0.8, k: 0.8 };
    
    setInitialized(true);
    
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  // Sync data updates (like fullAnswer edits)
  useEffect(() => {
    if (!initialized) return;
    data.forEach((u, uIdx) => {
      u.subtopics.forEach((s, sIdx) => {
        s.questions.forEach((q, qIdx) => {
          let qId = `q_${uIdx}_${sIdx}_${qIdx}`;
          let node = nodesRef.current.find(n => n.id === qId);
          if (node) node.qData = q; 
        });
      });
    });
    if (selectedNode && selectedNode.type === 'question') {
      const updatedNode = nodesRef.current.find(n => n.id === selectedNode.id);
      setSelectedNode({...updatedNode}); 
    }
  }, [data, initialized]);

  // 2. High-Performance Canvas Render Loop
  useLayoutEffect(() => {
    if (!initialized || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for opaque background

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const tick = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const transform = transformRef.current;
      
      const REPULSION = 2500;
      const ATTRACTION = 0.03;
      const DAMPING = 0.85;

      // --- 1. PHYSICS ---
      nodes.forEach(n => { n.fx = 0; n.fy = 0; });

      // Repulsion (optimized spatial check)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].x - nodes[j].x;
          let dy = nodes[i].y - nodes[j].y;
          let distSq = dx * dx + dy * dy;
          if (distSq === 0) distSq = 1;
          
          if (distSq < 90000) { 
            let force = REPULSION / distSq;
            let fx = (dx / Math.sqrt(distSq)) * force;
            let fy = (dy / Math.sqrt(distSq)) * force;
            nodes[i].fx += fx; nodes[i].fy += fy;
            nodes[j].fx -= fx; nodes[j].fy -= fy;
          }
        }
      }

      // Attraction
      links.forEach(l => {
        let dx = l.targetObj.x - l.sourceObj.x;
        let dy = l.targetObj.y - l.sourceObj.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) dist = 1;
        
        let force = (dist - l.distance) * ATTRACTION;
        let fx = (dx / dist) * force;
        let fy = (dy / dist) * force;
        l.sourceObj.fx += fx; l.sourceObj.fy += fy;
        l.targetObj.fx -= fx; l.targetObj.fy -= fy;
      });

      // Center Gravity
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      nodes.forEach(n => {
        n.fx += (cx - n.x) * 0.005;
        n.fy += (cy - n.y) * 0.005;
      });

      // Apply Forces
      nodes.forEach(n => {
        if (n !== draggedNodeRef.current) {
          n.vx = (n.vx + n.fx / n.mass) * DAMPING;
          n.vy = (n.vy + n.fy / n.mass) * DAMPING;
          n.x += n.vx;
          n.y += n.vy;
        }
      });

      // --- 2. RENDER (CANVAS) ---
      const rect = canvas.parentElement.getBoundingClientRect();
      ctx.fillStyle = '#111827'; // gray-900 background
      ctx.fillRect(0, 0, rect.width, rect.height);
      
      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // Draw Links
      ctx.lineWidth = 1 / transform.k;
      links.forEach(l => {
        ctx.beginPath();
        ctx.moveTo(l.sourceObj.x, l.sourceObj.y);
        ctx.lineTo(l.targetObj.x, l.targetObj.y);
        ctx.strokeStyle = '#374151'; // gray-700
        
        if (l.sourceObj.type === 'root') { ctx.lineWidth = 3 / transform.k; ctx.globalAlpha = 0.8; }
        else if (l.sourceObj.type === 'unit') { ctx.lineWidth = 2 / transform.k; ctx.globalAlpha = 0.8; }
        else { ctx.lineWidth = 1 / transform.k; ctx.globalAlpha = 0.4; }
        
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      // Draw Nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        
        if (n.type === 'root') {
          ctx.fillStyle = '#9333ea';
          ctx.shadowColor = 'rgba(147,51,234,0.7)';
          ctx.shadowBlur = 15;
        } else if (n.type === 'unit') {
          ctx.fillStyle = '#3b82f6';
          ctx.strokeStyle = '#93c5fd';
          ctx.lineWidth = 2 / transform.k;
          ctx.stroke();
          ctx.shadowBlur = 0;
        } else if (n.type === 'subtopic') {
          ctx.fillStyle = '#2dd4bf';
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = n.qData?.fullAnswer ? '#facc15' : '#9ca3af';
          if (n.qData?.fullAnswer) {
            ctx.shadowColor = 'rgba(250,204,21,0.6)';
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset
        
        // Highlight Selected Node
        if (selectedNode?.id === n.id) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 4/transform.k, 0, Math.PI * 2);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3 / transform.k;
          ctx.stroke();
        }
      });

      // Draw Labels
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      nodes.forEach(n => {
        const isSelected = selectedNode?.id === n.id;
        const isHovered = hoveredNodeRef.current?.id === n.id;
        
        if (n.type !== 'question' || isSelected || isHovered) {
          if (n.type === 'root') {
            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = '#ffffff';
          } else if (n.type === 'unit') {
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#e5e7eb';
          } else {
            ctx.font = `12px sans-serif`;
            ctx.fillStyle = '#9ca3af';
          }

          // Dark background for small labels to improve readability over lines
          if (n.type === 'question' || n.type === 'subtopic') {
            const metrics = ctx.measureText(n.label);
            const pad = 3;
            ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
            ctx.fillRect(n.x + n.radius + 6 - pad, n.y - 6 - pad, metrics.width + pad*2, 12 + pad*2);
            ctx.fillStyle = '#9ca3af';
          }
          
          ctx.fillText(n.label, n.x + n.radius + 6, n.y);
        }
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [initialized, selectedNode]);

  // 3. Interactions
  const getPointerPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const getHitNode = (x, y) => {
    const worldX = (x - transformRef.current.x) / transformRef.current.k;
    const worldY = (y - transformRef.current.y) / transformRef.current.k;
    
    // Reverse array to hit smallest (top-most) nodes first
    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const n = nodesRef.current[i];
      const dist = Math.hypot(n.x - worldX, n.y - worldY);
      if (dist <= n.radius + (3 / transformRef.current.k)) return n; // Extra padding for tiny nodes
    }
    return null;
  };

  const handlePointerDown = (e) => {
    const pos = getPointerPos(e);
    const hit = getHitNode(pos.x, pos.y);
    
    if (hit) {
      draggedNodeRef.current = hit;
      mouseRef.current = { ...pos, isDown: true, mode: 'drag' };
      setSelectedNode(hit);
    } else {
      mouseRef.current = { ...pos, isDown: true, mode: 'pan', startX: pos.x - transformRef.current.x, startY: pos.y - transformRef.current.y };
    }
  };

  const handlePointerMove = (e) => {
    const pos = getPointerPos(e);
    const m = mouseRef.current;

    // Handle Hover State mapping
    const hit = getHitNode(pos.x, pos.y);
    if (hit !== hoveredNodeRef.current) hoveredNodeRef.current = hit;
    canvasRef.current.style.cursor = hit ? (m.isDown ? 'grabbing' : 'pointer') : (m.isDown ? 'grabbing' : 'grab');

    if (!m.isDown) return;

    if (m.mode === 'pan') {
      transformRef.current.x = pos.x - m.startX;
      transformRef.current.y = pos.y - m.startY;
    } else if (m.mode === 'drag' && draggedNodeRef.current) {
      draggedNodeRef.current.x = (pos.x - transformRef.current.x) / transformRef.current.k;
      draggedNodeRef.current.y = (pos.y - transformRef.current.y) / transformRef.current.k;
      draggedNodeRef.current.vx = 0; 
      draggedNodeRef.current.vy = 0;
    }
  };

  const handlePointerUp = () => {
    mouseRef.current.isDown = false;
    draggedNodeRef.current = null;
    canvasRef.current.style.cursor = hoveredNodeRef.current ? 'pointer' : 'grab';
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const pos = getPointerPos(e);
    
    // Zoom around mouse cursor
    const scaleBy = 1.1;
    const newK = e.deltaY < 0 ? transformRef.current.k * scaleBy : transformRef.current.k / scaleBy;
    const clampedK = Math.max(0.1, Math.min(newK, 4));
    
    const scaleRatio = clampedK / transformRef.current.k;
    transformRef.current.x = pos.x - (pos.x - transformRef.current.x) * scaleRatio;
    transformRef.current.y = pos.y - (pos.y - transformRef.current.y) * scaleRatio;
    transformRef.current.k = clampedK;
  };
  
  const resetZoom = () => {
    const container = canvasRef.current.parentElement;
    transformRef.current = { x: container.clientWidth/2 - (window.innerWidth/2)*0.8, y: container.clientHeight/2 - (window.innerHeight/2)*0.8, k: 0.8 };
  };

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-gray-900 overflow-hidden selection:bg-transparent">
      
      {/* HIGH PERFORMANCE CANVAS */}
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
      />

      {/* GRAPH CONTROLS */}
      <div className="absolute bottom-6 left-6 flex gap-2 z-20">
        <button onClick={() => { transformRef.current.k *= 1.2; }} className="bg-gray-800 text-gray-300 p-2 rounded-full hover:bg-gray-700 shadow-lg border border-gray-700">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={() => { transformRef.current.k /= 1.2; }} className="bg-gray-800 text-gray-300 p-2 rounded-full hover:bg-gray-700 shadow-lg border border-gray-700">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={resetZoom} className="bg-gray-800 text-gray-300 p-2 rounded-full hover:bg-gray-700 shadow-lg border border-gray-700">
          <Maximize className="w-5 h-5" />
        </button>
      </div>
      
      <div className="absolute top-6 left-6 pointer-events-none z-20 text-gray-400 text-sm">
        <p>• Drag background to pan</p>
        <p>• Scroll to zoom</p>
        <p className="text-yellow-500 font-medium">• Yellow dots contain your notes</p>
      </div>

      {/* SIDEBAR PANEL FOR SELECTED NODE */}
      {selectedNode && selectedNode.type === 'question' && (
        <div 
          className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-gray-200 z-30 flex flex-col animate-in slide-in-from-right-8 duration-300"
          onPointerDown={(e) => e.stopPropagation()} 
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-indigo-600" />
              Node Inspector
            </h3>
            <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-gray-800 p-1 bg-white rounded-md border border-gray-200">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 overflow-y-auto flex-1">
             <QuestionContent 
                q={selectedNode.qData} 
                unitIdx={selectedNode.uIdx} 
                subIdx={selectedNode.sIdx} 
                qIdx={selectedNode.qIdx} 
                onUpdate={onUpdateAnswer} 
                isExpandedInit={true} 
                isAdmin={isAdmin}
                onRequestLogin={onRequestLogin}
             />
             
             <div className="mt-6">
                <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">External Resources</p>
                <SubtopicLinks query={selectedNode.label} />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [activeTab, setActiveTab] = useState('read'); // Landing Page is firmly Read Notes
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(initialHrmData)));
  const [user, setUser] = useState(null);

  // Initialize admin state from localStorage so it survives page reloads
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('hrmAdmin') === 'true');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Authentication Setup
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Authentication error (running without cloud auth):", err);
      }
    };
    initAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Robust Cloud Sync with LocalStorage Fallback
  useEffect(() => {
    // 1. If there's no secure cloud connection, fall back strictly to local storage
    if (!user || !db) {
      const localData = localStorage.getItem('hrmData');
      if (localData) {
        try { setData(JSON.parse(localData)); } catch(e) {}
      }
      return;
    }

    // 2. If Cloud IS available, sync continuously
    // Changed path to the 'public' folder so ALL devices see the same synced notes
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'shared_notes', 'main_v1');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().hrmData) {
        setData(docSnap.data().hrmData);
      }
    }, (error) => {
      console.warn("Cloud connection interrupted. Falling back to local cache.", error);
      const localData = localStorage.getItem('hrmData');
      if (localData) {
        try { setData(JSON.parse(localData)); } catch(e) {}
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateAnswer = (uIdx, sIdx, qIdx, fullAnswer) => {
    setData(prevData => {
      // Create strict deep copy
      const newData = [...prevData];
      const newUnit = { ...newData[uIdx] };
      const newSubtopics = [...newUnit.subtopics];
      const newSub = { ...newSubtopics[sIdx] };
      const newQuestions = [...newSub.questions];
      
      // Inject updated markdown text
      newQuestions[qIdx] = {
        ...newQuestions[qIdx],
        fullAnswer
      };
      
      newSub.questions = newQuestions;
      newSubtopics[sIdx] = newSub;
      newUnit.subtopics = newSubtopics;
      newData[uIdx] = newUnit;
      
      // Always save to Local Storage (safety net)
      localStorage.setItem('hrmData', JSON.stringify(newData));

      // Attempt to push to Cloud
      if (user && db) {
        // Push to the 'public' folder so ALL devices get the update
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'shared_notes', 'main_v1');
        setDoc(docRef, { hrmData: newData }).catch(err => {
          console.warn("Could not save to cloud, but saved locally.", err);
        });
      }
      
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans selection:bg-indigo-100">
      <Header 
        isAdmin={isAdmin} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={() => {
          setIsAdmin(false);
          localStorage.removeItem('hrmAdmin');
        }} 
      />
      
      <main>
        {activeTab === 'read' ? 
           <ReadView data={data} onUpdateAnswer={handleUpdateAnswer} isAdmin={isAdmin} onRequestLogin={() => setShowLoginModal(true)} /> : 
           <ObsidianGraphView data={data} onUpdateAnswer={handleUpdateAnswer} isAdmin={isAdmin} onRequestLogin={() => setShowLoginModal(true)} />
        }
      </main>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSuccess={() => {
          setIsAdmin(true);
          localStorage.setItem('hrmAdmin', 'true');
          setShowLoginModal(false);
        }} 
      />

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <button 
            onClick={() => setActiveTab('read')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'read' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            <BookOpen className={`w-6 h-6 ${activeTab === 'read' ? 'fill-indigo-50' : ''}`} />
            <span className="text-[10px] font-semibold tracking-wide">READ NOTES</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('mindmap')}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${activeTab === 'mindmap' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            <Network className={`w-6 h-6 ${activeTab === 'mindmap' ? 'fill-indigo-50' : ''}`} />
            <span className="text-[10px] font-semibold tracking-wide">GRAPH VIEW</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
