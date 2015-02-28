/*!
	jQuery Tabordian v1.2
	(c) 2015 Andy Palmer
	license: http://www.opensource.org/licenses/mit-license.php
*/
(function($, window, document, undefined) {

	'use strict';

	var pluginName = 'tabs';

	function Plugin( element, options ) {
	
		//this.element = element;
		this.$el = $(element);

		this.options = $.extend({}, $.fn[pluginName].defaults, options);
		
		this._isAccordion = false;
		
		// Store a reference to the tabs
		this.tabs = this.$el.find('.tabs a');
			
		// Store a reference to the tab contents
		this.tabContents = this.$el.find('.tabs-content');

		this.init();
	}

	Plugin.prototype = {

		/**
		 *  Initialises the plugin instance
		 */
		init: function() {
			
			this.tabs.each(function() {
				
				// Give the tab a reference to its tab content div
				$(this).data(pluginName + '.tab-content', $($(this).attr('href')));
				
				// Give the tab content div a reference to its tab
				$(this).data(pluginName + '.tab-content').data(pluginName + '.tab', $(this));
			});
			
			// Initial call to resize callback
			this.resizeCallback(true);
			
			// Hide all tab contents
			this.hideTabs();
			
			if(location.hash) {
				// Pass showTab() the first matched tab only
				this.showTab($('.tabs a[href=' + location.hash + ']').eq(0), true);
			} else {
				// If there is no hash fragment in the URL show the first tab
				this.showTab(0, true);
			}
			
			// Attach the click handler to tabs
			this.attachHandler();
			
			if(this.options.resize) {
			
				var self = this;
				
				$(window).on('resize.' + pluginName, function() {
					self.resizeCallback();
				});
			}
		},
		
		/**
		 *  Destroys the plugin instance
		 */
		destroy: function() {
		
			this.tabs.removeData(pluginName + '.tab-content');
			
			this.tabContents.removeData(pluginName + '.tab');
			
			if(this.options.resize) {
				$(window).off('resize.' + pluginName);
			}
			
			this.$el.off('click.' + pluginName, '.tabs a').removeData(pluginName + '.plugin');
		},
		
		/**
		 *  Emits a namespaced plugin event
		 */
		emit: function(event, tab) {
			
			this.$el.trigger(pluginName + '.' + event, [tab, this.options]);
		},
		
		/**
		 *  Attaches the click handler to the element
		 */
		attachHandler: function() {
		
			var self = this;
			
			this.$el.on('click.' + pluginName, '.tabs a', function(event) {
			
				event.preventDefault();

				if(!$(this).data(pluginName + '.tab-content').is(':visible')) {
					self.showTab(this);
				} else if(self._isAccordion) {
					self.hideTab(this);
				}
				
				if(self.options.pushState) {

					self.pushState($(this).attr('href'));
				}
				
			});
		},
		
		/**
		 *  Returns the tab at zero-based index i
		 */
		getTab: function(i) {
			return this.tabs.get(i);
		},
		
		/**
		 *  Shows the specified tab
		 */
		showTab: function(tab, instant) {
			
			var self = this;

			if(typeof tab === 'number') {
				tab = this.getTab(tab);
			}
			
			if(!$(tab).length) {
				tab = this.getTab(0);
			}
			
			if(instant) {
			
				$(tab).data(pluginName + '.tab-content').show();
				this.emit('show', tab);
				
			} else if(this._isAccordion) {
				
				$(tab).data(pluginName + '.tab-content').slideDown(this.options.duration, function() {
					
					self.emit('show', tab);
				});
				
				if(this.options.closeOtherTabs) {
					this.hideTabs($(tab).data(pluginName + '.tab-content'));
				}
				
			} else {
				
				this.hideTabs($(tab).data(pluginName + '.tab-content'));
				
				$(tab).data(pluginName + '.tab-content').fadeIn(this.options.duration, function() {
					
					self.emit('show', tab);
				});
			}
			
			$(tab).addClass(this.options.activeClass);
			
			// Change glyphicon chevrons if they exist
			$(tab).find('.glyphicon').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
		},
		
		/**
		 *  Hides a specific tab
		 */
		hideTab: function(tab) {
		
			$(tab).removeClass(this.options.activeClass);
			
			// If we're in accordion mode slideUp the tab content, otherwise hide it
			if(this._isAccordion) {
			
				var self = this;
				
				$(tab).data(pluginName + '.tab-content').slideUp(this.options.duration, function() {
					self.emit('hide', this);
				});
				
			} else  {
			
				$(tab).data(pluginName + '.tab-content').hide();
				
				this.emit('hide', tab);
			}
			
			// Change Bootstrap glyphicon chevrons if they exist
			$(tab).find('.glyphicon').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
		},

		/**
		 *  Hides all tabs apart from the current tab
		 */
		hideTabs: function(current) {

			this.tabs.removeClass(this.options.activeClass);
			
			if(this._isAccordion) {
				this.tabContents.not(current).slideUp(this.options.duration);
			} else {
				this.tabContents.not(current).hide();
				
			}
		},
		
		/**
		 *  Pushes the tab state to the history API or falls back to setting the location hash fragment
		 */
		pushState: function(state) {
			
			if($.isFunction(history.pushState)) {
				history.pushState({}, '', state);
			} else {
				location.hash = state;
			}
		},
		
		/**
		 *  Fires when the window is resized and converts the instance between tab and accordion mode
		 */
		resizeCallback: function(initial) {
			
			if(this.isDesktop()) {
				
				// If its not the initial call move the tab contents back in to the container
				if(!initial) {
					this.tabContents.appendTo('.tabs-content-container');
				}
				
			} else {
			
				this.tabContents.each(function() {

					$(this).appendTo($(this).data(pluginName + '.tab').parent());
					
				});
			}
		},

		/**
		 *  Returns whether the window width matches the breakpoint
		 */
		isDesktop: function() {
			
			if($.isFunction(this.options.breakPoint)) {
				this._isAccordion = !this.options.breakPoint.call(this);
			} else {
				this._isAccordion = (window.innerWidth < this.options.breakPoint);
			}
			
			return !this._isAccordion;
		}
		
	};

	$.fn[pluginName] = function() {
		
		var args = arguments;
		
		return this.each(function() {
			
			var plugin = $(this).data(pluginName + '.plugin');
			
			if (!plugin) {
			
				plugin = new Plugin(this, args[0]);	
				
				$(this).data(pluginName + '.plugin', plugin);
			}
			
			if(typeof args[0] === 'string' && args[0].charAt(0) !== '_' && $.isFunction(plugin[args[0]])) {
				plugin[args[0]].apply(plugin, [].slice.call(args, 1));
			}
		});
	};
	
	$.fn[pluginName].defaults = {
		activeClass: 'tabs-active', // css class added to the active tab
		breakPoint: 991, // The breakpoint at which accordion mode is activated. Functions must return a boolean (int|function)
		closeOtherTabs: false, // Close other tabs when opening one in accordion mode
		duration: 200, // Duration of transitions
		pushState: false, // push tab events to window.history()
		resize: true // listen for resize events
	};

})(jQuery, window, document);