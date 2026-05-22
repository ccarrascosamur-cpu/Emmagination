import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Eye, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Project } from '../data/projects';
import ProjectPreviewModal from '../components/ProjectPreviewModal';
import { useSiteData } from '../lib/site-data-client';

gsap.registerPlugin(ScrollTrigger);

function LaptopMockup({
  image,
  alt,
  onScreenRef,
}: {
  image: string;
  alt: string;
  onScreenRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div className="relative w-full" style={{ perspective: '1400px' }}>
      <div className="relative mx-auto" style={{ maxWidth: '92%' }}>
        {/* Screen assembly — animated via GSAP */}
        <div
          ref={onScreenRef}
          className="relative rounded-t-2xl p-3 pb-0"
          style={{
            background: 'linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)',
            boxShadow: `
              0 0 0 1px rgba(255,255,255,0.08),
              0 20px 60px -10px rgba(0,0,0,0.6),
              0 40px 80px -20px rgba(0,0,0,0.4)
            `,
            transformOrigin: 'bottom center',
            willChange: 'transform',
          }}
        >
          <div className="flex justify-center mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
          <div
            className="relative rounded-lg overflow-hidden"
            style={{ background: '#000', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: '#f0f0f0' }}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/5" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-black/5" />
              </div>
              <div className="flex-1 mx-3">
                <div
                  className="h-6 rounded-md flex items-center px-3 text-[10px] text-gray-400"
                  style={{ background: '#fff', border: '1px solid #e0e0e0' }}
                >
                  https://www.{alt.toLowerCase().replace(/\s/g, '')}.cl
                </div>
              </div>
            </div>
            <img
              src={image}
              alt={alt}
              className="w-full object-cover"
              style={{ aspectRatio: '16/10' }}
              loading="lazy"
            />
          </div>
        </div>

        {/* Hinge */}
        <div
          className="h-2 mx-auto"
          style={{
            maxWidth: '98%',
            background: 'linear-gradient(180deg, #1a1a1a, #0a0a0a)',
            borderRadius: '0 0 2px 2px',
          }}
        />

        {/* Base */}
        <div
          className="relative mx-auto rounded-b-xl"
          style={{
            maxWidth: '100%',
            height: '14px',
            background: 'linear-gradient(180deg, #2c2c2e 0%, #1c1c1e 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] rounded-full bg-white/10" />
        </div>

        {/* Shadow */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[95%] h-8 rounded-[50%]"
          style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.25) 0%, transparent 70%)' }}
        />
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const screenRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { data } = useSiteData();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recentProjects = data.projects.filter((project) => project.featured).slice(0, 4);

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title fade in
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Cards fade in
      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          }
        );
      });

      // Laptop opening animation (screen rotates from closed to open on scroll)
      screenRefs.current.forEach((screen, i) => {
        if (!screen) return;
        gsap.fromTo(
          screen,
          { rotateX: -72 },
          {
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: cardsRef.current[i],
              start: 'top 85%',
              end: 'center 35%',
              scrub: 1.8,
            },
          }
        );
      });

      // CTA fade in
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="work"
        className="relative w-full overflow-hidden"
        style={{
          padding: '120px 0',
          background: 'radial-gradient(ellipse at 20% 10%, #1a0f2e 0%, #0d0618 40%, #050208 100%)',
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            filter: 'blur(80px)',
            top: '-10%',
            right: '-5%',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(204,38,211,0.12) 0%, transparent 70%)',
            filter: 'blur(100px)',
            bottom: '10%',
            left: '-5%',
          }}
        />

        <div className="mx-auto relative" style={{ maxWidth: '1440px', padding: '0 4vw' }}>
          {/* Section Header */}
          <div className="mb-20">
            <span
              className="block mb-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 500,
                letterSpacing: '1px',
                color: '#CC26D3',
              }}
            >
              PORTAFOLIO
            </span>
            <h2
              ref={titleRef}
              className="text-white opacity-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                letterSpacing: '-1.5px',
                lineHeight: 1.05,
              }}
            >
              PROYECTOS
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #A78BFA 0%, #C084FC 50%, #E879F9 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                DESTACADOS
              </span>
            </h2>
          </div>

          {/* Projects — alternating horizontal layout */}
          <div className="flex flex-col gap-24 lg:gap-32">
            {recentProjects.map((project, index) => (
              <div
                key={project.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className={`group opacity-0 flex flex-col gap-10 items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } lg:gap-16`}
              >
                {/* Laptop mockup — 58% width on desktop */}
                <div className="relative w-full lg:w-[58%] flex-shrink-0">
                  <LaptopMockup
                    image={project.image}
                    alt={project.title}
                    onScreenRef={(el) => { screenRefs.current[index] = el; }}
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <Link
                      to={`/proyectos/${project.slug}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                      style={{ fontFamily: 'var(--font-body)', transitionDelay: '0ms' }}
                    >
                      Caso
                    </Link>
                    {project.pdf && (
                      <button
                        onClick={(e) => { e.stopPropagation(); openProject(project); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                        style={{ fontFamily: 'var(--font-body)', transitionDelay: '60ms' }}
                      >
                        <Eye size={15} />
                        Ver PDF
                      </button>
                    )}
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-black text-sm font-medium transform translate-y-3 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#7C3AED] hover:text-white"
                      style={{ fontFamily: 'var(--font-body)', transitionDelay: '120ms' }}
                    >
                      <ExternalLink size={15} />
                      Visitar
                    </a>
                  </div>
                </div>

                {/* Project info — 42% width on desktop */}
                <div className="w-full lg:w-[42%] flex flex-col justify-center">
                  {/* Project number */}
                  <span
                    className="block mb-5"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(48px, 6vw, 80px)',
                      fontWeight: 700,
                      letterSpacing: '-2px',
                      lineHeight: 1,
                      color: 'rgba(124, 58, 237, 0.15)',
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <h3
                    className="text-white mb-4"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(22px, 2.5vw, 32px)',
                      fontWeight: 700,
                      letterSpacing: '-0.5px',
                      lineHeight: 1.1,
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className="text-white/45 mb-6"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7 }}
                  >
                    {project.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.services.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          background: 'rgba(167, 139, 250, 0.12)',
                          color: '#C084FC',
                          border: '1px solid rgba(167, 139, 250, 0.2)',
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Action links */}
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/proyectos/${project.slug}`}
                      className="inline-flex items-center gap-2 text-white text-sm font-medium border-b border-white/20 pb-0.5 hover:border-[#A78BFA] hover:text-[#A78BFA] transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Ver caso
                      <ArrowUpRight size={14} />
                    </Link>
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/40 text-sm hover:text-white/70 transition-colors duration-300"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      <ExternalLink size={14} />
                      Sitio web
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="flex justify-center mt-24 opacity-0">
            <Link
              to="/portafolio"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#7C3AED]/25"
              style={{
                fontFamily: 'var(--font-body)',
                background: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #A855F7 100%)',
              }}
            >
              Ver todos los proyectos
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <ProjectPreviewModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
