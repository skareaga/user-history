@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <button id="get-coupon" class="btn btn-primary btn-lg btn-block mb-3">Get coupon!</button>

            <!-- Available Coupons Wrapper -->
            <div class="card mb-3">
                <div class="card-header">My available coupons <span id="badge-available" class="badge badge-secondary badge-pill float-right mt-1">{{ count($availableCoupons) }}</span></div>

                <!-- Available Coupons List -->
                <div class="card-body">
                    <div id="coupons-list-available" class="list-group">
                        @foreach ($availableCoupons as $coupon)
                            <div class="list-group-item d-flex justify-content-between align-items-center">
                                <span><b>{{ $coupon->code }}</b><i class="text-muted small ml-3">Created at {{ $coupon->created_at }}</i></span>
                                <button class="btn btn-outline-primary btn-xs pull-right redeem-coupon" data-coupon-id="{{ $coupon->id }}">Redeem</button>
                            </div>
                        @endforeach
                        <div id="available-empty-alert" class="alert alert-info {{ count($availableCoupons) == 0 ? '' : 'd-none' }}">There's no available coupons.</div>
                    </div>
                </div>
            </div>

            <!-- Redeemed Coupons Wrapper -->
            <div class="card mb-3">
                <div class="card-header">My redeemed coupons <span id="badge-redeemed" class="badge badge-secondary badge-pill float-right mt-1">{{ count($redeemedCoupons) }}</span></div>

                <!-- Redeemed Coupons List -->
                <div class="card-body">
                    <div id="coupons-list-redeemed" class="list-group">
                        @foreach ($redeemedCoupons as $coupon)
                            <div class="list-group-item d-flex justify-content-between align-items-center disabled">
                                <span><b>{{ $coupon->code }}</b><i class="text-muted small ml-3">Redeemed at {{ $coupon->redeemed_at }}</i></span>
                            </div>
                        @endforeach
                        <div id="redeemed-empty-alert" class="alert alert-info {{ count($redeemedCoupons) == 0 ? '' : 'd-none' }}">There's no redeemed coupons.</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
