/**
 * @file
 * Rating jquery widget
 *
 * This widget allows users to rate library materials.
 */

(function ($) {
  /**
   * AJAX command to update the content of a serendipity pane.
   */
  Drupal.ding_serendipity = {};
  Drupal.ding_serendipity.refresh_content = function(ajax, response, status) {
    var $serendipitypane = $('.pane-serendipity-ting-object .pane-content')
      $context = Drupal.settings.ding_serendipity.context;
      
    if(response.data) {
      var _data = JSON.parse(response.data);
      $.extend($context, _data);
    }
    
    if(!Drupal.ajax['.pane-serendipity-ting-object']) {
      Drupal.ajax['.pane-serendipity-ting-object'] = new Drupal.ajax('.pane-serendipity-ting-object .pane-content', $serendipitypane, {
        url: 'ding/serendipity/ajax',
        settings: {},
        event: 'load',
        submit: {context: $context}
      });
    }
    else {
      Drupal.ajax['.pane-serendipity-ting-object'].element_settings.submit = {context: $context};
    }
    $serendipitypane.trigger('load');
  }
  Drupal.ajax.prototype.commands.ding_serendipity_refresh = Drupal.ding_serendipity.refresh_content;

  Drupal.behaviors.ding_serendipity = {
    attach: function (context, settings) {
      // Bail if there's no analytics.
      if (this._gaq === undefined) {
        return;
      }
      
      // Add analytics tracking
      $('div[class*="pane-serendipity"] .ting-object, .ding-serendipity-analytics ting-object', context).each(function() {
        var _source = $('.ding-serendipity-source', this).text();
        $('a', this).click(function(evt) {
          _gaq.push(['_trackEvent', 'Serendipitet', 'click', _source]);
        });
      });
    }
  };
})(jQuery);
