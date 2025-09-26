import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, Loader2, HelpCircle, Quote } from 'lucide-react';
import apiService from '../services/api';

const ChatInterface = ({ sessionId, analysisData, isVisible = false, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sample questions for quick start
  const sampleQuestions = [
    "What does my cholesterol level mean?",
    "How serious is my risk score?",
    "What medications might I need?",
    "What lifestyle changes should I make?",
    "How often should I get follow-up tests?",
    "Can you explain the SHAP analysis?"
  ];

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([{
        id: Date.now(),
        type: 'bot',
        content: `Hello! I'm here to help you understand your medical analysis. You can ask me about any aspect of your results, including specific test values, risk factors, or recommendations. What would you like to know?`,
        timestamp: new Date(),
        confidence: 1.0
      }]);
    }
  }, [isVisible, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageText = null) => {
    const message = messageText || currentMessage.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      contextLine: selectedContext
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setSelectedContext(null);
    setIsLoading(true);

    try {
      // Send to API
      const response = await apiService.sendChatMessage(
        sessionId,
        message,
        selectedContext
      );

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.response,
          timestamp: new Date(),
          confidence: response.data.confidence,
          citations: response.data.citations,
          relatedFindings: response.data.related_findings
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      // Add error message with fallback response
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `I apologize, but I'm having trouble accessing the analysis system right now. However, based on your question about "${message}", I can provide some general guidance:\n\n${generateFallbackResponse(message)}`,
        timestamp: new Date(),
        confidence: 0.7,
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const generateFallbackResponse = (question) => {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('cholesterol')) {
      return "Cholesterol levels are important indicators of cardiovascular health. High cholesterol can increase your risk of heart disease. Your doctor will typically recommend lifestyle changes like diet modification and exercise, and may prescribe statin medications if levels are significantly elevated.";
    } else if (questionLower.includes('risk') || questionLower.includes('score')) {
      return "Risk scores help predict your likelihood of developing cardiovascular disease. Higher scores indicate greater risk, but remember that risk can be modified through lifestyle changes and appropriate medical treatment. Discuss your specific risk factors with your healthcare provider.";
    } else if (questionLower.includes('medication') || questionLower.includes('treatment')) {
      return "Treatment decisions should always be made in consultation with your healthcare provider. Common treatments for cardiovascular risk factors include statins for cholesterol, blood pressure medications, and diabetes medications if needed. Your specific treatment plan will depend on your individual risk profile.";
    } else if (questionLower.includes('lifestyle') || questionLower.includes('diet')) {
      return "Lifestyle modifications are often the first line of treatment and can be very effective. This typically includes a heart-healthy diet (low in saturated fat, rich in fruits and vegetables), regular physical activity, weight management, and smoking cessation if applicable.";
    } else {
      return "I'd be happy to help explain your test results and recommendations. Please consult with your healthcare provider for personalized medical advice and treatment decisions based on your specific situation.";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    handleSendMessage(question);
  };

  const handleContextSelect = (contextLine) => {
    setSelectedContext(contextLine);
    setCurrentMessage(`Can you explain: "${contextLine}"`);
    inputRef.current?.focus();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 text-medical-600 mr-3" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ask About Your Results</h2>
              <p className="text-sm text-gray-500">Session: {sessionId?.substring(0, 8)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    message.type === 'user' ? 'order-2' : 'order-1'
                  }`}>
                    {/* Message bubble */}
                    <div className={`chat-message ${
                      message.type === 'user' ? 'chat-user' : 'chat-bot'
                    } ${message.isError ? 'border border-orange-300 bg-orange-50 text-orange-900' : ''}`}>
                      
                      {/* Context reference */}
                      {message.contextLine && (
                        <div className="mb-2 p-2 bg-blue-100 rounded text-xs">
                          <Quote className="h-3 w-3 inline mr-1" />
                          "{message.contextLine}"
                        </div>
                      )}
                      
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Bot message metadata */}
                      {message.type === 'bot' && (
                        <div className="mt-2 space-y-2">
                          {message.confidence && (
                            <div className="text-xs opacity-70">
                              Confidence: {(message.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                          
                          {message.citations && message.citations.length > 0 && (
                            <div className="text-xs">
                              <p className="font-semibold mb-1">Sources:</p>
                              {message.citations.map((citation, index) => (
                                <div key={index} className="mb-1">
                                  • {citation.source} ({(citation.relevance * 100).toFixed(0)}%)
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {message.relatedFindings && message.relatedFindings.length > 0 && (
                            <div className="text-xs">
                              <p className="font-semibold mb-1">Related:</p>
                              {message.relatedFindings.map((finding, index) => (
                                <div key={index}>• {finding}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Message header */}
                    <div className={`flex items-center mt-1 text-xs text-gray-500 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-3 w-3 mr-1" />
                      ) : (
                        <Bot className="h-3 w-3 mr-1" />
                      )}
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="chat-message chat-bot max-w-xs">
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analyzing your question...
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Context selection bar */}
            {selectedContext && (
              <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-blue-800">
                    <Quote className="h-4 w-4 mr-2" />
                    <span>Asking about: "{selectedContext.length > 60 ? selectedContext.substring(0, 60) + '...' : selectedContext}"</span>
                  </div>
                  <button
                    onClick={() => setSelectedContext(null)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your test results, risk factors, or recommendations..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent resize-none"
                    rows="2"
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!currentMessage.trim() || isLoading}
                  className="px-4 py-2 bg-medical-500 text-white rounded-lg hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar with quick questions and context */}
          <div className="w-80 border-l border-gray-200 p-4 bg-gray-50">
            <div className="space-y-6">
              {/* Quick Questions */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Quick Questions
                </h3>
                <div className="space-y-2">
                  {sampleQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      disabled={isLoading}
                      className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded hover:border-medical-300 hover:bg-medical-50 transition-colors disabled:opacity-50"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context from Analysis */}
              {analysisData && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Ask About Specific Lines</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {/* Patient summary recommendations */}
                    {analysisData.patient_summary?.recommendations?.map((rec, index) => (
                      <button
                        key={`patient-${index}`}
                        onClick={() => handleContextSelect(rec)}
                        className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:border-green-300 hover:bg-green-50 transition-colors"
                      >
                        <div className="text-green-700 font-medium mb-1">Patient Recommendation</div>
                        <div className="text-gray-600 truncate">{rec}</div>
                      </button>
                    ))}

                    {/* Doctor summary treatment recommendations */}
                    {analysisData.doctor_summary?.treatment_recommendations?.map((treatment, index) => (
                      <button
                        key={`doctor-${index}`}
                        onClick={() => handleContextSelect(treatment.intervention)}
                        className="w-full text-left p-2 text-xs bg-white border border-gray-200 rounded hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="text-blue-700 font-medium mb-1">Treatment</div>
                        <div className="text-gray-600 truncate">{treatment.intervention}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;