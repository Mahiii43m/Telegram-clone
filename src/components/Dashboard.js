// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

// ---------- MOCK DATA ----------
const DEPARTMENTS_DATA = [
  { id: 'geo', name: 'Geologo Department', admin: 'Dr. Alene', status: 'online', time: '4:00 PM' },
  { id: 'natan', name: 'Natan Ethiopia', admin: '', status: 'online', time: 'now' },
  { id: 'space', name: 'Space Operations', admin: 'Dir. Kassa', status: 'online', time: '12:00 PM' },
  { id: 'geo2', name: 'Geospatial Division', admin: 'Amina', status: 'warning', time: '11:30 AM' },
  { id: 'orbit', name: 'Orbit Chat Support', admin: '', status: 'online', time: 'always' },
];

const CHATS_DATA = [
  { id: 'c1', name: 'Dr. Alene', last: 'See you tomorrow', time: '11:45 AM', unread: 2, thread: ['Hi, meeting at 10?', 'Yes, see you tomorrow'] },
  { id: 'c2', name: 'Dir. Kassa', last: 'Launch go/no-go', time: '11:42 AM', unread: 5, thread: ['Checklist ready?', 'Launch go/no-go', 'All systems nominal'] },
  { id: 'c3', name: 'Amina', last: 'Coordinates sent', time: '10:35 AM', unread: 1, thread: ['Coordinate data updated', 'Coordinates sent'] },
  { id: 'c4', name: 'Support Bot', last: 'Welcome!', time: '09:10 AM', unread: 1, thread: ['Welcome to your premium terminal'] },
];

