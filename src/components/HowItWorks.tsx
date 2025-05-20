// src/components/HowItWorks.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Search, ScrollText, Bookmark, Pencil } from 'lucide-react';
import NumberCounter from './NumberCounter'; 

// Step type definition
interface HowItWorksProps {
  id?: string;
  className?: string;
}

interface Step {
  icon: React.FC<any>;
  title: string;
  description: string;
  isVisible: boolean;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ id, className }) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [steps, setSteps] = useState<Step[]>([
    {
      icon: Search,
      title: 'Search New Recipes',
      description: 'Generate healthy recipe recommendations based on your dietary requirements, ingredients and culinary preferences.',
      isVisible: false
    },
    {
      icon: ScrollText,
      title: 'View Recipe Details',
      description: 'Get a complete breakdown of time taken, ingredients, cooking steps, and nutritional information for your chosen recipe.',
      isVisible: false
    },
    {
      icon: Pencil,
      title: 'Customize and Modify',
      description: 'Adjust ingredient list based on your health goals, or get substitute recommendations to perfectly match your taste.',
      isVisible: false
    },
    {
      icon: Bookmark,
      title: 'Save Your Favorites',
      description: 'Once you\'re happy with a recipe, save it to your collection to create a personalized cookbook for easy reference in the future.',
      isVisible: false
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleScroll = () => {
    if (!imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.75; // Trigger when image is 75% visible
    
    if (rect.top < triggerPoint && rect.bottom > 0) {
      setIsModalVisible(true);
    } else {
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    // Set up intersection observer for steps
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stepRefs.current.findIndex(ref => ref === entry.target);
          if (index !== -1) {
            setSteps(prevSteps => {
              const newSteps = [...prevSteps];
              newSteps[index] = { ...newSteps[index], isVisible: true };
              return newSteps;
            });
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    
    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Set up scroll listener for modal
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white" >
      <div className="container mx-auto px-4" id={id}>
        <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800" >
          How it <span className="text-purple-600">Works</span>
        </h3>
        
        {/* Steps Section */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-8 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.title}
              ref={el => stepRefs.current[index] = el}
              className={`step-item flex flex-col items-center p-6 bg-white rounded-lg shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex-1 group ${step.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
              style={{transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'}}
            >
              <div className={`relative mb-8 transition-transform duration-500 ${activeStep === index ? 'scale-110' : ''}`}>
                <div className={`absolute inset-0 bg-purple-100 rounded-full scale-150 opacity-50 ${activeStep === index ? 'bg-purple-200' : ''} transition-colors duration-300`}></div>
                <step.icon 
                  className="h-16 w-16 text-purple-600 relative z-10 transition-colors duration-300" 
                  style={{ 
                    color: activeStep === index ? '#7e22ce' : '#9333ea'
                  }} 
                />
              </div>
              <h4 className="text-xl text-center font-semibold mb-4 text-gray-800">{step.title}</h4>
              <p className="text-gray-600 text-center flex-grow">{step.description}</p>
              <div className="mt-2 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600 mr-2"></span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Image Section */}
        <div className="my-16 flex flex-col items-center justify-center mx-auto max-w-5xl px-4 md:px-8 relative">
          <h4 className="text-2xl text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Endless Possibilities Await You...
          </h4>
          
          {/* Responsive Image Container */}
          <div 
            ref={imageContainerRef}
            className="relative bg-gray-200 rounded-lg overflow-hidden w-full"
          >
            <div className="aspect-video sm:aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1]">
              <img 
                src="/app_ss.png" 
                alt="How it works demonstration" 
                className={`w-full h-full object-cover transition-all duration-500 ${isModalVisible ? 'blur-[2px]' : ''}`}
              />
            </div>
            
            {/* Responsive Modal */}
            <div 
              className={`absolute left-1/2 -translate-x-1/2 transform transition-transform duration-700 ease-out bg-gradient-to-t from-purple-600/90 to-purple-600/80 backdrop-blur-sm rounded-t-lg p-4 sm:p-6 text-white ${isModalVisible ? 'translate-y-0' : 'translate-y-full'}`}
              style={{width: '90%', maxWidth: '500px', bottom: '20px'}}
            >
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 animate-fadeIn">
                    100% Healthy
                  </div>
                  <p className="text-sm sm:text-base animate-fadeIn animation-delay-200">
                    Discover nutritious recipes that align perfectly with your health goals
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Obesity Section */}
        <div className="bg-gray-100 p-8 rounded-lg max-w-full mx-auto px-4 sm:px-6 md:px-10">
          <div className="mx-auto max-w-7xl">
            {/* Title and Subtitle */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              <span className="text-purple-600">Obesity</span> in Singapore
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">"A Growing Global Concern"</h2>

            {/* Divider */}
            <div className="w-16 border-b-2 border-gray-800 mb-4"></div>

            {/* Paragraph */}
            <p className="text-gray-700 mb-8">
              Obesity is a growing global issue, with rates more than doubling since 1980. In Singapore, the 2021/2022
              National Population Health Survey revealed a rise in obesity among residents aged 18 to 74, increasing from
              10.5% in 2019/2020 to 11.6% in 2022, with higher rates observed in males and those aged 40 to 49. This trend
              highlights the need for healthier lifestyle choices. Our platform supports this by helping users create
              nutritious meals from available ingredients, promoting balanced eating habits in line with initiatives like "My
              Healthy Plate" to combat rising obesity.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Stat 1 */}
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                  <NumberCounter endValue={11.6} suffix="%" decimals={1} delay={0} />
                </h3>
                <p className="text-gray-600">Crude obesity prevalence in Singapore (2022)</p>
              </div>

              {/* Stat 2 */}
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                  <NumberCounter endValue={40} suffix="-" decimals={0} delay={200} />
                  <NumberCounter endValue={49} suffix=" years" decimals={0} delay={400} />
                </h3>
                <p className="text-gray-600">Age group with highest obesity rates (15%)</p>
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                  <NumberCounter endValue={2} suffix="x" decimals={0} delay={600} />
                </h3>
                <p className="text-gray-600">Global obesity rates since 1980</p>
              </div>
            </div>
          </div>
        </div>

        {/* Healthy Plate Section */}
        <div className="my-10"></div>
        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg max-w-full mx-auto flex flex-col md:flex-row items-center">
          {/* Image */}
          <div className="w-full sm:w-8/12 md:w-3/12 mb-4 md:mb-0 md:mr-6">
            <img 
              src="https://ch-api.healthhub.sg/api/public/content/4635b79d3a70405d9957c9e8e479c623?v=89e95a67"
              alt="Healthy Plate Image" 
              className="rounded-lg shadow-md w-full h-auto object-cover mx-auto min-w-52" 
            />
          </div>
          
          {/* Text content */}
          <div className="w-full md:w-9/12 px-4 sm:px-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">My Healthy Plate Initiative</h2>
            <div className="w-16 border-b-2 border-gray-800 mb-4"></div>
            <p className="text-gray-700 mb-6">
              The "My Healthy Plate" initiative, created by Singapore's Health Promotion Board, provides a simple visual
              guide to encourage balanced, healthy eating. It emphasizes the importance of eating a wide variety of foods in
              the right amounts to meet daily nutritional needs. 
              <br/><br/>
              The concept of "Quarter, Quarter, Half" is a key takeaway:
              a quarter of your plate should be whole grains, a quarter should be good sources of protein, and half should
              be filled with fruits and vegetables. This approach helps individuals maintain a well-balanced diet, manage
              their weight, and reduce the risk of chronic diseases.
            </p>
            <a 
              href="https://www.healthhub.sg/programmes/nutrition-hub/eat-more#my-healthy-plate"
              className="inline-block bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition duration-300"
              target="_blank" 
              rel="noopener noreferrer"
            >
              Find Out More
            </a>
          </div>
        </div>
      </div>

      {/* Add CSS styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;