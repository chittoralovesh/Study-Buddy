import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function AnimatedOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.2}>
        <MeshDistortMaterial
          color="#0ea5e9"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
        delay: 0.2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full bg-[#050816] text-white" ref={containerRef}>
      {/* 3D Background */}
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
          <AnimatedOrb />
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference">
        <div className="text-2xl font-bold tracking-tighter">StudyBuddy<span className="text-[#0ea5e9]">.</span></div>
        <div className="flex gap-6 items-center">
          <Link to="/login" className="font-medium hover:text-[#0ea5e9] transition-colors">Log in</Link>
          <Link to="/register" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors font-medium">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ y, opacity }}
        className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20"
      >
        <div ref={textRef} className="max-w-5xl mx-auto">
          <h1 className="hero-text text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
            Your AI-Powered <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0ea5e9] to-[#8b5cf6]">
              Study Universe
            </span>
          </h1>
          <p className="hero-text text-xl md:text-2xl opacity-70 max-w-2xl mx-auto mb-12 font-light">
            Upload notes. Learn faster. Ace exams. An intelligent futuristic learning assistant designed to help you study smarter.
          </p>
          <div className="hero-text flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link 
              to="/register" 
              className="px-10 py-5 bg-white text-black rounded-full text-lg font-bold hover:scale-105 transition-transform"
            >
              Start Learning Now
            </Link>
            <a 
              href="#features" 
              className="px-10 py-5 rounded-full text-lg font-medium border border-white/20 hover:bg-white/5 transition-colors"
            >
              Explore Features
            </a>
          </div>
        </div>
      </motion.section>

      {/* Features Section (Placeholder for scroll) */}
      <section id="features" className="relative z-10 min-h-screen bg-[#050816]/80 backdrop-blur-3xl py-32 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-20 text-center">
            Supercharge your <br/><span className="text-gradient">Brain Power</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Smart Summaries", desc: "Upload PDFs. Our AI extracts the core concepts." },
              { title: "Adaptive Quizzes", desc: "Test your knowledge with automatically generated MCQs." },
              { title: "Study Planner", desc: "Get a personalized, ML-driven schedule to optimize your time." }
            ].map((f, i) => (
              <div key={i} className="glass p-10 rounded-[2rem] hover:-translate-y-2 transition-transform duration-500">
                <h3 className="text-3xl font-bold mb-4">{f.title}</h3>
                <p className="text-lg opacity-70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
