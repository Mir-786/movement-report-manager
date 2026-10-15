"use client";

import React, { useState } from "react";
import { 
  GripVertical, 
  Trash2, 
  UserPlus, 
  Printer, 
  RotateCcw, 
  Layers, 
  MinusCircle, 
  PlusCircle,
  Split
} from "lucide-react";

interface StaffItem {
  id: string;
  name: string;
  role: string;
  hasBlackBarAbove?: boolean;
}

const INITIAL_STAFF: StaffItem[] = [
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
  { id: "32", name: "RAJU PATRA", role: "Staff" },
  { id: "33", name: "PURNA MAHATA", role: "Staff" },
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

export default function MovementReportApp() {
  const [staff, setStaff] = useState<StaffItem[]>(INITIAL_STAFF);
  const [frontPageCapacity, setFrontPageCapacity] = useState<number>(30);
  const [reportDay, setReportDay] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Drag and Drop reordering
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
    setDraggedIndex(null);
  };

  // Add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem: StaffItem = {
      id: Date.now().toString(),
      name: newName.trim().toUpperCase(),
      role: newRole.trim() || "Staff",
      hasBlackBarAbove: false
    };
    setStaff([...staff, newItem]);
    setNewName("");
    setNewRole("");
  };

  // Delete staff
  const handleDelete = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  // Inline updates
  const handleUpdate = (id: string, field: "name" | "role", value: string) => {
    setStaff(staff.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Toggle solid black bar above a row
  const toggleBlackBar = (id: string) => {
    setStaff(
      staff.map((s) =>
        s.id === id ? { ...s, hasBlackBarAbove: !s.hasBlackBarAbove } : s
      )
    );
  };

  // Pagination slicing
  const page1Items = staff.slice(0, frontPageCapacity);
  const page2Items = staff.slice(frontPageCapacity);

  const renderTable = (items: StaffItem[], startIndex: number) => (
    <table className="w-full border-collapse border-[1.5px] border-black text-[10.5px] font-sans">
      <thead>
        <tr className="border-b-[1.5px] border-black bg-slate-50 print:bg-transparent font-bold text-center">
          <th className="no-print w-7 border-r border-black p-1">#</th>
          <th className="w-10 border-r border-black p-1">Sl. No</th>
          <th className="w-56 sm:w-64 border-r border-black p-1 text-left px-2">Name of Person</th>
          <th className="w-12 border-r border-black p-1 text-center">In Time</th>
          <th className="w-12 border-r border-black p-1 text-center">Out Time</th>
          <th className="w-12 border-r border-black p-1 text-center">In Time</th>
          <th className="w-12 border-r border-black p-1 text-center">Out Time</th>
          <th className="w-12 border-r border-black p-1 text-center">In Time</th>
          <th className="w-12 border-r border-black p-1 text-center">Out Time</th>
          <th className="w-10 border-r border-black p-1 text-center">In</th>
          <th className="w-10 border-black p-1 text-center">Out</th>
          <th className="no-print w-16 border-l border-black p-1">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, localIndex) => {
          const globalIndex = startIndex + localIndex;
          return (
            <React.Fragment key={item.id}>
              {/* Solid Black Divider Row */}
              {item.hasBlackBarAbove && (
                <tr className="black-divider-row bg-black h-4 print:h-3">
                  <td colSpan={12} className="bg-black border border-black p-0 h-4"></td>
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

                {/* Name & Designation */}
                <td className="border-r border-black px-2 py-0.5 font-semibold text-black">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-amber-100 uppercase"
                    />
                    <span className="font-normal text-slate-600 print:text-black whitespace-nowrap">
                      (
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleUpdate(item.id, "role", e.target.value)}
                        className="w-20 inline bg-transparent outline-none focus:bg-amber-100 text-center"
                      />
                      )
                    </span>
                  </div>
                </td>

                {/* Empty check-in boxes matching original */}
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-r border-black h-7"></td>
                <td className="border-black h-7"></td>

                {/* Action buttons (hidden on print) */}
                <td className="no-print border-l border-black p-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      type="button"
                      onClick={() => toggleBlackBar(item.id)}
                      title="Toggle black separator bar above this row"
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
      {/* ================= CONTROL PANEL (NO-PRINT) ================= */}
      <div className="no-print bg-white p-5 rounded-2xl shadow-lg border border-slate-200 mb-8 space-y-4">
        {/* Top Header & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-wide uppercase">
              Kharagpur Vision Academy Movement Report
            </h1>
            <p className="text-xs text-slate-500">
              Drag rows to reorder. Serial numbers adjust sequentially.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStaff(INITIAL_STAFF)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Export A4 PDF
            </button>
          </div>
        </div>

        {/* Feature: Front Page Staff Count & Statistics */}
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
                Number of staff to fit onto Page 1 before breaking to Page 2
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
              <button
                onClick={() => setFrontPageCapacity((c) => Math.max(5, c - 1))}
                className="text-slate-500 hover:text-indigo-600"
              >
                <MinusCircle className="w-4 h-4" />
              </button>
              <span className="text-sm font-extrabold w-8 text-center text-slate-800">
                {frontPageCapacity}
              </span>
              <button
                onClick={() => setFrontPageCapacity((c) => Math.min(staff.length, c + 1))}
                className="text-slate-500 hover:text-indigo-600"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Badges */}
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

        {/* Date, Day, and Add Staff row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Day</label>
            <input
              type="text"
              placeholder="e.g. MONDAY"
              value={reportDay}
              onChange={(e) => setReportDay(e.target.value.toUpperCase())}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Date</label>
            <input
              type="text"
              placeholder="e.g. 15-10-2026"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <form onSubmit={handleAddStaff} className="md:col-span-2 flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-600 mb-1">Name of Person</label>
              <input
                type="text"
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-bold text-slate-600 mb-1">Role</label>
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
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold flex items-center gap-1 transition"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>
      </div>

      {/* ================= PRINTABLE DOCUMENT (A4 SAME-TO-SAME) ================= */}
      <div className="space-y-10 print:space-y-0">
        
        {/* ================= PAGE 1 (FRONT PAGE) ================= */}
        <section className="print-page bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 relative">
          {/* Circular Stamp Graphic (Top-Left) */}
          <div className="absolute top-5 left-5 w-24 h-24 border-[3px] border-black rounded-full flex flex-col items-center justify-center p-1 text-center font-black select-none pointer-events-none opacity-90 rotate-[-12deg]">
            <span className="text-[6.5px] leading-tight tracking-wider uppercase">Vision Educational Trust</span>
            <span className="text-[10px] font-extrabold my-0.5">KVA</span>
            <span className="text-[6px] tracking-tight">KHARAGPUR</span>
          </div>

          {/* Dotted Half indicators */}
          <div className="flex justify-between text-[11px] font-bold text-black mb-1">
            <span>1st Half....................................................</span>
            <span>2nd Half......................................................</span>
          </div>

          {/* Main Title Block */}
          <div className="text-center my-2">
            <h1 className="text-xl sm:text-2xl font-black tracking-widest text-black uppercase">
              KHARAGPUR VISION ACADEMY
            </h1>
            <div className="inline-block border-b-2 border-black font-extrabold text-sm sm:text-base tracking-widest uppercase mt-0.5">
              MOVEMENT REPORT
            </div>
          </div>

          {/* Day & Date Headers */}
          <div className="flex justify-between items-center text-xs font-extrabold uppercase mb-2 px-1 text-black">
            <div>
              DAY: <span className="font-semibold underline ml-1">{reportDay || "......................."}</span>
            </div>
            <div>
              DATE: <span className="font-semibold underline ml-1">{reportDate || "......................."}</span>
            </div>
          </div>

          {/* Page 1 Table */}
          {renderTable(page1Items, 0)}

          {/* Page indicator on screen */}
          <div className="no-print mt-3 text-right text-[11px] text-slate-400 font-semibold">
            Front Page (Rows 1 to {page1Items.length})
          </div>
        </section>

        {/* ================= PAGE 2 (BACK PAGE) ================= */}
        {page2Items.length > 0 && (
          <section className="print-page bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 relative">
            {/* Header Repeat on Page 2 */}
            <div className="flex justify-between text-[11px] font-bold text-black mb-1">
              <span>1st Half....................................................</span>
              <span>2nd Half......................................................</span>
            </div>

            <div className="text-center my-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-widest text-black uppercase">
                KHARAGPUR VISION ACADEMY
              </h2>
              <div className="inline-block border-b-2 border-black font-extrabold text-sm sm:text-base tracking-widest uppercase mt-0.5">
                MOVEMENT REPORT (CONT.)
              </div>
            </div>

            <div className="flex justify-between items-center text-xs font-extrabold uppercase mb-2 px-1 text-black">
              <div>
                DAY: <span className="font-semibold underline ml-1">{reportDay || "......................."}</span>
              </div>
              <div>
                DATE: <span className="font-semibold underline ml-1">{reportDate || "......................."}</span>
              </div>
            </div>

            {/* Page 2 Table */}
            {renderTable(page2Items, frontPageCapacity)}

            {/* Bottom-Right Stamp Seal */}
            <div className="flex justify-end mt-6 pr-4">
              <div className="w-28 h-28 border-[3.5px] border-black rounded-full flex flex-col items-center justify-center p-1.5 text-center font-black select-none pointer-events-none opacity-85 rotate-[15deg]">
                <span className="text-[6.5px] leading-none uppercase">Kharagpur Vision Academy</span>
                <span className="text-[7px] font-bold my-1 text-center">ENGLISH MEDIUM SCHOOL</span>
                <span className="text-[6.5px]">SADATPUR</span>
              </div>
            </div>

            <div className="no-print mt-3 text-right text-[11px] text-slate-400 font-semibold">
              Page 2 (Rows {frontPageCapacity + 1} to {staff.length})
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
