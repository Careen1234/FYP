<?php
// app/Services/ClickPesaService.php
namespace App\Services;

use Illuminate\Support\Facades\Http;

class ClickPesaService
{
    protected $baseUrl;
    protected $apiKey;
    protected $apiSecret;

    public function __construct()
    {
        $this->baseUrl = config('services.clickpesa.base_url');
        $this->apiKey = config('services.clickpesa.api_key');
        $this->apiSecret = config('services.clickpesa.api_secret');
    }

    public function initiatePayment($amount, $currency, $customerPhone, $description)
    {
        $payload = [
            'amount' => $amount,
            'currency' => $currency,
            'customer_phone_number' => $customerPhone,
            'description' => $description,
            'callback_url' => route('clickpesa.callback'),
        ];

        $response = Http::withBasicAuth($this->apiKey, $this->apiSecret)
            ->post("{$this->baseUrl}/payments", $payload);

        return $response->json();
    }
}
