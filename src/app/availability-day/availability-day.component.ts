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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dayData'] && this.dayData.isExpanded) {
      this.tempSlots = JSON.parse(JSON.stringify(this.dayData.slots));
    }
    // if (changes['dayData'] && !this.dayData.isExpanded) {
    //   this.tempSlots = JSON.parse(JSON.stringify(this.dayData.slots));
    // }
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