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
            
            self.on('onModalCalled', function () {
                o.events.onModalCalled.call(self);
            });
            self.trigger('onModalCalled');
            
            shroud = $('<div />').attr(o.shroud_attrs).css(o.shroud_css);
            
            if (o.show_shroud) {
                shroud.appendTo('body');
            }

            self.css({
                'left' : 50 + '%',
                'margin-left' :  - (self.outerWidth() / 2) + 'px',
                'top' : 50 + '%',
                'margin-top' :  - (self.outerHeight() / 2) + 'px'

            });
            self.css(o.modal_css);
            
            self.on('close', function () {
                self.stop().fadeOut('fast', function () {
                    $(this).css({
                        'display': 'none'
                    });
                });
                shroud.stop().fadeOut('fast', function () {
                    shroud.remove();
                    self.off('close');
                    self.off('onModalCalled');
                    self.off('onModalOpen');
                    self.trigger('onModalClosed');
                    self.off('onModalClosed');
                });
            });
            
            self.on('onModalOpen', function () {
                o.events.onModalOpen.call(self);
            });
            
            self.on('onModalClosed', function () {
                o.events.onModalClosed.call(self);
            });
            
            $(o.close_selector).click(function () {
                self.trigger('close');
            });
            
            shroud.stop().fadeTo('fast', o.shroud_max_opacity, function () {});
            
            self.stop().fadeTo('fast', 1, function () {
                self.trigger('onModalOpen');
            });
            
            if (o.shroud_close_on !== null) {
                shroud.on(o.shroud_close_on, function () {
                    self.trigger('close');
                });
            }
        });
    };

    $.BasicModal = {};

    $.BasicModal.defaults = {
        shroud_attrs: { id: 'shroud' },
        modal_css: {
            'display': 'block',
            'position': 'fixed',
            'opacity': 0,
            'z-index': 9999
        },
        shroud_css: {
            'opacity': 0,
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
        show_shroud: true,
        close_selector: '.basic-modal-close',
        events: {
            onModalCalled: function () {},
            onModalOpen: function () {},
            onModalClosed: function () {}
        }
    };
}(jQuery));