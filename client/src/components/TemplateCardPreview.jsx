import React from 'react';

/*
  Premium SVG presentation cover previews — one unique design per template.
  ViewBox: 0 0 480 270 (16:9)
  All IDs are prefixed with the template id to avoid DOM conflicts.
*/

const S = { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' };

const SLIDE_DESIGNS = {

  /* ── 1. CORPORATE ────────────────────────────── */
  corporate: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e3a5f"/><stop offset="100%" stopColor="#0f1f38"/></linearGradient>
        <linearGradient id={`${p}ac`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <polygon points="290,0 480,0 480,270 255,270" fill="#0a192e" opacity="0.6"/>
      <polygon points="265,0 295,0 260,270 230,270" fill={`url(#${p}ac)`} opacity="0.45"/>
      <rect x="0" y="0" width="480" height="3" fill="#3b82f6"/>
      <rect x="40" y="30" width="3" height="130" fill="#3b82f6" opacity="0.5"/>
      <circle cx="400" cy="80" r="90" fill="none" stroke="#3b82f6" strokeWidth="0.8" opacity="0.15"/>
      <circle cx="400" cy="80" r="65" fill="none" stroke="#3b82f6" strokeWidth="0.6" opacity="0.12"/>
      <circle cx="400" cy="80" r="40" fill="rgba(59,130,246,0.06)"/>
      <ellipse cx="400" cy="80" rx="65" ry="32" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.1"/>
      <line x1="400" y1="15" x2="400" y2="145" stroke="#3b82f6" strokeWidth="0.5" opacity="0.1"/>
      <rect x="56" y="46" width="95" height="15" rx="2" fill="rgba(59,130,246,0.2)"/>
      <text x="63" y="57" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="#3b82f6" letterSpacing="2">COMPANY NAME</text>
      <text x="56" y="94" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="27" fill="white">CORPORATE</text>
      <text x="56" y="122" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="27" fill="white">PRESENTATION</text>
      <text x="56" y="141" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="9" fill="rgba(255,255,255,0.5)" letterSpacing="2.5">ANNUAL REPORT · Q4 2025</text>
      <rect x="56" y="153" width="200" height="1" fill="rgba(255,255,255,0.1)"/>
      <text x="56" y="174" fontFamily="Arial,sans-serif" fontSize="7" fill="rgba(255,255,255,0.3)" letterSpacing="1">PERFORMANCE OVERVIEW</text>
      {[0,1,2,3,4,5,6].map((i,_,a) => { const h=[42,57,35,59,72,50,64][i]; return <rect key={i} x={56+i*19} y={257-h} width="14" height={h} fill="#3b82f6" opacity={0.45+i*0.07} rx="1"/>; })}
      <text x="340" y="255" fontFamily="Arial,sans-serif" fontSize="7.5" fill="rgba(255,255,255,0.2)">Prepared by Executive Team · 2025</text>
    </svg>
  ),

  /* ── 2. STARTUP PITCH ────────────────────────── */
  startup: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <radialGradient id={`${p}o1`} cx="75%" cy="20%" r="60%"><stop offset="0%" stopColor="#818cf8" stopOpacity="0.55"/><stop offset="100%" stopColor="#0f0f1a" stopOpacity="0"/></radialGradient>
        <radialGradient id={`${p}o2`} cx="25%" cy="85%" r="45%"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.35"/><stop offset="100%" stopColor="#0f0f1a" stopOpacity="0"/></radialGradient>
        <linearGradient id={`${p}tt`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ffffff"/><stop offset="100%" stopColor="#a5b4fc"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill="#0f0f1a"/>
      <rect width="480" height="270" fill={`url(#${p}o1)`}/>
      <rect width="480" height="270" fill={`url(#${p}o2)`}/>
      {[0,60,120,180,240,300,360,420,480].map(x=><line key={x} x1={x} y1="0" x2={x} y2="270" stroke="#6366f1" strokeWidth="0.35" opacity="0.1"/>)}
      {[0,54,108,162,216,270].map(y=><line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#6366f1" strokeWidth="0.35" opacity="0.1"/>)}
      <rect x="48" y="38" width="105" height="20" rx="10" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="0.8"/>
      <text x="64" y="52" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="8" fill="#a5b4fc" letterSpacing="1.5">✦ SERIES A PITCH</text>
      <text x="48" y="108" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="34" fill={`url(#${p}tt)`}>STARTUP</text>
      <text x="48" y="145" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="34" fill={`url(#${p}tt)`}>PITCH DECK</text>
      <text x="48" y="165" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="10" fill="rgba(255,255,255,0.38)" letterSpacing="1">Disrupting the market. Building the future.</text>
      <rect x="48" y="182" width="380" height="1" fill="rgba(99,102,241,0.3)"/>
      <text x="48" y="202" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="19" fill="white">$2.4M</text>
      <text x="48" y="216" fontFamily="Arial,sans-serif" fontSize="7" fill="rgba(255,255,255,0.38)" letterSpacing="1">ARR</text>
      <text x="145" y="202" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="19" fill="white">340%</text>
      <text x="145" y="216" fontFamily="Arial,sans-serif" fontSize="7" fill="rgba(255,255,255,0.38)" letterSpacing="1">GROWTH</text>
      <text x="246" y="202" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="19" fill="white">12K+</text>
      <text x="246" y="216" fontFamily="Arial,sans-serif" fontSize="7" fill="rgba(255,255,255,0.38)" letterSpacing="1">USERS</text>
      <polygon points="415,75 458,135 415,165 427,135" fill="#6366f1" opacity="0.5"/>
      <polygon points="378,98 428,135 378,158 392,135" fill="#818cf8" opacity="0.3"/>
      <circle cx="443" cy="52" r="3" fill="#a5b4fc" opacity="0.5"/>
      <circle cx="462" cy="225" r="2" fill="#6366f1" opacity="0.4"/>
    </svg>
  ),

  /* ── 3. ACADEMIC ─────────────────────────────── */
  academic: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <pattern id={`${p}dot`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="0.8" fill="#92400e" opacity="0.18"/></pattern>
        <linearGradient id={`${p}top`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3d1f08"/><stop offset="100%" stopColor="#92400e"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill="#f5f0e8"/>
      <rect width="480" height="270" fill={`url(#${p}dot)`}/>
      <rect x="0" y="0" width="480" height="72" fill={`url(#${p}top)`}/>
      <circle cx="422" cy="36" r="28" fill="none" stroke="rgba(245,240,232,0.3)" strokeWidth="1.5"/>
      <circle cx="422" cy="36" r="19" fill="none" stroke="rgba(245,240,232,0.2)" strokeWidth="1"/>
      <circle cx="422" cy="36" r="11" fill="rgba(245,240,232,0.08)"/>
      <text x="416" y="40" fontFamily="serif" fontSize="11" fill="rgba(245,240,232,0.5)">✦</text>
      <text x="44" y="26" fontFamily="Georgia,serif" fontSize="8.5" fill="rgba(245,240,232,0.45)" letterSpacing="3">RESEARCH PRESENTATION</text>
      <text x="44" y="52" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill="rgba(245,240,232,0.85)">Department of Advanced Studies</text>
      <text x="34" y="128" fontFamily="Georgia,serif" fontSize="68" fill="rgba(146,64,14,0.1)">"</text>
      <text x="56" y="118" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#1c1917">A Comprehensive Study on</text>
      <text x="56" y="140" fontFamily="Georgia,serif" fontSize="17" fontWeight="700" fill="#1c1917">Advanced Research Methods</text>
      <rect x="56" y="153" width="240" height="2" fill="#92400e" opacity="0.5"/>
      <rect x="56" y="159" width="160" height="1" fill="#92400e" opacity="0.25"/>
      <text x="56" y="182" fontFamily="Georgia,serif" fontSize="10.5" fill="#1c1917" opacity="0.7">Presented by: Dr. Sarah Thompson</text>
      <text x="56" y="197" fontFamily="Georgia,serif" fontSize="9.5" fill="#1c1917" opacity="0.45">Faculty of Sciences · Spring 2025</text>
      <rect x="0" y="244" width="480" height="26" fill="rgba(146,64,14,0.07)"/>
      <rect x="0" y="244" width="480" height="1" fill="rgba(146,64,14,0.18)"/>
      <text x="44" y="260" fontFamily="Georgia,serif" fontSize="7.5" fill="#92400e" opacity="0.55" letterSpacing="2">THESIS DEFENSE · PAGE 1 OF 32</text>
      <rect x="368" y="96" width="76" height="100" rx="3" fill="rgba(146,64,14,0.07)" stroke="rgba(146,64,14,0.18)" strokeWidth="1"/>
      <line x1="406" y1="96" x2="406" y2="196" stroke="rgba(146,64,14,0.25)" strokeWidth="1.5"/>
      {[108,120,132,154,166].map(y=><rect key={y} x="374" y={y} width="28" height="5" rx="1" fill="rgba(146,64,14,0.14)"/>)}
      {[108,120,132,154,166].map(y=><rect key={y+1} x="412" y={y} width="24" height="5" rx="1" fill="rgba(146,64,14,0.1)"/>)}
    </svg>
  ),

  /* ── 4. TECHNOLOGY ───────────────────────────── */
  technology: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <radialGradient id={`${p}gw`} cx="65%" cy="35%" r="55%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.18"/><stop offset="100%" stopColor="#0a0f1e" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="480" height="270" fill="#0a0f1e"/>
      <rect width="480" height="270" fill={`url(#${p}gw)`}/>
      {[0,40,80,120,160,200,240,280,320,360,400,440,480].map(x=><line key={x} x1={x} y1="0" x2={x} y2="270" stroke="#06b6d4" strokeWidth="0.4" opacity="0.07"/>)}
      {[0,40,80,120,160,200,240].map(y=><line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#06b6d4" strokeWidth="0.4" opacity="0.07"/>)}
      <line x1="305" y1="72" x2="425" y2="72" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4"/>
      <line x1="425" y1="72" x2="425" y2="118" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4"/>
      <line x1="425" y1="118" x2="462" y2="118" stroke="#06b6d4" strokeWidth="1.5" opacity="0.4"/>
      <circle cx="425" cy="72" r="4" fill="#06b6d4" opacity="0.7"/>
      <circle cx="425" cy="118" r="4" fill="#06b6d4" opacity="0.6"/>
      <line x1="325" y1="155" x2="375" y2="155" stroke="#06b6d4" strokeWidth="1.2" opacity="0.3"/>
      <line x1="375" y1="155" x2="375" y2="195" stroke="#06b6d4" strokeWidth="1.2" opacity="0.3"/>
      <line x1="375" y1="195" x2="450" y2="195" stroke="#06b6d4" strokeWidth="1.2" opacity="0.3"/>
      <circle cx="375" cy="155" r="4.5" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5"/>
      <circle cx="375" cy="195" r="4.5" fill="none" stroke="#06b6d4" strokeWidth="1.5" opacity="0.5"/>
      <polygon points="345,45 368,34 391,45 391,67 368,78 345,67" fill="none" stroke="#06b6d4" strokeWidth="1.2" opacity="0.3"/>
      <polygon points="415,160 437,149 459,160 459,182 437,193 415,182" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.22"/>
      <rect x="48" y="38" width="128" height="18" rx="2" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" strokeWidth="0.7"/>
      <text x="56" y="51" fontFamily="'Courier New',monospace" fontSize="8" fill="#06b6d4" letterSpacing="2">▶ TECH SUMMIT 2025</text>
      <text x="48" y="97" fontFamily="'Courier New',monospace" fontWeight="700" fontSize="29" fill="#e0f2fe">TECHNOLOGY</text>
      <text x="48" y="128" fontFamily="'Courier New',monospace" fontWeight="700" fontSize="29" fill="#06b6d4">CONFERENCE</text>
      <text x="48" y="150" fontFamily="'Courier New',monospace" fontSize="9" fill="#06b6d4" opacity="0.4">{"// Building the future, one line at a time"}</text>
      <text x="48" y="163" fontFamily="'Courier New',monospace" fontSize="8" fill="#06b6d4" opacity="0.22">{"import { innovation } from 'future';"}</text>
      <rect x="48" y="188" width="370" height="1" fill="rgba(6,182,212,0.2)"/>
      <text x="48" y="208" fontFamily="'Courier New',monospace" fontSize="8.5" fill="rgba(224,242,254,0.45)" letterSpacing="0.5">2,400+ ENGINEERS · 180 COUNTRIES · 96 SPEAKERS</text>
      <circle cx="300" cy="242" r="3" fill="#06b6d4" opacity="0.5"/>
      <circle cx="340" cy="242" r="2" fill="#06b6d4" opacity="0.3"/>
      <circle cx="360" cy="242" r="4" fill="#06b6d4" opacity="0.4"/>
      <line x1="300" y1="242" x2="360" y2="242" stroke="#06b6d4" strokeWidth="1" opacity="0.2"/>
    </svg>
  ),

  /* ── 5. MARKETING ────────────────────────────── */
  marketing: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}dg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e11d74"/><stop offset="100%" stopColor="#f43f9e"/></linearGradient>
        <radialGradient id={`${p}rg`} cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#e11d74" stopOpacity="0.12"/><stop offset="100%" stopColor="#fff0f5" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="480" height="270" fill="#fff0f5"/>
      <rect width="480" height="270" fill={`url(#${p}rg)`}/>
      <polygon points="308,0 480,0 480,270 338,270" fill={`url(#${p}dg)`} opacity="0.9"/>
      <polygon points="280,0 308,0 338,270 308,270" fill="#e11d74" opacity="0.14"/>
      <circle cx="430" cy="135" r="82" fill="none" stroke="white" strokeWidth="1.5" opacity="0.28"/>
      <circle cx="430" cy="135" r="58" fill="none" stroke="white" strokeWidth="1.5" opacity="0.38"/>
      <circle cx="430" cy="135" r="32" fill="none" stroke="white" strokeWidth="2" opacity="0.48"/>
      <circle cx="430" cy="135" r="10" fill="white" opacity="0.28"/>
      <rect x="48" y="38" width="135" height="20" rx="10" fill="rgba(225,29,116,0.13)"/>
      <text x="58" y="52" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="9" fill="#e11d74" letterSpacing="1.5">✦ CAMPAIGN 2025</text>
      <text x="48" y="96" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="32" fill="#1a0010">MARKETING</text>
      <text x="48" y="132" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="32" fill="#e11d74">STRATEGY</text>
      <text x="48" y="154" fontFamily="Arial,sans-serif" fontSize="10" fill="#1a0010" opacity="0.58">Reach. Engage. Convert. Grow.</text>
      <rect x="48" y="166" width="210" height="2" fill="#e11d74" opacity="0.38"/>
      <text x="48" y="186" fontFamily="Arial,sans-serif" fontSize="7" fill="#1a0010" opacity="0.38" letterSpacing="2">KEY METRICS</text>
      <text x="48" y="207" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="17" fill="#1a0010">+127%</text>
      <text x="48" y="219" fontFamily="Arial,sans-serif" fontSize="7" fill="#e11d74" letterSpacing="1">CONVERSION</text>
      <text x="122" y="207" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="17" fill="#1a0010">4.8M</text>
      <text x="122" y="219" fontFamily="Arial,sans-serif" fontSize="7" fill="#e11d74" letterSpacing="1">REACH</text>
      <text x="188" y="207" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="17" fill="#1a0010">$2.1M</text>
      <text x="188" y="219" fontFamily="Arial,sans-serif" fontSize="7" fill="#e11d74" letterSpacing="1">REVENUE</text>
    </svg>
  ),

  /* ── 6. FINANCE ──────────────────────────────── */
  finance: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d2818"/><stop offset="100%" stopColor="#051a0e"/></linearGradient>
        <linearGradient id={`${p}ar`} x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#10b981" stopOpacity="0.28"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      {[80,160,240,320,400].map(x=><line key={x} x1={x} y1="90" x2={x} y2="205" stroke="#10b981" strokeWidth="0.3" opacity="0.1"/>)}
      {[110,140,170,200].map(y=><line key={y} x1="60" y1={y} x2="460" y2={y} stroke="#10b981" strokeWidth="0.3" opacity="0.1"/>)}
      <path d="M60,198 L110,182 L170,170 L220,158 L270,142 L315,122 L365,110 L420,90 L462,75 L462,205 L60,205 Z" fill={`url(#${p}ar)`}/>
      <path d="M60,198 L110,182 L170,170 L220,158 L270,142 L315,122 L365,110 L420,90 L462,75" fill="none" stroke="#10b981" strokeWidth="2.5" opacity="0.85"/>
      {[[60,198],[110,182],[170,170],[220,158],[270,142],[315,122],[365,110],[420,90],[462,75]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill="#10b981" opacity="0.75"/>)}
      <circle cx="462" cy="75" r="6" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.85"/>
      <text x="310" y="170" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="90" fill="#10b981" opacity="0.04">$</text>
      <rect x="0" y="0" width="195" height="270" fill="rgba(0,0,0,0.28)"/>
      <rect x="28" y="35" width="93" height="16" rx="2" fill="rgba(16,185,129,0.2)"/>
      <text x="34" y="47" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="#10b981" letterSpacing="1.5">FINANCE REPORT</text>
      <text x="28" y="84" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="21" fill="#ecfdf5">FINANCIAL</text>
      <text x="28" y="108" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="21" fill="#10b981">ANALYSIS</text>
      <text x="28" y="132" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="21" fill="#ecfdf5">REPORT</text>
      <rect x="28" y="145" width="150" height="1" fill="rgba(16,185,129,0.3)"/>
      <text x="28" y="168" fontFamily="Arial,sans-serif" fontSize="8" fill="rgba(236,253,245,0.38)" letterSpacing="2">NET REVENUE</text>
      <text x="28" y="190" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#ecfdf5">$48.2M</text>
      <text x="28" y="208" fontFamily="Arial,sans-serif" fontSize="9.5" fill="#10b981">▲ +23.4% YoY</text>
      <text x="28" y="235" fontFamily="Arial,sans-serif" fontSize="7" fill="rgba(236,253,245,0.22)" letterSpacing="1">FY 2025 · CFO REPORT · CONFIDENTIAL</text>
    </svg>
  ),

  /* ── 7. HEALTHCARE ───────────────────────────── */
  healthcare: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dbeafe"/><stop offset="100%" stopColor="#f0f9ff"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <rect x="0" y="0" width="480" height="58" fill="#0284c7"/>
      <rect x="420" y="15" width="6" height="26" rx="2" fill="white" opacity="0.55"/>
      <rect x="411" y="24" width="24" height="6" rx="2" fill="white" opacity="0.55"/>
      <text x="40" y="24" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8.5" fill="rgba(255,255,255,0.65)" letterSpacing="2">HEALTHCARE MEDICAL CENTER</text>
      <text x="40" y="44" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="14" fill="white">Excellence in Patient Care</text>
      <rect x="295" y="74" width="162" height="170" rx="12" fill="white" opacity="0.92"/>
      <path d="M310,145 L326,145 L340,115 L352,168 L363,133 L374,145 L444,145" fill="none" stroke="#0284c7" strokeWidth="2.5" opacity="0.7"/>
      <text x="310" y="200" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#0284c7" opacity="0.5" letterSpacing="1">PATIENT OUTCOMES</text>
      <text x="310" y="222" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#0c1e2e">98.6%</text>
      <text x="310" y="236" fontFamily="Arial,sans-serif" fontSize="8" fill="#0284c7">Satisfaction Rate</text>
      <text x="40" y="96" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#0284c7" opacity="0.55" letterSpacing="2">CLINICAL PRESENTATION</text>
      <text x="56" y="125" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="19" fill="#0c1e2e">ADVANCED</text>
      <text x="40" y="149" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="19" fill="#0284c7">HEALTHCARE</text>
      <text x="40" y="173" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="19" fill="#0c1e2e">SOLUTIONS</text>
      <rect x="40" y="185" width="220" height="1.5" fill="#0284c7" opacity="0.28"/>
      <text x="40" y="204" fontFamily="Arial,sans-serif" fontSize="10" fill="#0c1e2e" opacity="0.7">Dr. Emily Chen, MD, PhD</text>
      <text x="40" y="219" fontFamily="Arial,sans-serif" fontSize="9" fill="#0c1e2e" opacity="0.42">Chief Medical Officer · 2025</text>
      <circle cx="60" cy="252" r="12" fill="#0284c7" opacity="0.07"/>
      <circle cx="88" cy="252" r="8" fill="#0284c7" opacity="0.05"/>
    </svg>
  ),

  /* ── 8. CREATIVE ─────────────────────────────── */
  creative: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bl`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#d97706"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill="#fef3c7"/>
      <circle cx="75" cy="75" r="130" fill="#d97706" opacity="0.18"/>
      <polygon points="338,0 480,0 480,168 372,270 295,270 338,168" fill={`url(#${p}bl)`} opacity="0.82"/>
      <polygon points="308,0 338,0 338,168 295,270 265,270 285,168" fill="#92400e" opacity="0.58"/>
      <rect x="360" y="22" width="84" height="54" rx="4" fill="rgba(255,255,255,0.38)"/>
      <rect x="350" y="85" width="64" height="54" rx="4" fill="rgba(255,255,255,0.28)"/>
      <rect x="378" y="148" width="84" height="54" rx="4" fill="rgba(255,255,255,0.33)"/>
      <text x="38" y="72" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#92400e" opacity="0.65" letterSpacing="3">CREATIVE</text>
      <text x="33" y="118" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="40" fill="#1c0d00">AGENCY</text>
      <text x="33" y="158" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="40" fill="#d97706">PORTFOLIO</text>
      <rect x="33" y="170" width="238" height="2" fill="#d97706" opacity="0.45"/>
      <text x="33" y="190" fontFamily="Arial,sans-serif" fontSize="10" fill="#1c0d00" opacity="0.58">Creative Direction · Branding · UX Design</text>
      <circle cx="72" cy="232" r="29" fill="#d97706" opacity="0.13"/>
      <text x="48" y="238" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fill="#92400e">2025</text>
      <rect x="200" y="224" width="10" height="10" transform="rotate(30 205 229)" fill="#d97706" opacity="0.38"/>
      <rect x="222" y="242" width="8" height="8" transform="rotate(15 226 246)" fill="#92400e" opacity="0.28"/>
    </svg>
  ),

  /* ── 9. MINIMAL ──────────────────────────────── */
  minimal: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <rect width="480" height="270" fill="#ffffff"/>
      <rect x="0" y="0" width="480" height="2" fill="#334155"/>
      <rect x="48" y="28" width="1" height="195" fill="#334155" opacity="0.12"/>
      <rect x="440" y="0" width="40" height="40" fill="#334155" opacity="0.03"/>
      <line x1="440" y1="0" x2="480" y2="0" stroke="#334155" strokeWidth="1.5" opacity="0.18"/>
      <line x1="440" y1="0" x2="440" y2="40" stroke="#334155" strokeWidth="1.5" opacity="0.18"/>
      <text x="452" y="56" fontFamily="Arial,sans-serif" fontSize="11" fill="#334155" opacity="0.22" textAnchor="middle">01</text>
      <text x="68" y="88" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="9" fill="#334155" opacity="0.42" letterSpacing="5">PRESENTATION</text>
      <text x="66" y="142" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="36" fill="#0f172a">Minimal.</text>
      <rect x="66" y="155" width="290" height="1.5" fill="#334155" opacity="0.1"/>
      <text x="66" y="176" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="13" fill="#475569">Clean design. Maximum impact.</text>
      {[332,358,384,410,436,462].map(x=>[100,120,140,160,182].map(y=><circle key={`${x}${y}`} cx={x} cy={y} r="1.5" fill="#334155" opacity="0.07"/>))}
      <text x="66" y="228" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="9" fill="#334155" opacity="0.32">Author Name · Organization · 2025</text>
      <rect x="66" y="238" width="105" height="1" fill="#334155" opacity="0.08"/>
      <rect x="66" y="248" width="8" height="8" fill="#334155" opacity="0.18"/>
    </svg>
  ),

  /* ── 10. DARK MODE ───────────────────────────── */
  dark: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <radialGradient id={`${p}g1`} cx="72%" cy="18%" r="55%"><stop offset="0%" stopColor="#a78bfa" stopOpacity="0.28"/><stop offset="100%" stopColor="#0f0f14" stopOpacity="0"/></radialGradient>
        <radialGradient id={`${p}g2`} cx="18%" cy="88%" r="42%"><stop offset="0%" stopColor="#7c3aed" stopOpacity="0.22"/><stop offset="100%" stopColor="#0f0f14" stopOpacity="0"/></radialGradient>
        <linearGradient id={`${p}tt`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e2e8f0"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill="#0f0f14"/>
      <rect width="480" height="270" fill={`url(#${p}g1)`}/>
      <rect width="480" height="270" fill={`url(#${p}g2)`}/>
      <circle cx="372" cy="58" r="82" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.14"/>
      <circle cx="372" cy="58" r="58" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.1"/>
      <circle cx="372" cy="58" r="33" fill="rgba(167,139,250,0.07)"/>
      <polygon points="420,28 462,90 378,90" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.22"/>
      <polygon points="388,50 422,90 356,90" fill="#7c3aed" opacity="0.1"/>
      <line x1="0" y1="270" x2="200" y2="0" stroke="#a78bfa" strokeWidth="0.4" opacity="0.07"/>
      <rect x="0" y="0" width="1.5" height="270" fill="#a78bfa" opacity="0.42"/>
      <rect x="55" y="40" width="102" height="18" rx="9" fill="rgba(167,139,250,0.14)" stroke="#a78bfa" strokeWidth="0.8"/>
      <text x="72" y="53" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="8" fill="#a78bfa" letterSpacing="1.5">◆ DARK MODE</text>
      <text x="55" y="100" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill={`url(#${p}tt)`}>PROFESSIONAL</text>
      <text x="55" y="135" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#a78bfa">DARK THEME</text>
      <text x="55" y="156" fontFamily="Arial,sans-serif" fontWeight="300" fontSize="10" fill="rgba(226,232,240,0.42)">Sophisticated. Modern. Immersive.</text>
      <rect x="55" y="168" width="285" height="1" fill="rgba(167,139,250,0.2)"/>
      {[{t:'Modern UI',w:68},{t:'Analytics',w:72},{t:'Dashboard',w:82}].map(({t,w},i)=>(
        <g key={i}><rect x={55+i*88} y="184" width={w} height="20" rx="10" fill="rgba(167,139,250,0.12)" stroke="#a78bfa" strokeWidth="0.6"/>
        <text x={55+i*88+12} y="198" fontFamily="Arial,sans-serif" fontSize="8" fill="#a78bfa">{t}</text></g>
      ))}
      <text x="55" y="242" fontFamily="Arial,sans-serif" fontSize="7.5" fill="rgba(226,232,240,0.22)" letterSpacing="1">VERSION 3.0 · PRODUCT OVERVIEW · 2025</text>
    </svg>
  ),

  /* ── 11. NEO-MEMPHIS ─────────────────────────── */
  neomemphis: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <pattern id={`${p}sq`} x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M0,14 Q4,5 8,14 Q12,23 16,14 Q20,5 24,14 Q28,23 32,14" fill="none" stroke="#d946ef" strokeWidth="1" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="480" height="270" fill="#fdf4ff"/>
      <rect width="480" height="270" fill={`url(#${p}sq)`}/>
      <circle cx="380" cy="58" r="72" fill="#d946ef" opacity="0.13"/>
      <circle cx="380" cy="58" r="48" fill="#d946ef" opacity="0.08"/>
      <rect x="58" y="168" width="82" height="82" transform="rotate(-14 99 209)" fill="#fbbf24" opacity="0.28"/>
      <polygon points="400,185 452,270 348,270" fill="#06b6d4" opacity="0.18"/>
      <circle cx="432" cy="125" r="16" fill="#ef4444" opacity="0.22"/>
      <circle cx="455" cy="148" r="9" fill="#ef4444" opacity="0.18"/>
      <path d="M248,222 L268,202 L288,222 L308,202 L328,222 L348,202 L368,222" fill="none" stroke="#d946ef" strokeWidth="2" opacity="0.33"/>
      <circle cx="148" cy="48" r="8" fill="#fbbf24" opacity="0.42"/>
      <circle cx="168" cy="36" r="5" fill="#d946ef" opacity="0.3"/>
      <circle cx="198" cy="53" r="6" fill="#06b6d4" opacity="0.33"/>
      <rect x="44" y="58" width="262" height="118" rx="6" fill="white" opacity="0.88"/>
      <rect x="44" y="58" width="262" height="118" rx="6" fill="none" stroke="#d946ef" strokeWidth="2" opacity="0.48"/>
      <text x="62" y="92" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#3b0764">NEO</text>
      <text x="62" y="124" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#d946ef">MEMPHIS</text>
      <text x="62" y="156" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="16" fill="#3b0764">Design Studio</text>
      {['#d946ef','#fbbf24','#06b6d4','#ef4444'].map((c,i)=><rect key={i} x={62+i*24} y="162" width="18" height="8" rx="1" fill={c} opacity="0.8"/>)}
      <text x="44" y="210" fontFamily="Arial,sans-serif" fontSize="9" fontWeight="600" fill="#3b0764" opacity="0.45" letterSpacing="2">CREATIVE CONCEPTS · 2025</text>
    </svg>
  ),

  /* ── 12. ECO GREEN ───────────────────────────── */
  ecogreen: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dcfce7"/><stop offset="100%" stopColor="#f0fdf4"/></linearGradient>
        <radialGradient id={`${p}rg`} cx="60%" cy="30%" r="55%"><stop offset="0%" stopColor="#16a34a" stopOpacity="0.18"/><stop offset="100%" stopColor="#f0fdf4" stopOpacity="0"/></radialGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <rect width="480" height="270" fill={`url(#${p}rg)`}/>
      <circle cx="382" cy="102" r="112" fill="#16a34a" opacity="0.07"/>
      <path d="M0,205 Q120,180 240,205 Q360,230 480,205 L480,270 L0,270 Z" fill="#16a34a" opacity="0.07"/>
      <path d="M0,220 Q120,200 240,220 Q360,240 480,220 L480,270 L0,270 Z" fill="#16a34a" opacity="0.05"/>
      <path d="M352,38 Q425,78 414,162 Q352,202 312,152 Q272,102 352,38 Z" fill="#16a34a" opacity="0.1"/>
      <path d="M352,38 Q362,100 342,152" fill="none" stroke="#16a34a" strokeWidth="1.5" opacity="0.22"/>
      <path d="M402,102 Q442,122 437,162 Q402,177 382,152 Q362,127 402,102 Z" fill="#22c55e" opacity="0.13"/>
      <rect x="40" y="34" width="8" height="8" rx="1" fill="#16a34a" opacity="0.58"/>
      <text x="56" y="43" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="#16a34a" opacity="0.65" letterSpacing="2">SUSTAINABILITY REPORT</text>
      <text x="40" y="90" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#14532d">ECO</text>
      <text x="40" y="124" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#16a34a">GREEN</text>
      <text x="40" y="158" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#14532d">FUTURE</text>
      <rect x="40" y="172" width="210" height="2" fill="#16a34a" opacity="0.28"/>
      <text x="40" y="192" fontFamily="Arial,sans-serif" fontSize="10" fill="#14532d" opacity="0.58">Environmental Strategy &amp; Impact 2025</text>
      <text x="40" y="216" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="15" fill="#14532d">-60% Carbon</text>
      <text x="162" y="216" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="15" fill="#14532d">100% Renewable</text>
    </svg>
  ),

  /* ── 13. CYBERPUNK ───────────────────────────── */
  cyberpunk: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <rect width="480" height="270" fill="#050505"/>
      {[-3,-2,-1,0,1,2,3,4,5,6].map(i=><line key={i} x1={240+i*82} y1="0" x2={240+i*30} y2="270" stroke="#facc15" strokeWidth="0.5" opacity="0.13"/>)}
      {[55,88,118,148,178,208,238].map(y=><line key={y} x1="0" y1={y} x2="480" y2={y} stroke="#facc15" strokeWidth="0.3" opacity="0.1"/>)}
      <rect x="0" y="0" width="480" height="3" fill="#facc15" opacity="0.82"/>
      <rect x="0" y="267" width="480" height="3" fill="#facc15" opacity="0.82"/>
      <rect x="0" y="0" width="3" height="270" fill="#facc15" opacity="0.82"/>
      <rect x="0" y="58" width="310" height="2" fill="#facc15" opacity="0.05"/>
      <rect x="0" y="198" width="405" height="1.5" fill="#facc15" opacity="0.04"/>
      <text x="28" y="105" fontFamily="'Courier New',monospace" fontWeight="700" fontSize="42" fill="#facc15">CYBER</text>
      <text x="28" y="155" fontFamily="'Courier New',monospace" fontWeight="700" fontSize="42" fill="#facc15">PUNK</text>
      <text x="28" y="178" fontFamily="'Courier New',monospace" fontSize="10" fill="#fef08a" opacity="0.48" letterSpacing="2">// WEB3 FUTURE CONF 2025</text>
      <rect x="330" y="48" width="125" height="82" rx="4" fill="none" stroke="#facc15" strokeWidth="1" opacity="0.18"/>
      <rect x="340" y="56" width="105" height="13" rx="2" fill="#facc15" opacity="0.06"/>
      <rect x="340" y="76" width="75" height="9" rx="2" fill="#facc15" opacity="0.05"/>
      <rect x="340" y="93" width="92" height="9" rx="2" fill="#facc15" opacity="0.04"/>
      <line x1="392" y1="130" x2="392" y2="162" stroke="#facc15" strokeWidth="1.5" opacity="0.38"/>
      <line x1="362" y1="162" x2="432" y2="162" stroke="#facc15" strokeWidth="1.5" opacity="0.38"/>
      <circle cx="362" cy="162" r="5" fill="none" stroke="#facc15" strokeWidth="1.5" opacity="0.58"/>
      <circle cx="432" cy="162" r="5" fill="#facc15" opacity="0.38"/>
      <text x="28" y="218" fontFamily="'Courier New',monospace" fontSize="8" fill="#fef08a" opacity="0.38" letterSpacing="1">SYS://MAINFRAME v2.0 · ACCESS_GRANTED</text>
      <circle cx="452" cy="205" r="5" fill="#facc15" opacity="0.58"/>
      <circle cx="462" cy="222" r="3" fill="#facc15" opacity="0.38"/>
    </svg>
  ),

  /* ── 14. VENTURE CAPITAL ─────────────────────── */
  vcpitch: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0d0d0d"/><stop offset="100%" stopColor="#1a0010"/></linearGradient>
        <radialGradient id={`${p}gw`} cx="72%" cy="28%" r="58%"><stop offset="0%" stopColor="#ec4899" stopOpacity="0.22"/><stop offset="100%" stopColor="#0d0d0d" stopOpacity="0"/></radialGradient>
        <linearGradient id={`${p}ar`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#ec4899"/><stop offset="100%" stopColor="#f472b6"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <rect width="480" height="270" fill={`url(#${p}gw)`}/>
      <polygon points="378,0 480,0 480,105 428,0" fill="#ec4899" opacity="0.62"/>
      <polygon points="358,0 378,0 428,0 390,82" fill="#ec4899" opacity="0.14"/>
      <rect x="0" y="0" width="480" height="1.5" fill="#ec4899" opacity="0.48"/>
      <rect x="40" y="38" width="112" height="18" rx="9" fill="rgba(236,72,153,0.15)" stroke="#ec4899" strokeWidth="0.8"/>
      <text x="56" y="51" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="#ec4899" letterSpacing="1.5">INVESTOR DECK</text>
      <text x="40" y="100" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#fdf2f8">VENTURE</text>
      <text x="40" y="134" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#ec4899">CAPITAL</text>
      <text x="40" y="168" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#fdf2f8">PITCH</text>
      <text x="40" y="188" fontFamily="Arial,sans-serif" fontSize="9" fill="rgba(253,242,248,0.42)">The opportunity of a generation.</text>
      <rect x="40" y="198" width="265" height="1" fill="rgba(236,72,153,0.28)"/>
      <path d="M40,237 L165,217 L225,222 L285,202 L325,197" fill="none" stroke={`url(#${p}ar)`} strokeWidth="2" opacity="0.7"/>
      <polygon points="320,192 336,197 320,202" fill="#ec4899" opacity="0.82"/>
      <text x="40" y="255" fontFamily="Arial,sans-serif" fontSize="7.5" fill="rgba(253,242,248,0.28)" letterSpacing="1">SEEKING $15M SERIES B · VALUATION $80M</text>
      <circle cx="420" cy="205" r="25" fill="none" stroke="#ec4899" strokeWidth="0.8" opacity="0.22"/>
    </svg>
  ),

  /* ── 15. MEDICAL JOURNAL ─────────────────────── */
  medicaljournal: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <rect width="480" height="270" fill="#ffffff"/>
      <rect x="0" y="0" width="480" height="62" fill="#0d9488"/>
      <text x="40" y="22" fontFamily="Georgia,serif" fontSize="8" fill="rgba(255,255,255,0.55)" letterSpacing="3">THE JOURNAL OF ADVANCED MEDICINE</text>
      <text x="40" y="46" fontFamily="Georgia,serif" fontWeight="700" fontSize="16" fill="white">Clinical Research &amp; Innovation</text>
      <text x="402" y="30" fontFamily="Georgia,serif" fontSize="9.5" fill="rgba(255,255,255,0.48)">Vol. 12 No. 4</text>
      <text x="402" y="48" fontFamily="Georgia,serif" fontSize="8.5" fill="rgba(255,255,255,0.38)">Spring 2025</text>
      <text x="40" y="88" fontFamily="Georgia,serif" fontSize="8" fill="#0d9488" letterSpacing="2">ORIGINAL RESEARCH</text>
      <rect x="40" y="95" width="265" height="2" fill="#0d9488" opacity="0.28"/>
      <text x="40" y="116" fontFamily="Georgia,serif" fontWeight="700" fontSize="16" fill="#115e59">Efficacy of Novel Treatment</text>
      <text x="40" y="136" fontFamily="Georgia,serif" fontWeight="700" fontSize="16" fill="#115e59">Protocols in Advanced</text>
      <text x="40" y="156" fontFamily="Georgia,serif" fontWeight="700" fontSize="16" fill="#115e59">Oncological Cases</text>
      <rect x="40" y="168" width="265" height="1" fill="#115e59" opacity="0.13"/>
      <text x="40" y="183" fontFamily="Georgia,serif" fontSize="9" fill="#115e59" opacity="0.58">Dr. Marcus Johnson · Dr. Yuki Tanaka</text>
      <text x="40" y="197" fontFamily="Georgia,serif" fontSize="8.5" fill="#115e59" opacity="0.38">Harvard Medical School · Oncology Dept.</text>
      <text x="40" y="218" fontFamily="Georgia,serif" fontWeight="700" fontSize="7.5" fill="#0d9488" letterSpacing="2">ABSTRACT</text>
      {[224,232,240,248].map(y=><rect key={y} x="40" y={y} width={y===224?225:y===232?195:y===240?215:180} height="5" rx="1" fill="#0d9488" opacity="0.07"/>)}
      <rect x="322" y="74" width="140" height="178" rx="8" fill="#f0fdfa" stroke="#0d9488" strokeWidth="0.8" opacity="0.48"/>
      <text x="336" y="100" fontFamily="Georgia,serif" fontWeight="700" fontSize="7.5" fill="#0d9488" letterSpacing="1">STUDY OUTCOMES</text>
      <rect x="336" y="105" width="110" height="1" fill="#0d9488" opacity="0.18"/>
      <text x="336" y="130" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#115e59">94.3%</text>
      <text x="336" y="143" fontFamily="Arial,sans-serif" fontSize="7" fill="#0d9488" opacity="0.58">Efficacy Rate</text>
      <rect x="336" y="150" width="110" height="1" fill="#0d9488" opacity="0.1"/>
      <text x="336" y="172" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="22" fill="#115e59">n=840</text>
      <text x="336" y="185" fontFamily="Arial,sans-serif" fontSize="7" fill="#0d9488" opacity="0.58">Sample Size</text>
      <rect x="336" y="192" width="110" height="1" fill="#0d9488" opacity="0.1"/>
      <text x="336" y="214" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="18" fill="#115e59">p&lt;0.001</text>
      <text x="336" y="227" fontFamily="Arial,sans-serif" fontSize="7" fill="#0d9488" opacity="0.58">Significance</text>
    </svg>
  ),

  /* ── 16. E-LEARNING ──────────────────────────── */
  elearning: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fef9c3"/><stop offset="100%" stopColor="#fefce8"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <path d="M0,0 Q120,35 240,20 Q360,5 480,28 L480,0 Z" fill="#ca8a04" opacity="0.1"/>
      <rect x="398" y="18" width="16" height="82" rx="4" transform="rotate(28 406 59)" fill="#ca8a04" opacity="0.32"/>
      <polygon points="404,94 416,100 410,108" transform="rotate(28 410 101)" fill="#92400e" opacity="0.48"/>
      <rect x="399" y="12" width="14" height="10" rx="2" transform="rotate(28 406 17)" fill="#f97316" opacity="0.38"/>
      <path d="M312,102 Q358,92 362,142 L362,202 Q317,212 312,202 Z" fill="#ca8a04" opacity="0.1"/>
      <path d="M312,102 Q266,92 262,142 L262,202 Q307,212 312,202 Z" fill="#ca8a04" opacity="0.1"/>
      <line x1="312" y1="102" x2="312" y2="202" stroke="#ca8a04" strokeWidth="1.5" opacity="0.28"/>
      {[122,135,148,161,174].map(y=><><line key={`a${y}`} x1="271" y1={y} x2="306" y2={y} stroke="#ca8a04" strokeWidth="1.5" opacity="0.18"/><line key={`b${y}`} x1="318" y1={y} x2="354" y2={y} stroke="#ca8a04" strokeWidth="1.5" opacity="0.18"/></>)}
      <rect x="40" y="34" width="112" height="20" rx="3" fill="#ca8a04" opacity="0.13"/>
      <text x="50" y="49" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="9" fill="#ca8a04" letterSpacing="1.5">📚 E-LEARNING</text>
      <text x="40" y="95" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill="#422006">ONLINE</text>
      <text x="40" y="127" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill="#ca8a04">COURSE</text>
      <text x="40" y="159" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill="#422006">MODULE</text>
      <rect x="40" y="170" width="208" height="2" fill="#ca8a04" opacity="0.33"/>
      <text x="40" y="190" fontFamily="Arial,sans-serif" fontSize="10" fill="#422006" opacity="0.62">Interactive Learning Experiences</text>
      <text x="40" y="215" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#422006" opacity="0.42" letterSpacing="1">COURSE PROGRESS</text>
      <rect x="40" y="220" width="205" height="8" rx="4" fill="rgba(202,138,4,0.13)"/>
      <rect x="40" y="220" width="144" height="8" rx="4" fill="#ca8a04" opacity="0.58"/>
      <text x="252" y="228" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="8" fill="#422006" opacity="0.48">70%</text>
      <text x="40" y="252" fontFamily="Arial,sans-serif" fontSize="12" fill="#ca8a04" opacity="0.48">★★★★★</text>
      <text x="116" y="252" fontFamily="Arial,sans-serif" fontSize="9" fill="#422006" opacity="0.38">4.9 · 12,400 students</text>
    </svg>
  ),

  /* ── 17. SOCIAL MEDIA GROWTH ─────────────────── */
  socialgrowth: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff7ed"/><stop offset="100%" stopColor="#fffbf5"/></linearGradient>
        <linearGradient id={`${p}ch`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" stopOpacity="0.58"/><stop offset="100%" stopColor="#f97316" stopOpacity="0.04"/></linearGradient>
        <clipPath id={`${p}cl`}><rect x="250" y="70" width="205" height="152"/></clipPath>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <rect x="242" y="60" width="222" height="178" rx="10" fill="white" opacity="0.82"/>
      <path d="M257,212 L292,192 L342,178 L382,148 L422,118 L448,82 L448,212 Z" fill={`url(#${p}ch)`} clipPath={`url(#${p}cl)`}/>
      <path d="M257,212 L292,192 L342,178 L382,148 L422,118 L448,82" fill="none" stroke="#f97316" strokeWidth="2.5" opacity="0.82"/>
      {[[257,212],[292,192],[342,178],[382,148],[422,118],[448,82]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#f97316" strokeWidth="2"/>)}
      <text x="257" y="227" fontFamily="Arial,sans-serif" fontSize="7" fill="#431407" opacity="0.33">Jan</text>
      <text x="294" y="227" fontFamily="Arial,sans-serif" fontSize="7" fill="#431407" opacity="0.33">Mar</text>
      <text x="345" y="227" fontFamily="Arial,sans-serif" fontSize="7" fill="#431407" opacity="0.33">Jun</text>
      <text x="384" y="227" fontFamily="Arial,sans-serif" fontSize="7" fill="#431407" opacity="0.33">Sep</text>
      <text x="256" y="84" fontFamily="Arial,sans-serif" fontSize="7" fill="#f97316" opacity="0.48" letterSpacing="1">FOLLOWER GROWTH</text>
      <circle cx="55" cy="50" r="18" fill="#f97316" opacity="0.1"/>
      <text x="49" y="56" fontFamily="Arial,sans-serif" fontSize="14" fill="#f97316" opacity="0.48">📱</text>
      <text x="40" y="95" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#431407">SOCIAL</text>
      <text x="40" y="126" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#f97316">MEDIA</text>
      <text x="40" y="157" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#431407">GROWTH</text>
      <rect x="40" y="168" width="188" height="2" fill="#f97316" opacity="0.28"/>
      <text x="40" y="188" fontFamily="Arial,sans-serif" fontSize="9" fill="#431407" opacity="0.52">Strategy · Analytics · Engagement</text>
      <text x="40" y="212" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="19" fill="#431407">2.4M</text>
      <text x="40" y="225" fontFamily="Arial,sans-serif" fontSize="7" fill="#f97316" letterSpacing="1">FOLLOWERS</text>
      <text x="116" y="212" fontFamily="Arial,sans-serif" fontWeight="800" fontSize="19" fill="#431407">+340%</text>
      <text x="116" y="225" fontFamily="Arial,sans-serif" fontSize="7" fill="#f97316" letterSpacing="1">GROWTH</text>
    </svg>
  ),

  /* ── 18. EXECUTIVE RETRO ─────────────────────── */
  execretro: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <pattern id={`${p}ht`} x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="8" y2="8" stroke="#6b7280" strokeWidth="0.3" opacity="0.18"/></pattern>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#111827"/><stop offset="100%" stopColor="#1f2937"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <rect width="480" height="270" fill={`url(#${p}ht)`}/>
      <rect x="0" y="0" width="480" height="52" fill="#374151" opacity="0.48"/>
      <rect x="0" y="52" width="480" height="1" fill="#6b7280" opacity="0.28"/>
      <rect x="172" y="0" width="1" height="270" fill="#6b7280" opacity="0.18"/>
      <text x="40" y="24" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#f9fafb" opacity="0.38" letterSpacing="3">EXECUTIVE MANAGEMENT</text>
      <text x="40" y="42" fontFamily="Arial,sans-serif" fontSize="10" fontWeight="600" fill="#f9fafb" opacity="0.68">Annual Strategic Review</text>
      <text x="282" y="30" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#6b7280">Q4 · FY 2025</text>
      <text x="28" y="100" fontFamily="Georgia,serif" fontSize="62" fontWeight="700" fill="#6b7280" opacity="0.1">I</text>
      <text x="38" y="112" fontFamily="Arial,sans-serif" fontSize="11" fill="#6b7280" letterSpacing="3">CORPORATE</text>
      <text x="38" y="142" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#f9fafb">EXECUTIVE</text>
      <text x="38" y="174" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="30" fill="#6b7280">RETRO</text>
      <line x1="232" y1="60" x2="232" y2="242" stroke="#6b7280" strokeWidth="1" opacity="0.28"/>
      {[80,120,162,204].map((y,i)=>(
        <g key={y}>
          <circle cx="232" cy={y} r="5" fill="#6b7280" opacity="0.58"/>
          <rect x="250" y={y-5} width="192" height="9" rx="1" fill="#6b7280" opacity={0.06+i*0.015}/>
          <text x="250" y={y+3} fontFamily="Arial,sans-serif" fontSize="8" fill="#f9fafb" opacity="0.28">{['Q1 Results','Q2 Analysis','Q3 Strategy','Q4 Forecast'][i]}</text>
        </g>
      ))}
      <rect x="0" y="248" width="480" height="1" fill="#6b7280" opacity="0.18"/>
      <text x="38" y="262" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#6b7280" letterSpacing="2">CONFIDENTIAL · BOARD OF DIRECTORS · 2025</text>
    </svg>
  ),

  /* ── 19. WARM EDITORIAL ──────────────────────── */
  warmeditorial: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <rect width="480" height="270" fill="#faf7f5"/>
      <rect x="10" y="10" width="460" height="250" fill="none" stroke="#c2410c" strokeWidth="1" opacity="0.22"/>
      <rect x="18" y="18" width="444" height="234" fill="none" stroke="#c2410c" strokeWidth="0.5" opacity="0.13"/>
      <rect x="28" y="28" width="424" height="48" fill="#c2410c"/>
      <text x="240" y="54" fontFamily="Georgia,serif" fontSize="14" fontWeight="700" fill="white" textAnchor="middle" letterSpacing="4">THE EDITORIAL REVIEW</text>
      <text x="36" y="46" fontFamily="Arial,sans-serif" fontSize="16" fill="rgba(255,255,255,0.28)">★</text>
      <text x="426" y="46" fontFamily="Arial,sans-serif" fontSize="16" fill="rgba(255,255,255,0.28)">★</text>
      <rect x="28" y="76" width="424" height="5" fill="#c2410c" opacity="0.12"/>
      {[96,108,120,132,144].map(y=><rect key={y} x="46" y={y} width="135" height="7" rx="1" fill="#2b1009" opacity={0.09+y*0.0003}/>)}
      <line x1="196" y1="84" x2="196" y2="215" stroke="#2b1009" strokeWidth="0.8" opacity="0.13"/>
      <text x="214" y="100" fontFamily="Georgia,serif" fontSize="7.5" fill="#c2410c" letterSpacing="3" opacity="0.82">FEATURE STORY</text>
      <text x="212" y="126" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" fill="#2b1009">Warm Editorial</text>
      <text x="212" y="150" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" fill="#c2410c">Design Language</text>
      <rect x="212" y="162" width="215" height="1.5" fill="#c2410c" opacity="0.38"/>
      <text x="212" y="178" fontFamily="Georgia,serif" fontSize="9" fill="#2b1009" opacity="0.48">A deep exploration of editorial</text>
      <text x="212" y="192" fontFamily="Georgia,serif" fontSize="9" fill="#2b1009" opacity="0.48">typography and classical design</text>
      <text x="212" y="206" fontFamily="Georgia,serif" fontSize="9" fill="#2b1009" opacity="0.48">principles in modern presentation.</text>
      <rect x="28" y="220" width="424" height="1" fill="#2b1009" opacity="0.07"/>
      <text x="46" y="238" fontFamily="Georgia,serif" fontSize="7.5" fill="#2b1009" opacity="0.38" letterSpacing="1">© THE EDITORIAL REVIEW · SPRING 2025 · ISSUE 18</text>
      <text x="13" y="26" fontFamily="serif" fontSize="14" fill="#c2410c" opacity="0.18">✦</text>
      <text x="451" y="26" fontFamily="serif" fontSize="14" fill="#c2410c" opacity="0.18">✦</text>
    </svg>
  ),

  /* ── 20. PRODUCT ROADMAP ─────────────────────── */
  productroadmap: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0f172a"/><stop offset="100%" stopColor="#0c1422"/></linearGradient>
        <linearGradient id={`${p}br`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0ea5e9"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      {[60,120,180,240,300,360,420].map(x=><line key={x} x1={x} y1="0" x2={x} y2="270" stroke="#38bdf8" strokeWidth="0.3" opacity="0.06"/>)}
      <rect x="0" y="0" width="5" height="270" fill="#38bdf8" opacity="0.72"/>
      <text x="28" y="42" fontFamily="Arial,sans-serif" fontSize="8.5" fill="#38bdf8" opacity="0.58" letterSpacing="3">PRODUCT ROADMAP</text>
      <text x="28" y="72" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#e0f2fe">Q1 → Q4</text>
      <text x="153" y="72" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="26" fill="#38bdf8"> 2025</text>
      <text x="28" y="102" fontFamily="Arial,sans-serif" fontSize="7.5" fill="rgba(224,242,254,0.28)" letterSpacing="1">SPRINT OVERVIEW</text>
      <text x="28" y="124" fontFamily="Arial,sans-serif" fontSize="8" fill="rgba(224,242,254,0.48)">Q1</text>
      <rect x="52" y="114" width="285" height="14" rx="3" fill={`url(#${p}br)`} opacity="0.82"/>
      <text x="58" y="125" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="white" opacity="0.82">Core Platform · API v2 · Auth System</text>
      <text x="28" y="150" fontFamily="Arial,sans-serif" fontSize="8" fill="rgba(224,242,254,0.48)">Q2</text>
      <rect x="52" y="140" width="205" height="14" rx="3" fill={`url(#${p}br)`} opacity="0.6"/>
      <text x="58" y="151" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="white" opacity="0.8">Mobile App · Analytics Dashboard</text>
      <text x="28" y="176" fontFamily="Arial,sans-serif" fontSize="8" fill="rgba(224,242,254,0.48)">Q3</text>
      <rect x="52" y="166" width="245" height="14" rx="3" fill="#38bdf8" opacity="0.38"/>
      <text x="58" y="177" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="white" opacity="0.68">Enterprise Features · Integrations</text>
      <text x="28" y="202" fontFamily="Arial,sans-serif" fontSize="8" fill="rgba(224,242,254,0.48)">Q4</text>
      <rect x="52" y="192" width="142" height="14" rx="3" fill="#38bdf8" opacity="0.22"/>
      <text x="58" y="203" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7.5" fill="white" opacity="0.48">Scale · Performance · v3.0 Launch</text>
      <line x1="338" y1="100" x2="338" y2="222" stroke="#38bdf8" strokeWidth="1" strokeDasharray="4,3" opacity="0.18"/>
      <text x="343" y="114" fontFamily="Arial,sans-serif" fontSize="7" fill="#38bdf8" opacity="0.38">TODAY</text>
      <text x="28" y="240" fontFamily="Arial,sans-serif" fontSize="7.5" fill="rgba(224,242,254,0.22)" letterSpacing="1">PRODUCT TEAM · AGILE SPRINT PLAN · 2025</text>
    </svg>
  ),

  /* ── 21. WELLNESS & SPA ──────────────────────── */
  wellness: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <radialGradient id={`${p}bg`} cx="62%" cy="42%" r="72%"><stop offset="0%" stopColor="#d6d3d1"/><stop offset="100%" stopColor="#fafaf9"/></radialGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <ellipse cx="382" cy="78" rx="112" ry="92" fill="#78716c" opacity="0.055" transform="rotate(-18 382 78)"/>
      <ellipse cx="118" cy="202" rx="92" ry="72" fill="#78716c" opacity="0.045" transform="rotate(14 118 202)"/>
      <circle cx="402" cy="54" r="46" fill="#78716c" opacity="0.065"/>
      <circle cx="434" cy="92" r="30" fill="#78716c" opacity="0.045"/>
      <circle cx="372" cy="78" r="20" fill="#78716c" opacity="0.075"/>
      <path d="M0,242 Q60,232 120,242 Q180,252 240,242 Q300,232 360,242 Q420,252 480,242 L480,270 L0,270 Z" fill="#78716c" opacity="0.045"/>
      <rect x="40" y="28" width="2" height="202" fill="#78716c" opacity="0.1"/>
      <text x="56" y="58" fontFamily="Georgia,serif" fontSize="8" fill="#78716c" letterSpacing="4" opacity="0.68">WELLNESS &amp; SPA</text>
      <text x="54" y="103" fontFamily="Georgia,serif" fontSize="30" fontWeight="700" fill="#292524">Serenity</text>
      <text x="54" y="138" fontFamily="Georgia,serif" fontSize="30" fontWeight="700" fill="#78716c">&amp;</text>
      <text x="78" y="138" fontFamily="Georgia,serif" fontSize="30" fontWeight="700" fill="#292524"> Balance</text>
      <rect x="54" y="152" width="205" height="1.5" fill="#78716c" opacity="0.22"/>
      <text x="54" y="172" fontFamily="Georgia,serif" fontSize="10.5" fill="#292524" opacity="0.48">Holistic Wellness Solutions</text>
      <text x="54" y="188" fontFamily="Georgia,serif" fontSize="10.5" fill="#292524" opacity="0.38">for Mind, Body &amp; Soul</text>
      {[{t:'Meditation',w:78},{t:'Yoga',w:52},{t:'Therapy',w:68}].map(({t,w},i)=>(
        <g key={i}><rect x={54+i*90} y="210" width={w} height="20" rx="10" fill="#78716c" opacity="0.09" stroke="#78716c" strokeWidth="0.7" opacity="0.28"/>
        <text x={54+i*90+10} y="224" fontFamily="Georgia,serif" fontSize="8" fill="#292524" opacity="0.48">{t}</text></g>
      ))}
    </svg>
  ),

  /* ── 22. SAAS SHOWCASE ───────────────────────── */
  saasshowcase: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8fafc"/><stop offset="100%" stopColor="#f1f5f9"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      {[60,90,120,150,180,210,240,270,300,330,360,390,420,450].map(x=>[42,72,102,132,162,192,222,252].map(y=><circle key={`${x}${y}`} cx={x} cy={y} r="1" fill="#4f46e5" opacity="0.04"/>))}
      <rect x="242" y="44" width="222" height="198" rx="10" fill="white"/>
      <rect x="242" y="44" width="222" height="28" rx="10" fill="#e2e8f0" opacity="0.78"/>
      <rect x="242" y="58" width="222" height="14" fill="#e2e8f0" opacity="0.78"/>
      <circle cx="260" cy="58" r="4" fill="#ef4444" opacity="0.58"/>
      <circle cx="274" cy="58" r="4" fill="#f59e0b" opacity="0.58"/>
      <circle cx="288" cy="58" r="4" fill="#10b981" opacity="0.58"/>
      <rect x="302" y="52" width="142" height="12" rx="3" fill="white" opacity="0.68"/>
      <text x="310" y="62" fontFamily="Arial,sans-serif" fontSize="7" fill="#4f46e5" opacity="0.48">app.deckflow.ai/dashboard</text>
      <rect x="242" y="72" width="40" height="170" fill="#f8fafc"/>
      {[86,106,126,146,166].map(y=><rect key={y} x="252" y={y} width="20" height="8" rx="2" fill="#4f46e5" opacity={0.08+y*0.0004}/>)}
      <rect x="286" y="80" width="162" height="12" rx="2" fill="#4f46e5" opacity="0.1"/>
      <rect x="286" y="100" width="76" height="52" rx="4" fill="#e0e7ff" opacity="0.48"/>
      <rect x="368" y="100" width="72" height="52" rx="4" fill="#dbeafe" opacity="0.48"/>
      <rect x="286" y="160" width="157" height="8" rx="2" fill="#e2e8f0" opacity="0.58"/>
      <rect x="286" y="172" width="122" height="8" rx="2" fill="#e2e8f0" opacity="0.38"/>
      <rect x="286" y="184" width="142" height="8" rx="2" fill="#e2e8f0" opacity="0.48"/>
      <rect x="40" y="34" width="122" height="20" rx="4" fill="#4f46e5" opacity="0.09"/>
      <text x="50" y="49" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="9" fill="#4f46e5" letterSpacing="1">◆ PRODUCT DEMO</text>
      <text x="40" y="99" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="24" fill="#0f172a">SaaS</text>
      <text x="40" y="127" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="24" fill="#4f46e5">Showcase</text>
      <text x="40" y="155" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="24" fill="#0f172a">Template</text>
      <rect x="40" y="168" width="182" height="2" fill="#4f46e5" opacity="0.18"/>
      <text x="40" y="186" fontFamily="Arial,sans-serif" fontSize="9.5" fill="#475569">Present your product with clarity.</text>
      {[{t:'Analytics',w:68},{t:'Dashboard',w:75}].map(({t,w},i)=>(
        <g key={i}><rect x={40+i*88} y="214" width={w} height="18" rx="9" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="0.7"/>
        <text x={40+i*88+10} y="227" fontFamily="Arial,sans-serif" fontWeight="600" fontSize="7.5" fill="#4f46e5">{t}</text></g>
      ))}
    </svg>
  ),

  /* ── 23. RETRO POSTER ────────────────────────── */
  retroposter: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <rect width="480" height="270" fill="#fef2f2"/>
      <rect x="8" y="8" width="464" height="254" fill="none" stroke="#dc2626" strokeWidth="3" opacity="0.82"/>
      <rect x="15" y="15" width="450" height="240" fill="none" stroke="#dc2626" strokeWidth="1" opacity="0.28"/>
      <rect x="22" y="22" width="436" height="62" fill="#dc2626"/>
      <text x="240" y="56" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="24" fill="white" textAnchor="middle" letterSpacing="6">RETRO POSTER</text>
      <text x="36" y="62" fontFamily="Arial,sans-serif" fontSize="18" fill="rgba(255,255,255,0.28)">★</text>
      <text x="428" y="62" fontFamily="Arial,sans-serif" fontSize="18" fill="rgba(255,255,255,0.28)">★</text>
      <rect x="22" y="84" width="436" height="5" fill="#dc2626" opacity="0.12"/>
      <text x="240" y="132" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="46" fill="#450a0a" textAnchor="middle" letterSpacing="-1">VINTAGE</text>
      <line x1="80" y1="144" x2="400" y2="144" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.38"/>
      <text x="240" y="175" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="27" fill="#dc2626" textAnchor="middle" letterSpacing="4">DESIGN CO.</text>
      <rect x="22" y="200" width="436" height="58" fill="#dc2626"/>
      <text x="240" y="218" fontFamily="Arial,sans-serif" fontSize="8" fill="rgba(255,255,255,0.58)" textAnchor="middle" letterSpacing="4">EST. MCMXCV · CREATIVE STUDIO</text>
      <text x="240" y="240" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="15" fill="white" textAnchor="middle" letterSpacing="3">PRESENTATION 2025</text>
      <text x="24" y="78" fontFamily="serif" fontSize="10" fill="#dc2626" opacity="0.28">◆</text>
      <text x="449" y="78" fontFamily="serif" fontSize="10" fill="#dc2626" opacity="0.28">◆</text>
    </svg>
  ),

  /* ── 24. CORPORATE TRUST ─────────────────────── */
  corporatetrust: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}lp`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#1e3a8a"/><stop offset="100%" stopColor="#1d4ed8"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill="#f8fafc"/>
      <rect x="0" y="0" width="168" height="270" fill={`url(#${p}lp)`}/>
      <circle cx="84" cy="100" r="52" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2"/>
      <circle cx="84" cy="100" r="38" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
      <circle cx="84" cy="100" r="25" fill="rgba(255,255,255,0.055)"/>
      <polygon points="84,76 99,89 99,112 84,122 69,112 69,89" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <text x="79" y="103" fontFamily="Georgia,serif" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.48)">CT</text>
      <text x="84" y="170" fontFamily="Arial,sans-serif" fontSize="7" fill="rgba(255,255,255,0.38)" textAnchor="middle" letterSpacing="2">ESTABLISHED</text>
      <text x="84" y="186" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" fill="rgba(255,255,255,0.58)" textAnchor="middle">1998</text>
      <rect x="168" y="0" width="312" height="4" fill="#1e3a8a" opacity="0.58"/>
      <text x="196" y="44" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#1e3a8a" opacity="0.48" letterSpacing="3">CORPORATE PARTNERSHIP</text>
      <rect x="196" y="52" width="262" height="1" fill="#1e3a8a" opacity="0.13"/>
      <text x="194" y="88" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="25" fill="#1e293b">CORPORATE</text>
      <text x="194" y="118" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="25" fill="#1e3a8a">TRUST</text>
      <text x="194" y="148" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="25" fill="#1e293b">PROPOSAL</text>
      <rect x="194" y="162" width="245" height="2" fill="#1e3a8a" opacity="0.18"/>
      <text x="194" y="182" fontFamily="Arial,sans-serif" fontSize="10" fill="#1e293b" opacity="0.58">Building lasting partnerships through</text>
      <text x="194" y="197" fontFamily="Arial,sans-serif" fontSize="10" fill="#1e293b" opacity="0.58">transparency and shared success.</text>
      <rect x="194" y="215" width="105" height="30" rx="4" fill="#e0e7ff" opacity="0.58"/>
      <text x="246" y="234" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#1e3a8a" textAnchor="middle">CLIENT A</text>
      <text x="308" y="233" fontFamily="Arial,sans-serif" fontSize="16" fill="#1e3a8a" opacity="0.28">⟷</text>
      <rect x="325" y="215" width="105" height="30" rx="4" fill="#dbeafe" opacity="0.48"/>
      <text x="377" y="234" fontFamily="Arial,sans-serif" fontSize="8" fontWeight="700" fill="#1e3a8a" textAnchor="middle">PARTNER B</text>
    </svg>
  ),

  /* ── 25. ABSTRACT GEOMETRY ───────────────────── */
  abstractgeom: (p) => (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`${p}bg`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#faf5ff"/><stop offset="100%" stopColor="#f3e8ff"/></linearGradient>
        <linearGradient id={`${p}t1`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#a855f7"/></linearGradient>
        <linearGradient id={`${p}t2`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#6d28d9"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#${p}bg)`}/>
      <polygon points="400,88 452,58 480,88 480,150 452,182 400,182 370,150 370,88" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.13"/>
      <polygon points="480,0 480,270 242,270" fill={`url(#${p}t1)`} opacity="0.1"/>
      <polygon points="302,0 480,0 480,182" fill={`url(#${p}t2)`} opacity="0.09"/>
      <polygon points="0,270 152,270 0,152" fill="#7c3aed" opacity="0.07"/>
      <polygon points="352,48 382,78 352,108 322,78" fill="none" stroke="#7c3aed" strokeWidth="1.5" opacity="0.28"/>
      <polygon points="352,48 382,78 352,108 322,78" fill="#7c3aed" opacity="0.055"/>
      <polygon points="422,140 447,165 422,190 397,165" fill="none" stroke="#a855f7" strokeWidth="1.5" opacity="0.22"/>
      <polygon points="382,202 402,232 362,232" fill="#7c3aed" opacity="0.13"/>
      <polygon points="402,197 418,222 386,222" fill="#a855f7" opacity="0.1"/>
      <circle cx="58" cy="58" r="46" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.13"/>
      <circle cx="58" cy="58" r="30" fill="#7c3aed" opacity="0.055"/>
      <text x="48" y="52" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#7c3aed" opacity="0.58" letterSpacing="3">ABSTRACT</text>
      <text x="46" y="100" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill="#2e1065">GEOMETRIC</text>
      <text x="46" y="133" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill="#7c3aed">DESIGN</text>
      <text x="46" y="166" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill="#2e1065">STUDIO</text>
      <rect x="46" y="180" width="225" height="2" fill="#7c3aed" opacity="0.22"/>
      <text x="46" y="200" fontFamily="Arial,sans-serif" fontSize="10.5" fill="#2e1065" opacity="0.48">Where geometry meets creativity.</text>
      <polygon points="46,247 60,227 74,247" fill="#7c3aed" opacity="0.13"/>
      <polygon points="60,252 74,232 88,252" fill="#a855f7" opacity="0.09"/>
      <polygon points="74,247 88,227 102,247" fill="#7c3aed" opacity="0.11"/>
      <text x="46" y="264" fontFamily="Arial,sans-serif" fontSize="7.5" fill="#2e1065" opacity="0.32" letterSpacing="2">CREATIVE CONCEPT DECK · 2025</text>
    </svg>
  ),

};

/* ═══════════════════════════════════════════════════
   MAIN EXPORT — picks the right SVG per template
═══════════════════════════════════════════════════ */
export default function TemplateCardPreview({ t }) {
  const render = SLIDE_DESIGNS[t.id];
  if (render) return render(t.id);

  // Generic premium fallback for any future templates
  return (
    <svg viewBox="0 0 480 270" style={S}>
      <defs>
        <linearGradient id={`fb-${t.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.bg}/>
          <stop offset="100%" stopColor={t.accent} stopOpacity="0.3"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" fill={`url(#fb-${t.id})`}/>
      <rect x="0" y="0" width="5" height="270" fill={t.accent} opacity="0.85"/>
      <rect x="0" y="0" width="480" height="2" fill={t.accent} opacity="0.5"/>
      <circle cx="400" cy="80" r="75" fill={t.accent} opacity="0.08"/>
      <circle cx="400" cy="80" r="50" fill={t.accent} opacity="0.06"/>
      <text x="30" y="48" fontFamily="Arial,sans-serif" fontSize="7.5" fontWeight="700" fill={t.text} opacity="0.42" letterSpacing="3">{t.category.toUpperCase()}</text>
      <text x="28" y="95" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="28" fill={t.text}>{t.name}</text>
      <rect x="28" y="108" width="200" height="2" fill={t.accent} opacity="0.4"/>
      <text x="28" y="130" fontFamily="Arial,sans-serif" fontSize="9.5" fill={t.text} opacity="0.52">{t.philosophy}</text>
    </svg>
  );
}
