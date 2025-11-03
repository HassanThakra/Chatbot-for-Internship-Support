import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, FileText, Download, Upload } from 'lucide-react';

const InternshipChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize with sample FAQ data
  useEffect(() => {
    const sampleFAQs = [
      {
        category: "General",
        question: "What are the internship hours?",
        answer: "Internship hours are typically 9 AM to 5 PM, Monday through Friday. However, this may vary by department. Please check with your supervisor for specific requirements."
      },
      {
        category: "General",
        question: "How do I request time off?",
        answer: "To request time off, submit a request through the HR portal at least 48 hours in advance. Navigate to 'Time Off' section and fill out the form. Your supervisor will be notified automatically."
      },
      {
        category: "Technical",
        question: "How do I access the development environment?",
        answer: "Access credentials for the development environment are sent to your company email. Use VPN to connect remotely. Contact IT support at it@company.com if you face any issues."
      },
      {
        category: "Technical",
        question: "What tools and software do I need?",
        answer: "Required tools include: Git, VS Code or your preferred IDE, Docker, and Slack for communication. Specific technical requirements vary by team. Check your onboarding document for details."
      },
      {
        category: "HR",
        question: "When will I receive my stipend?",
        answer: "Stipends are processed on the last working day of each month. Direct deposit typically takes 2-3 business days. Contact hr@company.com for payment-related queries."
      },
      {
        category: "HR",
        question: "How do I submit my timesheet?",
        answer: "Timesheets must be submitted weekly through the HR portal. Navigate to 'Timesheet' section, log your hours, and submit by Friday 5 PM each week."
      },
      {
        category: "Projects",
        question: "How do I choose my project?",
        answer: "Project assignments are discussed during your first week. You'll meet with your mentor to understand available projects and align them with your interests and learning goals."
      },
      {
        category: "Projects",
        question: "Who is my project mentor?",
        answer: "Your project mentor is assigned during onboarding. Check your welcome email or contact your team lead to confirm your mentor assignment."
      },
      {
        category: "Policies",
        question: "What is the dress code?",
        answer: "We follow a business casual dress code. Jeans and sneakers are acceptable. Avoid overly casual wear like shorts or flip-flops. Dress appropriately for client meetings."
      },
      {
        category: "Policies",
        question: "Can I work remotely?",
        answer: "Remote work policies vary by department. Most teams offer 2-3 days remote work per week. Discuss with your supervisor to understand your team's specific policy."
      }
    ];

    setKnowledgeBase(sampleFAQs);
    
    setMessages([{
      type: 'bot',
      content: "Hi! I'm your Internship Support Assistant. I can help you with questions about:\n\n• Internship hours and policies\n• Time off requests\n• Technical setup and tools\n• Stipend and timesheet queries\n• Project assignments\n• And more!\n\nHow can I help you today?",
      timestamp: new Date()
    }]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple similarity scoring function
  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Word overlap scoring
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    
    let matches = 0;
    words1.forEach(word => {
      if (word.length > 3 && s2.includes(word)) {
        matches++;
      }
    });
    
    return matches / words1.length;
  };

  // Find best matching FAQ
  const findBestMatch = (query) => {
    let bestMatch = null;
    let bestScore = 0;

    knowledgeBase.forEach(faq => {
      const questionScore = calculateSimilarity(query, faq.question);
      const answerScore = calculateSimilarity(query, faq.answer) * 0.5;
      const totalScore = questionScore + answerScore;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMatch = faq;
      }
    });

    return { match: bestMatch, score: bestScore };
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      const { match, score } = findBestMatch(input);

      let botResponse;
      if (score > 0.15) {
        botResponse = {
          type: 'bot',
          content: match.answer,
          category: match.category,
          confidence: score,
          timestamp: new Date()
        };
      } else {
        botResponse = {
          type: 'bot',
          content: "I'm not sure about that specific question. Here are some options:\n\n1. Contact HR at hr@company.com for policy questions\n2. Reach out to IT support at it@company.com for technical issues\n3. Talk to your supervisor for project-specific queries\n\nYou can also try rephrasing your question or browse our FAQ categories: General, Technical, HR, Projects, and Policies.",
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type.toUpperCase()}: ${msg.content}`
    ).join('\n\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${Date.now()}.txt`;
    a.click();
  };

  const uploadFAQ = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data)) {
          setKnowledgeBase(prev => [...prev, ...data]);
          setMessages(prev => [...prev, {
            type: 'bot',
            content: `Successfully loaded ${data.length} new FAQ entries!`,
            timestamp: new Date()
          }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, {
          type: 'bot',
          content: 'Error loading FAQ file. Please ensure it\'s a valid JSON array.',
          timestamp: new Date()
        }]);
      }
    };
    reader.readAsText(file);
  };

  const showCategories = () => {
    const categories = [...new Set(knowledgeBase.map(faq => faq.category))];
    const categoryList = categories.map(cat => {
      const count = knowledgeBase.filter(faq => faq.category === cat).length;
      return `• ${cat} (${count} items)`;
    }).join('\n');

    setMessages(prev => [...prev, {
      type: 'bot',
      content: `Here are the available FAQ categories:\n\n${categoryList}\n\nFeel free to ask questions about any of these topics!`,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Internship Support Bot</h1>
            <p className="text-sm text-gray-600">AI-Powered Assistant</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={showCategories}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Categories
          </button>
          <button
            onClick={exportChat}
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <label className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            Upload FAQ
            <input
              type="file"
              accept=".json"
              onChange={uploadFAQ}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              msg.type === 'user' 
                ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              {msg.type === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div className={`flex flex-col max-w-2xl ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                  : 'bg-white shadow-md text-gray-800'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.category && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {msg.category}
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-1 px-2">
                {msg.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white shadow-md px-4 py-3 rounded-2xl">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about internship policies, technical setup, timesheets..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Knowledge Base: {knowledgeBase.length} FAQs loaded
        </p>
      </div>
    </div>
  );
};

export default InternshipChatbot;