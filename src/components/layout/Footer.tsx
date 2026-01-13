'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import logo from '@/assets/district-logo.png'
import logoBrandmarkLavender from '@/assets/district-brandmark-lavender-transparent.png'

const contactInfo = {
  email: 'Sales@district.sa',
  phone: '+966 056 228 8177',
  whatsapp: '+966 50 060 6506',
  address: 'Al Zoubair Ibn Al Awwam, Ar Rawabi, Riyadh 14214',
  googleMaps: 'https://share.google/OwSIbmaVwv0vXcatO',
}

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/districtflora', abbr: 'IG' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@districtflora', abbr: 'TT' },
  { label: 'Snapchat', href: '#', abbr: 'SC' },
]

export function Footer() {
  const pathname = usePathname()
  const isFlowersPage = pathname === '/flowers'

  return (
    <footer
      className={cn(
        'py-16 px-6 md:px-12 lg:px-20 transition-colors duration-500',
        isFlowersPage ? 'bg-lavender' : 'bg-night-green'
      )}
    >
      <div className="container-luxury">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            {isFlowersPage ? (
              <Image
                src={logoBrandmarkLavender}
                alt="District Flowers"
                width={200}
                height={64}
                className="h-16 w-auto mb-6 brightness-0 invert"
              />
            ) : (
              <Image
                src={logo}
                alt="District Interiors"
                width={200}
                height={64}
                className="h-16 w-auto mb-6 brightness-0 invert"
              />
            )}
            <p
              className={cn(
                'max-w-md leading-relaxed mb-6',
                isFlowersPage ? 'text-ivory/80' : 'text-stone/80'
              )}
            >
              {isFlowersPage
                ? "Premium wholesale flowers, fresh from source. Trusted supplier to Saudi Arabia's finest hotels and event planners."
                : 'Transforming spaces through expert plantscaping, luxury softscaping, and custom tree fabrication.'}
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-300',
                    isFlowersPage
                      ? 'bg-ivory/15 hover:bg-ivory group'
                      : 'bg-ivory/10 hover:bg-pear group'
                  )}
                  aria-label={social.label}
                >
                  <span
                    className={cn(
                      'text-xs font-semibold transition-colors duration-300',
                      isFlowersPage
                        ? 'text-ivory group-hover:text-lavender'
                        : 'text-ivory group-hover:text-night-green'
                    )}
                  >
                    {social.abbr}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-ivory mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className={cn(
                    'flex items-start gap-3 transition-colors duration-300',
                    isFlowersPage ? 'text-ivory/70 hover:text-ivory' : 'text-stone/80 hover:text-pear'
                  )}
                >
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className={cn(
                    'flex items-start gap-3 transition-colors duration-300',
                    isFlowersPage ? 'text-ivory/70 hover:text-ivory' : 'text-stone/80 hover:text-pear'
                  )}
                >
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp.replace(/\s/g, '').replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-start gap-3 transition-colors duration-300',
                    isFlowersPage ? 'text-ivory/70 hover:text-ivory' : 'text-stone/80 hover:text-pear'
                  )}
                >
                  <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>WhatsApp: {contactInfo.whatsapp}</span>
                </a>
              </li>
              <li>
                <a
                  href={contactInfo.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-start gap-3 transition-colors duration-300',
                    isFlowersPage ? 'text-ivory/70 hover:text-ivory' : 'text-stone/80 hover:text-pear'
                  )}
                >
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>{contactInfo.address}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-ivory mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Services', 'Collection', 'Projects', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase()}`}
                    className={cn(
                      'transition-colors duration-300',
                      isFlowersPage ? 'text-ivory/70 hover:text-ivory' : 'text-stone/80 hover:text-pear'
                    )}
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-ivory mb-6">{isFlowersPage ? 'Flower Services' : 'Services'}</h4>
            <ul className="space-y-3">
              {isFlowersPage ? (
                <>
                  {[
                    { label: 'Wholesale Flowers', href: '/flowers#catalog' },
                    { label: 'Event Floristry', href: '/flowers#events' },
                    { label: 'Hotel Partnerships', href: '/flowers#hotels' },
                    { label: 'Weekly Subscriptions', href: '/flowers#subscriptions' },
                    { label: 'Bulk Orders', href: '/flowers#bulk' },
                  ].map((service) => (
                    <li key={service.label}>
                      <Link
                        href={service.href}
                        className="text-ivory/70 hover:text-ivory transition-colors duration-300"
                      >
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { label: 'Plantscaping', href: '/services/plantscaping' },
                    { label: 'Tree Customization', href: '/services/tree-customization' },
                    { label: 'Tree Restoration', href: '/services/tree-restoration' },
                    { label: 'Green Walls', href: '/services/green-walls' },
                    { label: 'Custom Planter Design', href: '/services/planters' },
                    { label: 'Maintenance', href: '/services/maintenance' },
                  ].map((service) => (
                    <li key={service.label}>
                      <Link
                        href={service.href}
                        className="text-stone/80 hover:text-pear transition-colors duration-300"
                      >
                        {service.label}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={cn(
            'pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4',
            isFlowersPage ? 'border-ivory/20' : 'border-ivory/10'
          )}
        >
          <p
            className={cn(
              'text-sm',
              isFlowersPage ? 'text-ivory/50' : 'text-stone/60'
            )}
          >
            © {new Date().getFullYear()} {isFlowersPage ? 'District Flowers' : 'District Interiors'}. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className={cn(
                'text-sm transition-colors',
                isFlowersPage ? 'text-ivory/50 hover:text-ivory' : 'text-stone/60 hover:text-pear'
              )}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className={cn(
                'text-sm transition-colors',
                isFlowersPage ? 'text-ivory/50 hover:text-ivory' : 'text-stone/60 hover:text-pear'
              )}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}





