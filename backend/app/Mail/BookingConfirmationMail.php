<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Booking Confirmed - #{$this->booking->reference_number}",
        );
    }

    public function content(): Content
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        return new Content(
            view: 'emails.booking-confirmation',
            with: [
                'booking' => $this->booking,
                'bookingUrl' => "{$frontendUrl}/bookings/{$this->booking->id}",
                'vehicle' => $this->booking->vehicle,
                'services' => $this->booking->services,
            ],
        );
    }
}
