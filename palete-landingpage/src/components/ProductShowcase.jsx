import { useState } from 'react';
import {
  Play,
  Pause,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Download,
  Share2,
  Layers,
  Palette,
  Settings,
  Zap
} from 'lucide-react';

/**
 * ProductShowcase Component
 *
 * Interactive product demonstration featuring:
 * - Dashboard screenshots with tooltips
 * - Video demo with play controls
 * - Device preview modes
 * - Interactive feature highlights
 */

export default function ProductShowcase() {
  const [activeDevice, setActiveDevice] = useState('desktop');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  const features = [
    {
      id: 'theme-generator',
      title: 'AI Theme Generator',
      description: 'Generate beautiful themes with AI-powered color harmony',
      position: { top: '20%', left: '15%' },
      icon: Palette,
    },
    {
      id: 'live-preview',
      title: 'Live Preview',
      description: 'See changes instantly across all components',
      position: { top: '35%', right: '20%' },
      icon: Eye,
    },
    {
      id: 'export-options',
      title: 'Export & Share',
      description: 'Export themes in multiple formats or share with team',
      position: { bottom: '25%', left: '20%' },
      icon: Download,
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Work together with real-time collaboration features',
      position: { bottom: '20%', right: '15%' },
      icon: Share2,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-theme-secondary to-theme-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-theme-accent/10 text-theme-accent text-sm font-medium mb-6">
            🎨 See It In Action
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-theme-text-primary mb-6">
            Experience the power of
            <span className="text-theme-accent block">
              intelligent theme creation
            </span>
          </h2>
          <p className="text-lg text-theme-text-secondary max-w-3xl mx-auto">
            Watch how PaletteSaaS transforms your design workflow with intuitive tools,
            real-time collaboration, and AI-powered theme generation.
          </p>
        </div>

        {/* Device Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-theme-primary rounded-lg p-1 shadow-sm border border-theme-border/20">
            {devices.map((device) => (
              <button
                key={device.id}
                onClick={() => setActiveDevice(device.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeDevice === device.id
                    ? 'bg-theme-accent text-white shadow-sm'
                    : 'text-theme-text-primary hover:text-theme-accent'
                }`}
              >
                <device.icon className="w-4 h-4" />
                {device.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Showcase */}
        <div className="relative">
          {/* Dashboard Mockup */}
          <div className={`relative mx-auto bg-theme-primary rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
            activeDevice === 'desktop' ? 'max-w-6xl' :
            activeDevice === 'tablet' ? 'max-w-3xl' : 'max-w-sm'
          }`}>
            {/* Browser/App Header */}
            <div className="flex items-center justify-between p-4 bg-theme-secondary border-b border-theme-border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-theme-accent rounded-full"></div>
                <div className="w-3 h-3 bg-theme-accent/70 rounded-full"></div>
                <div className="w-3 h-3 bg-theme-accent/40 rounded-full"></div>
              </div>
              <div className="text-sm text-theme-text-secondary font-medium">
                PaletteSaaS Dashboard
              </div>
              <div className="w-16"></div>
            </div>

            {/* Dashboard Content */}
            <div className="relative p-6 bg-gradient-to-br from-theme-secondary to-theme-primary min-h-96">
              {/* Top Navigation */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-theme-text-primary">Theme Studio</h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-theme-accent/10 rounded-lg text-theme-accent hover:bg-theme-accent/20 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-theme-accent text-white rounded-lg hover:opacity-90 transition-all">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Theme Palette */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {['Primary', 'Secondary', 'Accent', 'Neutral'].map((colorType, index) => (
                  <div key={colorType} className="bg-theme-primary rounded-lg p-4 border border-theme-border/20 shadow-sm">
                    <div className="text-sm font-medium text-theme-text-primary mb-2">{colorType}</div>
                    <div className="flex space-x-1">
                      <div className={`w-8 h-8 rounded ${
                        index === 0 ? 'bg-theme-accent' :
                        index === 1 ? 'bg-theme-accent/70' :
                        index === 2 ? 'bg-theme-accent/50' : 'bg-theme-border'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-xs text-theme-text-secondary">
                          Dynamic
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview Area */}
              <div className="bg-theme-primary rounded-xl p-6 border border-theme-border/20 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-theme-text-primary">Live Preview</h4>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-theme-text-secondary" />
                    <span className="text-sm text-theme-text-secondary">Components</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-8 bg-gradient-to-r from-theme-accent to-theme-accent rounded"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-16 bg-theme-secondary rounded"></div>
                    <div className="h-16 bg-theme-accent/20 rounded"></div>
                    <div className="h-16 bg-theme-border rounded"></div>
                  </div>
                  <div className="h-12 bg-gradient-to-r from-theme-accent/30 to-theme-accent/50 rounded flex items-center justify-center">
                    <span className="text-theme-text-primary text-sm font-medium">Button Preview</span>
                  </div>
                </div>
              </div>

              {/* Interactive Feature Tooltips */}
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="absolute cursor-pointer group"
                  style={feature.position}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="w-8 h-8 bg-theme-accent rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                    <feature.icon className="w-4 h-4" />
                  </div>

                  {/* Tooltip */}
                  <div className={`absolute z-10 w-64 p-4 bg-theme-primary rounded-lg shadow-xl border border-theme-border/20 transition-all duration-200 ${
                    activeFeature === index ? 'opacity-100 visible' : 'opacity-0 invisible'
                  } ${
                    feature.position.right ? 'right-0' : 'left-0'
                  } ${
                    feature.position.bottom ? 'bottom-full mb-2' : 'top-full mt-2'
                  }`}>
                    <h5 className="font-semibold text-theme-text-primary mb-2">{feature.title}</h5>
                    <p className="text-sm text-theme-text-secondary">{feature.description}</p>
                    <div className={`absolute w-3 h-3 bg-theme-primary border-r border-b border-theme-border/20 transform rotate-45 ${
                      feature.position.bottom ? 'top-full -mt-1.5' : 'bottom-full -mb-1.5'
                    } ${
                      feature.position.right ? 'right-4' : 'left-4'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Demo Section */}
          <div className="mt-16 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-theme-accent rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                {isVideoPlaying ? (
                  <Pause className="w-8 h-8 text-white" onClick={() => setIsVideoPlaying(false)} />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" onClick={() => setIsVideoPlaying(true)} />
                )}
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-theme-accent/30 animate-ping"></div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-theme-text-primary mb-2">
                Watch 2-Minute Demo
              </h3>
              <p className="text-theme-text-secondary">
                See how easy it is to create professional themes in minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
