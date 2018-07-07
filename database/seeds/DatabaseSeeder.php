<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->truncateTables([
            'users',
            'coupons'
        ]);

        $this->call(UsersTableSeeder::class);
        $this->call(CouponsTableSeeder::class);
    }

    /**
     * Truncate defined tables ignoring foreign key checks.
     *
     * @param  array  $tables
     * @return void
     */
    protected function truncateTables($tables)
    {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');

        foreach($tables as $table){
            DB::table($table)->truncate();
        }

        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
    }
}
