import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default function WhatsAppChat() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'leads'
  const [leads, setLeads] = useState([]);
  const [fetchingLeads, setFetchingLeads] = useState(false);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all leads
  const fetchLeads = async () => {
    setFetchingLeads(true);
    try {
      const res = await axios.get(`${API_BASE}/api/claim-drafts?department=sales`);
      setLeads(res.data.drafts || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setFetchingLeads(false);
    }
  };

  // Fetch all sessions
  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/whatsapp/sessions`);
      setSessions(res.data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  // Fetch messages for the active session
  const fetchMessages = async (sessionId) => {
    if (!sessionId) return;
    try {
      const res = await axios.get(`${API_BASE}/api/whatsapp/sessions/${sessionId}/messages`);
      setMessages(res.data || []);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Setup basic polling so staff can see new incoming messages
  useEffect(() => {
    fetchSessions();
    fetchLeads();
    const interval = setInterval(() => {
      fetchSessions();
      if (activeTab === 'leads') fetchLeads();
      if (activeSession) {
        fetchMessages(activeSession.id);
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, [activeSession, activeTab]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const selectSession = (session) => {
    setActiveSession(session);
    fetchMessages(session.id);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeSession) return;

    const messageText = inputText;
    setInputText('');
    setLoading(true);

    try {
      await axios.post(`${API_BASE}/api/whatsapp/agent/send`, {
        sessionId: activeSession.id,
        phoneNumber: activeSession.phone_number,
        messageText
      });
      await fetchMessages(activeSession.id);
    } catch (err) {
      console.error("Failed to send", err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeSession) return;
    
    if (window.confirm("Are you sure you want to close this ticket and return the user to the bot?")) {
      try {
        await axios.post(`${API_BASE}/api/whatsapp/agent/close`, {
          sessionId: activeSession.id,
          phoneNumber: activeSession.phone_number
        });
        setActiveSession(null);
        fetchSessions();
      } catch (err) {
        console.error("Failed to close ticket", err);
        alert("Failed to close ticket");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 flex h-[calc(100vh-100px)]">
      
      {/* Sessions Sidebar */}
      <div className="w-1/3 bg-white shadow-xl rounded-l-lg border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-red-800 text-white font-bold text-lg rounded-tl-lg flex justify-between items-center">
          <span>📱 WhatsApp</span>
          <div className="flex bg-red-900 rounded-md p-1 items-center">
             <button 
                onClick={() => setActiveTab('chats')}
                className={`px-2 py-1 text-xs rounded ${activeTab === 'chats' ? 'bg-yellow-500 text-red-900' : 'text-white'}`}
             >Chats</button>
             <button 
                onClick={() => setActiveTab('leads')}
                className={`px-2 py-1 text-xs rounded ${activeTab === 'leads' ? 'bg-yellow-500 text-red-900' : 'text-white'}`}
             >Leads</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          {activeTab === 'chats' ? (
            sessions.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">No ongoing conversations.</div>
            ) : (
              sessions.map((s) => (
                <div 
                  key={s.id} 
                  onClick={() => selectSession(s)}
                  className={`p-4 border-b cursor-pointer transition flex items-center justify-between ${
                    activeSession?.id === s.id ? 'bg-red-50 border-l-4 border-red-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{s.user_name || s.phone_number}</div>
                    <div className="text-xs text-gray-500">{new Date(s.updated_at).toLocaleString()}</div>
                  </div>
                  {s.state === 'agent' && (
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">
                      WAITING
                    </span>
                  )}
                </div>
              ))
            )
          ) : (
            leads.length === 0 ? (
              <div className="p-4 text-gray-500 text-sm">No captured leads yet.</div>
            ) : (
              leads.map((l) => (
                <div 
                  key={l.policy_number}
                  className="p-4 border-b hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-red-800">{l.data?.deceased_name || 'Anonymous'}</div>
                    <span className="text-[10px] bg-green-100 text-green-800 px-1 rounded font-bold">LEAD</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-1">ID: {l.data?.deceased_id || 'N/A'}</div>
                  <div className="text-xs text-gray-600 mb-2">Plan: {l.data?.plan_name} (R{l.data?.total_price})</div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">{new Date(l.updated_at).toLocaleDateString()}</span>
                    <button 
                      onClick={() => navigate(`/?policy=${l.policy_number}`)}
                      className="text-[10px] bg-red-800 text-white px-2 py-1 rounded font-bold hover:bg-red-700"
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 bg-gray-50 shadow-xl rounded-r-lg flex flex-col relative">
        {activeSession ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white border-b flex justify-between items-center rounded-tr-lg">
              <div>
                <h2 className="font-bold text-lg">{activeSession.user_name || activeSession.phone_number}</h2>
                <p className="text-xs text-gray-500">State: {activeSession.state.toUpperCase()}</p>
              </div>
              {activeSession.state === 'agent' && (
                <button 
                  onClick={handleCloseTicket}
                  className="bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold px-4 py-2 rounded shadow transition"
                >
                  Close & End Chat
                </button>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
                >
                  <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                    msg.sender === 'user' ? 'bg-white text-gray-800 border' : 
                    msg.sender === 'bot' ? 'bg-gray-200 text-gray-700' : 
                    'bg-red-100 text-red-900 border border-red-200'
                  }`}>
                    {msg.sender === 'bot' && <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">BOT 🤖</div>}
                    {msg.sender === 'agent' && <div className="text-[10px] uppercase font-bold text-red-700 mb-1">AGENT 👨‍💻</div>}
                    
                    <div className="text-sm whitespace-pre-wrap">{msg.message_text}</div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {activeSession.state === 'agent' ? (
              <form onSubmit={handleSend} className="p-3 bg-white border-t flex items-center gap-2 rounded-br-lg">
                <input 
                  type="text" 
                  className="flex-1 border p-2 rounded focus:ring-red-500 font-medium text-sm"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="submit" 
                  className="bg-red-800 hover:bg-red-700 text-white px-6 py-2 rounded font-bold shadow transition disabled:opacity-50"
                  disabled={loading || !inputText.trim()}
                >
                  {loading ? '...' : 'Send'}
                </button>
              </form>
            ) : (
              <div className="p-4 bg-gray-200 text-center text-sm text-gray-600 rounded-br-lg">
                Chat is currently in BOT mode. Client must request an Agent to reply.
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Select a conversation from the left sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
