<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $token,
        public string $email
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Email - Auto Workshop',
        );
    }

    public function content(): Content
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $verificationUrl = "{$frontendUrl}/verify-email?email={$this->email}&token={$this->token}";

        return new Content(
            view: 'emails.verify-email',
            with: [
                'verificationUrl' => $verificationUrl,
                'token' => $this->token,
            ],
        );
    }
}
