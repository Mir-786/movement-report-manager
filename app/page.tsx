"use client";

import React, { useState, useEffect } from "react";
import { 
  GripVertical, 
  Trash2, 
  UserPlus, 
  Printer, 
  RotateCcw, 
  Layers, 
  MinusCircle, 
  PlusCircle,
  Building2,
  HardDrive,
  Server,
  Undo2,
  Redo2,
  Check,
  Loader2,
  Lock,
  X
} from "lucide-react";

interface StaffItem {
  id: string;
  name: string;
  role: string;
  hasBlackBarAbove?: boolean;
}

interface AppSnapshot {
  staff: StaffItem[];
  frontPageCapacity: number;
  reportDay: string;
  reportDate: string;
}

const DEFAULT_STAFF: StaffItem[] = [
  { id: "1", name: "Md AKBAR", role: "Electrician" },
  { id: "2", name: "MANOJ NAYAK", role: "Sweeper" },
  { id: "3", name: "ROHIT NAYAK", role: "Sweeper" },
  { id: "4", name: "RAMESH", role: "Sweeper" },
  { id: "5", name: "PRAFULLA BERA", role: "Cleaner" },
  { id: "6", name: "DEBASIS", role: "Cleaner" },
  { id: "7", name: "SUMIT", role: "Cleaner" },
  { id: "8", name: "SAWAN NAG", role: "Cleaner" },
  { id: "9", name: "NITYANANDA MAHATA", role: "Cleaner" },
  { id: "10", name: "BHUTEN MAHATA", role: "Cleaner" },
  { id: "11", name: "SANDIP MAHATA", role: "Cleaner" },
  { id: "12", name: "DASARATHI ROY", role: "Mali" },
  { id: "13", name: "SK ARMAN", role: "Mali" },
  { id: "14", name: "T. VENKAT RAO", role: "Helper" },
  { id: "15", name: "SK NASIR", role: "Helper" },
  { id: "16", name: "MAGHU SAREN", role: "Helper" },
  { id: "17", name: "RAMCHANDRA", role: "Helper" },
  { id: "18", name: "BIJOY", role: "Helper" },
  { id: "19", name: "CHANCHAL", role: "Helper" },
  { id: "20", name: "KARISMA BIBI", role: "Helper" },
  { id: "21", name: "SONI PATRA", role: "Cleaner" },
  { id: "22", name: "SARATHI SHEET", role: "Cleaner" },
  { id: "23", name: "SIMA RANA", role: "Helper" },
  { id: "24", name: "PUJA KARMAKAR", role: "Helper" },
  { id: "25", name: "CHAMPA RANA", role: "Helper" },
  { id: "26", name: "PORI KARMAKAR", role: "Helper" },
  { id: "27", name: "KAJAL RANA", role: "Helper" },
  { id: "28", name: "DIPALI", role: "Helper" },
  { id: "29", name: "BIPLAB DUTTA", role: "Supervisor" },
  { id: "30", name: "SOUKAT", role: "Driver" },
  { id: "31", name: "SRIMANTA MAHAPATRA", role: "Cook" },
  { id: "32", name: "RAJU PATRA", role: "" },
  { id: "33", name: "PURNA MAHATA", role: "" },
  { id: "34", name: "MOHAN PATRA", role: "Driver", hasBlackBarAbove: true },
  { id: "35", name: "KHOKAN BERA", role: "Driver" },
  { id: "36", name: "CHANDAN DANDAPATH", role: "Driver" },
  { id: "37", name: "SWAPAN MAHAPATRA", role: "Driver" },
  { id: "38", name: "MAHIUDDIN", role: "Driver" },
  { id: "39", name: "KUDRAT ALI", role: "Driver" },
  { id: "40", name: "SK WASIM", role: "Driver" },
  { id: "41", name: "SUNIL MAITY", role: "Driver" },
  { id: "42", name: "SAMIR", role: "Driver" },
  { id: "43", name: "BISWAJIT MAHAPATRA", role: "Driver" },
  { id: "44", name: "SK SONABUL", role: "Driver" },
  { id: "45", name: "PREMASIS DAS", role: "Driver" },
  { id: "46", name: "SHYAMAL MAHATA", role: "Driver" },
  { id: "47", name: "K. RAMADASU", role: "Driver" },
  { id: "48", name: "SOUMEN ROY", role: "Driver" },
  { id: "49", name: "VIVEK", role: "Driver" },
  { id: "50", name: "PREM SINGH", role: "Driver" },
  { id: "51", name: "OMAR", role: "Driver" }
];

