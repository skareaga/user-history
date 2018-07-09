<?php

namespace App\Http\Controllers;

use App\Coupon;
use App\Rules\ValidCoupon;
use Faker\Factory as Faker;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    /**
     * The current authenticated user.
     *
     * @var \App\User
     */
    private $authenticatedUser;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // Require authentication
        $this->middleware('auth');

        // Set authenticated user
        $this->middleware(function ($request, $next) {
            $this->authenticatedUser = auth()->user();

            return $next($request);
        });
    }

    /**
     * Show the coupons administration panel.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Heavier but more readable than a query with "foreach" statement to divide it
        $availableCoupons = $this->getUserCouponsByState()->sortByDesc('created_at');
        $redeemedCoupons = $this->getUserCouponsByState(false)->sortByDesc('updated_at');

        return view('coupons.index', [
            'availableCoupons' => $availableCoupons,
            'redeemedCoupons' => $redeemedCoupons
        ]);
    }

    /**
     * Create and save a new coupon.
     * Response with all coupon fields in JSON format.
     *
     * @return string
     */
    public function store()
    {
        $code = $this->getUniqueCode();

        // If cannot get unique code, return error
        if(!$code){
            return response()->json([
                'message' => 'The server cannot create a unique coupon code. Please try again later.'
            ], 508);
        }

        $coupon = Coupon::create([
            'user_id' => $this->authenticatedUser->id,
            'code' => $code
        ]);

        return response()->json($coupon);
    }

    /**
     * Update coupon, set redeemed_at field with current date and time.
     *
     * @param  string  $couponId
     * @return string
     */
    public function update($couponId){        
        $coupon = $this->authenticatedUser->coupons->keyBy('id')->get($couponId);

        // If coupon not belongs to user, return error
        if(!$coupon){
            return response()->json([
                'message' => 'You are not authorized to redeem this coupon.'
            ], 403);
        }

        $coupon->update([
            'redeemed_at' => date('Y-m-d H:i:s')
        ]);

        return response()->json($coupon);
    }

    /**
     * Get available or redeemed coupons of user.
     *
     * @param  bool  $available
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserCouponsByState($available = true)
    {
        $operator = $available ? '=': '!=';

        return $this->authenticatedUser->coupons->where('redeemed_at', $operator, NULL);
    }

    /**
     * Get unique coupon code.
     * 
     * @param  int  $maxIntents
     * @return string
     */
    public function getUniqueCode($maxIntents = 100)
    {
        $faker = Faker::create();
        $code = null;
        
        for ($i = 0; $i < $maxIntents; $i++) {
            $code = strtoupper($faker->unique()->bothify('???####'));
            
            if (!Coupon::where('code', '=', $code)->exists()) {
                return $code;
            }
        }

        return false;
    }
}
