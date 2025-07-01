<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UnreadMessageNotification extends Notification
{
    use Queueable;

    private $messageData;

    public function __construct($messageData)
    {
        $this->messageData = $messageData;
    }

    public function via($notifiable)
    {
        return ["database"];
    }

    public function toDatabase($notifiable)
    {
        return [
            "title" => "New unread message",
            "message" => "You have a new unread message from " . $this->messageData["sender_name"] . ": " . $this->messageData["preview"],
            "message_id" => $this->messageData["id"],
            "sender_id" => $this->messageData["sender_id"],
            "sender_name" => $this->messageData["sender_name"],
            "conversation_id" => $this->messageData["conversation_id"],
            "type" => "unread_message",
            "action_url" => "/messages/" . $this->messageData["conversation_id"],
        ];
    }
}
