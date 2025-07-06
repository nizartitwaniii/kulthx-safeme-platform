import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Loading() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Add particles.js script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js";
    script.onload = () => {
      // Initialize particles
      (window as any).particlesJS("particles-js", {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: ["#007aff", "#ff2d55", "#3a506b"] },
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: 2.5, random: true },
          line_linked: {
            enable: true,
            distance: 80,
            color: "#007aff",
            opacity: 0.2,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            random: true,
            straight: false,
            out_mode: "out",
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
          },
          modes: {
            grab: { distance: 100, line_linked: { opacity: 0.3 } },
            push: { particles_nb: 2 },
          },
        },
        retina_detect: true,
      });
    };
    document.head.appendChild(script);

    // Check if real-home is available and redirect
    const checkAndRedirect = async () => {
      try {
        const response = await fetch('/real-home', { method: 'HEAD' });
        if (response.ok) {
          setLocation("/real-home");
        } else {
          setLocation("/home");
        }
      } catch (error) {
        console.error('Error checking real-home:', error);
        // Fallback to regular home after delay
        setTimeout(() => setLocation("/home"), 2000);
      }
    };

    const timer = setTimeout(checkAndRedirect, 3000);

    return () => {
      clearTimeout(timer);
      script.remove();
    };
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 flex flex-col items-center justify-center text-gray-900 relative overflow-hidden">
      {/* Background Video */}
      <video 
        className="fixed top-0 left-0 w-full h-full object-cover z-[-2] opacity-15 blur-sm"
        autoPlay 
        loop 
        muted 
        playsInline
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-background-of-colored-lines-moving-1468-large.mp4" type="video/mp4" />
      </video>

      {/* Background Image */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-[-3] opacity-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1635322969959-661e47b8c97b?auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Particles Container */}
      <div id="particles-js" className="fixed top-0 left-0 w-full h-full z-[-1]" />

      {/* Loading Content */}
      <div className="max-w-lg bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center">
        <div className="loader mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-blue-600 mb-4 tracking-tight">
          🌟 Welcome to KULTHX SAFEME
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Preparing your experience securely...
        </p>
      </div>

      <footer className="absolute bottom-8 text-center text-gray-600">
        © 2025 KULTHX SAFEME | All Rights Reserved ✨
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #007aff;
            border-top: 5px solid #ff2d55;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}
