<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ServiceCompletedNotification extends Notification
{
    use Queueable;

    private $booking;

    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Service completed',
            'message' => 'Your service "' . $this->booking['service_name'] . '" has been completed',
            'booking_id' => $this->booking['id'],
            'service_name' => $this->booking['service_name'],
            'provider_name' => $this->booking['provider_name'],
            'type' => 'service_completed',
            'action_url' => '/bookings/' . $this->booking['id']
        ];
    }
}