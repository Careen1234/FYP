<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PaymentReceivedNotification extends Notification
{
    use Queueable;

    private $payment;

    public function __construct($payment)
    {
        $this->payment = $payment;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Payment received',
            'message' => 'You have received a payment of $' . $this->payment['amount'] . ' for booking #' . $this->payment['booking_id'],
            'booking_id' => $this->payment['booking_id'],
            'amount' => $this->payment['amount'],
            'payment_method' => $this->payment['payment_method'],
            'type' => 'payment_received',
            'action_url' => '/payments/' . $this->payment['id']
        ];
    }
}