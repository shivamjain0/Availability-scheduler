import { Component, OnInit } from '@angular/core';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isDefault?: boolean;
}

interface DayAvailability {
  day: string;
  slots: TimeSlot[];
  isExpanded: boolean;
  isEnabled: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  days: DayAvailability[] = [
    { day: 'Monday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true },
    { day: 'Tuesday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true },
    { day: 'Wednesday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true },
    { day: 'Thursday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true },
    { day: 'Friday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true },
    { day: 'Saturday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true },
    { day: 'Sunday', slots: [{ startTime: '09:00', endTime: '18:00', isDefault: true }], isExpanded: false, isEnabled: true }
  ];

  ngOnInit() {
    const savedDays = localStorage.getItem('availability');
    if (savedDays) {
      const parsedDays = JSON.parse(savedDays);
      this.days = this.days.map(day => {
        const savedDay = parsedDays.find((d: DayAvailability) => d.day === day.day);
        return savedDay ? { ...day, slots: savedDay.slots, isEnabled: savedDay.isEnabled } : day;
      });
    }
  }

  toggleDay(index: number) {
    this.days = this.days.map((day, i) => ({
      ...day,
      isExpanded: i === index ? !day.isExpanded : false
    }));
  }

  toggleEnabled(index: number) {
    this.days = this.days.map((day, i) => ({
      ...day,
      isEnabled: i === index ? !day.isEnabled : day.isEnabled,
      isExpanded: false
    }));
    this.saveDays();
  }

  saveDays() {
    localStorage.setItem('availability', JSON.stringify(this.days));
  }

  getDefaultTime(day: DayAvailability): string {
    const defaultSlot = day.slots.find(slot => slot.isDefault);
    if (!defaultSlot) return '';
    return `${this.formatTime(defaultSlot.startTime)} to ${this.formatTime(defaultSlot.endTime)}`;
  }

  formatTime(time: string): string {
    const [hour, minute] = time.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  getAddedSlotsCount(day: DayAvailability): number {
    return day.slots.filter(slot => !slot.isDefault).length;
  }
}