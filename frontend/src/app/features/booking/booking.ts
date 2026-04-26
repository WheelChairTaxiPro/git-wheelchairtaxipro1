import { Component, signal } from '@angular/core';

interface VehicleOption {
  readonly value: string;
  readonly label: string;
}

const VEHICLE_OPTIONS: readonly VehicleOption[] = [
  { value: 'small-new', label: '新款細輪椅的士' },
  { value: 'standard-old', label: '普通舊款輪椅的士' },
  { value: 'large-luxury', label: '特大豪華輪椅的士' },
  { value: 'system-arranged', label: '由系統安排' },
];

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.html',
  styleUrl: './booking.scss',
})
export class Booking {
  protected readonly vehicleOptions = VEHICLE_OPTIONS;
  protected readonly submitted = signal(false);

  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Prototype only: real API submission lands with the backend booking slice.
    this.submitted.set(true);
    form.reset();
  }
}
