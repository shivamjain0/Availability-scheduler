import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

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
  selector: 'app-availability-day',
  templateUrl: './availability-day.component.html',
  styleUrls: ['./availability-day.component.css']
})
export class AvailabilityDayComponent implements OnChanges {
  @Input() dayData!: DayAvailability;
  @Output() save = new EventEmitter<void>();

  tempSlots: TimeSlot[] = [];
  showSaveModal: boolean = false;
  showCancelModal: boolean = false;

  timeOptions: string[] = this.generateTimeOptions();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dayData'] && this.dayData.isExpanded) {
      this.tempSlots = JSON.parse(JSON.stringify(this.dayData.slots));
    }
    if (changes['dayData'] && !this.dayData.isExpanded) {
      this.tempSlots = JSON.parse(JSON.stringify(this.dayData.slots));
    }
  }

  generateTimeOptions(): string[] {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const adjustedHour = hour % 12 || 12;
        const time = `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;
        options.push(time);
      }
    }
    return options;
  }

  timeToMilitary(time: string): string {
    const [timePart, period] = time.split(' ');
    let [hour, minute] = timePart.split(':').map(Number);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  }

  militaryToTime(military: string): string {
    const [hour, minute] = military.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const adjustedHour = hour % 12 || 12;
    return `${adjustedHour}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  addSlot() {
    this.tempSlots.push({ startTime: '00:00', endTime: '00:00' });
  }

  deleteSlot(index: number) {
    this.tempSlots = this.tempSlots.filter((_, i) => i !== index);
  }

  saveSlot() {
    this.showSaveModal = true;
  }

  confirmSave() {
    this.showSaveModal = false;
    this.dayData.slots = [...this.tempSlots];
    this.save.emit();
    this.dayData.isExpanded = false;
  }

  cancelSave() {
    this.showSaveModal = false;
  }

  cancelEdit() {
    this.showCancelModal = true;
  }

  confirmCancel() {
    this.tempSlots = JSON.parse(JSON.stringify(this.dayData.slots));
    this.showCancelModal = false;
    this.dayData.isExpanded = false;
  }

  cancelCancel() {
    this.showCancelModal = false;
  }
}