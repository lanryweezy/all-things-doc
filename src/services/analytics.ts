// Privacy-friendly analytics service
// No personal data collection, only usage metrics

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private startTime: number;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeSession();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  private initializeSession() {
    // Track session start
    this.trackEvent({
      category: 'Session',
      action: 'Start',
      label: window.location.pathname,
    });

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent({
        category: 'Session',
        action: 'End',
        value: Math.round((Date.now() - this.startTime) / 1000), // Duration in seconds
      });
      this.sendEvents();
    });
  }

  public trackToolUsage(toolId: string, action: string = 'Used') {
    this.trackEvent({
      category: 'Tool',
      action: action,
      label: toolId,
    });
  }

  public trackFileProcessing(toolId: string, fileSize: number, success: boolean) {
    this.trackEvent({
      category: 'File',
      action: success ? 'Processed Successfully' : 'Processing Failed',
      label: toolId,
      value: Math.round(fileSize / 1024), // Size in KB
    });
  }

  public trackError(toolId: string, errorType: string) {
    this.trackEvent({
      category: 'Error',
      action: errorType,
      label: toolId,
    });
  }

  public trackPageView(page: string) {
    this.trackEvent({
      category: 'Page',
      action: 'View',
      label: page,
    });
  }

  private trackEvent(event: AnalyticsEvent) {
    const eventWithTimestamp = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };

    this.events.push(eventWithTimestamp);

    // Send events in batches to reduce network calls
    if (this.events.length >= 5) {
      this.sendEvents();
    }
  }

  private sendEvents() {
    if (this.events.length === 0) return;

    // Send to your analytics endpoint or store locally
    // For now, we'll log to console (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.group('Analytics Events');
      console.table(this.events);
      console.groupEnd();
    }

    // In production, you would send to your analytics endpoint:
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ events: this.events })
    // });

    // Clear events after sending
    this.events = [];
  }

  // Get basic usage statistics
  public getUsageStats() {
    return {
      sessionId: this.sessionId,
      sessionDuration: Math.round((Date.now() - this.startTime) / 1000),
      pendingEvents: this.events.length,
    };
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance();
