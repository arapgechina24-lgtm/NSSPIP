/**
 * NSSPIP Event Stream Manager
 * Real-time event ingestion pipeline
 * 
 * In production: connects to Apache Kafka
 * In MVP/demo: uses in-memory queue with same interface
 */

export interface StreamEvent {
  id: string;
  topic: 'incidents' | 'threats' | 'edge-telemetry' | 'social-signals' | 'cross-sector';
  source: string;
  timestamp: string;
  payload: Record<string, unknown>;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  processed: boolean;
}

export interface StreamStatus {
  mode: 'kafka' | 'in-memory';
  connected: boolean;
  topics: TopicStatus[];
  totalEventsIngested: number;
  eventsPerSecond: number;
  queueDepth: number;
  uptime: number;
  lastEvent: string | null;
}

export interface TopicStatus {
  name: string;
  eventCount: number;
  lastEvent: string | null;
  consumers: number;
}

type EventHandler = (event: StreamEvent) => void;

class EventStreamManager {
  private events: Map<string, StreamEvent[]> = new Map();
  private subscribers: Map<string, EventHandler[]> = new Map();
  private totalIngested = 0;
  private startTime = Date.now();
  private lastIngestTime: string | null = null;
  private recentIngestTimes: number[] = [];

  constructor() {
    // Initialize topic queues
    const topics = ['incidents', 'threats', 'edge-telemetry', 'social-signals', 'cross-sector'];
    topics.forEach(topic => {
      this.events.set(topic, []);
      this.subscribers.set(topic, []);
    });
  }

  /**
   * Ingest a new event into the stream
   */
  async ingestEvent(event: Omit<StreamEvent, 'id' | 'processed'>): Promise<StreamEvent> {
    const fullEvent: StreamEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      processed: false,
    };

    // Add to topic queue
    const topicQueue = this.events.get(event.topic);
    if (topicQueue) {
      topicQueue.push(fullEvent);
      // Cap queue at 10,000 events per topic
      if (topicQueue.length > 10000) {
        topicQueue.shift();
      }
    }

    this.totalIngested++;
    this.lastIngestTime = new Date().toISOString();
    this.recentIngestTimes.push(Date.now());

    // Clean old timestamps (keep last 60 seconds)
    const cutoff = Date.now() - 60000;
    this.recentIngestTimes = this.recentIngestTimes.filter(t => t > cutoff);

    // Notify subscribers
    const handlers = this.subscribers.get(event.topic) || [];
    handlers.forEach(handler => {
      try {
        handler(fullEvent);
      } catch (err) {
        console.error(`[Stream] Handler error on topic ${event.topic}:`, err);
      }
    });

    return fullEvent;
  }

  /**
   * Subscribe to a topic
   */
  subscribe(topic: string, handler: EventHandler): () => void {
    const handlers = this.subscribers.get(topic);
    if (handlers) {
      handlers.push(handler);
    }

    // Return unsubscribe function
    return () => {
      const idx = handlers?.indexOf(handler);
      if (idx !== undefined && idx >= 0) {
        handlers?.splice(idx, 1);
      }
    };
  }

  /**
   * Get recent events from a topic
   */
  getRecentEvents(topic: string, limit = 50): StreamEvent[] {
    const queue = this.events.get(topic) || [];
    return queue.slice(-limit).reverse();
  }

  /**
   * Get stream health and status
   */
  getStatus(): StreamStatus {
    const isKafkaAvailable = !!process.env.KAFKA_BROKERS;

    const topics: TopicStatus[] = [];
    this.events.forEach((events, name) => {
      const subscribers = this.subscribers.get(name) || [];
      topics.push({
        name,
        eventCount: events.length,
        lastEvent: events.length > 0 ? events[events.length - 1].timestamp : null,
        consumers: subscribers.length,
      });
    });

    // Calculate events per second (over last 60s window)
    const eventsPerSecond = this.recentIngestTimes.length / 60;

    let totalQueueDepth = 0;
    this.events.forEach(events => {
      totalQueueDepth += events.filter(e => !e.processed).length;
    });

    return {
      mode: isKafkaAvailable ? 'kafka' : 'in-memory',
      connected: true,
      topics,
      totalEventsIngested: this.totalIngested,
      eventsPerSecond: Math.round(eventsPerSecond * 100) / 100,
      queueDepth: totalQueueDepth,
      uptime: Math.round((Date.now() - this.startTime) / 1000),
      lastEvent: this.lastIngestTime,
    };
  }

  /**
   * Mark an event as processed
   */
  markProcessed(eventId: string): boolean {
    for (const [, events] of this.events) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        event.processed = true;
        return true;
      }
    }
    return false;
  }
}

// Singleton
export const eventStream = new EventStreamManager();
