import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, AlertCircle, Loader, Sparkles } from 'lucide-react';
import apiService from '../services/api';

const AIChatInterface = ({ analysisContext = null, onInsightGenerated = null }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI Medical Assistant. I can help you understand medical reports, answer health questions, and provide insights. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check API health on component mount
  useEffect(() => {
    checkAPIHealth();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAPIHealth = async () => {
    try {
      const health = await apiService.checkHealth();
      setApiStatus(health.features?.chatbot ? 'ready' : 'unavailable');
    } catch (error) {
      setApiStatus('error');
      console.error('Health check failed:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiService.chatWithAI(
        userMessage.content, 
        analysisContext ? JSON.stringify(analysisContext) : null,
        conversationId
      );

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: response.response,
        sources: response.sources || [],
        timestamp: new Date(),
        conversationId: response.conversation_id
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.conversation_id && !conversationId) {
        setConversationId(response.conversation_id);
      }

      // If this generates insights, notify parent component
      if (onInsightGenerated && response.insights) {
        onInsightGenerated(response.insights);
      }

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `I apologize, but I'm having trouble responding right now. ${error.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getQuickQuestions = () => {
    if (!analysisContext) {
      return [
        "What are normal blood pressure ranges?",
        "How can I improve my cholesterol levels?",
        "What does prediabetes mean?",
        "Explain BMI categories"
      ];
    } else {
      return [
        "What do my test results mean?",
        "What are my main health risks?",
        "What lifestyle changes should I make?",
        "When should I follow up with my doctor?"
      ];
    }
  };

  const MessageBubble = ({ message }) => {
    const isBot = message.type === 'bot';
    const isError = message.type === 'error';

    return (
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex max-w-xs lg:max-w-md ${isBot ? 'flex-row' : 'flex-row-reverse'} items-end space-x-2`}>
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-teal-500' : isError ? 'bg-red-500' : 'bg-green-500'
          }`}>
            {isBot ? <Bot size={16} className="text-white" /> : 
             isError ? <AlertCircle size={16} className="text-white" /> :
             <User size={16} className="text-white" />}
          </div>
          <div className={`px-4 py-2 rounded-lg ${
            isBot ? 'bg-gray-100 text-gray-800' : 
            isError ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-teal-500 text-white'
          }`}>
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">Sources:</p>
                {message.sources.map((source, idx) => (
                  <span key={idx} className="text-xs bg-gray-200 px-2 py-1 rounded mr-1 mt-1 inline-block">
                    {source.category || 'Medical Knowledge'}
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (apiStatus === 'checking') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader className="animate-spin text-teal-500" size={20} />
          <span className="text-gray-600">Checking AI Chat availability...</span>
        </div>
      </div>
    );
  }

  if (apiStatus === 'unavailable' || apiStatus === 'error') {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 text-amber-600 mb-4">
          <AlertCircle size={20} />
          <h3 className="font-semibold">AI Chat Unavailable</h3>
        </div>
        <p className="text-gray-600 mb-4">
          The AI chat feature requires API keys to be configured. Please contact your administrator to enable this feature.
        </p>
        <div className="bg-teal-50 p-4 rounded-lg">
          <p className="text-sm text-teal-800">
            <strong>To enable AI Chat:</strong><br />
            1. Set up OpenAI or Anthropic API keys<br />
            2. Configure the .env file<br />
            3. Restart the application
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-96'
    }`}>
      {/* Chat Header */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg cursor-pointer"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center space-x-2">
          <Sparkles size={20} />
          <h3 className="font-semibold">AI Medical Assistant</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <MessageCircle size={20} />
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Quick Questions */}
          {messages.length <= 1 && (
            <div className="p-4 border-b border-gray-100">
              <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {getQuickQuestions().map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputMessage(question)}
                    className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                  <Loader className="animate-spin" size={16} />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about medical reports, health advice, or any health questions..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIChatInterface;