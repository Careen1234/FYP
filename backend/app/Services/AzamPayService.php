<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AzamPayService
{
    protected $clientId;
    protected $appToken;
    protected $clientSecret;
    protected $baseUrl;

    public function __construct()
    {
        $this->clientId = config('services.azampay.client_id');
        $this->appToken = config('services.azampay.app_token');
        $this->clientSecret = config('services.azampay.client_secret');
        $this->baseUrl = config('services.azampay.base_url');
    }

    public function mobileCheckout(array $payload)
    {
        $tokenResponse = Http::withHeaders([
            'Content-Type' => 'application/json',
            'X-Client-Id' => $this->clientId,
            'X-Client-Secret' => $this->clientSecret,
        ])->post("{$this->baseUrl}/api/v1/authorize", [
            'appId' => $this->clientId,
            'appSecret' => $this->clientSecret,
        ]);

        $accessToken = $tokenResponse->json()['token'] ?? null;

        if (!$accessToken) {
            throw new \Exception("Failed to authenticate with AzamPay");
        }

        $response = Http::withHeaders([
            'Authorization' => "Bearer $accessToken",
            'X-API-Key' => $this->appToken,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/api/v1/receive/mobilemoney", [
            'amount' => $payload['amount'],
            'currency' => $payload['currency'],
            'accountNumber' => $payload['accountNumber'],
            'externalId' => $payload['externalId'],
            'provider' => $payload['provider'],
            'reason' => 'Service Payment',
        ]);

        return $response->json();
    }
}
