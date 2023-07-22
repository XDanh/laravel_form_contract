<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loaitb',function(Blueprint $table){
            $table->string('THIET_BI');
            $table->integer('GIA_TB');
            $table->foreignId('MaGC');
            $table->foreignId('MaLoai');
            $table->foreignId('MaTH');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loaitb');
    }
};
