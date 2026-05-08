import { ALGAReport } from '../types/alga';

export interface QuarantinedItem {
  id: string;
  originalContent: string;
  report: ALGAReport;
  timestamp: string;
  sourceDevice: string;
}

class QuarantineStore {
  private items: QuarantinedItem[] = [];

  constructor() {
    const saved = localStorage.getItem('zq_quarantine_store');
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (e) {
        this.items = [];
      }
    }
  }

  add(content: string, report: ALGAReport) {
    const item: QuarantinedItem = {
      id: `quarantine-${Date.now()}`,
      originalContent: content,
      report,
      timestamp: new Date().toISOString(),
      sourceDevice: 'ZQ-LOCAL-NODE'
    };
    this.items.unshift(item);
    this.save();
    return item;
  }

  getAll() {
    return this.items;
  }

  remove(id: string) {
    this.items = this.items.filter(i => i.id !== id);
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }

  private save() {
    localStorage.setItem('zq_quarantine_store', JSON.stringify(this.items));
    window.dispatchEvent(new CustomEvent('zq_quarantine_update'));
  }
}

export const quarantineStore = new QuarantineStore();
