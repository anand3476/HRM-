import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { Network, BookOpen, Search, Play, ExternalLink, ChevronDown, ChevronRight, BookMarked, GraduationCap, ChevronUp, Edit3, Save, X, ZoomIn, ZoomOut, Maximize, Lock, Unlock, KeyRound } from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- DATA STRUCTURE ---
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
      // 1. Escape HTML to prevent XSS and malformed tags
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // 2. Code blocks (multiline)
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

// Reusable component for editing/viewing a single question
const QuestionContent = ({ q, unitIdx, subIdx, qIdx, onUpdate, isExpandedInit = false, isAdmin, onRequestLogin }) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedInit);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(q.fullAnswer || "");

  // Update local state if the prop changes (e.g. switching nodes in graph view)
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
                 placeholder="Paste your detailed answer, notes, or links here..."
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

// --- OBSIDIAN GRAPH VIEW ---
const ObsidianGraphView = ({ data, onUpdateAnswer, isAdmin, onRequestLogin }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  
  // Physics state refs to avoid React re-renders during 60fps physics loop
  const nodesRef = useRef([]);
  const linksRef = useRef([]);
  const transformRef = useRef({ x: 0, y: 0, k: 1 });
  
  // React state for UI
  const [initialized, setInitialized] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [dragState, setDragState] = useState({ isPanning: false, isDraggingNode: false, startX: 0, startY: 0, node: null });
  // Used to force a render of the graph elements initially
  const [nodesRender, setNodesRender] = useState([]);
  const [linksRender, setLinksRender] = useState([]);

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
      n.push({ id: uId, label: u.unit.split(':')[0], fullLabel: u.unit, type: 'unit', x: w/2 + (Math.random()-0.5)*100, y: h/2 + (Math.random()-0.5)*100, vx: 0, vy: 0, radius: 16, mass: 5 });
      l.push({ source: 'root', target: uId, distance: 160 });

      u.subtopics.forEach((s, sIdx) => {
        let sId = `s_${uIdx}_${sIdx}`;
        n.push({ id: sId, label: s.title, type: 'subtopic', x: w/2 + (Math.random()-0.5)*300, y: h/2 + (Math.random()-0.5)*300, vx: 0, vy: 0, radius: 10, mass: 2 });
        l.push({ source: uId, target: sId, distance: 100 });

        s.questions.forEach((q, qIdx) => {
          let qId = `q_${uIdx}_${sIdx}_${qIdx}`;
          n.push({ 
            id: qId, 
            label: q.q, 
            type: 'question', 
            qData: q, 
            uIdx, sIdx, qIdx, 
            x: w/2 + (Math.random()-0.5)*500, 
            y: h/2 + (Math.random()-0.5)*500, 
            vx: 0, vy: 0, 
            radius: 6, 
            mass: 1 
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

    nodesRef.current = n;
    linksRef.current = l;
    
    // Center the view initially
    transformRef.current = { x: 0, y: 0, k: 0.8 };
    
    setNodesRender([...n]);
    setLinksRender([...l]);
    setInitialized(true);
    
    return () => cancelAnimationFrame(animationRef.current);
  }, []); // Only rebuild graph structure on initial mount

  // Sync data updates (like fullAnswer edits) into the physics nodes without resetting positions
  useEffect(() => {
    if (!initialized) return;
    data.forEach((u, uIdx) => {
      u.subtopics.forEach((s, sIdx) => {
        s.questions.forEach((q, qIdx) => {
          let qId = `q_${uIdx}_${sIdx}_${qIdx}`;
          let node = nodesRef.current.find(n => n.id === qId);
          if (node) node.qData = q; // update reference to include new answers
        });
      });
    });
    // Force re-render if selected node was updated
    if (selectedNode && selectedNode.type === 'question') {
      const updatedNode = nodesRef.current.find(n => n.id === selectedNode.id);
      setSelectedNode({...updatedNode}); 
    }
  }, [data, initialized]);

  // 2. Physics Loop
  useLayoutEffect(() => {
    if (!initialized) return;

    const tick = () => {
      const nodes = nodesRef.current;
      const links = linksRef.current;
      const REPULSION = 2500;
      const ATTRACTION = 0.03;
      const DAMPING = 0.85;

      // Reset forces
      nodes.forEach(n => { n.fx = 0; n.fy = 0; });

      // Repulsion (Coulomb) - optimized O(n^2)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].x - nodes[j].x;
          let dy = nodes[i].y - nodes[j].y;
          let distSq = dx * dx + dy * dy;
          if (distSq === 0) distSq = 1;
          
          // Add a max distance for repulsion to optimize and prevent exploding
          if (distSq < 90000) { 
            let force = REPULSION / distSq;
            let fx = (dx / Math.sqrt(distSq)) * force;
            let fy = (dy / Math.sqrt(distSq)) * force;
            
            nodes[i].fx += fx; nodes[i].fy += fy;
            nodes[j].fx -= fx; nodes[j].fy -= fy;
          }
        }
      }

      // Attraction (Hooke's Springs)
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

      // Apply forces and update DOM elements directly for 60fps
      nodes.forEach(n => {
        if (!n.isDragging) {
          n.vx = (n.vx + n.fx / n.mass) * DAMPING;
          n.vy = (n.vy + n.fy / n.mass) * DAMPING;
          n.x += n.vx;
          n.y += n.vy;
        }
        
        // Directly update DOM to avoid React render cycle overhead
        const el = document.getElementById(`node-${n.id}`);
        if (el) {
          el.style.transform = `translate(${n.x}px, ${n.y}px)`;
        }
      });

      // Update Link SVG DOM
      links.forEach(l => {
        const el = document.getElementById(`link-${l.source}-${l.target}`);
        if (el) {
          el.setAttribute('x1', l.sourceObj.x);
          el.setAttribute('y1', l.sourceObj.y);
          el.setAttribute('x2', l.targetObj.x);
          el.setAttribute('y2', l.targetObj.y);
        }
      });
      
      // Update Wrapper Transform DOM
      const wrap = document.getElementById('graph-pan-wrapper');
      if (wrap) {
        wrap.style.transform = `translate(${transformRef.current.x}px, ${transformRef.current.y}px) scale(${transformRef.current.k})`;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationRef.current);
  }, [initialized]);

  // 3. Interactions (Pan, Zoom, Drag Node)
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleBy = 1.1;
    const newK = e.deltaY < 0 ? transformRef.current.k * scaleBy : transformRef.current.k / scaleBy;
    transformRef.current.k = Math.max(0.1, Math.min(newK, 4));
  };

  const handlePointerDown = (e, node) => {
    e.stopPropagation(); // Don't trigger background pan
    if (node) {
      node.isDragging = true;
      setDragState({ isPanning: false, isDraggingNode: true, node });
      setSelectedNode(node);
    } else {
      setDragState({ isPanning: true, isDraggingNode: false, startX: e.clientX - transformRef.current.x, startY: e.clientY - transformRef.current.y });
    }
  };

  const handlePointerMove = (e) => {
    if (dragState.isPanning) {
      transformRef.current.x = e.clientX - dragState.startX;
      transformRef.current.y = e.clientY - dragState.startY;
    } else if (dragState.isDraggingNode && dragState.node) {
      // Convert screen coords to world coords taking pan/zoom into account
      const n = dragState.node;
      n.x = (e.clientX - transformRef.current.x) / transformRef.current.k;
      n.y = (e.clientY - transformRef.current.y) / transformRef.current.k;
      // Reset velocity so it doesn't fly away after release
      n.vx = 0; n.vy = 0;
    }
  };

  const handlePointerUp = () => {
    if (dragState.node) {
      dragState.node.isDragging = false;
    }
    setDragState({ isPanning: false, isDraggingNode: false, node: null });
  };
  
  const resetZoom = () => {
    transformRef.current = { x: 0, y: 0, k: 0.8 };
  };

  // 4. Render Helpers
  const getNodeColor = (n) => {
    if (n.type === 'root') return 'bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.7)]';
    if (n.type === 'unit') return 'bg-blue-500 border-2 border-blue-300';
    if (n.type === 'subtopic') return 'bg-teal-400';
    if (n.type === 'question') {
      // Obsidian-like: turn yellow if there's a custom note!
      return n.qData?.fullAnswer ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'bg-gray-400';
    }
    return 'bg-white';
  };

  return (
    <div 
      className="relative w-full h-[calc(100vh-140px)] bg-gray-900 overflow-hidden cursor-grab active:cursor-grabbing selection:bg-transparent"
      onWheel={handleWheel}
      onPointerDown={(e) => handlePointerDown(e, null)}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* GRAPH CANVAS */}
      <div id="graph-pan-wrapper" className="absolute top-0 left-0 w-full h-full transform-origin-top-left will-change-transform">
        
        {/* LINKS (SVG Layer) */}
        <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
          {linksRender.map(l => (
            <line 
              key={`link-${l.source}-${l.target}`}
              id={`link-${l.source}-${l.target}`}
              stroke="#374151" // gray-700
              strokeWidth={l.sourceObj?.type === 'root' ? 3 : l.sourceObj?.type === 'unit' ? 2 : 1}
              opacity={l.sourceObj?.type === 'subtopic' ? 0.4 : 0.8}
            />
          ))}
        </svg>

        {/* NODES (DOM Layer) */}
        {nodesRender.map(n => {
          const isSelected = selectedNode?.id === n.id;
          const isHovered = hoveredNode?.id === n.id;
          
          return (
            <div
              key={n.id}
              id={`node-${n.id}`}
              className="absolute top-0 left-0 pointer-events-auto will-change-transform"
              style={{ 
                 // Initial position so they don't pop in at 0,0
                 transform: `translate(${n.x}px, ${n.y}px)`,
                 // Center the node correctly
                 marginTop: -n.radius, 
                 marginLeft: -n.radius,
                 width: n.radius * 2,
                 height: n.radius * 2,
                 zIndex: n.type === 'question' ? 10 : n.type === 'subtopic' ? 20 : 30
              }}
              onPointerDown={(e) => handlePointerDown(e, n)}
              onMouseEnter={() => setHoveredNode(n)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* The Dot */}
              <div className={`w-full h-full rounded-full transition-colors ${getNodeColor(n)} ${isSelected ? 'ring-4 ring-white' : ''}`} />
              
              {/* Text Label */}
              {(n.type !== 'question' || isSelected || isHovered) && (
                <div 
                  className={`absolute left-full top-1/2 -translate-y-1/2 ml-2 pointer-events-none whitespace-nowrap 
                    ${n.type === 'root' ? 'text-xl font-bold text-white' : 
                      n.type === 'unit' ? 'text-sm font-semibold text-gray-200' : 
                      'text-xs text-gray-400 bg-gray-900/80 px-1.5 py-0.5 rounded'}`}
                  style={{ zIndex: 100 }}
                >
                  {n.label}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* GRAPH CONTROLS (Bottom Left) */}
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
      
      {/* OBSIDIAN HELPER TEXT */}
      <div className="absolute top-6 left-6 pointer-events-none z-20 text-gray-400 text-sm">
        <p>• Drag background to pan</p>
        <p>• Scroll to zoom</p>
        <p className="text-yellow-500 font-medium">• Yellow dots contain your notes</p>
      </div>

      {/* SIDEBAR PANEL FOR SELECTED NODE */}
      {selectedNode && selectedNode.type === 'question' && (
        <div 
          className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-gray-200 z-30 flex flex-col animate-in slide-in-from-right-8 duration-300"
          onPointerDown={(e) => e.stopPropagation()} // Prevent clicking sidebar from panning graph
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
                isExpandedInit={true} // Always expanded in sidebar
                isAdmin={isAdmin}
                onRequestLogin={onRequestLogin}
             />
             
             {/* Add search links in sidebar too! */}
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
  const [activeTab, setActiveTab] = useState('read'); // Default to read notes view
  
  const [data, setData] = useState(() => JSON.parse(JSON.stringify(initialHrmData)));
  const [user, setUser] = useState(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 1. Initialize Secure Authentication
  useEffect(() => {
    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Real-time Cloud Sync Listener
  useEffect(() => {
    if (!user) return; // Wait until secure auth is complete
    
    // Connects to a private, user-specific cloud folder for this exact app
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'notes', 'main');
    
    // onSnapshot automatically downloads the latest notes whenever they change
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(docSnap.data().hrmData);
      }
    }, (error) => {
      console.error("Cloud sync error:", error);
    });
    
    return () => unsubscribe();
  }, [user]);

  const handleUpdateAnswer = (uIdx, sIdx, qIdx, fullAnswer) => {
    setData(prevData => {
      // Create a strict deep copy
      const newData = [...prevData];
      const newUnit = { ...newData[uIdx] };
      const newSubtopics = [...newUnit.subtopics];
      const newSub = { ...newSubtopics[sIdx] };
      const newQuestions = [...newSub.questions];
      
      // Update the target question
      newQuestions[qIdx] = {
        ...newQuestions[qIdx],
        fullAnswer
      };
      
      // Re-assemble the nested structure
      newSub.questions = newQuestions;
      newSubtopics[sIdx] = newSub;
      newUnit.subtopics = newSubtopics;
      newData[uIdx] = newUnit;
      
      // Instantly beam the new data up to the secure cloud!
      if (user) {
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'notes', 'main');
        setDoc(docRef, { hrmData: newData }).catch(err => console.error("Error saving to cloud:", err));
      }
      
      return newData;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans selection:bg-indigo-100">
      <Header 
        isAdmin={isAdmin} 
        onLoginClick={() => setShowLoginModal(true)} 
        onLogout={() => setIsAdmin(false)} 
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
          setShowLoginModal(false);
        }} 
      />

      {/* Bottom Navigation */}
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
