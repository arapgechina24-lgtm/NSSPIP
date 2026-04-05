/**
 * NCTIRS Sheng NLP Engine
 * Kenyan urban vernacular threat detection & sentiment analysis
 * 
 * Integrates with sovereign Ollama for deep contextual analysis
 * and uses local lexicon for fast keyword-level scanning
 */

import { SHENG_LEXICON, SHENG_TERM_MAP, CRITICAL_TERMS, type ShengTerm } from './sheng-lexicon';

export interface ShengAnalysisResult {
  originalText: string;
  detectedTerms: DetectedTerm[];
  translatedText: string;
  threatAssessment: {
    overallLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    score: number; // 0-100
    categories: string[];
    justification: string;
  };
  sentiment: {
    score: number; // -1 (negative) to 1 (positive)
    label: 'HOSTILE' | 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE';
  };
  regions: string[];
  processingTime: number;
  engine: 'lexicon' | 'ollama' | 'hybrid';
}

export interface DetectedTerm {
  term: ShengTerm;
  position: number;
  matchedText: string;
  context: string; // surrounding text for disambiguation
}

export class ShengNLPEngine {
  private lexicon = SHENG_LEXICON;
  private termMap = SHENG_TERM_MAP;

  /**
   * Full analysis pipeline: scan text for Sheng terms, assess threat, translate
   */
  async analyzeText(text: string): Promise<ShengAnalysisResult> {
    const startTime = Date.now();
    const normalizedText = text.toLowerCase().trim();

    // Step 1: Lexicon scan — detect all known Sheng terms
    const detectedTerms = this.scanForTerms(normalizedText);

    // Step 2: Threat assessment
    const threatAssessment = this.assessThreat(detectedTerms, normalizedText);

    // Step 3: Translation
    const translatedText = this.translateToEnglish(text, detectedTerms);

    // Step 4: Sentiment analysis
    const sentiment = this.analyzeSentiment(detectedTerms, normalizedText);

    // Step 5: Extract regions
    const regions = this.extractRegions(detectedTerms);

    return {
      originalText: text,
      detectedTerms,
      translatedText,
      threatAssessment,
      sentiment,
      regions,
      processingTime: Date.now() - startTime,
      engine: 'lexicon',
    };
  }

  /**
   * Scan text for known Sheng/Swahili threat keywords
   */
  private scanForTerms(text: string): DetectedTerm[] {
    const detected: DetectedTerm[] = [];
    const words = text.split(/[\s,;.!?]+/);

    // Single-word matching
    words.forEach((word, idx) => {
      const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase();
      const term = this.termMap.get(clean);
      if (term) {
        const position = text.indexOf(word);
        detected.push({
          term,
          position,
          matchedText: word,
          context: this.getContext(text, position, 40),
        });
      }
    });

    // Multi-word phrase matching (e.g., "kupiga risasi", "wasee wa mtaa")
    for (const entry of this.lexicon) {
      if (entry.sheng.includes(' ')) {
        const phraseIdx = text.indexOf(entry.sheng.toLowerCase());
        if (phraseIdx !== -1) {
          // Check if already detected via single-word
          const alreadyDetected = detected.some(d => 
            d.position === phraseIdx && d.term.sheng === entry.sheng
          );
          if (!alreadyDetected) {
            detected.push({
              term: entry,
              position: phraseIdx,
              matchedText: entry.sheng,
              context: this.getContext(text, phraseIdx, 40),
            });
          }
        }
      }
    }

    return detected.sort((a, b) => a.position - b.position);
  }

