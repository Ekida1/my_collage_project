$(function(){
  

  if($('.del_main_cmt')){
   
  
    $('.del_main_cmt').click(function(e){
    var target = $(this);
    var cid = target.parent().parent().attr("id");
    //console.log("++++++++++++++++++++++++++++++++++++++++" + cid);
    var li = target.parent().parent();

    $.ajax({
      type:'DELETE',
      url:'/movie/'+cid,
      //data:{id:cid}
    })
     .done(function(results){
      if(results.success === 1 && li.length > 0){
          li.remove()
      };
    })
  })
};

  if($('#del_rly_cmt')){

$('#del_rly_cmt').click(function(e){
    var target = $(this);
    var rid = target.parent().parent().attr("id");
    console.log("++++++++++++++++++++++++++++++++++++++++" + rid);
    var div = target.parent().parent();

    $.ajax({
      type:'DELETE',
      url:'/movie/'+rid,
      //data:{id:cid}
    })
     .done(function(results){
      if(results.success === 1 && div.length > 0){
          div.remove()
      };
    })
  })
    
  };
})
