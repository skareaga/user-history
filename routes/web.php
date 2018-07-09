<?php

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/coupons');;
    }
    
    return view('auth.login');
});

Auth::routes();

// Coupons
Route::get('/coupons', 'CouponController@index')->name('coupons');
Route::post('/coupons', 'CouponController@store')->name('coupons.store');
Route::put('/coupons/{couponId}', 'CouponController@update')->name('coupons.update');