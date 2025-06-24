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
        Schema::table('providers', function (Blueprint $table) {
             if (!Schema::hasColumn('providers', 'email')) {
            $table->string('email')->after('name');
        }
        if (!Schema::hasColumn('providers', 'service')) {
            $table->string('service')->after('email');
        }
        if (!Schema::hasColumn('providers', 'location')) {
            $table->string('location')->nullable()->after('service');
        }

        // Remove newly added columns if needed
        if (Schema::hasColumn('providers', 'service_id')) {
            $table->dropForeign(['service_id']);
            $table->dropColumn('service_id');
        }
        if (Schema::hasColumn('providers', 'status')) {
            $table->string('status')->default('active')->change(); // to original format
        }
        if (!Schema::hasColumn('providers', 'availability')) {
            $table->boolean('availability')->default(true)->after('status');
        }
    });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('providers', function (Blueprint $table) {
             $table->dropColumn(['email', 'service', 'location', 'availability']);
        $table->foreignId('service_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
