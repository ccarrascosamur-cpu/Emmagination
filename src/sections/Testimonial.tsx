import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "El equipo de EMMAGINATION capturó perfectamente la esencia de mi marca personal. Mi landing page no solo se ve profesional, sino que también me ha ayudado a convertir visitantes en clientes de coaching. El proceso fue fluido y el resultado superó mis expectativas.",
    initials: "JA",
    name: "Jaime Ávila",
    role: "Coach & Conferencista",
    company: "jaimeavila.cl",
  },
  {
    id: 2,
    quote: "Transformaron nuestra visión en una experiencia digital que superó todas nuestras expectativas. El equipo de EMMAGINATION entiende perfectamente cómo convertir ideas en realidades digitales impactantes.",
    initials: "FZ",
    name: "Francisco Zamora",
    role: "Gerente Comercial",
    company: "Fegar",
  },
  {
    id: 3,
    quote: "Nuestra tienda online aumentó sus ventas en un 40% después del rediseño. La atención al detalle y la comprensión del negocio que mostró el equipo fue excepcional. Totalmente recomendados.",
    initials: "SM",
    name: "Sofía Martínez",
    role: "Directora de Marketing",
    company: "Sagrada Madre",
  },
];

export default function Testimonial() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1030 0%, #1a1a2e 50%, #0a0a1a 100%)',
        padding: '120px 0',
      }}
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: '#7C3AED', filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#CC26D3', filter: 'blur(120px)' }}
        />
      </div>

      <div
        ref={contentRef}
        className="relative mx-auto text-center opacity-0"
        style={{ maxWidth: '900px', padding: '0 4vw' }}
      >
        {/* Section label */}
        <span
          className="block mb-8"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            fontWeight: 500,
            letterSpacing: '1px',
            color: '#7C3AED',
          }}
        >
          TESTIMONIOS
        </span>

        {/* Quote icon */}
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-10"
          style={{ backgroundColor: '#7C3AED15' }}
        >
          <Quote className="w-8 h-8" style={{ color: '#7C3AED' }} />
        </div>

        {/* Quote text */}
        <blockquote className="mb-10 min-h-[200px] flex items-center justify-center">
          <p
            className="text-white/90 font-light italic leading-relaxed"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(18px, 2.2vw, 26px)',
              lineHeight: 1.6,
            }}
          >
            "{current.quote}"
          </p>
        </blockquote>

        {/* Author */}
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #CC26D3)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {current.initials}
          </div>
          <div>
            <div
              className="text-white font-semibold"
              style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem' }}
            >
              {current.name}
            </div>
            <div
              className="text-white/50 text-sm"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {current.role}, {current.company}
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevTestimonial}
            className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-300"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Dots indicator */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? 'w-6'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                style={index === activeIndex ? { backgroundColor: '#7C3AED' } : {}}
                aria-label={`Ver testimonio ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            className="p-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-300"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
