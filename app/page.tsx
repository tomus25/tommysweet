// @ts-nocheck
"use client";

// In a real Next.js app, also import Tailwind globals, e.g.:
// import "./globals.css";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/*******************
 * Shared constants *
 *******************/
const SERVICES = [
  { name: 'SEO', desc: 'Optimize your visibility and rankings.' },
  { name: 'Paid Media', desc: 'High-performing Google, Meta & TikTok ads.' },
  { name: 'Content', desc: 'Clear copy, blogs, and storytelling.' },
  { name: 'Social Media', desc: 'Grow and engage your audience.' },
  { name: 'AI SEO', desc: 'Scale search with AI-assisted content.' },
  { name: 'Creative', desc: 'Visual identity and campaign design.' },
  { name: 'Analytics', desc: 'Insights that drive better decisions.' },
  { name: 'App Store', desc: 'ASO to boost rankings and installs.' },
  { name: 'Other', desc: 'Tailored solutions for your brand.' }
];

const SOCIALS = ['WhatsApp', 'Telegram', 'Instagram', 'LinkedIn', 'Facebook'];
const CURRENCIES = ['USD', 'EUR', 'AED', 'GBP', 'CHF', 'SAR', 'QAR', 'KWD', 'SGD', 'AUD', 'CAD'];
const SOCIAL_PLACEHOLDER = {
  WhatsApp: 'WhatsApp number (with country code)',
  Telegram: 'Telegram @username',
  Instagram: 'Instagram username',
  LinkedIn: 'LinkedIn profile URL',
  Facebook: 'Facebook profile URL'
};

/*******************
 * Pure helpers     *
 *******************/
