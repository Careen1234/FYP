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
        Schema::table('ratings', function (Blueprint $table) {
         if (!Schema::hasColumn('ratings', 'user_id')) {
                $table->unsignedBigInteger('user_id')->after('id');
            }

            if (!Schema::hasColumn('ratings', 'provider_id')) {
                $table->unsignedBigInteger('provider_id')->after('user_id');
            }

            // Add foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->after('id');
            $table->foreign('provider_id')->references('id')->on('providers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     * 
     *
     * @return void
     */
    public function down()
    {
        Schema::table('ratings', function (Blueprint $table) {
             $table->dropForeign(['user_id']);
            $table->dropForeign(['provider_id']);

            // Then drop the columns
            $table->dropColumn(['user_id', 'provider_id']);
        });
    }
};
