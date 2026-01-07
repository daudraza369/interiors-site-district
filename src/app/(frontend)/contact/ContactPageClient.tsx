'use client'

import { motion } from 'framer-motion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

interface ContactPageClientProps {
  contactPage: any
}

const iconMap = {
  Email: Mail,
  Phone: Phone,
  WhatsApp: MessageCircle,
  Address: MapPin,
}

export function ContactPageClient({ contactPage }: ContactPageClientProps) {
  const heroRef = useScrollAnimation<HTMLElement>()
  const formRef = useScrollAnimation<HTMLElement>()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const heroSection = contactPage?.heroSection
  const contactSection = contactPage?.contactSection
  const contactInfoData = contactSection?.contactInfo

  const contactInfo = contactInfoData
    ? [
        {
          icon: Mail,
          label: 'Email',
          value: contactInfoData.email || 'Sales@district.sa',
          href: `mailto:${contactInfoData.email || 'Sales@district.sa'}`,
        },
        {
          icon: Phone,
          label: 'Phone',
          value: contactInfoData.phone || '+966 056 228 8177',
          href: `tel:${contactInfoData.phone?.replace(/\s/g, '') || '+966562288177'}`,
        },
        {
          icon: MessageCircle,
          label: 'WhatsApp',
          value: contactInfoData.whatsapp || '+966 50 060 6506',
          href: `https://wa.me/${contactInfoData.whatsapp?.replace(/\s/g, '').replace('+', '') || '966500606506'}`,
        },
        {
          icon: MapPin,
          label: 'Address',
          value: contactInfoData.address || 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
          href: contactInfoData.googleMaps || 'https://share.google/OwSIbmaVwv0vXcatO',
        },
      ]
    : []

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      toast({
        title: 'Message sent!',
        description: data.message || "We'll get back to you soon.",
      })

      // Reset form
      setFormData({
        name: '',
        email: '',
        projectType: '',
        message: '',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero Section */}
      {heroSection?.enabled !== false && (
        <section ref={heroRef.ref} className="relative py-32 bg-night-green overflow-hidden" suppressHydrationWarning>
          <div className="absolute inset-0 pattern-overlay opacity-20" suppressHydrationWarning />
          <div className="container-luxury relative z-10 text-center" suppressHydrationWarning>
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-ivory mb-6"
              suppressHydrationWarning
            >
              {heroSection?.headline || 'Contact Us'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={heroRef.isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-stone max-w-2xl mx-auto"
              suppressHydrationWarning
            >
              {heroSection?.description ||
                "Let's bring nature into your space. Connect with our design team to start your project."}
            </motion.p>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {contactSection?.enabled !== false && (
        <section ref={formRef.ref} className="section-padding bg-ivory" suppressHydrationWarning>
          <div className="container-luxury" suppressHydrationWarning>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20" suppressHydrationWarning>
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={formRef.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                suppressHydrationWarning
              >
                <h2 className="text-night-green mb-6" suppressHydrationWarning>
                  {contactSection?.headline || 'Get in Touch'}
                </h2>
                <p className="text-slate-moss mb-10 leading-relaxed" suppressHydrationWarning>
                  {contactSection?.description ||
                    "Whether you're planning a complete transformation or exploring options for your space, we're here to help. Reach out and let's discuss how we can bring your vision to life."}
                </p>

                <div className="space-y-6 mb-10" suppressHydrationWarning>
                  {contactInfo.map((info, index) => (
                    <motion.a
                      key={info.label}
                      href={info.href}
                      target={info.label === 'Address' || info.label === 'WhatsApp' ? '_blank' : undefined}
                      rel={info.label === 'Address' || info.label === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      animate={formRef.isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="flex items-start gap-4 group"
                      suppressHydrationWarning
                    >
                      <div className="w-12 h-12 rounded-sm bg-pear/30 flex items-center justify-center flex-shrink-0 group-hover:bg-pear transition-colors duration-300" suppressHydrationWarning>
                        <info.icon className="w-5 h-5 text-night-green" suppressHydrationWarning />
                      </div>
                      <div suppressHydrationWarning>
                        <span className="text-sm uppercase tracking-wider text-slate-moss/60 block" suppressHydrationWarning>
                          {info.label}
                        </span>
                        <span className="text-night-green group-hover:text-slate-moss transition-colors" suppressHydrationWarning>
                          {info.value}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>

                {/* Social Links */}
                {contactSection?.socialLinks && contactSection.socialLinks.length > 0 && (
                  <div suppressHydrationWarning>
                    <span className="text-sm uppercase tracking-wider text-slate-moss/60 block mb-4" suppressHydrationWarning>
                      Follow Us
                    </span>
                    <div className="flex gap-4" suppressHydrationWarning>
                      {contactSection.socialLinks.map((link: any) => (
                        <a
                          key={link.abbr}
                          href={link.href}
                          target={link.href !== '#' ? '_blank' : undefined}
                          rel={link.href !== '#' ? 'noopener noreferrer' : undefined}
                          className="w-10 h-10 rounded-sm bg-night-green/10 flex items-center justify-center hover:bg-night-green hover:text-ivory transition-colors"
                          suppressHydrationWarning
                        >
                          <span className="text-xs font-semibold" suppressHydrationWarning>{link.abbr}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={formRef.isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                suppressHydrationWarning
              >
                <form onSubmit={handleSubmit} className="bg-stone/20 p-8 md:p-12 rounded-sm" suppressHydrationWarning>
                  <div className="grid md:grid-cols-2 gap-6 mb-6" suppressHydrationWarning>
                    <div suppressHydrationWarning>
                      <label className="block text-sm text-night-green mb-2 uppercase tracking-wider" suppressHydrationWarning>
                        Name *
                      </label>
                      <Input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-ivory"
                        suppressHydrationWarning
                      />
                    </div>
                    <div suppressHydrationWarning>
                      <label className="block text-sm text-night-green mb-2 uppercase tracking-wider" suppressHydrationWarning>
                        Email *
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-ivory"
                        suppressHydrationWarning
                      />
                    </div>
                  </div>
                  <div className="mb-6" suppressHydrationWarning>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider" suppressHydrationWarning>
                      Project Type
                    </label>
                    <Select value={formData.projectType} onValueChange={(value) => setFormData({ ...formData, projectType: value })}>
                      <SelectTrigger className="bg-ivory" suppressHydrationWarning>
                        <SelectValue placeholder="Select a service..." suppressHydrationWarning />
                      </SelectTrigger>
                      <SelectContent suppressHydrationWarning>
                        {contactSection?.projectTypes?.map((option: any) => {
                          // Skip options with empty values (they're handled by placeholder)
                          if (!option.value || option.value === '') return null
                          return (
                            <SelectItem key={option.value} value={option.value} suppressHydrationWarning>
                              {option.label}
                            </SelectItem>
                          )
                        }) || (
                          <>
                            <SelectItem value="plantscaping" suppressHydrationWarning>Plantscaping</SelectItem>
                            <SelectItem value="tree-customization" suppressHydrationWarning>Tree Customization</SelectItem>
                            <SelectItem value="tree-restoration" suppressHydrationWarning>Tree Restoration</SelectItem>
                            <SelectItem value="green-walls" suppressHydrationWarning>Green Walls</SelectItem>
                            <SelectItem value="planters" suppressHydrationWarning>Custom Planter Design</SelectItem>
                            <SelectItem value="maintenance" suppressHydrationWarning>Maintenance</SelectItem>
                            <SelectItem value="other" suppressHydrationWarning>Other</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="mb-8" suppressHydrationWarning>
                    <label className="block text-sm text-night-green mb-2 uppercase tracking-wider" suppressHydrationWarning>
                      Message
                    </label>
                    <Textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      className="bg-ivory resize-none"
                      suppressHydrationWarning
                    />
                  </div>
                  <Button variant="default" size="lg" className="w-full" disabled={isSubmitting} suppressHydrationWarning>
                    {isSubmitting ? 'Sending...' : contactSection?.formButtonText || 'Send Message'}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

