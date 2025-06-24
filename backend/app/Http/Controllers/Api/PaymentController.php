<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AzamPayService;

class PaymentController extends Controller
{
    protected $azamPay;

    public function __construct(AzamPayService $azamPay)
    {
        $this->azamPay = $azamPay;
    }

    public function payWithCash(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|integer',
            'service_id' => 'required|integer',
        ]);

        // Record the intent to pay with cash (optional: store in DB)
        return response()->json(['message' => 'Cash payment selected. Please pay the provider directly.']);
    }

    public function initiateMobileMoney(Request $request)
    {
        $request->validate([
            'provider_id' => 'required|integer',
            'service_id' => 'required|integer',
            'amount' => 'required|numeric',
            'phone' => 'required|string|min:10',
        ]);

        $amount = $request->amount;
        $phone = $request->phone;
        $referenceId = 'TXN-' . uniqid();

        try {
            $response = $this->azamPay->initiateMobilePayment($amount, $phone, $referenceId);
            return response()->json([
                'message' => 'Payment request sent.',
                'azam_response' => $response
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



public function pay(Request $request)
{
    $azampay = new AzamPayService();

    $response = $azampay->mobileCheckout([
        'amount' => $request->amount,
        'currency' => 'TZS',
        'accountNumber' => $request->accountNumber,
        'externalId' => uniqid('order_'),
        'provider' => $request->provider, 
    ]);

    return response()->json($response);
}




}
