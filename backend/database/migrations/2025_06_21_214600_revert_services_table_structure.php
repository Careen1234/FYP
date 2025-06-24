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
        Schema::table('services', function (Blueprint $table) {
          if (!Schema::hasColumn('services', 'category_id')) {
            $table->unsignedBigInteger('category_id')->after('price');
        }

        if (Schema::hasColumn('services', 'category')) {
            $table->dropColumn('category');
        }

        if (Schema::hasColumn('services', 'image_url')) {
            $table->dropColumn('image_url');
        }

        $table->string('status')->default('active')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('services', function (Blueprint $table) {
            //
        });
    }
};
