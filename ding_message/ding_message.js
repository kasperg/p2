/**
 * @file
 * Ding message javascript
 */

(function ($) {
  
  Drupal.behaviors.ding_interaction = {
    attach: function (context, settings) {
      $('.ding-message a', context).each(function() {
        $(this).on('click',function(evt) {
          var $id = $(this).attr('data-item-id');
          $.ajax({
            url: '/ding_message/status/change',
            type: "POST",
            data: { 'mid' : $id },
          });
        })
      });
      $('a.ding-message-link', context).each(function() {
        $(this).on('click',function(evt) {
          var $id = $(this).attr('data-item-id');
          $.ajax({
            url: '/ding_message/status/change',
            type: "POST",
            data: { 'mid' : $id },
          });
        })
      });      
      var 
        isSet = false,
        latestId = get_url_parameter('message');
      if(latestId && $('.ting-object-collection', context).size() > 0) {
        $('.ting-object-collection', context).each(function() {
          if(!isSet) {
            if($(this).attr('data-ting-object-id') == latestId) {
              isSet = true;
            }
            $(this).addClass('new-content-pending');
          }
        });
      }
      $('.ting-object-collection.new-content-pending', context).each(function() {
        if(isSet) {
          $(this).addClass('new-content');
          $(this).removeClass('new-content-pending');
          if($(this).attr('data-ting-object-id') == latestId) {
            return false;
          }            
        }
      });
      if(latestId && $('.ding-message-item', context).size() > 0) {
        $('.ding-message-item', context).each(function() {
          if($(this).attr('data-ting-object-id') == latestId) {
            isSet = true;
          }
          if(isSet) {
            $(this).addClass('new-content');
          }
        });
      }
    }
  };
  
  function get_url_parameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return decodeURIComponent(sParameterName[1]);
      }
    }
    return false;
  }
})(jQuery);
