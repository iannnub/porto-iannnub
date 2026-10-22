import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import emailjs from '@emailjs/browser';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { profileData } from '@/data/profile';
import { Send } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { contactSchema, type ContactFormValues } from '@/lib/contactSchema';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [cooldown, setCooldown] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Honeypot bot protection: silent discard
    if (data.botField || cooldown) {
      return;
    }

    setCooldown(true);
    setStatus('loading');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        // Local demo simulation fallback if keys are missing
        setTimeout(() => {
          setStatus('success');
          reset();
          setTimeout(() => {
            setStatus('idle');
            setCooldown(false);
          }, 5000);
        }, 1000);
        return;
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: data.name,
          reply_to: data.email,
          message: data.message,
          to_name: profileData.name,
        },
        publicKey
      );

      setStatus('success');
      reset();

      setTimeout(() => {
        setStatus('idle');
        setCooldown(false);
      }, 5000);
    } catch {
      setStatus('error');
      setCooldown(false);
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionHeading title="Contact" subtitle="Send a signal" />

      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 flex flex-col gap-8">
          <h3 className="font-display text-4xl text-primary drop-shadow-md">Send a Signal</h3>
          <p className="font-sans text-secondary leading-relaxed text-lg">
            I'm currently looking for new opportunities. Whether you have a question or just want to
            say hi, my inbox is always open.
          </p>
          <div className="flex flex-col gap-6 font-mono text-sm mt-4">
            {profileData.socials.linkedin && (
              <a
                href={profileData.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-secondary hover:text-accent-blue transition-all group"
              >
                <div className="w-12 h-12 rounded-full border border-accent-line flex items-center justify-center group-hover:border-accent-blue group-hover:bg-accent-blue/10 transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </div>
                <span className="text-lg">LinkedIn</span>
              </a>
            )}
            <a
              href={`mailto:${profileData.socials.email}`}
              className="flex items-center gap-4 text-secondary hover:text-accent-red transition-all group"
            >
              <div className="w-12 h-12 rounded-full border border-accent-line flex items-center justify-center group-hover:border-accent-red group-hover:bg-accent-red/10 transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-lg">Email Me</span>
            </a>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <Card className="p-8 md:p-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                {...register('botField')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative z-0 w-full group">
                  <input
                    id="name"
                    type="text"
                    placeholder=" "
                    maxLength={80}
                    {...register('name')}
                    className="block py-3 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-accent-line appearance-none focus:outline-none focus:ring-0 focus:border-accent-blue peer font-sans transition-colors"
                  />
                  <label
                    htmlFor="name"
                    className="absolute text-secondary duration-300 transform -translate-y-6 scale-75 top-3 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-accent-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-sans text-lg"
                  >
                    Name
                  </label>
                  {errors.name && (
                    <span className="text-accent-red text-xs absolute -bottom-5">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="relative z-0 w-full group">
                  <input
                    id="email"
                    type="email"
                    placeholder=" "
                    maxLength={120}
                    {...register('email')}
                    className="block py-3 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-accent-line appearance-none focus:outline-none focus:ring-0 focus:border-accent-blue peer font-sans transition-colors"
                  />
                  <label
                    htmlFor="email"
                    className="absolute text-secondary duration-300 transform -translate-y-6 scale-75 top-3 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-accent-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-sans text-lg"
                  >
                    Email
                  </label>
                  {errors.email && (
                    <span className="text-accent-red text-xs absolute -bottom-5">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="relative z-0 w-full group mt-4">
                <textarea
                  id="message"
                  placeholder=" "
                  maxLength={2000}
                  {...register('message')}
                  rows={4}
                  className="block py-3 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-accent-line appearance-none focus:outline-none focus:ring-0 focus:border-accent-blue peer font-sans transition-colors resize-none"
                />
                <label
                  htmlFor="message"
                  className="absolute text-secondary duration-300 transform -translate-y-6 scale-75 top-3 pointer-events-none origin-[0] peer-focus:left-0 peer-focus:text-accent-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-sans text-lg"
                >
                  Message
                </label>
                {errors.message && (
                  <span className="text-accent-red text-xs absolute -bottom-5">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={status === 'loading' || cooldown}
                className="w-full mt-4 font-bold tracking-wider min-h-[48px]"
                aria-live="polite"
              >
                {status === 'loading' && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                )}
                {status === 'loading' && 'SENDING...'}
                {status === 'idle' && (cooldown ? 'PLEASE WAIT (COOLDOWN)' : 'SEND MESSAGE')}
                {status === 'success' && 'SENT SUCCESSFULLY'}
                {status === 'error' && 'FAILED TO SEND'}
              </Button>
              {status === 'success' && (
                <p role="status" className="text-emerald-400 font-mono text-xs text-center">
                  Message delivered. Thank you!
                </p>
              )}
              {status === 'error' && (
                <p role="status" className="text-accent-red font-mono text-xs text-center">
                  Could not deliver message. Please contact directly via email or LinkedIn.
                </p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
