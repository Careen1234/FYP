<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Alphaolomi\Azampay\Events\AzampayCallback;


class AzampayCallbackListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(AzampayCallback $event)
    {
         $data = $event->data;

        // Log received callback for debugging
        Log::info('AzamPay Callback received', (array) $data);

        // Example expected fields (adjust to match actual AzamPay callback)
        $transactionId = $data['transactionId'] ?? null;
        $referenceId   = $data['referenceId'] ?? null;
        $status        = $data['status'] ?? null;
        $amount        = $data['amount'] ?? null;
        $currency      = $data['currency'] ?? 'TZS';

        // Save to payments table
        Payment::create([
            'transaction_id' => $transactionId,
            'reference_id'   => $referenceId,
            'status'         => $status,
            'amount'         => $amount,
            'currency'       => $currency,
            'raw_payload'    => json_encode($data),
        ]);
    }
}
