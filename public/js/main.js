function Coupon(){
    var base = this;
    base.id;
    base.userId;
    base.code;
    base.redeemedAt;
    base.createdAt;
    base.updatedAt;
    base.getCouponButton = $('#get-coupon');
    base.availableCouponsList = $('#coupons-list-available');
    base.redeemedCouponsList = $('#coupons-list-redeemed');
    base.availableEmptyAlert = $('#available-empty-alert');
    base.redeemedEmptyAlert =  $('#redeemed-empty-alert');
    base.couponToastProperties = {
        'timeOut': 2000,
        'extendedTimeOut': 1000,
        'progressBar': true,
        'positionClass': 'toast-bottom-right'
    }
    
    /**
     * Create a new coupon instance.
     */
	base.init = function(){
        base.getCouponButton.click(base.storeCoupon);

        base.updateEventListeners();
    }


    /**
     * Set coupon properties.
     * 
     * @param {number} id
     * @param {number} userId
     * @param {string} code
     * @param {string} redeemedAt
     * @param {string} createdAt
     * @param {string} updatedAt
     */
    base.setProperties = function(id = null, userId = null, code = null, redeemedAt = null, createdAt = null, updatedAt = null){
        base.id = id;
        base.userId = userId;
        base.code = code;
        base.redeemedAt = redeemedAt;
        base.createdAt = createdAt;
        base.updatedAt = updatedAt;
    }

    /**
     * Clean and set event listeners.
     */
    base.updateEventListeners = function(){
        base.availableCouponsList.find('button').off();

        $('.redeem-coupon').click(function(){
            base.updateCoupon($(this).data('coupon-id'));
        });
    };

    /**
     * Sent Ajax POST request to store a new coupon.
     */
    base.storeCoupon = function(){
        $.post('/coupons', {
            _token: $('meta[name="csrf-token"]').attr('content')
        }).done(function(data){
            console.log(data);
            if(data.id){
                base.setProperties(data.id, data.user_id, data.code, data.redeemed_at, data.created_at, data.updated_at);

                base.addToAvailableList();

                base.updateEventListeners();

                toastr.success('You have a new coupon available with code <b>' + data.code + '</b>.', 'Success', base.couponToastProperties);
            } else{
                toastr.error('An internal server error occurred. Please try again later.', 'Error', base.couponToastProperties);
            }
        }).fail(function(data){
            toastr.error(data.responseJSON.message, 'Error', base.couponToastProperties);
        });
    };

    /**
     * Send Ajax POST request (with _method = PUT) to update 
     * redeemed_at field in coupon.
     * 
     * @param {number} couponId
     */
    base.updateCoupon = function(couponId){
        $.post('/coupons/' + couponId, {
            _token: $('meta[name="csrf-token"]').attr('content'),
            _method: 'PUT'
        }).done(function(data){
            if(data.code){
                base.setProperties(data.id, data.user_id, data.code, data.redeemed_at, data.created_at, data.updated_at);

                base.moveToRedeemedList();

                toastr.success('Coupon <b>' + data.code + '</b> redeemed. Enjoy it!', 'Success', base.couponToastProperties);
            } else{
                toastr.error('An internal server error occurred. Please try again later.', 'Error', base.couponToastProperties);
            }
        }).fail(function(data){
            toastr.error(data.responseJSON.message, 'Error', base.couponToastProperties);
        });
    };

    /**
     * Add coupon element to available coupons list.
     */
    base.addToAvailableList = function(){
        var elementDiv = $('<div>', {class: 'list-group-item d-flex justify-content-between align-items-center'}),
            couponInfoSpan = $('<span>');
            couponCodeB = $('<b>', {text: base.code});
            createdAtI = $('<i>', {text: 'Created at ' + base.createdAt, class: 'text-muted small ml-3'});
            redeemButton = $('<button>', {text: 'Redeem', class: 'btn btn-outline-primary btn-xs pull-right redeem-coupon'}).attr('data-coupon-id', base.id);

        couponInfoSpan.append(couponCodeB);
        couponInfoSpan.append(createdAtI);
        elementDiv.append(couponInfoSpan);
        elementDiv.append(redeemButton);

        base.availableCouponsList.prepend(elementDiv);

        base.updateInfo();
    };

    /**
     * Move coupon element from available to redeemed coupons list.
     */
    base.moveToRedeemedList = function(){
        var redeemButton = $('button[data-coupon-id="' + base.id + '"]'),
            elementDiv = redeemButton.parent().addClass('disabled'),
            createdAtI = elementDiv.find('span > i');

        redeemButton.remove();
        createdAtI.text('Redeemed at ' + base.redeemedAt);
        elementDiv.prependTo(base.redeemedCouponsList);

        base.updateInfo();
    };

    /**
     * Update badges and information elements.
     */
    base.updateInfo = function(){
        var totalAvailableCoupons = base.availableCouponsList.find('> div.list-group-item').length,
            totalRedeemedCoupons = base.redeemedCouponsList.find('> div.list-group-item').length;

        $('#badge-available').html(totalAvailableCoupons);
        $('#badge-redeemed').html(totalRedeemedCoupons);
        
        base.availableEmptyAlert.toggleClass('d-none', (totalAvailableCoupons > 0));
        base.redeemedEmptyAlert.toggleClass('d-none', (totalRedeemedCoupons > 0));
    }

    // Call constructor
    base.init();
}

$(document).ready(function(){
    // Set new coupon instance
    var coupon = new Coupon();
});