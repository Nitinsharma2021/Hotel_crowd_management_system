import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Bot, Clock, Users, Star, Zap } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Booking',
      description: 'Intelligent table assignment and personalized recommendations using advanced AI.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'Instant table availability updates and dynamic waitlist management.',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Users,
      title: 'Smart Capacity Management',
      description: 'Optimize restaurant capacity while maintaining guest experience quality.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Star,
      title: 'Personalized Experience',
      description: 'Tailored recommendations based on customer preferences and history.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Restaurant
            <span className="text-primary-600"> Reservations</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of dining with our AI-powered reservation system. 
            Book tables instantly, get personalized recommendations, and enjoy seamless service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reserve"
              className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Book a Table</span>
            </Link>
            <Link
              to="/ai-assistant"
              className="btn-secondary text-lg px-8 py-3 flex items-center justify-center space-x-2"
            >
              <Bot className="w-5 h-5" />
              <span>Try AI Assistant</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose ReserveAI?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our multi-agent AI system revolutionizes restaurant management with intelligent automation and personalized service.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card card-hover text-center">
                <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <Zap className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Dining Experience?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of restaurants and customers who trust ReserveAI for seamless reservations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reserve"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Start Booking Now
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">10,000+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Restaurants</div>
          </div>
          <div className="card">
            <div className="text-3xl font-bold text-primary-600 mb-2">99.9%</div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 