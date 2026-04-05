/**
 * NCTIRS Sheng/Swahili Threat Lexicon
 * Curated dataset of Kenyan urban slang mapped to threat categories
 * 
 * Built in partnership concept with University of Nairobi Linguistics Dept.
 * Covers: Nairobi, Mombasa, Kisumu, Eldoret, Nakuru urban vernacular
 */

export interface ShengTerm {
  sheng: string;
  english: string;
  category: 'WEAPON' | 'VIOLENCE' | 'DRUG' | 'THEFT' | 'GANG' | 'MOVEMENT' | 'POLICE' | 'MONEY' | 'CYBERCRIME' | 'SMUGGLING' | 'RADICALIZATION' | 'NEUTRAL';
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  region: string[];
  context?: string;
}

/**
 * Core Sheng/Swahili threat lexicon
 * Sources: Urban fieldwork, social media monitoring, law enforcement glossaries
 */
export const SHENG_LEXICON: ShengTerm[] = [
  // ===== WEAPONS =====
  { sheng: 'bunduki', english: 'gun/firearm', category: 'WEAPON', threatLevel: 'CRITICAL', region: ['National'], context: 'Standard Swahili, universally understood' },
  { sheng: 'mshale', english: 'bullet/ammunition', category: 'WEAPON', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kisu', english: 'knife/blade', category: 'WEAPON', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'panga', english: 'machete', category: 'WEAPON', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'chapaa', english: 'weapon (slang)', category: 'WEAPON', threatLevel: 'HIGH', region: ['Nairobi', 'Mombasa'] },
  { sheng: 'mzinga', english: 'explosive/bomb', category: 'WEAPON', threatLevel: 'CRITICAL', region: ['National'], context: 'Also means bottle in casual context — needs disambiguation' },
  { sheng: 'rungu', english: 'club/baton', category: 'WEAPON', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'nyahunyo', english: 'whip', category: 'WEAPON', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'nderemo', english: 'grenade', category: 'WEAPON', threatLevel: 'CRITICAL', region: ['Nairobi', 'Mombasa', 'Border'] },
  { sheng: 'mbao', english: 'pistol (slang)', category: 'WEAPON', threatLevel: 'CRITICAL', region: ['Nairobi'] },
  { sheng: 'ndonga', english: 'heavy weapon/rifle', category: 'WEAPON', threatLevel: 'CRITICAL', region: ['Nairobi', 'Eastlands'] },

  // ===== VIOLENCE =====
  { sheng: 'kuchinja', english: 'to slaughter/kill', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kupiga', english: 'to hit/beat/shoot', category: 'VIOLENCE', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'kuchapa', english: 'to beat up severely', category: 'VIOLENCE', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'kumaliza', english: 'to finish off/kill', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kutoa ngumi', english: 'to punch/assault', category: 'VIOLENCE', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'kufyeka', english: 'to hack/slash', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kunyonga', english: 'to strangle', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kupigwa risasi', english: 'to be shot', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kuchomea', english: 'to stab', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['Nairobi', 'Mombasa'] },
  { sheng: 'kudedi', english: 'someone died', category: 'VIOLENCE', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'kufanya mob justice', english: 'to lynch', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kurushiana', english: 'to exchange fire/fight', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['Nairobi'] },
  { sheng: 'kuchomwa', english: 'to be burned/arson', category: 'VIOLENCE', threatLevel: 'CRITICAL', region: ['National'] },

  // ===== DRUG-RELATED =====
  { sheng: 'bangi', english: 'marijuana', category: 'DRUG', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'ndukulu', english: 'heroin', category: 'DRUG', threatLevel: 'HIGH', region: ['Mombasa', 'Coast'] },
  { sheng: 'dawa', english: 'drugs (general)', category: 'DRUG', threatLevel: 'HIGH', region: ['National'], context: 'Also means medicine — context-dependent' },
  { sheng: 'brownies', english: 'heroin (street)', category: 'DRUG', threatLevel: 'HIGH', region: ['Mombasa'] },
  { sheng: 'mkorogo', english: 'cocaine', category: 'DRUG', threatLevel: 'HIGH', region: ['Nairobi', 'Mombasa'] },
  { sheng: 'muguka', english: 'stimulant plant', category: 'DRUG', threatLevel: 'LOW', region: ['Meru', 'Eastern'] },
  { sheng: 'chang\'aa', english: 'illicit brew', category: 'DRUG', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'kulevya', english: 'to get intoxicated/drug use', category: 'DRUG', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'kubeba supply', english: 'to transport drugs', category: 'DRUG', threatLevel: 'HIGH', region: ['Mombasa', 'Coast'] },

  // ===== THEFT & ROBBERY =====
  { sheng: 'kuibia', english: 'to steal', category: 'THEFT', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'kunyakua', english: 'to snatch/rob', category: 'THEFT', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'kugonga', english: 'to rob/mug', category: 'THEFT', threatLevel: 'HIGH', region: ['Nairobi', 'Mombasa'] },
  { sheng: 'kupiga nduru', english: 'to shout (during robbery)', category: 'THEFT', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'kupora', english: 'to rob with violence', category: 'THEFT', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'jambazi', english: 'armed robber/bandit', category: 'THEFT', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kuvamia', english: 'to invade/break in', category: 'THEFT', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'heist', english: 'planned robbery (adopted)', category: 'THEFT', threatLevel: 'CRITICAL', region: ['Nairobi'] },
  { sheng: 'kufanya mbachao', english: 'to pull off a hustle/scam', category: 'THEFT', threatLevel: 'MEDIUM', region: ['Nairobi'] },
  { sheng: 'manamba', english: 'getaway driver', category: 'THEFT', threatLevel: 'HIGH', region: ['Nairobi'] },

  // ===== GANG TERMINOLOGY =====
  { sheng: 'mungiki', english: 'banned sect/gang', category: 'GANG', threatLevel: 'CRITICAL', region: ['Central', 'Nairobi'] },
  { sheng: 'gaza', english: 'gang territory', category: 'GANG', threatLevel: 'HIGH', region: ['Nairobi', 'Mombasa'] },
  { sheng: 'mtaa', english: 'hood/territory', category: 'GANG', threatLevel: 'MEDIUM', region: ['Nairobi'] },
  { sheng: 'ndugu', english: 'brother/gang member', category: 'GANG', threatLevel: 'LOW', region: ['National'], context: 'Usually innocent — flag only in threat context' },
  { sheng: 'wasee wa mtaa', english: 'street crew/gang', category: 'GANG', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'ma-OG', english: 'established gang leaders', category: 'GANG', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'kamjesh', english: 'youth gang/militia', category: 'GANG', threatLevel: 'HIGH', region: ['Nairobi', 'Kisumu'] },
  { sheng: 'confirm', english: 'gang initiation/kill order (Sheng)', category: 'GANG', threatLevel: 'CRITICAL', region: ['Nairobi'], context: 'In context of gang comms, means assassination order' },
  { sheng: 'kubeba jina', english: 'to carry street reputation', category: 'GANG', threatLevel: 'MEDIUM', region: ['Nairobi'] },

  // ===== MOVEMENT / OPERATIONAL =====
  { sheng: 'kukimbia', english: 'to flee/run', category: 'MOVEMENT', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'kuvuka border', english: 'to cross border illegally', category: 'MOVEMENT', threatLevel: 'HIGH', region: ['Border'] },
  { sheng: 'kujificha', english: 'to hide/go underground', category: 'MOVEMENT', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'kupitia njia panya', english: 'using back routes/smuggling paths', category: 'MOVEMENT', threatLevel: 'HIGH', region: ['Border', 'Coast'] },
  { sheng: 'kufanya recce', english: 'to conduct reconnaissance', category: 'MOVEMENT', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kucheki ground', english: 'to scout an area', category: 'MOVEMENT', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'kuenda chini', english: 'to go undercover/lay low', category: 'MOVEMENT', threatLevel: 'HIGH', region: ['National'] },

  // ===== POLICE / LAW ENFORCEMENT =====
  { sheng: 'karao', english: 'police officer (Sheng)', category: 'POLICE', threatLevel: 'NONE', region: ['Nairobi'] },
  { sheng: 'dem/sanse', english: 'bribe/corruption', category: 'POLICE', threatLevel: 'MEDIUM', region: ['National'] },
  { sheng: 'mabeast', english: 'brutal police (neg slang)', category: 'POLICE', threatLevel: 'LOW', region: ['Nairobi'] },
  { sheng: 'kukaliwa', english: 'to be arrested', category: 'POLICE', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'cell', english: 'jail/police cells', category: 'POLICE', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'kuoshwa', english: 'to be cleaned (killed by police)', category: 'POLICE', threatLevel: 'HIGH', region: ['Nairobi'], context: 'Euphemism for extrajudicial killing' },

  // ===== MONEY / FINANCIAL CRIME =====
  { sheng: 'mdomo', english: 'ransom/extortion demand', category: 'MONEY', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'kutesa', english: 'to extort/demand payment', category: 'MONEY', threatLevel: 'HIGH', region: ['Nairobi', 'Mombasa'] },
  { sheng: 'kucheza pesa', english: 'money laundering (euphemism)', category: 'MONEY', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'kusafisha', english: 'to clean/launder money', category: 'MONEY', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'hawala', english: 'informal money transfer', category: 'MONEY', threatLevel: 'HIGH', region: ['Eastleigh', 'Mombasa'], context: 'Legitimate system but used for terror financing' },
  { sheng: 'mpesa ya chini', english: 'underground M-Pesa transfers', category: 'MONEY', threatLevel: 'HIGH', region: ['National'] },

  // ===== CYBERCRIME =====
  { sheng: 'kuhack', english: 'to hack (adopted)', category: 'CYBERCRIME', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'SIM swap', english: 'SIM card hijacking', category: 'CYBERCRIME', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kubamba', english: 'to intercept/phish', category: 'CYBERCRIME', threatLevel: 'HIGH', region: ['Nairobi'] },
  { sheng: 'kudunga OTP', english: 'to steal one-time passwords', category: 'CYBERCRIME', threatLevel: 'CRITICAL', region: ['National'] },
  { sheng: 'kucheza na system', english: 'to hack/tamper with systems', category: 'CYBERCRIME', threatLevel: 'CRITICAL', region: ['Nairobi'] },

  // ===== SMUGGLING =====
  { sheng: 'magendo', english: 'smuggling/contraband', category: 'SMUGGLING', threatLevel: 'HIGH', region: ['National'] },
  { sheng: 'kupitisha mali', english: 'to smuggle goods', category: 'SMUGGLING', threatLevel: 'HIGH', region: ['Border', 'Coast'] },
  { sheng: 'kuficha ndani', english: 'to conceal inside (vehicle/ship)', category: 'SMUGGLING', threatLevel: 'HIGH', region: ['Mombasa'] },
  { sheng: 'miraa run', english: 'khat smuggling route', category: 'SMUGGLING', threatLevel: 'MEDIUM', region: ['Meru', 'Coast'] },

  // ===== RADICALIZATION =====
  { sheng: 'jihadi', english: 'jihad fighter/radical', category: 'RADICALIZATION', threatLevel: 'CRITICAL', region: ['Coast', 'NEP'] },
  { sheng: 'kuandikishwa', english: 'to be recruited (radical)', category: 'RADICALIZATION', threatLevel: 'CRITICAL', region: ['Coast', 'Eastleigh'] },
  { sheng: 'kupiga msalaba', english: 'to cross over (join radical group)', category: 'RADICALIZATION', threatLevel: 'CRITICAL', region: ['Coast'] },
  { sheng: 'madrasa ya chini', english: 'underground religious school', category: 'RADICALIZATION', threatLevel: 'HIGH', region: ['Coast', 'NEP'] },
  { sheng: 'kusafiri Somalia', english: 'to travel to Somalia (radicalization)', category: 'RADICALIZATION', threatLevel: 'CRITICAL', region: ['NEP', 'Coast'], context: 'Legitimate travel exists — flag in threat context only' },
  { sheng: 'shahidi', english: 'martyr (radical context)', category: 'RADICALIZATION', threatLevel: 'CRITICAL', region: ['Coast', 'NEP'] },

  // ===== NEUTRAL (Common Sheng for NLP training) =====
  { sheng: 'niaje', english: 'what\'s up?', category: 'NEUTRAL', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'sema', english: 'say/talk', category: 'NEUTRAL', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'poa', english: 'cool/fine', category: 'NEUTRAL', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'maze', english: 'man/dude', category: 'NEUTRAL', threatLevel: 'NONE', region: ['Nairobi'] },
  { sheng: 'fiti', english: 'okay/good', category: 'NEUTRAL', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'mdosi', english: 'boss/wealthy person', category: 'NEUTRAL', threatLevel: 'NONE', region: ['Nairobi'] },
  { sheng: 'dame', english: 'woman/girl', category: 'NEUTRAL', threatLevel: 'NONE', region: ['National'] },
  { sheng: 'mbuzi', english: 'goat/naive person', category: 'NEUTRAL', threatLevel: 'NONE', region: ['National'] },
];

/**
 * Quick lookup maps for performance
 */
export const SHENG_TERM_MAP = new Map(SHENG_LEXICON.map(t => [t.sheng.toLowerCase(), t]));

export const THREAT_TERMS = SHENG_LEXICON.filter(t => t.threatLevel !== 'NONE');
export const CRITICAL_TERMS = SHENG_LEXICON.filter(t => t.threatLevel === 'CRITICAL');

export function lookupTerm(term: string): ShengTerm | undefined {
  return SHENG_TERM_MAP.get(term.toLowerCase());
}

export function getTermsByCategory(category: ShengTerm['category']): ShengTerm[] {
  return SHENG_LEXICON.filter(t => t.category === category);
}

export function getTermsByRegion(region: string): ShengTerm[] {
  return SHENG_LEXICON.filter(t => t.region.includes(region) || t.region.includes('National'));
}
