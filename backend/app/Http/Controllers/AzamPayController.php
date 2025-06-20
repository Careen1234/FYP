<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
 use Alphaolomi\Azampay\AzampayService;

class AzamPayController extends Controller
{
   
  public function pay(Request $request)
    {
        $azampay = new AzampayService();

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

