<?php

use Faker\Generator as Faker;

$factory->define(App\Coupon::class, function (Faker $faker) {
    return [
        'user_id' => App\User::first()->id,
        'code' => strtoupper($faker->unique()->bothify('???####')),
        'redeemed_at' => $faker->optional()->dateTimeBetween('now')
    ];
});
