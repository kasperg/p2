/**
 * @file
 * Rating jquery widget
 *
 * This widget allows users to rate library materials.
 */

(function ($) {

  $.widget("ding.rating", {
    options: {
      'average': 1,
      'submitted': false,
    },

    /**
     * Constructor.
     */
    _create: function() {
      this.element
        // Add a class for theming.
        .addClass( "ding-rating" )
        // Prevent double click to select text.
        .disableSelection();
      if(this.options.submitted === false) {
        var _star = $('.star', this.element).hover(this.starMouseIn, this.startMouseOut);
        _star.click(this.starClick);
      }
      this._refresh();
    },
    
    /**
     * Called when created, and later when changing options.
     */
    _refresh: function() {
      this._trigger( "change" );
    },
    
    /**
     * On mouse in.
     *
     * @param Event evt
     *   Mouseenter event
     */
    starMouseIn: function(evt) {
      var $this = $(this);
      $this.parent().children('.submitted').addClass('has-sub').removeClass('submitted');
      $this.siblings().removeClass('active');
      $this.addClass('active');
      $this.prevAll().addClass('active');
    },
    
    /**
     * On mouse out.
     *
     * @param Event evt
     *   Mouseleave event
     */
    startMouseOut: function(evt) {
      var $this = $(this);
      $this.parent().children('.has-sub').addClass('submitted').removeClass('has-sub');
      $this.removeClass('active');
      $this.siblings().removeClass('active');
    },
    
    /**
     * On click.
     *
     * @param Event evt
     *   Click event
     */
    starClick: function(evt) {
      var $this = $(this);
      evt.preventDefault();

      if (!$this.closest('.ding-rating').hasClass('rateable')) {
        location.href = '/user?destination=' + location.pathname;
        return;
      }

      $this.parent().children('.has-sub').removeClass('has-sub');
      $this.addClass('submitted');
      $this.prevAll().addClass('submitted');
      $this.nextAll().removeClass('submitted');
      var _path = $this.parent().attr('data-ding-entity-rating-path'),
        _index = $this.index() + 1;
      $.get('/ding_entity_rating/ajax/' + _path + '/' + _index, function(responseText) {
        $this.parent().append(responseText);
        $('.ding-entity-rating-respons', $this.parent()).delay(5000).fadeOut();
      });
    },
    
    /**
     * Events bound via _on are removed automatically revert other
     * modifications here.
     */
    _destroy: function() {
      this.element
        .removeClass( "ding-rating" )
        .enableSelection();
    },

    /**
     * _setOptions is called with a hash of all options that are changing.
     */
    _setOptions: function() {
      // _super and _superApply handle keeping the right this-context.
      if (this._superApply) {
        this._superApply( arguments );
      }
      this._refresh();
    },

    /**
     * _setOption is called for each individual option that is changing.
     */
    _setOption: function( key, value ) {
      this._super( key, value );
    }
  });

  // Drupal behavior.
  Drupal.behaviors.ding_entity_rating = {
    attach: function (context, settings) {
      // Attach rating widget.
      $('.ding-entity-rating, .ding-entity-rating-submitted', context).rating();
    }
  };
})(jQuery);
