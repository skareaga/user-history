<?php

namespace App\Rules;

use App\Source;
use Illuminate\Contracts\Validation\Rule;

class ValidCoupon implements Rule
{
    /**
     * The user instance.
     *
     * @var \App\User
     */
    public $user;

    /**
     * The coupon's id field.
     *
     * @var string
     */
    public $couponId;

    /**
     * Create a new rule instance.
     *
     * @param  \App\User  $user
     * @param  string  $couponId
     * @return void
     */
    public function __construct($user, $couponId)
    {
        $this->user = $user;
        $this->couponId = $couponId;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return !empty($this->user->coupons->keyBy('id')->get($value));
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'You are not authorized to redeem this coupon.';
    }
}
