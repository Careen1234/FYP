<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('bookings', function (Blueprint $table) {
         $table->string('transaction_id')->nullable();
        $table->string('reference_id')->nullable();
        $table->string('payment_status')->default('UNPAID'); // or 'PENDING'
         $table->string('payment_method')->nullable()->after('payment_status'); // e.g., 'cash' or 'mobile'    
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['transaction_id', 'reference_id', 'payment_status', 'payment_method']);
        });
    }
};