function toggleSelection(list, item) {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
function toggleSet(set, key) {
  const next = new Set(set);
  next.has(key) ? next.delete(key) : next.add(key);
  return next;
}
/** Build a Telegram-friendly message (Markdown). */
function buildTelegramMessage(data) {
  const lines = [];
  lines.push(`*New Project Request*`);
  if (data.metaTime || data.metaTz) {
    const when = [data.metaTime, data.metaTz].filter(Boolean).join(' ');
    if (when) lines.push(`*Time:* ${when}`);
  }
  if (data.geoText) lines.push(`*Geo:* ${data.geoText}`);
  if (data.userAgent) lines.push(`*Device:* ${data.userAgent}`);
  lines.push(`*Contact method:* ${data.contactMethod}${data.contactDetail ? ` — ${data.contactDetail}` : ''}`);
  if (data.socialPlatform) lines.push(`*Social platform:* ${data.socialPlatform}`);
  lines.push(`*Name:* ${[data.firstName, data.lastName].filter(Boolean).join(' ')}`);
  if (data.email) lines.push(`*Email:* ${data.email}`);
  if (data.brief) lines.push(`*Brief:* ${data.brief}`);
  const budgetLine = data.budget ? `${data.currency} ${data.budget}` : 'not specified';
  lines.push(`*Budget:* ${data.budgetType} — ${budgetLine}`);
  if (Array.isArray(data.services) && data.services.length) {
    lines.push(`*Selected services:* ${data.services.join(', ')}`);
  }
  return lines.join('\n');
}

/*******************
 * Components       *
 *******************/
function HomeHero({ onWorkClick, onViewCases }) {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dark NYC Skyline background */}
      <div className="absolute inset-0 bg-[url('https://www.royalcitytours.com/wp-content/uploads/2020/07/SKYLINE-NIGHT-2-scaled.jpg')] bg-cover bg-center brightness-[0.25]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-5 sm:px-6">
        <div className="max-w-7xl w-full text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="font-semibold leading-none select-none"
          >
            <span
              className="inline-block text-[clamp(40px,15vw,96px)] bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(180deg, #f3f3f3 0%, #cbb893 50%, #7d6a4f 100%)", fontFamily: 'Cinzel, Playfair Display, serif' }}
            >
              TommySweet
            </span>
          </motion.h1>
          <div className="mt-3 text-[11px] tracking-[0.22em] uppercase text-zinc-400">
            Marketing agency based in New York, Manhattan
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="mt-6 text-lg sm:text-xl text-zinc-300 font-serif italic"
            style={{ fontFamily: 'Cinzel, Playfair Display, serif' }}
          >
            We help you become a brand.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.75 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onWorkClick}
              className="px-6 py-3 rounded-2xl text-base font-medium bg-white/5 hover:bg-white/10 border border-white/10 shadow-lg shadow-black/30 transition"
            >
              Work with us
            </button>
            <button
              onClick={onViewCases}
              className="px-6 py-3 rounded-2xl text-base font-medium bg-gradient-to-b from-[#cbb893] to-[#7d6a4f] text-black hover:brightness-110 shadow-lg shadow-yellow-900/30 transition"
            >
              See case studies
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function WorkWithUs({ onBack, onStartProject }) {
  const [selected, setSelected] = useState([]);
  const [visibleTip, setVisibleTip] = useState(null); // which service tooltip is visible
  const tipTimer = useRef(null);

  const toggle = (name) => setSelected((curr) => curr.includes(name) ? curr.filter(x => x !== name) : [...curr, name]);

  function showTip(name) {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setVisibleTip(name);
    tipTimer.current = setTimeout(() => setVisibleTip(null), 2000); // auto-hide after 2s
  }

  useEffect(() => () => { if (tipTimer.current) clearTimeout(tipTimer.current); }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden px-4 sm:px-6 md:px-12 py-20">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <button
          onClick={onBack}
          className="absolute -top-2 left-0 text-sm text-zinc-400 hover:text-[#cbb893] transition"
        >
          ← Back
        </button>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-[9vw] sm:text-[6vw] md:text-[4.5vw] font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#f2f2f2] via-[#cbb893] to-[#7d6a4f]"
        >
          How can we help you get found?
        </motion.h1>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {SERVICES.map(({ name, desc }) => {
            const isActive = selected.includes(name);
            const isVisible = visibleTip === name;
            return (
              <div key={name} className="relative">
                <button
                  onClick={() => toggle(name)}
                  onMouseEnter={() => showTip(name)}
                  onMouseLeave={() => setVisibleTip(null)}
                  onFocus={() => showTip(name)}
                  onBlur={() => setVisibleTip(null)}
                  onTouchStart={() => showTip(name)} // mobile: show briefly, but don't block tap
                  className={`rounded-2xl px-4 py-3 border w-full text-left transition ${
                    isActive
                      ? 'bg-[#cbb893]/10 border-[#cbb893] shadow-[0_0_8px_rgba(203,184,147,0.3)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  {name}
                </button>
                {isVisible && (
                  <span className="pointer-events-none absolute left-0 top-full mt-2 w-[min(28rem,calc(100vw-4rem))] max-w-full z-50 opacity-100 translate-y-0 transition duration-200 text-[11px] sm:text-xs text-white bg-black rounded-xl px-3 py-2 border border-[#cbb893]/60 shadow-xl shadow-black/80">
                    {desc}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={onStartProject} className="w-full sm:w-auto px-6 py-3 bg-gradient-to-b from-[#cbb893] to-[#7d6a4f] text-black font-medium rounded-2xl hover:brightness-110 shadow-lg shadow-yellow-900/30 transition">
            Start Project
          </button>
          <button onClick={onBack} className="w-full sm:w-auto px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 hover:text-[#cbb893] transition">
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

function Cases({ onBack }) {
  const CARDS = [
    {
      id: 'c1',
      client: 'Luxury Fashion D2C',
      quote: '“From invisible to everywhere — revenue +182% in 6 months.”',
      work: [
        'AI-driven SEO architecture & entity mapping',
        'Paid social restructure (Meta/TikTok) to creative-first',
        'UGC + creator program: 48 assets/month',
        'CVO: landing tests (↑ CVR +31%)'
      ]
    },
    {
      id: 'c2',
      client: 'Fintech App',
      quote: '“CPI down 46%, App Store rank Top-5 in Finance.”',
      work: [
        'ASO: metadata & visuals v2',
        'SKAN-ready paid UA, creative learnings loop',
        'Lifecycle emails & in-app prompts',
        'Attribution sanity dashboard'
      ]
    },
    {
      id: 'c3',
      client: 'Real Estate NYC',
      quote: '“Booked out quarter. +220 qualified leads.”',
      work: [
        'Local SEO + GMB domination',
        'YouTube pre-roll + OTT tests',
        'High-intent landing (Manhattan neighborhoods)'
      ]
    },
    {
      id: 'c4',
      client: 'SaaS B2B',
      quote: '“Pipeline x3. SQLs +138% with same spend.”',
      work: [
        'Content hub & topical authority',
        'LinkedIn ABM + retargeting stages',
        'Demo flow optimization (+24% to-book rate)'
      ]
    }
  ];

  const [open, setOpen] = useState(new Set());
  const toggle = (id) => setOpen((prev) => toggleSet(prev, id));

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-12 py-20">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="mb-6 text-sm text-zinc-400 hover:text-[#cbb893] transition">← Back</button>
        <h1 className="text-4xl sm:text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#f2f2f2] via-[#cbb893] to-[#7d6a4f]">Case Studies</h1>
        <p className="text-zinc-400 mt-2">Click a testimonial to see the work we delivered.</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CARDS.map((card) => {
            const isOpen = open.has(card.id);
            return (
              <div key={card.id} className={`group rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition overflow-hidden`}>
                {/* Square header with client + quote */}
                <button onClick={() => toggle(card.id)} className="w-full aspect-square p-5 text-left">
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">{card.client}</div>
                  <div className="mt-3 text-sm sm:text-base text-zinc-100 leading-relaxed">{card.quote}</div>
                  <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-[#cbb893]">{isOpen ? 'Hide details' : 'Show details'}
                    <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </button>

                {/* Expandable work body */}
                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} bg-black/30`}>
                  <div className="overflow-hidden">
                    <ul className="p-5 space-y-2 text-sm text-zinc-300">
                      {card.work.map((w, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-[#cbb893]" />
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ContactForm({ onBack }) {
  const [contactMethod, setContactMethod] = useState('phone'); // 'phone' | 'social' | 'email'
  const [budgetType, setBudgetType] = useState('monthly'); // 'one-time' | 'monthly'
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [socialPlatform, setSocialPlatform] = useState('WhatsApp');
  const [brief, setBrief] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-resize textarea for project brief
  const briefRef = useRef(null);
  const resizeBrief = () => {
    const el = briefRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };
  useEffect(() => { resizeBrief(); }, [brief]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    // collect client meta
    const metaTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const metaTime = new Date().toISOString();
    const userAgent = navigator.userAgent;

    // best-effort browser geolocation (optional, may be denied)
    async function getGeo() {
      if (!('geolocation' in navigator)) return null;
      const opts = { enableHighAccuracy: false, timeout: 4000, maximumAge: 60000 };
      return await new Promise((resolve) => {
        const done = (val) => resolve(val);
        let settled = false;
        const timer = setTimeout(() => { if (!settled) done(null); }, 4200);
        navigator.geolocation.getCurrentPosition(
          (pos) => { settled = true; clearTimeout(timer); done(pos); },
          () => { settled = true; clearTimeout(timer); done(null); },
          opts
        );
      });
    }

    const geoPos = await getGeo();
    const geoText = geoPos ? `${geoPos.coords.latitude.toFixed(5)}, ${geoPos.coords.longitude.toFixed(5)} (±${Math.round(geoPos.coords.accuracy)}m)` : undefined;

    // derive contact detail depending on method
    let contactDetail = '';
    if (contactMethod === 'phone') contactDetail = phone;
    if (contactMethod === 'email') contactDetail = email;
    if (contactMethod === 'social') contactDetail = socialHandle;

    const payload = {
      contactMethod,
      contactDetail,
      socialPlatform: contactMethod === 'social' ? socialPlatform : undefined,
      firstName,
      lastName,
      email: contactMethod === 'email' ? email : undefined,
      brief,
      budgetType,
      currency,
      budget,
      services: [], // wire from WorkWithUs if needed
      metaTime,
      metaTz,
      userAgent,
      geoText
    };

    const message = buildTelegramMessage(payload);

    try {
      // Client **never** sees BOT_TOKEN or CHAT_ID; we only call our server.
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setErrorMsg(String(err?.message || 'Failed to submit'));
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-zinc-900 to-black" />
      <div className="max-w-lg w-full text-center">
        <button onClick={onBack} className="absolute top-4 left-4 text-sm text-zinc-400 hover:text-[#cbb893] transition">← Back</button>
        <h1 className="text-4xl font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-b from-[#f2f2f2] via-[#cbb893] to-[#7d6a4f]">Work with us</h1>
        <p className="text-zinc-400 mb-8">Fill out the form and choose how you’d like us to contact you.</p>
        <form className="space-y-4 text-left" onSubmit={onSubmit}>
          {/* Contact method selector */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setContactMethod('phone')}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                contactMethod === 'phone'
                  ? 'bg-[#cbb893] text-black border-[#cbb893]'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => setContactMethod('social')}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                contactMethod === 'social'
                  ? 'bg-[#cbb893] text-black border-[#cbb893]'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              Social
            </button>
            <button
              type="button"
              onClick={() => setContactMethod('email')}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                contactMethod === 'email'
                  ? 'bg-[#cbb893] text-black border-[#cbb893]'
                  : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              Email
            </button>
          </div>

          {/* Method-specific fields */}
          {contactMethod === 'phone' && (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number (with country code)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              required
            />
          )}

          {contactMethod === 'social' && (
            <div className="flex gap-2">
              <select
                value={socialPlatform}
                onChange={(e) => setSocialPlatform(e.target.value)}
                className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              >
                {SOCIALS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {socialPlatform === 'WhatsApp' ? (
                <input
                  type="tel"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder={SOCIAL_PLACEHOLDER.WhatsApp}
                  className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
                  required
                />
              ) : (
                <input
                  type="text"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder={SOCIAL_PLACEHOLDER[socialPlatform]}
                  className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
                  required
                />
              )}
            </div>
          )}

          {contactMethod === 'email' && (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              required
            />
          )}

          {/* Name */}
          <div className="flex gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              required
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-1/2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              required
            />
          </div>

          {/* Project brief (auto-resizing textarea) */}
          <textarea
            ref={briefRef}
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            onInput={resizeBrief}
            rows={3}
            placeholder="Briefly describe your project or goal"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893] resize-none overflow-hidden"
            style={{ minHeight: '48px', lineHeight: '1.4' }}
          />

          {/* Budget */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBudgetType('one-time')}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                  budgetType === 'one-time'
                    ? 'bg-[#cbb893] text-black border-[#cbb893]'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                One-time Service
              </button>
              <button
                type="button"
                onClick={() => setBudgetType('monthly')}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                  budgetType === 'monthly'
                    ? 'bg-[#cbb893] text-black border-[#cbb893]'
                    : 'bg-white/5 text-white border-white/10 hover:bg-white/10'
                }`}
              >
                Monthly
              </button>
            </div>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-1/3 bg-white/5 border border-white/10 rounded-xl px-2 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Approx. amount (optional)"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-2/3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#cbb893]"
              />
            </div>
          </div>

          {/* Status */}
          {status === 'ok' && <div className="text-sm text-emerald-400">Thanks! Your request has been sent.</div>}
          {status === 'error' && <div className="text-sm text-red-400">Could not send: {errorMsg}</div>}

          <p className="text-xs text-zinc-500 leading-relaxed mt-4">
            By submitting this form, you agree to be contacted through your preferred communication method. This consent is not required to make a purchase. See our <span className="text-[#cbb893] hover:underline cursor-pointer">Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-b from-[#cbb893] to-[#7d6a4f] text-black font-medium rounded-2xl hover:brightness-110 shadow-lg shadow-yellow-900/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? 'Sending…' : 'Send Request'}
          </button>
        </form>
      </div>
    </div>
  );
}

/*******************
 * App + Smoke tests*
 *******************/
function runTests() {
  console.assert(typeof HomeHero === 'function', 'HomeHero should be defined');
  console.assert(typeof WorkWithUs === 'function', 'WorkWithUs should be defined');
  console.assert(typeof Cases === 'function', 'Cases should be defined');
  console.assert(typeof ContactForm === 'function', 'ContactForm should be defined');

  const afterAdd = toggleSelection(['SEO'], 'Paid Media');
  console.assert(afterAdd.includes('SEO') && afterAdd.includes('Paid Media'), 'toggleSelection add');
  const afterRemove = toggleSelection(afterAdd, 'SEO');
  console.assert(!afterRemove.includes('SEO') && afterRemove.includes('Paid Media'), 'toggleSelection remove');
}

export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'work' | 'cases' | 'form'

  useEffect(() => {
    try { runTests(); } catch {}
  }, []);

  return (
    <>
      {screen === 'home' && (
        <HomeHero
          onWorkClick={() => setScreen('work')}
          onViewCases={() => setScreen('cases')}
        />
      )}
      {screen === 'work' && (
        <WorkWithUs
          onBack={() => setScreen('home')}
          onStartProject={() => setScreen('form')}
        />
      )}
      {screen === 'cases' && (
        <Cases onBack={() => setScreen('home')} />
      )}
      {screen === 'form' && (
        <ContactForm onBack={() => setScreen('work')} />
      )}
    </>
  );
}
