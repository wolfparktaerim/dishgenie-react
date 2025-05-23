// src/app/page.tsx

/*
  This is the home screen of the entire application.

  It consists of multiple components: Navigation bar, carousel, tag line, video modal, ... and footer.
*/

'use client';
import { useState, useEffect } from 'react';
import HowItWorks from '../components/HowItWorks';
import Footer from '../components/Footer';
import Carousel from '../components/Carousel';
import Navigation from '../components/layout/Navigation';
import TagLine from '../components/TagLine';
import LoginModal from '../components/modals/LoginModal';
import VideoModal from '../components/modals/VideoModal';

// const xxx = useState('something') in React.js is like const xxx = ref('something') in Vue.js

export default function Home() {

  const [showLogin, setShowLogin] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const [videoId] = useState('zw8Ao6VfDog');                    // Video ID (Youtube Video)
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default authentication state

  useEffect(() => {
    animateComponents();
  }, []);

   const animateComponents = () => {
    const components = document.querySelectorAll('.animate-up');
    components.forEach((component, index) => {
      (component as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });
  };
  
  const handleLogin = () => {
    // Perform actual login logic here
    // localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setShowLogin(false);
  };
  
  const handleLogout = () => {
    // Perform actual logout logic here
    // localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <div className="relative">
      
      {/* Login Modal */}
      {showLogin && <LoginModal onLogin={()=>handleLogin()} onClose={() => setShowLogin(false)} />}

      {/* Video Modal */}
      {showVideo && (
        <VideoModal
          isOpen={showVideo}
          onClose={() => setShowVideo(false)}
          videoId={videoId}
          title="Discover Healthy Recipes Demo  "
          description="Learn how to find, save, and prepare delicious healthy recipes that match your dietary preferences and nutritional goals."
        />
      )}

      {/* Background container */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-50 to-white">
        <div className="absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl"></div>
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-purple-100/20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-purple-100/20 blur-3xl"></div>
      </div>

      {/* Content container */}
      <div className="relative min-h-screen">
        <Navigation 
          isAuthenticated={isAuthenticated} 
          onLogin={() => setShowLogin(true)} 
          onLogout={handleLogout} 
        />
        <main className="relative">
          <div className="animated-container">
            <Carousel  />
            <TagLine 
              className="animate-up" 
              onShowLogin={() => setShowLogin(true)} 
              onShowVideo={() => setShowVideo(true)} 
            />
            <HowItWorks id="HowItWorks" className="animate-up" />
            <Footer className="animate-up" />
          </div>
        </main>
      </div>
    </div>
  );
}