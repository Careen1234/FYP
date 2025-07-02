<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewMessage extends Notification
{
    use Queueable;

    protected $senderName;
    protected $preview;

    public function __construct($senderName, $preview = '')
    {
        $this->senderName = $senderName;
        $this->preview = $preview;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'New message',
            'message' => "{$this->senderName} sent you a message: \"{$this->preview}\"",
            'type' => 'message',
            'timestamp' => now(),
        ];
    }
}
