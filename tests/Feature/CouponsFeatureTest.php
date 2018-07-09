<?php

namespace Tests\Feature;

use App\User;
use App\Coupon;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CouponsFeatureTest extends TestCase
{
    // Execute migrate before test and set transactional mode 
    use RefreshDatabase;

    public function setUp()
    {
        parent::setUp();

        // Authenticated user
        $this->be(factory(User::class)->create());
    }

    /** @test */
    function load_coupons()
    {
        factory(Coupon::class)->create([
            'code' => 'AAA0000'
        ]);

        $this->get('/coupons')
            ->assertOk()
            ->assertSee('AAA0000');
    }

    /** @test */
    function show_default_message_if_coupons_list_is_empty()
    {
        $this->get('/coupons')
            ->assertOk()
            ->assertSee("There's no available coupons.");
    }

    /** @test */
    function store_new_coupon_and_return_valid_json()
    {
        $this->json('POST', '/coupons')
            ->assertOk()
            ->assertJson([
                'user_id' => auth()->user()->id
            ]);

        $this->assertDatabaseHas('coupons', [
            'user_id' => auth()->user()->id
        ]);
    }

    /** @test */
    function update_coupon_and_return_valid_json()
    {
        $couponId = factory(Coupon::class)->create()->id;

        $this->json('PUT', "/coupons/{$couponId}")
            ->assertOk()
            ->assertJson([
                'id' => $couponId
            ]);
    }

    /** @test */
    function update_coupon_that_not_belongs_to_authenticated_user()
    {
        $couponId = factory(Coupon::class)->create()->id;

        // Change authenticated user
        $this->be(factory(User::class)->create());

        $this->json('PUT', "/coupons/{$couponId}")
            ->assertStatus(403)
            ->assertJson([
                'message' => 'You are not authorized to redeem this coupon.'
            ]);
    }
}