  /**
   * Assess overall threat level from detected terms
   */
  private assessThreat(terms: DetectedTerm[], text: string): ShengAnalysisResult['threatAssessment'] {
    if (terms.length === 0) {
      return {
        overallLevel: 'NONE',
        score: 0,
        categories: [],
        justification: 'No threat indicators detected in text.',
      };
    }

    const threatTerms = terms.filter(t => t.term.threatLevel !== 'NONE');
    const categories = [...new Set(threatTerms.map(t => t.term.category))];

    // Score calculation
    const levelScores: Record<string, number> = {
      CRITICAL: 40,
      HIGH: 25,
      MEDIUM: 15,
      LOW: 5,
      NONE: 0,
    };

    let score = 0;
    threatTerms.forEach(t => {
      score += levelScores[t.term.threatLevel] || 0;
    });

    // Bonus for multiple categories (cross-domain threat)
    if (categories.length > 2) score += 15;

    // Bonus for critical density (multiple critical terms)
    const criticalCount = threatTerms.filter(t => t.term.threatLevel === 'CRITICAL').length;
    if (criticalCount >= 3) score += 20;

    score = Math.min(100, score);

    // Map score to level
    let overallLevel: ShengAnalysisResult['threatAssessment']['overallLevel'];
    if (score >= 70) overallLevel = 'CRITICAL';
    else if (score >= 50) overallLevel = 'HIGH';
    else if (score >= 25) overallLevel = 'MEDIUM';
    else if (score > 0) overallLevel = 'LOW';
    else overallLevel = 'NONE';

    return {
      overallLevel,
      score,
      categories,
      justification: `Detected ${threatTerms.length} threat indicator(s) across ${categories.length} category/categories: ${categories.join(', ')}. ${criticalCount} critical-level terms found.`,
    };
  }

  /**
   * Translate Sheng text to English by replacing known terms
   */
  private translateToEnglish(text: string, terms: DetectedTerm[]): string {
    let translated = text;

    // Sort by length (longest first) to avoid partial replacements
    const sortedTerms = [...terms].sort((a, b) => b.term.sheng.length - a.term.sheng.length);

    for (const detected of sortedTerms) {
      const regex = new RegExp(detected.term.sheng.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      translated = translated.replace(regex, `[${detected.term.english}]`);
    }

    return translated;
  }

  /**
   * Basic sentiment analysis based on threat term density and categories
   */
  private analyzeSentiment(terms: DetectedTerm[], text: string): ShengAnalysisResult['sentiment'] {
    const totalWords = text.split(/\s+/).length;
    const threatTerms = terms.filter(t => t.term.threatLevel !== 'NONE');

    if (threatTerms.length === 0) {
      return { score: 0.1, label: 'NEUTRAL' };
    }

    // Threat density ratio
    const density = threatTerms.length / Math.max(totalWords, 1);

    // Weight by severity
    const weights: Record<string, number> = { CRITICAL: -0.3, HIGH: -0.2, MEDIUM: -0.1, LOW: -0.05 };
    let weightedScore = 0;
    threatTerms.forEach(t => {
      weightedScore += weights[t.term.threatLevel] || 0;
    });

    const finalScore = Math.max(-1, Math.min(1, weightedScore));

    let label: ShengAnalysisResult['sentiment']['label'];
    if (finalScore <= -0.5) label = 'HOSTILE';
    else if (finalScore <= -0.1) label = 'NEGATIVE';
    else if (finalScore < 0.1) label = 'NEUTRAL';
    else label = 'POSITIVE';

    return { score: finalScore, label };
  }

  /**
   * Extract likely geographic regions from detected terms
   */
  private extractRegions(terms: DetectedTerm[]): string[] {
    const regions = new Set<string>();
    terms.forEach(t => {
      t.term.region.forEach(r => regions.add(r));
    });
    return Array.from(regions);
  }

  /**
   * Get surrounding context for a word position
   */
  private getContext(text: string, position: number, radius: number): string {
    const start = Math.max(0, position - radius);
    const end = Math.min(text.length, position + radius);
    return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
  }

  /**
   * Quick threat scan — returns only critical findings (for real-time streaming)
   */
  quickScan(text: string): { hasThreat: boolean; criticalTerms: string[]; score: number } {
    const normalizedText = text.toLowerCase();
    const criticalFound: string[] = [];

    for (const term of CRITICAL_TERMS) {
      if (normalizedText.includes(term.sheng.toLowerCase())) {
        criticalFound.push(term.sheng);
      }
    }

    return {
      hasThreat: criticalFound.length > 0,
      criticalTerms: criticalFound,
      score: Math.min(100, criticalFound.length * 30),
    };
  }

  /**
   * Get lexicon statistics
   */
  getStats() {
    const categories: Record<string, number> = {};
    const threatLevels: Record<string, number> = {};

    this.lexicon.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + 1;
      threatLevels[t.threatLevel] = (threatLevels[t.threatLevel] || 0) + 1;
    });

    return {
      totalTerms: this.lexicon.length,
      categories,
      threatLevels,
      lastUpdated: '2026-03-10',
      source: 'NCTIRS-Linguistics-Team + UoN Partnership',
    };
  }
}

export const shengEngine = new ShengNLPEngine();
