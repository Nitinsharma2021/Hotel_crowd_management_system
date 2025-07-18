import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { aiAgentAPI } from '../services/api';
import toast from 'react-hot-toast';
// Removed Link import since admin login is not needed

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your AI reservation assistant. I can help you book tables, check availability, and handle special requests. What would you like to do today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiAgentAPI.processRequest(inputValue);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.data.aiResponse.response || 'I understand your request. Let me help you with that.',
        timestamp: new Date(),
        data: response.data.result
      };

      setMessages(prev => [...prev, aiResponse]);

      // Show success toast if reservation was created
      if (response.data.aiResponse.action === 'create_reservation') {
        toast.success('Reservation created successfully!');
      } else if (response.data.aiResponse.action === 'check_availability') {
        const available = response.data.result.available;
        if (available) {
          toast.success(`Found ${response.data.result.tables.length} available tables!`);
        } else {
          toast.error('No tables available for the requested time.');
        }
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to process request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    const isAI = message.type === 'ai';
    const Icon = isAI ? Bot : User;

    return (
      <div
        key={message.id}
        className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
      >
        <div className={`flex ${isAI ? 'flex-row' : 'flex-row-reverse'} items-start space-x-3 max-w-3xl`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isAI ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className={`flex-1 ${isAI ? 'text-left' : 'text-right'}`}>
            <div className={`inline-block p-4 rounded-2xl ${
              isAI 
                ? 'bg-white border border-gray-200 text-gray-900' 
                : 'bg-primary-600 text-white'
            } ${message.isError ? 'border-red-300 bg-red-50' : ''}`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              
              {/* Display additional data if available */}
              {message.data && !message.isError && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  {message.data.tables && (
                    <div className="text-sm">
                      <p className="font-semibold mb-2">Available Tables:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {message.data.tables.map((table, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                            Table {table.table_number} ({table.seating_capacity} seats)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {message.data.reservation_id && (
                    <div className="text-sm">
                      <p className="font-semibold">Reservation ID: {message.data.reservation_id}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className={`text-xs text-gray-500 mt-1 ${isAI ? 'text-left' : 'text-right'}`}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Reservation Assistant</h1>
        <p className="text-gray-600">
          Chat with our AI to book tables, check availability, and get personalized recommendations
        </p>
      </div>

      <div className="card">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: 'Book a table for 4 people tonight at 7 PM' or 'Check availability for tomorrow'"
              className="input-field resize-none h-12"
              rows="1"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary h-12 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Book table for 2 tonight',
              'Check availability tomorrow',
              'Reservation for 6 people',
              'Special dietary requirements'
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => setInputValue(action)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <Bot className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Natural Language</h3>
          <p className="text-sm text-gray-600">
            Speak naturally and our AI will understand your reservation needs
          </p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-lg">⚡</span>
          </div>
          <h3 className="font-semibold mb-2">Instant Booking</h3>
          <p className="text-sm text-gray-600">
            Get instant confirmation and table assignments
          </p>
        </div>
        <div className="card text-center">
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="text-lg">🎯</span>
          </div>
          <h3 className="font-semibold mb-2">Smart Recommendations</h3>
          <p className="text-sm text-gray-600">
            Personalized suggestions based on your preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant; 