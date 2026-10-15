"use client";

import React, { useState } from "react";
import { 
  GripVertical, 
  Trash2, 
  UserPlus, 
  Printer, 
  RotateCcw,
  Building2 
} from "lucide-react";

interface StaffItem {
  id: string;
  name: string;
  role: string;
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
  { id: "12", name: "DASHARATHI ROY", role: "Mali" },
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
  { id: "34", name: "MOHAN PATRA", role: "Driver" },
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
  { id: "51", name: "OMAR", role: "Driver" },
];

export default function MovementReportPage() {
  const [staff, setStaff] = useState<StaffItem[]>(INITIAL_STAFF);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportDay, setReportDay] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Drag and Drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
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

  // Add new staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const item: StaffItem = {
      id: Date.now().toString(),
      name: newName.trim().toUpperCase(),
      role: newRole.trim() || "Staff",
    };
    setStaff([...staff, item]);
    setNewName("");
    setNewRole("");
  };

  // Delete staff
  const handleDelete = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  // Inline editing
  const handleUpdate = (id: string, field: "name" | "role", value: string) => {
    setStaff(
      staff.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Trigger A4 Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-6 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Control Panel (Hidden during Print) */}
      <div className="no-print bg-white p-5 rounded-xl shadow-md border border-slate-200 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              Movement Report Sheet Builder
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag rows by the handle to re-sequence. Serial numbers adjust automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setStaff(INITIAL_STAFF)}
              className="px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Default
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" /> Export A4 PDF
            </button>
          </div>
        </div>

        {/* Form controls for Day, Date & Add New Person */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Day</label>
            <input
              type="text"
              placeholder="e.g. Monday"
              value={reportDay}
              onChange={(e) => setReportDay(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
            <input
              type="text"
              placeholder="e.g. 15-10-2026"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Add Staff form */}
          <form onSubmit={handleAddStaff} className="md:col-span-2 flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">New Person Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="w-36">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
              <input
                type="text"
                placeholder="e.g. Driver"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium flex items-center gap-1 transition"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>
      </div>

      {/* Printable Sheet View (A4 Target Sheet) */}
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0">
        {/* Top Header */}
        <div className="flex justify-between text-xs font-semibold mb-2 text-slate-700">
          <div>1st Half....................................................</div>
          <div>2nd Half......................................................</div>
        </div>

        <div className="text-center my-3">
          <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase">
            Kharagpur Vision Academy
          </h2>
          <div className="inline-block border-b-2 border-black font-extrabold text-sm sm:text-base mt-0.5 tracking-wide">
            MOVEMENT REPORT
          </div>
        </div>

        <div className="flex justify-between items-center text-xs font-bold uppercase mb-3 px-1">
          <div>DAY: <span className="underline ml-1 font-semibold">{reportDay || "_________________"}</span></div>
          <div>DATE: <span className="underline ml-1 font-semibold">{reportDate || "_________________"}</span></div>
        </div>

        {/* Master Table */}
        <table className="w-full border-collapse border border-black text-[11px] print:text-[9.5px]">
          <thead>
            <tr className="bg-slate-100 print:bg-transparent text-center font-bold">
              <th className="no-print w-8 border border-black p-1">Move</th>
              <th className="w-10 border border-black p-1">Sl. No</th>
              <th className="w-48 sm:w-60 border border-black p-1 text-left px-2">Name of Person</th>
              <th className="w-14 border border-black p-1">In Time</th>
              <th className="w-14 border border-black p-1">Out Time</th>
              <th className="w-14 border border-black p-1">In Time</th>
              <th className="w-14 border border-black p-1">Out Time</th>
              <th className="w-14 border border-black p-1">In Time</th>
              <th className="w-14 border border-black p-1">Out Time</th>
              <th className="w-14 border border-black p-1">In Time</th>
              <th className="w-14 border border-black p-1">Out Time</th>
              <th className="no-print w-10 border border-black p-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((item, index) => (
              <tr
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                className={`transition-colors ${
                  draggedIndex === index
                    ? "opacity-40 bg-indigo-50"
                    : "hover:bg-slate-50 print:hover:bg-transparent"
                }`}
              >
                {/* Drag Handle */}
                <td className="no-print text-center border border-black p-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700">
                  <GripVertical className="w-4 h-4 mx-auto" />
                </td>

                {/* Auto Sequence Number */}
                <td className="border border-black text-center font-semibold p-1">
                  {index + 1}
                </td>

                {/* Name & Designation */}
                <td className="border border-black px-2 py-1">
                  <div className="flex items-center gap-1 font-medium text-slate-900">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdate(item.id, "name", e.target.value)}
                      className="w-full bg-transparent outline-none focus:bg-indigo-50 focus:px-1 rounded"
                    />
                    <span className="text-slate-500 font-normal whitespace-nowrap">
                      (
                      <input
                        type="text"
                        value={item.role}
                        onChange={(e) => handleUpdate(item.id, "role", e.target.value)}
                        className="w-20 inline bg-transparent outline-none focus:bg-indigo-50 rounded"
                      />
                      )
                    </span>
                  </div>
                </td>

                {/* Time Slot Columns */}
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>
                <td className="border border-black h-7"></td>

                {/* Delete Action Button */}
                <td className="no-print text-center border border-black p-1">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete person"
                  >
                    <Trash2 className="w-3.5 h-3.5 mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
