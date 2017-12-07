$(function(){
  if($('#del_main_cmt')===true){
    var del = $('#del_main_cmt')
  }
  else if($('#del_rly_cmt')){
    var del = $('#del_rly_cmt')
  }
  del.click(function(e){
      var target = $(e.target);
    //var target = $(this);
      var rid = target.parent().parent().attr("id");
      console.log("++++++++++++++++++++++++++++++++++++++++" + rid);
      var div = target.parent().parent();

    $.ajax({
      type:'DELETE',
      url:'/movie/'+rid,
    })
     .done(function(results){
      if(results.success === 1 && div.length > 0){
          div.remove()
        }
           })
  })
})
