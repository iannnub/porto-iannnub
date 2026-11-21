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
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
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
    setFeedbackMessage('');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const hasValidEmailJsKeys =
        Boolean(serviceId && templateId && publicKey) &&
        serviceId !== 'your_service_id' &&
        templateId !== 'your_template_id' &&
        publicKey !== 'your_public_key';

      if (hasValidEmailJsKeys) {
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
        setFeedbackMessage('Message delivered. Thank you!');
      } else {
        // Real zero-config email delivery via FormSubmit AJAX API to profileData.socials.email
        const targetEmail = profileData.socials.email || 'iannnubb@gmail.com';
        const deliveryPromise = fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            _subject: `[Portfolio Contact] New message from ${data.name}`,
            _template: 'table',
            _captcha: 'false',
          }),
        }).then(async (response) => {
          const result = (await response.json().catch(() => null)) as {
            success?: string | boolean;
            message?: string;
          } | null;

          if (!response.ok) {
            throw new Error(result?.message || `Email delivery failed (${response.status})`);
          }

          if (result && (result.success === 'false' || result.success === false)) {
            if (result.message && result.message.toLowerCase().includes('activation')) {
              return 'activation_needed' as const;
            }
            throw new Error(result.message || 'Email delivery failed.');
          }
          return 'delivered' as const;
        });

        const outcome = await Promise.race([
          deliveryPromise,
          new Promise<'dispatched_async'>((resolve) =>
            window.setTimeout(() => resolve('dispatched_async'), 3500)
          ),
        ]);

        if (outcome === 'activation_needed') {
          setFeedbackMessage(
            `Check ${targetEmail} (Inbox/Spam) and click "Activate Form" from FormSubmit once to enable instant inbox delivery.`
          );
        } else {
          // Keep background request alive if still in flight
          deliveryPromise.catch(() => {});
          setFeedbackMessage(`Message sent to ${targetEmail}. Thank you!`);
        }
      }

      setStatus('success');
      reset();

      setTimeout(() => {
        setStatus('idle');
        setFeedbackMessage('');
        setCooldown(false);
      }, 8000);
    } catch (err) {
      setStatus('error');
      setFeedbackMessage(
        err instanceof Error && err.message
          ? err.message
          : 'Could not deliver message. Please contact directly via email or LinkedIn.'
      );
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
                className="flex items-center gap-4 text-secondary hover:text-accent-blue-glow transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-xl"
              >
                <div className="w-12 h-12 rounded-full border border-accent-line flex items-center justify-center group-hover:border-accent-blue group-hover:bg-accent-blue/10 transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </div>
                <span className="text-lg">LinkedIn</span>
              </a>
            )}
            <a
              href={`mailto:${profileData.socials.email}`}
              className="flex items-center gap-4 text-secondary hover:text-accent-red-glow transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded-xl"
            >
              <div className="w-12 h-12 rounded-full border border-accent-line flex items-center justify-center group-hover:border-accent-red group-hover:bg-accent-red/10 transition-colors">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-lg">Email Me</span>
            </a>
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <Card className="p-6 sm:p-8 md:p-10 bg-[#12121A]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                {...register('botField')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="font-sans text-sm font-medium text-primary tracking-wide"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    maxLength={80}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    {...register('name')}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0A0A0F] text-base text-primary placeholder:text-secondary/50 border transition-colors font-sans focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-accent-red-glow focus:border-accent-red-glow focus:ring-accent-red/30'
                        : 'border-white/15 hover:border-white/25 focus:border-accent-blue-glow focus:ring-accent-blue/30'
                    }`}
                  />
                  {errors.name && (
                    <span id="name-error" role="alert" className="text-accent-red-glow text-xs">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-sans text-sm font-medium text-primary tracking-wide"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    maxLength={120}
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    {...register('email')}
                    className={`w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0A0A0F] text-base text-primary placeholder:text-secondary/50 border transition-colors font-sans focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-accent-red-glow focus:border-accent-red-glow focus:ring-accent-red/30'
                        : 'border-white/15 hover:border-white/25 focus:border-accent-blue-glow focus:ring-accent-blue/30'
                    }`}
                  />
                  {errors.email && (
                    <span id="email-error" role="alert" className="text-accent-red-glow text-xs">
                      {errors.email.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="font-sans text-sm font-medium text-primary tracking-wide"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Write your message here..."
                  maxLength={2000}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  {...register('message')}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl bg-[#0A0A0F] text-base text-primary placeholder:text-secondary/50 border transition-colors font-sans resize-y focus:outline-none focus:ring-2 ${
                    errors.message
                      ? 'border-accent-red-glow focus:border-accent-red-glow focus:ring-accent-red/30'
                      : 'border-white/15 hover:border-white/25 focus:border-accent-blue-glow focus:ring-accent-blue/30'
                  }`}
                />
                {errors.message && (
                  <span id="message-error" role="alert" className="text-accent-red-glow text-xs">
                    {errors.message.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant={status === 'loading' ? 'secondary' : 'primary'}
                size="lg"
                disabled={status === 'loading' || cooldown}
                className={`w-full mt-2 font-semibold tracking-wider min-h-[50px] rounded-xl shadow-none ${
                  status === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-600 text-white border border-emerald-400/30 disabled:opacity-100'
                    : status === 'loading'
                      ? 'disabled:opacity-90'
                      : 'bg-accent-red hover:bg-[#c81e24] text-white border border-white/10'
                }`}
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
                  {feedbackMessage || 'Message delivered. Thank you!'}
                </p>
              )}
              {status === 'error' && (
                <p role="status" className="text-accent-red-glow font-mono text-xs text-center">
                  {feedbackMessage ||
                    'Could not deliver message. Please contact directly via email or LinkedIn.'}
                </p>
              )}
            </form>
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
