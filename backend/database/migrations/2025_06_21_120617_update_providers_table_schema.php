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
             if (Schema::hasColumn('providers', 'email')) {
                $table->dropColumn('email');
            }
            if (Schema::hasColumn('providers', 'service')) {
                $table->dropColumn('service');
            }
            if (Schema::hasColumn('providers', 'location')) {
                $table->dropColumn('location'); // keep if you want address later
            }

            // Add foreign key for service_id if not exists
            if (!Schema::hasColumn('providers', 'service_id')) {
                $table->foreignId('service_id')->after('user_id')->constrained()->onDelete('cascade');
            }

            // Update types
            $table->decimal('latitude', 10, 7)->nullable()->change();
            $table->decimal('longitude', 10, 7)->nullable()->change();

            // Make sure status and availability exist
            if (!Schema::hasColumn('providers', 'status')) {
                $table->enum('status', ['active', 'inactive'])->default('active')->after('longitude');
            }

            if (!Schema::hasColumn('providers', 'availability')) {
                $table->boolean('availability')->default(true)->after('status');
            }
        });
    }

    public function down()
    {
        Schema::table('providers', function (Blueprint $table) {
            $table->dropForeign(['service_id']);
            $table->dropColumn(['service_id', 'status', 'availability']);
            $table->string('service')->nullable(); // if you want to reverse
            $table->string('email')->nullable();
            $table->string('location')->nullable();
        });
    }
};