// ---------- MAIN COMPONENT ----------
export default function Dashboard() {
  const [editMode, setEditMode] = useState(false);
  const [departments, setDepartments] = useState(DEPARTMENTS_DATA);
  const [chats, setChats] = useState(CHATS_DATA);
  const [search, setSearch] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [temp, setTemp] = useState(63);
  const [condition, setCondition] = useState('Mostly sunny');
  const [time, setTime] = useState('');
  const [showMeeting, setShowMeeting] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const temps = [61, 62, 63, 64, 65];
      const conditions = ['Mostly sunny', 'Clear', 'Partly cloudy', 'Overcast'];
      setTemp(temps[Math.floor(Math.random() * temps.length)]);
      setCondition(conditions[Math.floor(Math.random() * conditions.length)]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEditDept = (id, newName) => {
    setDepartments(prev =>
      prev.map(d => (d.id === id ? { ...d, name: newName } : d))
    );
  };

  const handleChatClick = (chat) => {
    setChats(prev =>
      prev.map(c => (c.id === chat.id ? { ...c, unread: 0 } : c))
    );
    setSelectedChat(chat);
  };

  const filteredChats = chats.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.last.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.admin.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-gray-200 font-mono p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-cyan-400">◈ TERMINAL</h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`px-3 py-1 text-sm rounded border transition ${
              editMode
                ? 'border-amber-400 text-amber-400 bg-amber-400/10'
                : 'border-gray-500 text-gray-400 hover:bg-gray-800'
            }`}
          >
            {editMode ? '✓ Editing' : '✎ Edit'}
          </button>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm">{temp}°F</div>
            <div className="text-xs text-gray-500">{condition}</div>
          </div>
          <div className="text-right text-sm">
            <div>{time || '--:--'}</div>
            <div className="text-xs text-gray-500">7/31/2026</div>
          </div>
          <button className="relative" onClick={() => setShowNotif(!showNotif)}>
            <span className="text-xl">🔔</span>
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalUnread}
              </span>
            )}
            {showNotif && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded shadow-lg p-2 text-sm z-10 text-left">
                <div className="p-1 border-b border-gray-700">⚠️ Telemetry spike at 10:15</div>
                <div className="p-1 border-b border-gray-700">📡 New orbit data available</div>
                <div className="p-1">📅 Meeting reminder: tomorrow 10 AM</div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMN 1: DEPARTMENTS */}
        <div className="bg-[#111827] rounded-lg p-4 border border-gray-700">
          <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Departments</h2>
          <div className="space-y-2">
            {filteredDepts.map(dept => (
              <div
                key={dept.id}
                className={`p-3 rounded border ${
                  dept.status === 'warning'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-gray-700'
                }`}
              >
                {editMode ? (
                  <input
                    type="text"
                    defaultValue={dept.name}
                    onBlur={(e) => handleEditDept(dept.id, e.target.value)}
                    className="bg-transparent border-b border-cyan-400 text-cyan-300 w-full focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <div className="font-semibold text-cyan-300">{dept.name}</div>
                )}
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">
                    {dept.admin ? `👤 ${dept.admin}${dept.admin.includes('Kassa') || dept.admin.includes('Alene') || dept.admin === 'Amina' ? ' (Admin)' : ''}` : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dept.status === 'online'
                          ? 'bg-green-400'
                          : dept.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}
                    />
                    {dept.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* Meeting Card */}
          <div
            className="mt-4 p-3 border border-dashed border-cyan-500/40 rounded cursor-pointer hover:bg-cyan-500/10 transition"
            onClick={() => setShowMeeting(true)}
          >
            <div className="text-sm text-cyan-300">📅 Dr. Alene</div>
            <div className="text-xs text-gray-400">Meeting scheduled for tomorrow at 10 AM</div>
          </div>
        </div>

        {/* COLUMN 2: CHAT */}
        <div className="bg-[#111827] rounded-lg p-4 border border-gray-700 flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xs uppercase tracking-wider text-gray-400">Chat</h2>
            <span className="text-xs text-gray-500">{totalUnread} unread</span>
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#0a0f1e] border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 mb-3 focus:outline-none focus:border-cyan-400"
          />
          <div className="flex-1 overflow-y-auto max-h-80 space-y-1">
            {filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleChatClick(chat)}
                className={`p-2 rounded cursor-pointer hover:bg-gray-800/50 transition flex justify-between items-center ${
                  selectedChat?.id === chat.id ? 'bg-gray-800' : ''
                }`}
              >
                <div>
                  <div className="text-sm">{chat.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[140px]">{chat.last}</div>
                </div>
                <div className="text-right text-xs">
                  <div className="text-gray-500">{chat.time}</div>
                  {chat.unread > 0 && (
                    <span className="bg-cyan-500 text-black font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {filteredChats.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-6">No chats match</div>
            )}
          </div>
          {selectedChat && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="text-xs text-gray-400 mb-1">Thread: {selectedChat.name}</div>
              <div className="text-sm space-y-1 max-h-24 overflow-y-auto bg-[#0a0f1e] p-2 rounded">
                {selectedChat.thread.map((msg, idx) => (
                  <div key={idx} className="border-b border-gray-800 pb-1 last:border-0">
                    {msg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUMN 3: OPS */}
        <div className="bg-[#111827] rounded-lg p-4 border border-gray-700 space-y-4">
          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Ops</h2>
            <div className="text-sm bg-[#0a0f1e] p-3 rounded border border-gray-700">
              <div className="flex justify-between">
                <span>Telemetry</span>
                <span className="text-green-400">● stable</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Last reading: {temp}°F · {condition}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-2">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-cyan-600/20 border border-cyan-600/40 rounded py-2 text-sm text-cyan-300 hover:bg-cyan-600/30 transition">
                🚀 Launch
              </button>
              <button className="bg-amber-600/20 border border-amber-600/40 rounded py-2 text-sm text-amber-300 hover:bg-amber-600/30 transition">
                📡 Scan
              </button>
              <button className="bg-purple-600/20 border border-purple-600/40 rounded py-2 text-sm text-purple-300 hover:bg-purple-600/30 transition col-span-2">
                📊 Full Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MEETING MODAL */}
      {showMeeting && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a2234] border border-cyan-500/40 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl text-cyan-300 font-bold mb-2">📅 Meeting Details</h2>
            <p className="text-sm text-gray-300">Host: <span className="text-cyan-200">Dr. Alene</span></p>
            <p className="text-sm text-gray-300">Time: <span className="text-cyan-200">Tomorrow, 10:00 AM</span></p>
            <p className="text-sm text-gray-300">Topic: Terrain report review</p>
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-2 rounded text-sm font-semibold transition">
                Join Meeting
              </button>
              <button
                onClick={() => setShowMeeting(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}