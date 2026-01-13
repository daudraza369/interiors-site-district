'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logoBrandmark from '@/assets/district-brandmark.png'
import logoBrandmarkNightGreen from '@/assets/district-brandmark-night-green.png'
import logoBrandmarkPear from '@/assets/district-brandmark-pear.png'
import logoBrandmarkLavender from '@/assets/district-brandmark-lavender.png'
import logoBrandmarkLavenderTransparent from '@/assets/district-brandmark-lavender-transparent.png'
import logoBrandmarkIvory from '@/assets/district-brandmark-ivory.png'
import logoLockup from '@/assets/district-logo-lockup.png'
import logoLockupNightGreen from '@/assets/district-logo-lockup-night-green.png'

// Pages that have dark hero sections where transparent header works well
const HERO_PAGES = ['/', '/flowers', '/hospitality', '/projects', '/tree-solutions', '/services', '/design', '/collection']

const navItems = [
  { label: 'DISTRICT', href: '/' },
  { label: 'FLOWERS', href: '/flowers' },
  {
    label: 'GREENERY',
    href: '/services',
    children: [
      { label: 'PLANTSCAPING', href: '/services/plantscaping' },
      { label: 'TREE SOLUTIONS', href: '/tree-solutions' },
      { label: 'PLANT MAINTENANCE', href: '/services/maintenance' },
      { label: 'CUSTOM PLANTERS', href: '/services/planters' },
      { label: 'GREEN WALLS', href: '/services/green-walls' },
    ],
  },
  { label: 'DESIGN', href: '/design' },
  { label: 'COLLECTION', href: '/collection' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Determine if current page has a dark hero that works with transparent header
  const hasHeroSection = HERO_PAGES.includes(pathname)
  const shouldUseTransparentHeader = hasHeroSection && !isScrolled
  
  // Flowers page uses ivory/lavender theme
  const isFlowersPage = pathname === '/flowers'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const handleConsultation = () => {
    setIsMobileMenuOpen(false)
    router.push('/contact')
  }

  const handleDropdownItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveDropdown(null)
    router.push(href)
  }

  const handleNavClick = (item: (typeof navItems)[0]) => {
    router.push(item.href)
  }

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ease-out',
          isScrolled || !hasHeroSection
            ? isFlowersPage
              ? 'py-3 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-b border-mauve/10'
              : 'py-3 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border-b border-ivory/20'
            : 'py-5 bg-transparent',
        )}
        style={{
          background:
            isScrolled || !hasHeroSection
              ? isFlowersPage
                ? 'linear-gradient(180deg, hsl(60 30% 96% / 0.85) 0%, hsl(60 30% 98% / 0.8) 100%)'
                : 'linear-gradient(135deg, hsla(60, 3%, 78%, 0.75) 0%, hsla(60, 30%, 98%, 0.6) 50%, hsla(155, 22%, 16%, 0.2) 100%)'
              : 'transparent',
        }}
      >
        <div className="w-full px-6 md:px-10 lg:px-12 xl:px-16">
          <nav className="flex items-center justify-between">
            {/* Logo - Refined sizing for balance */}
            <Link href="/" className="relative z-[60] flex flex-col items-center group shrink-0 w-[44px] md:w-[48px] lg:w-[52px]">
              {/* Flowers page transparent: show ivory brandmark */}
              <Image
                src={logoBrandmarkIvory}
                alt="District Flowers"
                width={52}
                height={44}
                className={cn(
                  'h-9 md:h-10 lg:h-11 w-auto transition-all duration-500',
                  shouldUseTransparentHeader && !isScrolled && isFlowersPage ? 'opacity-100' : 'opacity-0 h-0 absolute',
                )}
              />
              {/* Other pages transparent: show pear brandmark */}
              <Image
                src={logoBrandmarkPear}
                alt="District Interiors"
                width={52}
                height={44}
                className={cn(
                  'h-9 md:h-10 lg:h-11 w-auto transition-all duration-500',
                  shouldUseTransparentHeader && !isScrolled && !isFlowersPage ? 'opacity-100' : 'opacity-0 h-0 absolute',
                )}
              />
              {/* Scrolled flowers page: show lavender transparent brandmark */}
              <Image
                src={logoBrandmarkLavenderTransparent}
                alt="District Flowers"
                width={52}
                height={40}
                className={cn(
                  'h-8 md:h-9 lg:h-10 w-auto transition-all duration-500',
                  (!shouldUseTransparentHeader || isScrolled) && isFlowersPage ? 'opacity-100' : 'opacity-0 h-0 absolute',
                )}
              />
              {/* Scrolled other pages: show night-green brandmark */}
              <Image
                src={logoBrandmarkNightGreen}
                alt="District"
                width={52}
                height={40}
                className={cn(
                  'h-8 md:h-9 lg:h-10 w-auto transition-all duration-500',
                  (!shouldUseTransparentHeader || isScrolled) && !isFlowersPage ? 'opacity-100' : 'opacity-0 h-0 absolute',
                )}
              />
            </Link>

            {/* Desktop Navigation - Centered */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-3 xl:gap-5 2xl:gap-7 px-4 xl:px-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.children ? (
                    <button
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        'flex items-center gap-1 font-nav font-bold uppercase tracking-[0.2em] transition-all duration-300 relative whitespace-nowrap',
                        'text-[13px] xl:text-[14px] 2xl:text-[15px]',
                        'before:absolute before:-bottom-1 before:left-0 before:w-full before:h-[1.5px] before:origin-right before:scale-x-0 before:transition-transform before:duration-300',
                        shouldUseTransparentHeader
                          ? isFlowersPage
                            ? 'text-ivory hover:text-ivory/80 before:bg-ivory'
                            : 'text-ivory hover:text-pear before:bg-pear'
                          : isFlowersPage
                            ? 'text-lavender hover:text-mauve before:bg-lavender'
                            : 'text-night-green hover:text-slate-moss before:bg-night-green',
                        activeDropdown === item.label && (shouldUseTransparentHeader ? (isFlowersPage ? 'text-ivory/80' : 'text-pear') : (isFlowersPage ? 'text-mauve' : 'text-slate-moss')),
                        'hover:before:scale-x-100 hover:before:origin-left',
                      )}
                      style={shouldUseTransparentHeader ? { textShadow: '0 2px 8px rgba(0,0,0,0.4)' } : undefined}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        'flex items-center gap-1 font-nav font-bold uppercase tracking-[0.2em] transition-all duration-300 relative whitespace-nowrap',
                        'text-[13px] xl:text-[14px] 2xl:text-[15px]',
                        'before:absolute before:-bottom-1 before:left-0 before:w-full before:h-[1.5px] before:origin-right before:scale-x-0 before:transition-transform before:duration-300',
                        shouldUseTransparentHeader
                          ? isFlowersPage
                            ? 'text-ivory hover:text-ivory/80 before:bg-ivory'
                            : 'text-ivory hover:text-pear before:bg-pear'
                          : isFlowersPage
                            ? 'text-lavender hover:text-mauve before:bg-lavender'
                            : 'text-night-green hover:text-slate-moss before:bg-night-green',
                        'hover:before:scale-x-100 hover:before:origin-left',
                      )}
                      style={shouldUseTransparentHeader ? { textShadow: '0 2px 8px rgba(0,0,0,0.4)' } : undefined}
                    >
                      {item.label}
                    </button>
                  )}

                  {/* Dropdown */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-[1500]"
                      >
                        {/* Elegant gradient connector */}
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className={cn(
                            'absolute top-1 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-gradient-to-r from-transparent to-transparent',
                            isFlowersPage ? 'via-lavender/60' : 'via-pear/60'
                          )}
                        />
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="relative rounded-lg overflow-hidden min-w-[240px]"
                          style={{
                            background: isFlowersPage
                              ? 'linear-gradient(180deg, hsl(270 33% 72%) 0%, hsl(270 33% 68%) 100%)'
                              : 'linear-gradient(180deg, hsl(155 22% 16%) 0%, hsl(155 22% 20%) 100%)',
                            boxShadow: isFlowersPage
                              ? '0 25px 60px rgba(139,115,168,0.35), 0 10px 25px rgba(139,115,168,0.25), inset 0 1px 0 rgba(255,255,255,0.15)'
                              : '0 25px 60px rgba(0,0,0,0.3), 0 10px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                          }}
                        >
                          {/* Decorative top accent line */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, delay: 0.15 }}
                            className={cn(
                              'h-[2px] bg-gradient-to-r from-transparent to-transparent origin-center',
                              isFlowersPage ? 'via-ivory' : 'via-pear'
                            )}
                          />

                          <div className="py-3">
                            {item.children.map((child, index) => (
                              <motion.button
                                key={child.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                onClick={(e) => handleDropdownItemClick(e, child.href)}
                                className={cn(
                                  'group relative block w-full text-center px-6 py-3.5 text-sm font-nav font-bold uppercase tracking-wider transition-all duration-300',
                                  isFlowersPage
                                    ? 'text-ivory/90 hover:text-ivory'
                                    : 'text-ivory/80 hover:text-pear'
                                )}
                              >
                                {/* Hover background effect */}
                                <span
                                  className={cn(
                                    'absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                                    isFlowersPage ? 'via-ivory/15' : 'via-pear/10'
                                  )}
                                />
                                {/* Left accent bar on hover */}
                                <span
                                  className={cn(
                                    'absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 group-hover:h-6 transition-all duration-300 rounded-r-full',
                                    isFlowersPage ? 'bg-ivory' : 'bg-pear'
                                  )}
                                />
                                {/* Right accent bar on hover (flowers page only) */}
                                {isFlowersPage && (
                                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-ivory group-hover:h-6 transition-all duration-300 rounded-l-full delay-75" />
                                )}
                                <span className="relative">{child.label}</span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Decorative bottom accent line */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className={cn(
                              'h-[2px] bg-gradient-to-r from-transparent to-transparent origin-center',
                              isFlowersPage ? 'via-mauve/60' : 'via-slate-moss/50'
                            )}
                          />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* CTA Button - Fixed width for balance */}
            <div className="hidden lg:flex items-center justify-end w-[240px] xl:w-[260px]">
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  router.push(isFlowersPage ? '/flowers#catalog' : '/projects')
                }}
                className={cn(
                  'font-heading text-[11px] xl:text-xs tracking-[0.15em] uppercase px-4 xl:px-5',
                  'transition-all duration-300 ease-out',
                  'hover:-translate-y-0.5 hover:scale-[1.02]',
                  shouldUseTransparentHeader
                    ? isFlowersPage
                      ? 'bg-ivory/90 text-lavender hover:bg-lavender hover:text-ivory border border-ivory/50 hover:border-lavender shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_30px_rgba(139,115,168,0.4)]'
                      : 'bg-pear/90 text-night-green hover:bg-pear border border-pear/50 shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
                    : isFlowersPage
                      ? 'bg-lavender text-ivory hover:bg-ivory hover:text-lavender border border-lavender/30 hover:border-ivory shadow-[0_4px_20px_rgba(139,115,168,0.3)] hover:shadow-[0_8px_30px_rgba(255,255,255,0.25)]'
                      : 'bg-night-green text-ivory hover:bg-pear hover:text-night-green shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)]',
                )}
                size="sm"
              >
                {isFlowersPage ? 'BUY FLOWERS IN BULK' : 'PORTFOLIO'}
              </Button>
            </div>

            {/* Mobile Menu Button - Only show when menu is closed */}
            {!isMobileMenuOpen && (
              <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
                <Menu
                  className={cn(
                    'w-6 h-6 transition-colors duration-300',
                    shouldUseTransparentHeader 
                      ? 'text-ivory' 
                      : isFlowersPage 
                        ? 'text-lavender' 
                        : 'text-night-green',
                  )}
                />
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Menu - Elite Off-Canvas Experience */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] lg:hidden overflow-hidden"
          >
            {/* Rich gradient background */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1.1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(145deg, hsl(155 22% 18%) 0%, hsl(155 20% 22%) 35%, hsl(155 18% 28%) 65%, hsl(155 15% 32%) 100%)',
              }}
            />

            {/* Decorative gradient orbs */}
            <div
              className="absolute top-[-10%] right-[-10%] w-[60%] h-[50%] opacity-30 blur-3xl"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(72 68% 72% / 0.4) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[40%] opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(72 68% 72% / 0.3) 0%, transparent 70%)',
              }}
            />
            <div
              className="absolute top-[40%] left-[20%] w-[30%] h-[30%] opacity-10 blur-2xl"
              style={{
                background: 'radial-gradient(ellipse at center, hsl(60 30% 97% / 0.2) 0%, transparent 70%)',
              }}
            />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="absolute top-8 right-8 p-3 z-[10000] group"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-pear/10 scale-0 group-hover:scale-[2] transition-transform duration-500" />
                <X className="w-7 h-7 text-ivory/90 relative z-10 transition-all duration-300 group-hover:rotate-90 group-hover:text-pear" />
              </div>
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="absolute top-8 left-8"
            >
              <Image src={logoBrandmarkPear} alt="District Interiors" width={56} height={56} className="h-14 w-auto" />
            </motion.div>

            {/* Menu Content - Centered */}
            <div className="relative flex flex-col items-center justify-center min-h-full px-8 py-28">
              <nav className="w-full max-w-sm">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.2 + index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {/* Gradient separator - before first item */}
                    {index === 0 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="h-[1px] mb-4 origin-center"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent 0%, hsl(72 68% 72% / 0.4) 50%, transparent 100%)',
                        }}
                      />
                    )}

                    <button
                      onClick={() => {
                        handleNavClick(item)
                        setIsMobileMenuOpen(false)
                      }}
                      className="group relative flex items-center justify-center w-full py-4 text-center overflow-hidden rounded-lg transition-all duration-300"
                    >
                      {/* Hover background effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-pear/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      <span className="absolute inset-0 bg-gradient-to-b from-ivory/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                      {/* Side accent bars on hover */}
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 w-0 h-[2px] bg-gradient-to-r from-pear to-transparent group-hover:w-8 transition-all duration-500" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 w-0 h-[2px] bg-gradient-to-l from-pear to-transparent group-hover:w-8 transition-all duration-500" />

                      <span className="relative text-2xl sm:text-3xl font-heading text-ivory/90 tracking-wide uppercase transition-all duration-300 group-hover:text-pear group-hover:tracking-widest">
                        {item.label}
                      </span>
                    </button>

                    {/* Submenu items */}
                    {item.children && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.08 }}
                        className="space-y-1 pb-3"
                      >
                        {item.children.map((child, childIndex) => (
                          <motion.button
                            key={child.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: 0.35 + index * 0.08 + childIndex * 0.05,
                            }}
                            onClick={() => {
                              router.push(child.href)
                              setIsMobileMenuOpen(false)
                            }}
                            className="group/sub relative flex items-center justify-center w-full py-2 text-center overflow-hidden rounded transition-all duration-300"
                          >
                            {/* Subtle hover bg for submenu */}
                            <span className="absolute inset-0 bg-ivory/5 opacity-0 group-hover/sub:opacity-100 transition-opacity duration-300 rounded" />

                            <span className="relative text-sm sm:text-base font-nav text-ivory/60 uppercase tracking-[0.15em] transition-all duration-300 group-hover/sub:text-pear group-hover/sub:tracking-[0.25em]">
                              {child.label}
                            </span>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}

                    {/* Gradient separator - after each item */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
                      className="h-[1px] mt-1 origin-center"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, hsl(72 68% 72% / 0.25) 50%, transparent 100%)',
                      }}
                    />
                  </motion.div>
                ))}
              </nav>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10"
              >
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    router.push('/projects')
                  }}
                  className="relative overflow-hidden group font-heading text-sm tracking-widest uppercase bg-pear text-night-green hover:bg-pear border-0 px-8 py-6 shadow-[0_0_40px_rgba(206,219,115,0.3)] rounded-[6px]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-ivory/30 via-ivory/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center gap-3 font-bold">
                    VIEW OUR PORTFOLIO
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </motion.div>

              {/* Decorative footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <div
                  className="h-[1px] w-24 mx-auto mb-4"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, hsl(72 68% 72% / 0.3) 50%, transparent 100%)',
                  }}
                />
                <p className="text-[11px] font-nav uppercase tracking-[0.3em] text-ivory/40">Crafting Green Spaces</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
