<?php

use App\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Example user
        User::create([
            'name' => 'Hotelinking',
            'email' => 'hotelinking@laravel.com',
            'password' => bcrypt('hotelinking')
        ]);
    }
}
