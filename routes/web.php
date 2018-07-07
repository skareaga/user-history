<?php

Route::get('/', function () {
    if (Auth::check()) {
        return redirect('/home');;
    }
    
    return view('auth.login');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
