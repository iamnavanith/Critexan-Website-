import { useState, useEffect } from "react";
import { FaTimes, FaDownload, FaTrashAlt, FaSearch } from "react-icons/fa";
import { API_CONFIG } from "@/config/api";

interface Registration {
  name: string;
  email: string;
  platform: string;
  autoDownload: boolean;
  ticketId: string;
  date: string;
}

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load registrations from localStorage on open
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(API_CONFIG.LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setRegistrations(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse registrations", e);
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter registrations based on search query
  const filtered = registrations.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Export to CSV
  const handleExportCSV = () => {
    if (registrations.length === 0) return;

    const headers = ["Ticket ID", "Name", "Email", "Platform", "Auto-Download", "Registration Date"];
    const rows = registrations.map((r) => [
      r.ticketId,
      r.name,
      r.email,
      r.platform,
      r.autoDownload ? "Yes" : "No",
      r.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.map((val) => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "critexan_pre_registrations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete registration record
  const handleDeleteRecord = (ticketId: string) => {
    const updated = registrations.filter((r) => r.ticketId !== ticketId);
    setRegistrations(updated);
    localStorage.setItem(API_CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  // Clear entire database
  const handleClearDatabase = () => {
    if (window.confirm("Are you sure you want to permanently clear all pre-registration records? This action cannot be undone.")) {
      setRegistrations([]);
      localStorage.removeItem(API_CONFIG.LOCAL_STORAGE_KEY);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <div
        className="w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col relative transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 40px 90px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-rose-100/50">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-[#2e1a20] font-outfit">
              Critexan Deployment Control
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">
              Live registrations database: {registrations.length} total users
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 border border-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between px-6 py-4 bg-slate-50/50 border-b border-rose-100/30">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              placeholder="Search registrant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-9 pr-4 py-2 text-xs transition-all duration-200 outline-none"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                color: "#2e1a20",
              }}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleExportCSV}
              disabled={registrations.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-slate-100 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              style={{ color: "#8c7379" }}
            >
              <FaDownload size={11} />
              Export CSV
            </button>
            <button
              onClick={handleClearDatabase}
              disabled={registrations.length === 0}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-slate-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              style={{ color: "#8c7379" }}
            >
              <FaTrashAlt size={11} />
              Clear Database
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <span className="text-3xl">📭</span>
              <p className="text-xs uppercase tracking-widest font-semibold">No records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-400 border-b border-rose-100/30">
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3">Pass ID</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3">Name</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3">Email</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3">Platform</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3">Auto-Download</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3">Date</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider pb-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/20">
                  {filtered.map((reg) => (
                    <tr key={reg.ticketId} className="hover:bg-slate-50/30 transition-colors duration-150">
                      <td className="py-3 font-mono font-semibold text-slate-800">{reg.ticketId}</td>
                      <td className="py-3 font-semibold text-slate-700">{reg.name}</td>
                      <td className="py-3 text-slate-500 font-medium">{reg.email}</td>
                      <td className="py-3 font-bold uppercase text-slate-600">{reg.platform}</td>
                      <td className="py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{
                            background: reg.autoDownload ? "rgba(34, 197, 94, 0.06)" : "rgba(245, 158, 11, 0.06)",
                            color: reg.autoDownload ? "#16a34a" : "#d97706",
                          }}
                        >
                          {reg.autoDownload ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3 text-slate-450 font-medium">{reg.date}</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => handleDeleteRecord(reg.ticketId)}
                          className="w-7 h-7 rounded-full inline-flex items-center justify-center border border-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 cursor-pointer"
                        >
                          <FaTrashAlt size={10} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
