import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, ExternalLink, Loader2 } from 'lucide-react';

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
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (isOpen && project) {
      setIsLoading(true);
      setIframeError(false);

      // Opening animation
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );

      tl.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.9, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.15'
      );
    }
  }, [isOpen, project]);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: onClose,
    });

    tl.to(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.2,
      ease: 'power2.in',
    });

    tl.to(
      overlayRef.current,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      },
      '-=0.1'
    );
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setIframeError(true);
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* Modal Container */}
      <div
        ref={containerRef}
        className="relative z-10 w-full mx-4 flex flex-col bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          opacity: 0,
          maxWidth: '1200px',
          maxHeight: '90vh',
          height: '85vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F172A]">
          <div className="flex items-center gap-4">
            <h3
              className="text-white text-lg font-semibold"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {project.title}
            </h3>
            <span
              className="px-3 py-1 bg-white/10 rounded-full text-white/60 text-xs"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {project.category}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] hover:bg-[#CC26D3] text-white text-sm rounded-full transition-colors duration-300"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <ExternalLink size={14} />
              Visitar sitio
            </a>
            <button
              onClick={handleClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors duration-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {isLoading && !iframeError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A]">
              <Loader2 size={40} className="text-[#7C3AED] animate-spin mb-4" />
              <p
                className="text-white/60 text-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Cargando {project.title}...
              </p>
            </div>
          )}

          {iframeError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A] px-8">
              <img
                src={project.image}
                alt={project.title}
                className="w-full max-w-2xl h-auto rounded-lg mb-6 object-cover"
                style={{ maxHeight: '50vh' }}
              />
              <p
                className="text-white/60 text-center mb-4"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Este sitio no permite previsualización en iframe.
              </p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#7C3AED] hover:bg-[#CC26D3] text-white rounded-full transition-colors duration-300"
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
              onError={handleIframeError}
              style={{
                opacity: isLoading ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#0F172A]">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-white/40 text-xs mr-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              SERVICIOS:
            </span>
            {project.services.map((service, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-white/70 text-xs"
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
