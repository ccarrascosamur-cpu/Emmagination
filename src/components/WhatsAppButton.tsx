import { MessageCircle } from 'lucide-react';
import { useSiteData } from '../lib/site-data-client';

export default function WhatsAppButton() {
  const { data } = useSiteData();
  const whatsappNumber = data.config.contactPhone.replace(/[^\d]/g, '');

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#128C7E] hover:scale-110 transition-all duration-300"
      aria-label="Contactar por WhatsApp"
      style={{
        boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
      }}
    >
      <MessageCircle size={28} />
    </a>
  );
}
