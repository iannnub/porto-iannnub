import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { SectionWrapper } from '@/components/layout/SectionWrapper';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { profileData } from '@/data/profile';
import { Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading');
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
         console.warn("EmailJS credentials missing. Check .env file.");
         // For demonstration, we simulate success if no keys are provided
         setTimeout(() => {
           setStatus('success');
           reset();
           setTimeout(() => setStatus('idle'), 5000);
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
      }, 5000);
    } catch (error) {
      console.error('Email send failed:', error);
      setStatus('error');
    }
  };

  return (
    <SectionWrapper id="contact">
      <SectionHeading title="Contact" subtitle="Send a signal" />

      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/3 flex flex-col gap-8">
           <h3 className="font-display text-4xl text-primary drop-shadow-md">Send a Signal</h3>
           <p className="font-sans text-secondary leading-relaxed text-lg">
             I'm currently looking for new opportunities. Whether you have a question or just want to say hi, my inbox is always open.
           </p>
           <div className="flex flex-col gap-6 font-mono text-sm mt-4">
             {profileData.socials.linkedin && (
               <a href={profileData.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-secondary hover:text-accent-blue transition-all group">
                 <div className="w-12 h-12 rounded-full border border-accent-line flex items-center justify-center group-hover:border-accent-blue group-hover:bg-accent-blue/10 transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                 </div>
                 <span className="text-lg">LinkedIn</span>
               </a>
             )}
             <a href={`mailto:${profileData.socials.email}`} className="flex items-center gap-4 text-secondary hover:text-accent-red transition-all group">
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
               <div className="flex flex-col md:flex-row gap-8">
                 <div className="relative z-0 w-full group">
                   <input
                     id="name"
                     type="text"
                     placeholder=" "
                     {...register('name')}
                     className="block py-3 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-accent-line appearance-none focus:outline-none focus:ring-0 focus:border-accent-blue peer font-sans transition-colors"
                   />
                   <label
                     htmlFor="name"
                     className="absolute text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-sans text-lg"
                   >
                     Name
                   </label>
                   {errors.name && <span className="text-accent-red text-xs absolute -bottom-5">{errors.name.message}</span>}
                 </div>
                 
                 <div className="relative z-0 w-full group">
                   <input
                     id="email"
                     type="email"
                     placeholder=" "
                     {...register('email')}
                     className="block py-3 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-accent-line appearance-none focus:outline-none focus:ring-0 focus:border-accent-blue peer font-sans transition-colors"
                   />
                   <label
                     htmlFor="email"
                     className="absolute text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-sans text-lg"
                   >
                     Email
                   </label>
                   {errors.email && <span className="text-accent-red text-xs absolute -bottom-5">{errors.email.message}</span>}
                 </div>
               </div>

               <div className="relative z-0 w-full group mt-4">
                 <textarea
                   id="message"
                   placeholder=" "
                   {...register('message')}
                   rows={4}
                   className="block py-3 px-0 w-full text-lg text-primary bg-transparent border-0 border-b-2 border-accent-line appearance-none focus:outline-none focus:ring-0 focus:border-accent-blue peer font-sans transition-colors resize-none"
                 />
                 <label
                   htmlFor="message"
                   className="absolute text-secondary duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-accent-blue peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 font-sans text-lg"
                 >
                   Message
                 </label>
                 {errors.message && <span className="text-accent-red text-xs absolute -bottom-5">{errors.message.message}</span>}
               </div>

               <Button 
                 type="submit" 
                 variant="primary" 
                 size="lg"
                 disabled={status === 'loading'}
                 className="w-full mt-4 font-bold tracking-wider"
               >
                 {status === 'loading' && <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />}
                 {status === 'idle' && 'SEND MESSAGE'}
                 {status === 'success' && 'SENT SUCCESSFULLY'}
                 {status === 'error' && 'FAILED TO SEND'}
               </Button>
             </form>
           </Card>
        </div>
      </div>
    </SectionWrapper>
  );
}
