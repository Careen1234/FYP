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
            $table->text('bio')->nullable()->after('location');
            $table->string('profile_photo')->nullable()->after('bio');
            $table->integer('age')->nullable()->after('profile_photo');
            $table->string('instagram')->nullable()->after('age');
            $table->string('facebook')->nullable()->after('instagram');
            $table->string('website')->nullable()->after('facebook');
        
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
            //
        });
    }
};
