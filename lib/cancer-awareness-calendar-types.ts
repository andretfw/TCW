export type LocalizedText = Record<'en' | 'ro' | 'es', string>;

export type AwarenessDefinition = {
  title: LocalizedText;
  scope: LocalizedText;
  href: string;
  source: string;
  color: string;
};

export type EventDefinition = {
  date: string;
  name: LocalizedText;
  scope: LocalizedText;
  href: string;
  source: string;
};

export type MonthDefinition = {
  name: LocalizedText;
  awareness: AwarenessDefinition[];
  events: EventDefinition[];
};

export type CancerAwarenessCalendar2026 = {
  year: number;
  awarenessMonthLabel: string;
  keyDatesLabel: string;
  emptyMonth: string;
  scopeTitle: string;
  scopeNote: string;
  sourceTitle: string;
  sourceIntro: string;
  months: Array<{
    name: string;
    awareness: Array<{
      title: string;
      scope: string;
      href: string;
      source: string;
      color: string;
    }>;
    events: Array<{
      date: string;
      name: string;
      scope: string;
      href: string;
      source: string;
    }>;
  }>;
};
