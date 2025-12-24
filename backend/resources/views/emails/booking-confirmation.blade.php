<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0a0a0b;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #1f1f23; border-radius: 12px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Auto Workshop</h1>
                            <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Professional Car Service & Repairs</p>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <div style="display: inline-block; padding: 12px 24px; background-color: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; border-radius: 8px;">
                                    <span style="color: #22c55e; font-size: 16px; font-weight: 600;">Booking Confirmed</span>
                                </div>
                            </div>

                            <h2 style="margin: 0 0 10px; color: #ffffff; font-size: 24px; font-weight: 600;">Your Appointment is Scheduled!</h2>
                            <p style="margin: 0 0 30px; color: #a1a1aa; font-size: 16px;">
                                Reference: <strong style="color: #a855f7;">{{ $booking->reference_number }}</strong>
                            </p>

                            <!-- Booking Details Card -->
                            <table role="presentation" style="width: 100%; background-color: #27272a; border-radius: 8px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 16px; font-weight: 600;">Appointment Details</h3>
                                        <table role="presentation" style="width: 100%;">
                                            <tr>
                                                <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Date:</td>
                                                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">{{ \Carbon\Carbon::parse($booking->date)->format('l, F j, Y') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Time:</td>
                                                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">{{ \Carbon\Carbon::parse($booking->time)->format('g:i A') }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Vehicle:</td>
                                                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">{{ $vehicle->year }} {{ $vehicle->make }} {{ $vehicle->model }}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #71717a; font-size: 14px;">License Plate:</td>
                                                <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right;">{{ $vehicle->license_plate }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Services Card -->
                            <table role="presentation" style="width: 100%; background-color: #27272a; border-radius: 8px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 16px; font-weight: 600;">Services Booked</h3>
                                        @foreach($services as $service)
                                        <table role="presentation" style="width: 100%; margin-bottom: 8px;">
                                            <tr>
                                                <td style="color: #ffffff; font-size: 14px;">{{ $service->name }}</td>
                                                <td style="color: #a855f7; font-size: 14px; text-align: right;">${{ number_format($service->pivot->price, 2) }}</td>
                                            </tr>
                                        </table>
                                        @endforeach
                                        <div style="border-top: 1px solid #3f3f46; margin-top: 15px; padding-top: 15px;">
                                            <table role="presentation" style="width: 100%;">
                                                <tr>
                                                    <td style="color: #ffffff; font-size: 16px; font-weight: 600;">Total</td>
                                                    <td style="color: #a855f7; font-size: 16px; font-weight: 600; text-align: right;">${{ number_format($booking->total_amount, 2) }}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- View Booking Button -->
                            <table role="presentation" style="margin: 30px 0;">
                                <tr>
                                    <td style="border-radius: 8px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                                        <a href="{{ $bookingUrl }}" target="_blank" style="display: inline-block; padding: 16px 32px; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none;">
                                            View Booking Details
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                                Need to make changes? You can modify or cancel your booking up to 24 hours before your appointment through your account dashboard.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; background-color: #18181b; border-top: 1px solid #27272a;">
                            <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
                                &copy; {{ date('Y') }} Auto Workshop. All rights reserved.<br>
                                This is an automated message, please do not reply directly to this email.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
