;(function ($) {
    $.fn.BasicModal = function (options) {

        return this.each(function () {
            var self        = $(this).parent().is('body') ? $(this) : $(this).detach().appendTo('body'),
                o           = $.extend(true, {}, $.BasicModal.defaults, options),
                shroud      = null;

            for (p in o) {

                if (typeof o[p] !== 'function' && self.data('basic-modal-options-' + p) !== undefined) {
                    var value = self.data('basic-modal-options-' + p);

                    if (typeof o[p] !== 'object') {
                        o[p] = value;
                    } else {
                        o[p] = $.extend(true, {}, o[p], value);
                    }
                }
            }
            
            self.on('basic_modal_called', function () {
                o.events.basic_modal_called.call(self);
            });
            self.trigger('basic_modal_called');
            
            shroud = $('<div>').attr(o.shroud_attrs).css(o.shroud_css);
            
            if (o.shroud_show) {
                shroud.appendTo('body');
            }

            self.css({
                'left' : 50 + '%',
                'margin-left' :  - (self.outerWidth() / 2) + 'px',
                'top' : 50 + '%',
                'margin-top' :  - (self.outerHeight() / 2) + 'px'
            });
            self.css(o.modal_css);
            
            self.on('basic_modal_close', function () {
                self.stop().fadeOut('fast', function () {
                    $(this).css({
                        'display': 'none'
                    });
                });
                shroud.stop().fadeOut('fast', function () {
                    shroud.remove();
                    self.off('basic_modal_close');
                    self.off('basic_modal_called');
                    self.off('basic_modal_open');
                    self.trigger('basic_modal_closed');
                    self.off('basic_modal_closed');
                });
            });
            
            self.on('basic_modal_open', function () {
                o.events.basic_modal_open.call(self);
            });
            
            self.on('basic_modal_closed', function () {
                o.events.basic_modal_closed.call(self);
            });
            
            $(o.modal_close_selector).click(function () {
                self.trigger('basic_modal_close');
            });
            
            shroud.stop().fadeTo('fast', o.shroud_max_opacity, function () {});
            
            self.stop().fadeTo('fast', 1, function () {
                self.trigger('basic_modal_open');
            });
            
            if (o.shroud_close_on !== null) {
                shroud.on(o.shroud_close_on, function () {
                    self.trigger('basic_modal_close');
                });
            }
        });
    };

    $.BasicModal = {};

    $.BasicModal.defaults = {
        shroud_attrs: { id: 'basic-modal-shroud' },
        modal_css: {
            'display': 'block',
            'position': 'fixed',
            'opacity': 0.1,
            'z-index': 9999
        },
        shroud_css: {
            'opacity': 0.1,
            'width': 100 + '%',
            'height': 100 + '%',
            'z-index': 9998,
            'position': 'fixed',
            'background-color': '#888888',
            'top': '0px',
            'left': '0px'
        },
        shroud_max_opacity: 0.5,
        shroud_close_on: 'click',
        shroud_show: true,
        modal_close_selector: '.basic-modal-close',
        events: {
            basic_modal_called: function () {},
            basic_modal_open: function () {},
            basic_modal_closed: function () {}
        }
    };
}(jQuery));