$(document).ready(()=>{
    $('.add-to-cart').on('click', addToCart);
});

function addToCart(){
    var id=$(this).data('id');
    var quantity=1;
    //confirm("Bạn có muốn thanh toán không?")
    $.ajax({
        url: '/buyer/cart',
        type: 'POST',
        data: {id,quantity},
        success: function(result){
            $('#cart-badge').html(result.totalQuantity);
        }
    });
}

function updateCart(id,quantity){
    //confirm("Bạn có muốn update không? id:"+id+" quan titi: "+quantity);
    if(quantity==0){
        removeCartItem(id);
    }else{
        updateCartItem(id,quantity);
    }
}

function removeCartItem(id){
    $.ajax({
        url: '/buyer/cart',
        type: 'DELETE',
        data: {id},
        success: function(result){
            $('#cart-badge').html(result.totalQuantity);
            $('#totalPrice').html('$'+result.totalPrice);
            $(`#item${id}`).remove();
        }
    });
}
function updateCartItem(id,quantity){
    $.ajax({
        url: '/buyer/cart',
        type: 'PUT',
        data: {id,quantity},
        success: function(result){
            $('#cart-badge').html(result.totalQuantity);
            $('#totalPrice').html('$'+result.totalPrice);
            $(`#price${id}`).html('$'+result.item.price);
        }
    });
}



function confirmCart(){
    var result=document.getElementById("inputBill").value;
    if(confirm("Bạn có muốn thanh toán không?"+result)){
        //var order=req.session.cart;
        //console.log("cart 123");
        //var cartItem=document.getElementsByClassName('cart-item');
        var d=new Date();
        var date=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
        // var result=document.getElementById("inputBill").value;
        $.ajax({
            url: '/buyer/cart/all',
            type: 'DELETE',
            data: {date,result},
            success: function(){
                $('#cart-badge').html('0');
                $('#cart-body').html(`<div class="alert alert-info text-center">My cart is empty</div>`)
            }
        });
    }
    
}