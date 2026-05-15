import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, ExternalLink, FileText } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  pdf?: string;
  description: string;
  url: string;
  services: string[];
  offset: number;
}

interface ProjectPreviewModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectPreviewModal({
  project,
  isOpen,
  onClose,
}: ProjectPreviewModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && project) {
      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );

      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
        },
        '-=0.2'
      );
    }
  }, [isOpen, project]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(containerRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 20,
      duration: 0.25,
      ease: 'power2.in',
    });

    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.15'
    );
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-6 pb-6 px-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* Modal Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full flex flex-col bg-[#0B0F19] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          opacity: 0,
          maxWidth: '1200px',
          maxHeight: 'calc(100vh - 48px)',
        }}
      >
        {/* Browser-style Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#0F1623] shrink-0">
          <div className="flex items-center gap-3">
            {/* Window dots */}
            <div className="flex gap-1.5 mr-3">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <FileText size={16} className="text-white/40" />
            <h3
              className="text-white/90 text-sm font-medium"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h3>
            <span
              className="px-2.5 py-0.5 bg-white/[0.06] rounded-full text-white/40 text-[10px]"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {project.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs rounded-lg transition-colors duration-200"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ExternalLink size={13} />
              Visitar sitio
            </a>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors duration-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer with scroll */}
        <div 
          className="flex-1 relative bg-[#1a1a2e] overflow-auto"
          style={{ minHeight: '400px', maxHeight: '65vh' }}
        >
          {project.pdf ? (
            <iframe
              src={`${project.pdf}#toolbar=1&navpanes=1`}
              title={`${project.title} - PDF`}
              className="w-full"
              style={{ 
                minHeight: '65vh',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <img
                src={project.image}
                alt={project.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>

        {/* Project Details */}
        <div className="px-6 py-5 border-t border-white/[0.06] bg-[#0F1623] shrink-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <h4
                className="text-white text-lg font-medium mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {project.title}
              </h4>
              <p
                className="text-white/50 text-sm"
                style={{ fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
              >
                {project.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <span
                className="text-white/30 text-[10px] uppercase tracking-wider mr-1"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Servicios
              </span>
              {project.services.map((service, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-md text-white/60 text-xs"
                  style={{ fontFamily: 'var(--font-body)' }}
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
