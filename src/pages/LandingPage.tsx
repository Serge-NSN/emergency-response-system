import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  ChartBarIcon,
  PhoneIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  HeartIcon,
  ShieldExclamationIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const CrisisBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', text: string}>>([
    { type: 'bot', text: 'Hello! I\'m your emergency response assistant. What type of emergency are you experiencing? I can help with fires, medical emergencies, natural disasters, severe weather, active threats, power outages, and more.' }
  ]);
  const [inputText, setInputText] = useState('');

  const crisisGuidance = {
    'fire': {
      title: 'Fire Emergency Response',
      steps: [
        '1. Get out immediately and call 911',
        '2. Don\'t use elevators - use stairs',
        '3. Stay low to avoid smoke inhalation',
        '4. Feel doors before opening - if hot, find another way',
        '5. Meet at designated meeting point',
        '6. Never go back inside for belongings'
      ],
      additional: 'If trapped, seal door cracks with wet towels and signal for help from window.'
    },
    'medical': {
      title: 'Medical Emergency Response',
      steps: [
        '1. Call 911 immediately',
        '2. Stay with the person',
        '3. Don\'t move them unless in immediate danger',
        '4. Keep them calm and comfortable',
        '5. Check for breathing and pulse',
        '6. Begin CPR if trained and necessary'
      ],
      additional: 'If unconscious, place in recovery position. For heart attack, give aspirin if available.'
    },
    'heart': {
      title: 'Heart Attack Response',
      steps: [
        '1. Call 911 immediately',
        '2. Have person sit down and rest',
        '3. Loosen tight clothing',
        '4. Give aspirin if available (unless allergic)',
        '5. Monitor breathing and consciousness',
        '6. Be ready to perform CPR if needed'
      ],
      additional: 'Symptoms include chest pain, shortness of breath, nausea, and pain in arms/jaw.'
    },
    'choking': {
      title: 'Choking Emergency Response',
      steps: [
        '1. Ask "Are you choking?" - if they can speak, encourage coughing',
        '2. If unable to speak, perform Heimlich maneuver',
        '3. Stand behind person, wrap arms around waist',
        '4. Make fist above navel, grasp with other hand',
        '5. Give quick upward thrusts',
        '6. Call 911 if object doesn\'t dislodge'
      ],
      additional: 'For infants, use back blows and chest thrusts instead of Heimlich.'
    },
    'bleeding': {
      title: 'Severe Bleeding Response',
      steps: [
        '1. Call 911 immediately',
        '2. Apply direct pressure with clean cloth',
        '3. Elevate injured area above heart if possible',
        '4. Keep pressure for at least 10-15 minutes',
        '5. Don\'t remove soaked bandages - add more on top',
        '6. Monitor for signs of shock'
      ],
      additional: 'If bleeding is bright red and spurting, it\'s arterial and requires immediate medical attention.'
    },
    'earthquake': {
      title: 'Earthquake Response',
      steps: [
        '1. Drop, Cover, and Hold On',
        '2. Stay indoors if inside - don\'t run outside',
        '3. Move to open area if outside',
        '4. Stay away from windows and heavy objects',
        '5. Check for injuries after shaking stops',
        '6. Be prepared for aftershocks'
      ],
      additional: 'After earthquake, check for gas leaks, turn off utilities if needed, and listen to emergency broadcasts.'
    },
    'flood': {
      title: 'Flood Emergency Response',
      steps: [
        '1. Move to higher ground immediately',
        '2. Don\'t walk through moving water',
        '3. Turn off electricity and gas if safe',
        '4. Call emergency services',
        '5. Avoid driving through flooded areas',
        '6. Stay informed with weather updates'
      ],
      additional: 'Six inches of moving water can knock you down. Two feet can sweep away most vehicles.'
    },
    'storm': {
      title: 'Severe Storm Response',
      steps: [
        '1. Stay indoors and away from windows',
        '2. Have emergency kit ready',
        '3. Listen to weather updates',
        '4. Avoid using electrical equipment',
        '5. Go to basement or interior room',
        '6. Have battery-powered radio ready'
      ],
      additional: 'For tornadoes, go to basement or interior room on lowest floor. For hurricanes, follow evacuation orders.'
    },
    'tornado': {
      title: 'Tornado Emergency Response',
      steps: [
        '1. Go to basement or storm cellar immediately',
        '2. If no basement, go to interior room on lowest floor',
        '3. Stay away from windows and exterior walls',
        '4. Cover yourself with blankets or mattress',
        '5. Listen to weather radio for updates',
        '6. Don\'t try to outrun tornado in vehicle'
      ],
      additional: 'If in vehicle and tornado is approaching, abandon vehicle and lie flat in ditch or low area.'
    },
    'hurricane': {
      title: 'Hurricane Emergency Response',
      steps: [
        '1. Follow evacuation orders if issued',
        '2. If staying, secure outdoor objects',
        '3. Board up windows or use storm shutters',
        '4. Fill bathtub with water for emergency use',
        '5. Have emergency supplies ready',
        '6. Stay informed with weather updates'
      ],
      additional: 'After hurricane, avoid floodwaters, downed power lines, and damaged structures.'
    },
    'threat': {
      title: 'Active Threat Response',
      steps: [
        '1. Run - Get away from the threat if possible',
        '2. Hide - Find secure location, lock doors, turn off lights',
        '3. Fight - As last resort, act aggressively to defend yourself',
        '4. Call 911 when safe to do so',
        '5. Stay quiet and hidden',
        '6. Follow law enforcement instructions'
      ],
      additional: 'Remember: Run, Hide, Fight. Your safety is the priority.'
    },
    'power': {
      title: 'Power Outage Response',
      steps: [
        '1. Check if neighbors have power',
        '2. Use flashlights, not candles',
        '3. Keep refrigerator and freezer closed',
        '4. Have emergency supplies ready',
        '5. Turn off electrical equipment',
        '6. Listen to battery-powered radio for updates'
      ],
      additional: 'Keep emergency kit with water, non-perishable food, first aid, and batteries.'
    },
    'gas': {
      title: 'Gas Leak Response',
      steps: [
        '1. Leave the area immediately',
        '2. Don\'t turn on/off lights or electrical switches',
        '3. Don\'t use phone inside the building',
        '4. Call 911 from outside',
        '5. Don\'t return until cleared by authorities',
        '6. Warn others to stay away'
      ],
      additional: 'Natural gas is odorless, but utility companies add a rotten egg smell. If you smell it, evacuate immediately.'
    },
    'chemical': {
      title: 'Chemical Spill Response',
      steps: [
        '1. Evacuate the area immediately',
        '2. Move upwind and uphill if possible',
        '3. Call 911 and report the spill',
        '4. Don\'t touch or inhale chemicals',
        '5. Remove contaminated clothing',
        '6. Seek medical attention if exposed'
      ],
      additional: 'If chemical gets on skin, rinse with water for at least 15 minutes.'
    },
    'drowning': {
      title: 'Drowning Emergency Response',
      steps: [
        '1. Call 911 immediately',
        '2. Don\'t jump in unless trained in water rescue',
        '3. Use reaching or throwing assist if possible',
        '4. Once out of water, check breathing',
        '5. Begin CPR if not breathing',
        '6. Keep person warm and monitor for secondary drowning'
      ],
      additional: 'Secondary drowning can occur hours after incident. Watch for breathing difficulties.'
    },
    'poison': {
      title: 'Poisoning Emergency Response',
      steps: [
        '1. Call Poison Control (1-800-222-1222) or 911',
        '2. Don\'t induce vomiting unless directed',
        '3. Save container or sample of poison',
        '4. Monitor breathing and consciousness',
        '5. Don\'t give anything by mouth',
        '6. Follow medical professional instructions'
      ],
      additional: 'Have Poison Control number saved: 1-800-222-1222. They can provide immediate guidance.'
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user' as const, text: inputText };
    setMessages(prev => [...prev, userMessage]);

    // Enhanced keyword detection and response
    const lowerText = inputText.toLowerCase();
    let botResponse = '';
    let crisisType = '';

    // Check for specific crisis types with improved keyword matching
    if (lowerText.includes('fire') || lowerText.includes('burning') || lowerText.includes('smoke')) {
      crisisType = 'fire';
    } else if (lowerText.includes('heart') || lowerText.includes('chest pain') || lowerText.includes('heart attack')) {
      crisisType = 'heart';
    } else if (lowerText.includes('choking') || lowerText.includes('can\'t breathe') || lowerText.includes('food stuck')) {
      crisisType = 'choking';
    } else if (lowerText.includes('bleeding') || lowerText.includes('cut') || lowerText.includes('blood')) {
      crisisType = 'bleeding';
    } else if (lowerText.includes('medical') || lowerText.includes('unconscious') || lowerText.includes('passed out')) {
      crisisType = 'medical';
    } else if (lowerText.includes('earthquake') || lowerText.includes('shaking')) {
      crisisType = 'earthquake';
    } else if (lowerText.includes('flood') || lowerText.includes('water') || lowerText.includes('drowning')) {
      crisisType = lowerText.includes('drowning') ? 'drowning' : 'flood';
    } else if (lowerText.includes('tornado') || lowerText.includes('twister')) {
      crisisType = 'tornado';
    } else if (lowerText.includes('hurricane') || lowerText.includes('cyclone')) {
      crisisType = 'hurricane';
    } else if (lowerText.includes('storm') || lowerText.includes('thunder') || lowerText.includes('lightning')) {
      crisisType = 'storm';
    } else if (lowerText.includes('shooter') || lowerText.includes('gun') || lowerText.includes('threat') || lowerText.includes('attack')) {
      crisisType = 'threat';
    } else if (lowerText.includes('power') || lowerText.includes('electricity') || lowerText.includes('blackout')) {
      crisisType = 'power';
    } else if (lowerText.includes('gas') || lowerText.includes('smell') || lowerText.includes('leak')) {
      crisisType = 'gas';
    } else if (lowerText.includes('chemical') || lowerText.includes('spill') || lowerText.includes('toxic')) {
      crisisType = 'chemical';
    } else if (lowerText.includes('poison') || lowerText.includes('overdose') || lowerText.includes('swallowed')) {
      crisisType = 'poison';
    }

    if (crisisType && crisisGuidance[crisisType as keyof typeof crisisGuidance]) {
      const guidance = crisisGuidance[crisisType as keyof typeof crisisGuidance];
      botResponse = `**${guidance.title}**\n\n${guidance.steps.join('\n')}\n\n*${guidance.additional}*\n\n**Remember: Always call 911 for immediate emergency assistance.**`;
    } else {
      // General emergency response for unrecognized situations
      botResponse = `I understand you're experiencing an emergency. Here's what to do:\n\n1. **Call 911 immediately** for professional emergency assistance\n2. **Stay calm** and assess the situation\n3. **Ensure your safety** first\n4. **Help others** if it's safe to do so\n5. **Follow instructions** from emergency responders\n\nCan you tell me more specifically what type of emergency you're experiencing? I can provide more detailed guidance for:\n• Medical emergencies\n• Fire emergencies\n• Natural disasters\n• Severe weather\n• Active threats\n• Power outages\n• And many other situations`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 1000);

    setInputText('');
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center"
      >
        <ChatBubbleLeftRightIcon className="w-8 h-8" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-6 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-96 h-96 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-6 h-6" />
                <span className="font-semibold">Emergency Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.text}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe the emergency..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-red-600/20 animate-pulse"></div>
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/30 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-red-400/30 rounded-full animate-bounce-slow delay-1000"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-yellow-400/30 rounded-full animate-bounce-slow delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left animate-slide-up">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-6 animate-pulse">
                <ExclamationTriangleIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
                Emergency
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-blue-600">
                  Response System
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-2xl leading-relaxed">
                Empowering communities with real-time emergency reporting, rapid response coordination, 
                and comprehensive incident management. Every second counts when lives are at stake.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register" 
                  className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                  <span className="relative z-10">Get Started Now</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link 
                  to="/login" 
                  className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-xl shadow-lg font-semibold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Content - Emergency Scene */}
            <div className="flex-1 flex justify-center animate-slide-up delay-300">
              <div className="relative w-96 h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-red-500/20 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-blue-400/30 to-red-400/30 rounded-full animate-spin-slow reverse"></div>
                <div className="absolute inset-8 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <ExclamationTriangleIcon className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Emergency Response</h3>
                    <p className="text-gray-600">Always ready to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our System?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to ensure the fastest and most reliable emergency response
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ClockIcon,
                title: "Real-time Response",
                description: "Instant emergency alerts and rapid response coordination"
              },
              {
                icon: MapPinIcon,
                title: "Location Tracking",
                description: "Precise GPS tracking for accurate emergency location"
              },
              {
                icon: UserGroupIcon,
                title: "Team Coordination",
                description: "Seamless communication between responders and dispatchers"
              },
              {
                icon: ChartBarIcon,
                title: "Analytics & Reports",
                description: "Comprehensive data analysis for improved response times"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crisis Education Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Emergency Preparedness Guide</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Know what to do in different emergency situations. Knowledge saves lives.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FireIcon,
                title: "Fire Emergency",
                color: "from-red-500 to-orange-500",
                steps: [
                  "Get out immediately and call 911",
                  "Don't use elevators",
                  "Stay low to avoid smoke",
                  "Meet at designated meeting point"
                ]
              },
              {
                icon: HeartIcon,
                title: "Medical Emergency",
                color: "from-green-500 to-blue-500",
                steps: [
                  "Call 911 immediately",
                  "Stay with the person",
                  "Don't move them unless necessary",
                  "Keep them calm and comfortable"
                ]
              },
              {
                icon: ShieldExclamationIcon,
                title: "Natural Disaster",
                color: "from-purple-500 to-pink-500",
                steps: [
                  "Follow evacuation orders",
                  "Have emergency kit ready",
                  "Stay informed with updates",
                  "Check on neighbors after"
                ]
              },
              {
                icon: BoltIcon,
                title: "Severe Weather",
                color: "from-yellow-500 to-orange-500",
                steps: [
                  "Stay indoors and away from windows",
                  "Have emergency kit ready",
                  "Listen to weather updates",
                  "Avoid using electrical equipment"
                ]
              },
              {
                icon: MapPinIcon,
                title: "Active Threat",
                color: "from-gray-600 to-gray-800",
                steps: [
                  "Run, Hide, or Fight",
                  "Call 911 when safe",
                  "Stay quiet and hidden",
                  "Follow law enforcement instructions"
                ]
              },
              {
                icon: PhoneIcon,
                title: "Power Outage",
                color: "from-indigo-500 to-purple-500",
                steps: [
                  "Check if neighbors have power",
                  "Use flashlights, not candles",
                  "Keep refrigerator closed",
                  "Have emergency supplies ready"
                ]
              }
            ].map((crisis, index) => (
              <div 
                key={index}
                className="group bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${crisis.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <crisis.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{crisis.title}</h3>
                <ul className="space-y-2">
                  {crisis.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-2 text-gray-600">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-red-600">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "99.9%", label: "Uptime" },
              { number: "<30s", label: "Response Time" },
              { number: "10K+", label: "Lives Saved" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 300}ms` }}>
                <div className="text-4xl font-bold text-white mb-2 animate-count-up">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of emergency responders and community members who trust our system 
              to keep their communities safe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-xl shadow-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
                <span className="text-xl font-bold">Emergency Response</span>
              </div>
              <p className="text-gray-400">
                Empowering communities with reliable emergency response solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/landing" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>Emergency: 911</span>
                </li>
                <li className="flex items-center space-x-2">
                  <GlobeAltIcon className="w-4 h-4" />
                  <span>www.emergency-response.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Real-time Alerts</li>
                <li>GPS Tracking</li>
                <li>Team Coordination</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Emergency Response System. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Crisis Bot */}
      <CrisisBot />

      <style>{`
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .animate-slide-up.delay-300 {
          animation-delay: 0.3s;
        }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease both;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-bounce-slow.delay-1000 {
          animation-delay: 1s;
        }
        .animate-bounce-slow.delay-2000 {
          animation-delay: 2s;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow.reverse {
          animation-direction: reverse;
        }
        @keyframes count-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-count-up {
          animation: count-up 1s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 