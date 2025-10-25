"use client";

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

// The rest of the component code stays unchanged
