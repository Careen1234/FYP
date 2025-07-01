<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class PaymentController extends Controller
{
    
 public function initiateClickPesaUssdPush(Request $request)
{
    // Step 1: Generate token
    $tokenResponse = Http::withHeaders([
        'api-key' => 'SKpM73aauzK8NBkPmCWWLgAhkydccrjs8sG4B9aPz0',
        'client-id' => 'IDFFHRx2wxNdDtA21Ix4XFk7jSHavcvd',
    ])->timeout(30)->post('https://api.clickpesa.com/third-parties/generate-token');

    if (!$tokenResponse->successful()) {
        Log::error('ClickPesa Token Error', [
            'status' => $tokenResponse->status(),
            'body' => $tokenResponse->body(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Failed to generate token.',
            'error' => $tokenResponse->body(),
        ], $tokenResponse->status());
    }

    $token = $tokenResponse->json()['token'] ?? null;

    if (!$token) {
        return response()->json([
            'success' => false,
            'message' => 'Token missing from ClickPesa response.',
        ], 500);
    }

   
   $payload = [
    'amount' => (float) $request->amount,
    'currency' => 'TZS',
    'orderReference' => $request->orderReference,
    'phoneNumber' => preg_replace('/[^0-9]/', '', $request->phoneNumber), // remove + if exists
    'checksum' => $request->checksum,
];


    $url = 'https://api.clickpesa.com/third-parties/payments/initiate-ussd-push-request';

    $paymentResponse = Http::withHeaders([
        'Authorization' => $token,
        'Content-Type' => 'application/json'
    ])->timeout(30)->post($url, $payload);

    if ($paymentResponse->successful()) {
        $data = $paymentResponse->json();

        return response()->json([
            'success' => true,
            'id' => $data['id'] ?? null,
            'status' => $data['status'] ?? null,
            'channel' => $data['channel'] ?? null,
            'orderReference' => $data['orderReference'] ?? null,
            'collectedAmount' => $data['collectedAmount'] ?? null,
            'collectedCurrency' => $data['collectedCurrency'] ?? null,
            'createdAt' => $data['createdAt'] ?? null,
        ]);
    }

    return response()->json([
        'success' => false,
        'message' => 'Payment initiation failed.',
        'status_code' => $paymentResponse->status(),
        'error' => $paymentResponse->body(),
    ], $paymentResponse->status());
}

    public function initiatePayment(Request $request)
    {
        $validated = $request->validate([
            'accountNumber' => 'required|string|regex:/^255\d{9}$/',
            'amount' => 'required|numeric|min:100',
            'provider' => 'required|string',
        ]);

        try {
            $token = $this->getClickpesaToken();
            $reference = uniqid('cp_', true);

            $response = Http::withToken($token)->post(env('CLICKPESA_API_URL') . '/payments/initiate', [
                'phone' => $validated['accountNumber'],
                'amount' => $validated['amount'],
                'currency' => 'TZS',
                'provider' => $validated['provider'],
                'reference' => $reference,
            ]);

            if ($response->successful()) {
                return response()->json([
                    'success' => true,
                    'reference' => $reference,
                    'message' => 'Payment initiated. Please complete on your phone.',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => $response->json()['message'] ?? 'Failed to initiate payment.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function checkPaymentStatus($reference)
    {
        try {
            $token = $this->getClickpesaToken();

            $response = Http::withToken($token)
                ->get(env('CLICKPESA_API_URL') . "/payments/status/{$reference}");

            if ($response->successful()) {
                return $response->json(); // Includes 'status': pending, success, or failed
            }

            return response()->json([
                'success' => false,
                'message' => 'Status check failed.',
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
