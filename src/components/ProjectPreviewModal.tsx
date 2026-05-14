import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, ExternalLink, Monitor } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
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
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setIsLoading(true);
      setIframeError(false);

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

  const handleIframeLoad = () => {
    setIsLoading(false);
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
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-8 pb-8 px-4">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* Modal Container - Full width like a browser window */}
      <div
        ref={containerRef}
        className="relative z-10 w-full flex flex-col bg-[#0B0F19] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{
          opacity: 0,
          maxWidth: '1400px',
          height: 'calc(100vh - 64px)',
        }}
      >
        {/* Browser-style Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#0F1623]">
          <div className="flex items-center gap-3">
            {/* Window dots */}
            <div className="flex gap-1.5 mr-3">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <Monitor size={16} className="text-white/40" />
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

        {/* URL Bar */}
        <div className="px-5 py-2 border-b border-white/[0.06] bg-[#0F1623] flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 bg-black/30 rounded-lg border border-white/[0.06]">
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span
              className="text-white/40 text-xs truncate"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {project.url}
            </span>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {isLoading && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F19]">
              <div className="relative">
                <div className="w-12 h-12 border-2 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin" />
              </div>
              <p
                className="text-white/40 text-sm mt-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Cargando preview...
              </p>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B0F19] px-8">
              <img
                src={project.image}
                alt={project.title}
                className="w-full max-w-3xl rounded-xl mb-6 object-cover shadow-2xl"
                style={{ maxHeight: '55vh' }}
              />
              <p
                className="text-white/50 text-center mb-5"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Este sitio no permite previsualización directa.
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full transition-colors duration-200"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                <ExternalLink size={16} />
                Visitar sitio web
              </a>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={project.url}
              title={project.title}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              onLoad={handleIframeLoad}
              style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.4s ease',
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] bg-[#0F1623]">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-white/30 text-[10px] uppercase tracking-wider mr-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Servicios
            </span>
            {project.services.map((service, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.06] rounded-md text-white/50 text-[11px]"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
