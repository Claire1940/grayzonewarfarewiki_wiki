'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Crosshair,
  DollarSign,
  ExternalLink,
  Gamepad2,
  Heart,
  Key,
  Layers,
  Map,
  MapPin,
  MessageCircle,
  Navigation,
  ShoppingCart,
  Shield,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.grayzonewarfarewiki.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Gray Zone Warfare Wiki",
        description: "Complete Gray Zone Warfare Wiki covering maps, tasks, keys, vendors, weapons, ammo, loot routes, and patch guides for PvE and PvEvP operators on Lamang Island.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Gray Zone Warfare - PvE-First Open-World Tactical Shooter",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Gray Zone Warfare Wiki",
        alternateName: "GZW Wiki",
        url: siteUrl,
        description: "Complete Gray Zone Warfare Wiki resource hub for maps, tasks, keys, vendors, weapons, ammo, and patch guides",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Gray Zone Warfare Wiki - PvE-First Open-World Tactical Shooter",
        },
        sameAs: [
          'https://store.steampowered.com/app/2479810/Gray_Zone_Warfare/',
          'https://discord.com/invite/grayzonewarfare',
          'https://www.reddit.com/r/GrayZoneWarfare/',
          'https://www.grayzonewarfare.com/',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Gray Zone Warfare",
        gamePlatform: ['PC', 'Steam'],
        applicationCategory: 'Game',
        genre: ['Tactical Shooter', 'Extraction Shooter', 'PvE', 'Open World'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 4,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://store.steampowered.com/app/2479810/Gray_Zone_Warfare/',
        },
      },
    ],
  }

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [pvpExpanded, setPvpExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 移动端横幅 Sticky */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('task-guide')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/2479810/Gray_Zone_Warfare/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="CEqmu4QvkKE"
              title="Gray Zone Warfare | Early Access Launch Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionIds = [
                'task-guide', 'interactive-map', 'beginner-guide', 'keys-guide',
                'money-guide', 'weapons-guide', 'ammo-guide', 'vendors-guide',
                'health-system-guide', 'factions-guide', 'armor-guide', 'best-loadouts',
                'pve-vs-pvp-guide', 'locations-guide', 'edition-differences', 'update-roadmap'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Gray Zone Warfare Task Guide */}
      <section id="task-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwTaskGuide']} locale={locale}>
                {t.modules.gzwTaskGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwTaskGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-4">
            {t.modules.gzwTaskGuide.steps.map((step: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                    <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{step.task}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{step.vendor}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{step.area}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1 uppercase tracking-wide">Objectives</p>
                        <ul className="space-y-1">
                          {step.objectives.map((obj: string, oi: number) => (
                            <li key={oi} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] mb-1 uppercase tracking-wide">Rewards</p>
                        <ul className="space-y-1">
                          {step.rewards.map((rew: string, ri: number) => (
                            <li key={ri} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Star className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                              {rew}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic border-l-2 border-[hsl(var(--nav-theme)/0.4)] pl-3">{step.why_it_matters}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Gray Zone Warfare Interactive Map */}
      <section id="interactive-map" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwInteractiveMap']} locale={locale}>
                {t.modules.gzwInteractiveMap.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwInteractiveMap.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.gzwInteractiveMap.items.map((item: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <div className="flex items-start gap-4 p-5 bg-white/5">
                  <MapPin className="w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-mono">{item.label}</span>
                    </div>
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <ul className="space-y-1 mb-3">
                      {item.content.map((c: string, ci: number) => (
                        <li key={ci} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {item.quick_notes.map((note: string, ni: number) => (
                        <span key={ni} className="text-xs px-2 py-1 rounded bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.2)] text-muted-foreground">{note}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Gray Zone Warfare Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwBeginnerGuide']} locale={locale}>
                {t.modules.gzwBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwBeginnerGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gzwBeginnerGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 font-medium">{item.summary}</p>
                <ul className="space-y-1">
                  {item.details.map((d: string, di: number) => (
                    <li key={di} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Gray Zone Warfare Keys Guide */}
      <section id="keys-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwKeysGuide']} locale={locale}>
                {t.modules.gzwKeysGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwKeysGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.gzwKeysGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-3">
                  <Key className="w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold">{item.key_name}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.area}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Find: </span>
                        <span className="text-muted-foreground">{item.where_to_find}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Unlocks: </span>
                        <span className="text-muted-foreground">{item.unlocks}</span>
                      </div>
                      <div>
                        <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Behind: </span>
                        <span className="text-muted-foreground">{item.behind_lock}</span>
                      </div>
                    </div>
                    {item.related_task && (
                      <p className="text-xs text-muted-foreground mt-2 italic">Related task: {item.related_task}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 5: Gray Zone Warfare Money Guide */}
      <section id="money-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <DollarSign className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                {t.modules.gzwMoneyGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwMoneyGuide']} locale={locale}>
                {t.modules.gzwMoneyGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.gzwMoneyGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed">
              {t.modules.gzwMoneyGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.gzwMoneyGuide.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">{item.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{item.summary}</p>
                  <ul className="space-y-1">
                    {item.data_points.map((dp: string, di: number) => (
                      <li key={di} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        {dp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Gray Zone Warfare Weapons Guide */}
      <section id="weapons-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Crosshair className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                {t.modules.gzwWeaponsGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwWeaponsGuide']} locale={locale}>
                {t.modules.gzwWeaponsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.gzwWeaponsGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed">
              {t.modules.gzwWeaponsGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gzwWeaponsGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Crosshair className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.category}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border font-mono">{item.caliber}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{item.fire_mode} {item.fire_rate !== 'N/A' ? `· ${item.fire_rate}` : ''}</p>
                <ul className="space-y-1">
                  {item.notes.map((note: string, ni: number) => (
                    <li key={ni} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Gray Zone Warfare Ammo Guide */}
      <section id="ammo-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <Target className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                {t.modules.gzwAmmoGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwAmmoGuide']} locale={locale}>
                {t.modules.gzwAmmoGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.gzwAmmoGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed">
              {t.modules.gzwAmmoGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.gzwAmmoGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold font-mono">{item.caliber}</h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.weapon_class}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Used by: </span>
                      {item.used_by}
                    </p>
                    <p className="text-xs text-muted-foreground italic">{item.planning_note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 8: Gray Zone Warfare Vendors Guide */}
      <section id="vendors-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] mb-4">
              <ShoppingCart className="w-3.5 h-3.5 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--nav-theme-light))]">
                {t.modules.gzwVendorsGuide.eyebrow}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwVendorsGuide']} locale={locale}>
                {t.modules.gzwVendorsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-3">
              {t.modules.gzwVendorsGuide.subtitle}
            </p>
            <p className="text-sm text-muted-foreground/70 max-w-2xl mx-auto leading-relaxed">
              {t.modules.gzwVendorsGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3">
            {t.modules.gzwVendorsGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-3">
                  <ShoppingCart className="w-5 h-5 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{item.vendor}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Specialty: </span>
                      {item.specialty}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <p className="text-muted-foreground">
                        <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Ranks: </span>
                        {item.rank_thresholds}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="text-[hsl(var(--nav-theme-light))] font-semibold">Unlock: </span>
                        {item.unlock_path}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-[hsl(var(--nav-theme)/0.4)] pl-3">{item.progression_note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 9: Gray Zone Warfare Health System Guide */}
      <section id="health-system-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwHealthSystemGuide']} locale={locale}>
                {t.modules.gzwHealthSystemGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwHealthSystemGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gzwHealthSystemGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">{item.section}</h3>
                </div>
                <ul className="space-y-1">
                  {item.content.map((c: string, ci: number) => (
                    <li key={ci} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Gray Zone Warfare Factions Guide */}
      <section id="factions-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwFactionsGuide']} locale={locale}>
                {t.modules.gzwFactionsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwFactionsGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gzwFactionsGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{item.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                <ul className="space-y-1">
                  {item.highlights.map((h: string, hi: number) => (
                    <li key={hi} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Gray Zone Warfare Armor Guide */}
      <section id="armor-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwArmorGuide']} locale={locale}>
                {t.modules.gzwArmorGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwArmorGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-3 mb-6">
            {t.modules.gzwArmorGuide.rows.map((row: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <h3 className="font-bold">{row.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{row.nij}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-border">{row.type}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <p><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Material: </span>{row.material}</p>
                  <p><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Weight: </span>{row.weight}</p>
                  <p className="md:col-span-2"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Source: </span>{row.how_to_get}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-5 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold">Armor System Notes</h3>
            </div>
            <ul className="space-y-1">
              {t.modules.gzwArmorGuide.notes.map((note: string, ni: number) => (
                <li key={ni} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 12: Gray Zone Warfare Best Loadouts */}
      <section id="best-loadouts" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwBestLoadouts']} locale={locale}>
                {t.modules.gzwBestLoadouts.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwBestLoadouts.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.gzwBestLoadouts.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">{item.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                <ul className="space-y-1">
                  {item.highlights.map((h: string, hi: number) => (
                    <li key={hi} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Gray Zone Warfare PvE vs PvP Guide */}
      <section id="pve-vs-pvp-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Gamepad2 className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['gzwPveVsPvpGuide']} locale={locale}>
                  {t.modules.gzwPveVsPvpGuide.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwPveVsPvpGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-2">
            {/* Column headers */}
            <div className="grid grid-cols-3 gap-3 px-5 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Aspect</p>
              <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] uppercase tracking-wide">Warfare (PvEvP)</p>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Joint Operations (PvE)</p>
            </div>
            {t.modules.gzwPveVsPvpGuide.items.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-3 gap-3 p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <p className="text-sm font-semibold">{item.aspect}</p>
                <p className="text-sm text-muted-foreground">{item.warfare}</p>
                <p className="text-sm text-muted-foreground">{item.joint_operations}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Gray Zone Warfare Locations Guide */}
      <section id="locations-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwLocationsGuide']} locale={locale}>
                {t.modules.gzwLocationsGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwLocationsGuide.intro}
            </p>
          </div>
          <div className="scroll-reveal space-y-6">
            {t.modules.gzwLocationsGuide.sections.map((sec: any, si: number) => (
              <div key={si}>
                <div className="flex items-center gap-2 mb-3">
                  <Navigation className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg">{sec.section}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sec.entries.map((entry: any, ei: number) => (
                    <div key={ei} className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{entry.name}</h4>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{entry.grid}</span>
                      </div>
                      <p className="text-xs text-[hsl(var(--nav-theme-light))] mb-1">{entry.role}</p>
                      <p className="text-xs text-muted-foreground">{entry.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Gray Zone Warfare Edition Differences */}
      <section id="edition-differences" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwEditionDifferences']} locale={locale}>
                {t.modules.gzwEditionDifferences.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwEditionDifferences.intro}
            </p>
          </div>
          <div className="scroll-reveal overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header row */}
              <div className="grid grid-cols-5 gap-2 mb-2 px-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Feature</p>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Standard</p>
                <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] uppercase tracking-wide">Tactical</p>
                <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] uppercase tracking-wide">Elite</p>
                <p className="text-xs font-semibold text-[hsl(var(--nav-theme-light))] uppercase tracking-wide">Supporter</p>
              </div>
              {t.modules.gzwEditionDifferences.items.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-5 gap-2 p-4 mb-2 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <p className="text-sm font-semibold">{item.feature}</p>
                  <p className="text-sm text-muted-foreground">{item.standard}</p>
                  <p className="text-sm text-muted-foreground">{item.tactical}</p>
                  <p className="text-sm text-muted-foreground">{item.elite}</p>
                  <p className="text-sm text-muted-foreground">{item.supporter}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Module 16: Gray Zone Warfare Update Roadmap */}
      <section id="update-roadmap" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['gzwUpdateRoadmap']} locale={locale}>
                {t.modules.gzwUpdateRoadmap.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.gzwUpdateRoadmap.intro}
            </p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.gzwUpdateRoadmap.items.map((item: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.section}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />{item.date}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{item.summary}</p>
                  <ul className="space-y-1">
                    {item.highlights.map((h: string, hi: number) => (
                      <li key={hi} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="w-3 h-3 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/grayzonewarfare"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/GrayZoneWarfare/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/2479810"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/2479810/Gray_Zone_Warfare/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