const LOCAL_STORAGE_CACHE_KEY = "kva_movement_report_local_cache";
const SERVER_AUTH_TOKEN_KEY = "kva_server_device_auth_token";
const SERVER_SECRET_PASSWORD = "mir159";

export default function MovementReportApp() {
  const [staff, setStaff] = useState<StaffItem[]>(DEFAULT_STAFF);
  const [frontPageCapacity, setFrontPageCapacity] = useState<number>(30);
  const [reportDay, setReportDay] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Storage and sync feedback states
  const [saveCacheSuccess, setSaveCacheSuccess] = useState(false);
  const [isSavingServer, setIsSavingServer] = useState(false);
  const [saveServerSuccess, setSaveServerSuccess] = useState(false);

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Undo / Redo history
  const [history, setHistory] = useState<AppSnapshot[]>([
    {
      staff: DEFAULT_STAFF,
      frontPageCapacity: 30,
      reportDay: "",
      reportDate: ""
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const commitSnapshot = (
    newStaff: StaffItem[],
    newCapacity = frontPageCapacity,
    newDay = reportDay,
    newDate = reportDate
  ) => {
    const nextSnapshot: AppSnapshot = {
      staff: newStaff,
      frontPageCapacity: newCapacity,
      reportDay: newDay,
      reportDate: newDate
    };
    const truncatedHistory = history.slice(0, historyIndex + 1);
    setHistory([...truncatedHistory, nextSnapshot]);
    setHistoryIndex(truncatedHistory.length);
  };

  // Initial load: Priority to Server, fallback to Local Cache
  useEffect(() => {
    async function initData() {
      try {
        const res = await fetch("/api/report");
        const json = await res.json();
        if (json.success && json.data) {
          const remote: AppSnapshot = json.data;
          setStaff(remote.staff || DEFAULT_STAFF);
          setFrontPageCapacity(remote.frontPageCapacity || 30);
          setReportDay(remote.reportDay || "");
          setReportDate(remote.reportDate || "");
          setHistory([remote]);
          setHistoryIndex(0);
          return;
        }
      } catch (err) {
        // Fallback to local cache if offline or server is empty
      }

      const cached = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cached) {
        try {
          const parsed: AppSnapshot = JSON.parse(cached);
          if (parsed.staff && Array.isArray(parsed.staff)) {
            setStaff(parsed.staff);
            setFrontPageCapacity(parsed.frontPageCapacity || 30);
            setReportDay(parsed.reportDay || "");
            setReportDate(parsed.reportDate || "");
            setHistory([parsed]);
            setHistoryIndex(0);
          }
        } catch (e) {
          console.error("Local cache load failed:", e);
        }
      }
    }
    initData();
  }, []);

  // BUTTON 1: Save in Local Cache
  const handleSaveToCache = () => {
    const stateToSave: AppSnapshot = {
      staff,
      frontPageCapacity,
      reportDay,
      reportDate
    };
    localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(stateToSave));
    setSaveCacheSuccess(true);
    setTimeout(() => setSaveCacheSuccess(false), 2200);
  };

  // Server Save Execution Logic
  const executeServerSave = async () => {
    setIsSavingServer(true);
    try {
      const stateToSave: AppSnapshot = {
        staff,
        frontPageCapacity,
        reportDay,
        reportDate
      };
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stateToSave)
      });
      const data = await res.json();
      if (data.success) {
        setSaveServerSuccess(true);
        setTimeout(() => setSaveServerSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Failed to save on server:", err);
    } finally {
      setIsSavingServer(false);
    }
  };

  // BUTTON 2: Save in Server (With One-time Device Password Check)
  const handleSaveToServerClick = () => {
    const isDeviceAuthorized = localStorage.getItem(SERVER_AUTH_TOKEN_KEY) === "AUTHORIZED";
    if (isDeviceAuthorized) {
      executeServerSave();
    } else {
      setPasswordError("");
      setInputPassword("");
      setIsPasswordModalOpen(true);
    }
  };

  // Modal Password Verification
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === SERVER_SECRET_PASSWORD) {
      localStorage.setItem(SERVER_AUTH_TOKEN_KEY, "AUTHORIZED");
      setIsPasswordModalOpen(false);
      executeServerSave();
    } else {
      setPasswordError("Incorrect password. Access denied.");
    }
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const snapshot = history[targetIndex];
      setStaff(snapshot.staff);
      setFrontPageCapacity(snapshot.frontPageCapacity);
      setReportDay(snapshot.reportDay);
      setReportDate(snapshot.reportDate);
      setHistoryIndex(targetIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const snapshot = history[targetIndex];
      setStaff(snapshot.staff);
      setFrontPageCapacity(snapshot.frontPageCapacity);
      setReportDay(snapshot.reportDay);
      setReportDate(snapshot.reportDate);
      setHistoryIndex(targetIndex);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        handleRedo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSaveToServerClick();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  // Drag and Drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const reordered = [...staff];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);
    setStaff(reordered);
    commitSnapshot(reordered);
    setDraggedIndex(null);
  };

  // Add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const updated = [
      ...staff,
      {
        id: Date.now().toString(),
        name: newName.trim().toUpperCase(),
        role: newRole.trim(),
        hasBlackBarAbove: false
      }
    ];
    setStaff(updated);
    commitSnapshot(updated);
    setNewName("");
    setNewRole("");
  };

  // Delete staff
  const handleDelete = (id: string) => {
    const updated = staff.filter((s) => s.id !== id);
    setStaff(updated);
    commitSnapshot(updated);
  };

  // Inline editing
  const handleUpdate = (id: string, field: "name" | "role", value: string) => {
    const updated = staff.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setStaff(updated);
  };

  const handleBlurCommit = () => {
    commitSnapshot(staff);
  };

  // Toggle solid black divider above row
  const toggleBlackBar = (id: string) => {
    const updated = staff.map((s) =>
      s.id === id ? { ...s, hasBlackBarAbove: !s.hasBlackBarAbove } : s
    );
    setStaff(updated);
    commitSnapshot(updated);
  };

  // Reset
  const handleReset = () => {
    setStaff(DEFAULT_STAFF);
    setFrontPageCapacity(30);
    setReportDay("");
    setReportDate("");
    commitSnapshot(DEFAULT_STAFF, 30, "", "");
  };

  const page1Items = staff.slice(0, frontPageCapacity);
  const page2Items = staff.slice(frontPageCapacity);

  // Table Renderer
  const renderTable = (items: StaffItem[], startIndex: number, isFirstPage: boolean) => (
    <table className="w-full border-collapse border-[1.5px] border-black text-[10.5px] font-sans">
      <thead>
        {/* Only 1st page renders MOVEMENT REPORT and DAY/DATE header rows */}
        {isFirstPage && (
          <>
            <tr className="border-b-[1.5px] border-black">
              <th className="no-print border-r border-black p-0 w-7 bg-slate-100"></th>
              <th
                colSpan={10}
                className="border-r border-black text-center font-black tracking-widest text-sm py-1 uppercase text-black"
              >
                MOVEMENT REPORT
              </th>
              <th className="no-print border-l border-black p-0 w-16 bg-slate-100"></th>
            </tr>
            <tr className="border-b-[1.5px] border-black text-xs font-bold text-black">
              <th className="no-print border-r border-black p-0 bg-slate-100"></th>
              <th colSpan={2} className="border-r border-black p-1 bg-transparent"></th>
              <th colSpan={4} className="border-r border-black text-left px-2 py-1">
                DAY:{" "}
                <input
                  type="text"
                  value={reportDay}
                  onChange={(e) => setReportDay(e.target.value.toUpperCase())}
                  onBlur={handleBlurCommit}
                  className="bg-transparent outline-none font-normal w-32 focus:bg-amber-100 text-black border-none p-0 ml-1"
                />
              </th>
              <th colSpan={4} className="border-r border-black text-left px-2 py-1">
                DATE:{" "}
                <input
                  type="text"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  onBlur={handleBlurCommit}
                  className="bg-transparent outline-none font-normal w-32 focus:bg-amber-100 text-black border-none p-0 ml-1"
                />
              </th>
              <th className="no-print border-l border-black p-0 bg-slate-100"></th>
            </tr>
          </>
        )}

        {/* Column Headers */}
        <tr className="border-b-[1.5px] border-black bg-slate-50 print:bg-transparent font-bold text-center text-black">
          <th className="no-print w-7 border-r border-black p-1">#</th>
          <th className="w-10 border-r border-black p-1">Sl. No</th>
          <th className="w-48 sm:w-52 border-r border-black p-1 text-left px-2">Name of Person</th>
          <th className="w-12 border-r border-black p-1">In Time</th>
          <th className="w-12 border-r border-black p-1">Out Time</th>
          <th className="w-12 border-r border-black p-1">In Time</th>
          <th className="w-12 border-r border-black p-1">Out Time</th>
          <th className="w-12 border-r border-black p-1">In Time</th>
          <th className="w-12 border-r border-black p-1">Out Time</th>
          <th className="w-10 border-r border-black p-1">In</th>
          <th className="w-10 border-black p-1">Out</th>
          <th className="no-print w-16 border-l border-black p-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, localIndex) => {
          const globalIndex = startIndex + localIndex;
          const trimmedRole = item.role.trim();

          return (
            <React.Fragment key={item.id}>
              {/* Solid Black Divider Row */}
              {item.hasBlackBarAbove && (
                <tr className="black-divider-row bg-black h-3.5 print:h-3">
                  <td className="no-print bg-black border border-black p-0 h-3.5"></td>
                  <td colSpan={10} className="bg-black border border-black p-0 h-3.5"></td>
                  <td className="no-print bg-black border border-black p-0 h-3.5"></td>
                </tr>
              )}

              <tr
                draggable
                onDragStart={() => handleDragStart(globalIndex)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(globalIndex)}
                className={`border-b border-black transition-colors ${
                  draggedIndex === globalIndex
                    ? "bg-indigo-100 opacity-50"
                    : "hover:bg-slate-50 print:hover:bg-transparent"
                }`}
              >
                {/* Drag Handle */}
                <td className="no-print border-r border-black text-center cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-700">
                  <GripVertical className="w-4 h-4 mx-auto" />
                </td>

                {/* Auto Sequence Serial Number */}
                <td className="border-r border-black text-center font-bold p-1 text-black">
                  {globalIndex + 1}
                </td>

                {/* Name & Role: 2 non-breaking spaces start, tight brackets without inner space, space right side */}
                <td className="border-r border-black px-1.5 py-0.5 font-semibold text-black">
                  <div className="flex items-center text-[10.5px]">
                    <span className="select-none font-mono whitespace-pre">&nbsp;&nbsp;</span>
                    
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                      onBlur={handleBlurCommit}
                      className="w-full bg-transparent outline-none focus:bg-amber-100 uppercase font-semibold"
                    />

                    {trimmedRole !== "" ? (
                      <span className="font-normal text-slate-800 print:text-black whitespace-nowrap inline-flex items-center mr-2">
                        ({trimmedRole})
                      </span>
                    ) : (
                      <span className="no-print opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity mr-2">
                        <input
                          type="text"
                          placeholder="+role"
                          value={item.role}
                          onChange={(e) => handleUpdate(item.id, "role", e.target.value.trim())}
                          onBlur={handleBlurCommit}
                          className="w-12 text-[9px] bg-slate-100 rounded px-1 outline-none text-center"
                        />
                      </span>
                    )}
                  </div>
                </td>

                {/* Blank Time Slot Cells */}
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-black h-7"></td>

                {/* Actions */}
                <td className="no-print border-l border-black p-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBlackBar(item.id)}
                      title="Toggle black divider above this row"
                      className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${
                        item.hasBlackBarAbove
                          ? "bg-black text-white border-black"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300"
                      }`}
                    >
                      Bar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 p-0.5"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen py-6 px-3 sm:px-6 max-w-5xl mx-auto">
      {/* ================= CONTROLS (NO-PRINT) ================= */}
      <div className="no-print bg-white p-5 rounded-2xl shadow-lg border border-slate-200 mb-8 space-y-4">
        {/* Top Header & Two Save Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-wide uppercase flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Kharagpur Vision Academy Movement Report
            </h1>
            <p className="text-xs text-slate-500">
              Drag rows to reorder. Serial numbers adjust automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Undo / Redo */}
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
                historyIndex > 0
                  ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
                historyIndex < history.length - 1
                  ? "bg-white border-slate-300 hover:bg-slate-100 text-slate-700"
                  : "bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed"
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            {/* BUTTON 1: Save in Local Cache */}
            <button
              onClick={handleSaveToCache}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition border ${
                saveCacheSuccess
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-700"
              }`}
              title="Save to local browser cache"
            >
              {saveCacheSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Cache Saved!
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5" /> Save Cache
                </>
              )}
            </button>

            {/* BUTTON 2: Save in Server (With One-Time Password Check) */}
            <button
              onClick={handleSaveToServerClick}
              disabled={isSavingServer}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition shadow-sm ${
                saveServerSuccess
                  ? "bg-emerald-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
              title="Save directly to server database (Ctrl+S)"
            >
              {isSavingServer ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </>
              ) : saveServerSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Server Saved!
                </>
              ) : (
                <>
                  <Server className="w-3.5 h-3.5" /> Save Server
                </>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>

            {/* Export */}
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-lg shadow flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Export A4 PDF
            </button>
          </div>
        </div>

        {/* Front Page Capacity Control */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Front Page Capacity
              </span>
              <span className="text-[11px] text-slate-500">
                Number of staff to fit on Page 1 before continuing to Page 2
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
              <button
                onClick={() => {
                  const newCap = Math.max(5, frontPageCapacity - 1);
                  setFrontPageCapacity(newCap);
                  commitSnapshot(staff, newCap);
                }}
                className="text-slate-500 hover:text-indigo-600"
              >
                <MinusCircle className="w-4 h-4" />
              </button>
              <span className="text-sm font-extrabold w-8 text-center text-slate-800">
                {frontPageCapacity}
              </span>
              <button
                onClick={() => {
                  const newCap = Math.min(staff.length, frontPageCapacity + 1);
                  setFrontPageCapacity(newCap);
                  commitSnapshot(staff, newCap);
                }}
                className="text-slate-500 hover:text-indigo-600"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-700 shadow-sm">
                Total: <strong className="text-indigo-600 font-bold">{staff.length}</strong>
              </span>
              <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md">
                Page 1: <strong>{page1Items.length}</strong>
              </span>
              <span className="px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-800 rounded-md">
                Page 2: <strong>{page2Items.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Add Staff Form */}
        <form onSubmit={handleAddStaff} className="flex flex-wrap items-end gap-3 pt-1">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-600 mb-1">Name of Person</label>
            <input
              type="text"
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 uppercase font-medium"
            />
          </div>
          <div className="w-44">
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Role <span className="text-[10px] font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Driver"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 transition"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Staff
          </button>
        </form>
      </div>

      {/* ================= ONE-TIME PASSWORD MODAL ================= */}
      {isPasswordModalOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-800">
              Server Access Authorization
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              This device is not yet registered. Enter the server security key once to authorize this device permanently.
            </p>

            <form onSubmit={handleVerifyPassword} className="mt-4 space-y-3">
              <div>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={inputPassword}
                  onChange={(e) => {
                    setInputPassword(e.target.value);
                    setPasswordError("");
                  }}
                  autoFocus
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono tracking-wider"
                />
                {passwordError && (
                  <p className="text-red-500 text-xs font-semibold mt-1">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition"
                >
                  Authorize & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= PRINTABLE DOCUMENT ================= */}
      <div className="space-y-10 print:space-y-0">
        
        {/* ================= PAGE 1 ================= */}
        <section className="print-page bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0">
          {/* Box around 1st Half and 2nd Half (Page 1 Only) */}
          <div className="border-[1.5px] border-black px-3 py-1.5 flex justify-between items-center text-xs font-bold text-black mb-3">
            <span>1st Half....................................................</span>
            <span>2nd Half......................................................</span>
          </div>

          {/* School Name (Page 1 Only) */}
          <div className="text-center mb-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-black uppercase">
              KHARAGPUR VISION ACADEMY
            </h1>
          </div>

          {/* Page 1 Table */}
          {renderTable(page1Items, 0, true)}

          <div className="no-print mt-3 text-right text-[11px] text-slate-400 font-semibold">
            Front Page (Rows 1 to {page1Items.length})
          </div>
        </section>

        {/* ================= PAGE 2 (CONT.) ================= */}
        {page2Items.length > 0 && (
          <section className="print-page bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0">
            {/* Directly begins with column headers */}
            {renderTable(page2Items, frontPageCapacity, false)}

            <div className="no-print mt-3 text-right text-[11px] text-slate-400 font-semibold">
              Page 2 (Rows {frontPageCapacity + 1} to {staff.length})
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
