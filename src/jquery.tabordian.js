/*!
 jquery-tabordian v0.9.6
 A jQuery tabs/accordion plugin
 (c) 2015 Andy Palmer
 license: http://www.opensource.org/licenses/mit-license.php
 */
( function( $, window, document, undefined ) {

	'use strict';

	var pluginName = 'tabs';

	function Plugin( element, options ) {

		this.$el = $( element );

		this.options = $.extend( { }, $.fn[pluginName].defaults, options );

		this._isAccordion = false;

		// Store a reference to the tabs
		this.tabs = this.$el.find( this.options.tabSelector );

		// Store a reference to the tab contents
		this.tabContents = this.$el.find( this.options.contentSelector );

		this.tabContents.wrapAll( '<div class="' + pluginName + '-content-wrap" />' );

		this.container = this.tabContents.parent();

		this.init();
	}

	Plugin.prototype = {
		/**
		 *  Initialises the plugin instance
		 */
		init: function() {

			this.tabs.each( function() {

				// Give the tab a reference to its tab content div
				$( this ).data( pluginName + '.tab-content', $( $( this ).attr( 'href' ) ) );

				// Give the tab content div a reference to its tab
				$( this ).data( pluginName + '.tab-content' ).data( pluginName + '.tab', $( this ) );
			} );

			// Initial call to onResize
			this.onResize( true );

			// Hide all tab contents
			this.hideTabs();

			if ( location.hash ) {
				// Pass showTab() the first matched tab only
				this.showTab( $( this.options.tabSelector + '[href=' + location.hash + ']' ).eq( 0 ), true );
			} else {
				// If there is no hash fragment in the URL show the first tab
				this.showTab( 0, true );
			}

			// Attach the click handler to tabs
			this.attachHandler();

			if ( this.options.resizeRefreshRate !== false ) {

				$( window ).on( 'resize.' + pluginName, $.proxy( function() {
					this.resizeCallback();
				}, this ) );
			}
		},
		/**
		 *  Destroys the plugin instance
		 */
		destroy: function() {

			this.tabs.removeData( pluginName + '.tab-content' );

			this.tabContents.removeData( pluginName + '.tab' );

			if ( this.options.resizeRefreshRate !== false ) {
				$( window ).off( 'resize.' + pluginName );
			}

			this.$el.off( 'click.' + pluginName, this.options.tabSelector ).removeData( pluginName + '.plugin' );
		},
		/**
		 *  Emits a namespaced plugin event
		 */
		emit: function( event, tab ) {

			this.$el.trigger( pluginName + '.' + event, [ tab, this.options ] );
		},
		/**
		 *  Attaches the click handler to the element
		 */
		attachHandler: function() {

			var self = this;

			this.$el.on( 'click.' + pluginName, this.options.tabSelector, function( event ) {

				event.preventDefault();

				if ( !$( this ).data( pluginName + '.tab-content' ).is( ':visible' ) ) {
					self.showTab( this );
				} else if ( self._isAccordion ) {
					self.hideTab( this );
				}

				if ( self.options.pushState ) {

					self.pushState( $( this ).attr( 'href' ) );
				}

			} );
		},
		/**
		 *  Returns the tab at a zero-based index or a matching href attribute.
		 */
		getTab: function( id ) {

			var tab;

			switch ( typeof id ) {
				case 'string':
					tab = this.tabs.filter( '[href="' + id + '"]' );
					break;
				case 'number':
					tab = this.tabs.get( id );
					break;
				default:
					tab = this.tabs.filter( id );
					break;
			}

			return tab;
		},
		/**
		 *  Shows the specified tab
		 */
		showTab: function( tab, instant ) {

			tab = this.getTab( tab );

			if ( !$( tab ).length ) {
				tab = this.getTab( 0 );
			}

			if ( !$( tab ).data( pluginName + '.tab-content' ) ) {
				return false;
			}

			var transition;

			if ( instant ) {
				transition = 'show';
			} else if ( this._isAccordion ) {
				transition = 'slideDown';
			} else {
				transition = 'fadeIn';
			}

			var duration = ( instant || transition === 'show' ) ? 0 : this.options.duration;

			$( tab ).data( pluginName + '.tab-content' )[transition]( duration, $.proxy( function() {

				this.emit( 'show', tab );

			}, this ) );

			if ( !this._isAccordion || this.options.closeOtherTabs ) {
				this.hideTabs( $( tab ).data( pluginName + '.tab-content' ) );
			}

			$( tab ).addClass( this.options.activeClass );

			// Change glyphicon chevrons if they exist
			$( tab ).find( '.glyphicon' ).removeClass( 'glyphicon-chevron-right' ).addClass( 'glyphicon-chevron-down' );
		},
		/**
		 *  Hides a specific tab
		 */
		hideTab: function( tab ) {

			tab = this.getTab( tab );

			if ( !$( tab ).length ) {
				tab = this.getTab( 0 );
			}

			if ( !$( tab ).data( pluginName + '.tab-content' ) ) {
				return false;
			}

			$( tab ).removeClass( this.options.activeClass );

			var transition = ( this._isAccordion ) ? 'slideUp' : 'hide',
				duration = ( transition === 'hide' ) ? 0 : this.options.duration;

			$( tab ).data( pluginName + '.tab-content' )[transition]( duration, $.proxy( function() {
				this.emit( 'hide', tab );
			}, this ) );

			// Change Bootstrap glyphicon chevrons if they exist
			$( tab ).find( '.glyphicon' ).removeClass( 'glyphicon-chevron-down' ).addClass( 'glyphicon-chevron-right' );
		},
		/**
		 *  Hides all tabs apart from the current tab
		 */
		hideTabs: function( current ) {

			this.tabs.removeClass( this.options.activeClass );
			this.tabs.find( '.glyphicon' ).removeClass( 'glyphicon-chevron-down' ).addClass( 'glyphicon-chevron-right' );

			if ( this._isAccordion ) {
				this.tabContents.not( current ).slideUp( this.options.duration );
			} else {
				this.tabContents.not( current ).hide();

			}
		},
		/**
		 *  Pushes the tab state to the history API or falls back to setting the location hash fragment
		 */
		pushState: function( state ) {

			if ( $.isFunction( history.pushState ) ) {
				history.replaceState( { }, '', state );
			} else {
				location.hash = state;
			}
		},
		resizeCallback: function() {

			window.clearTimeout( this.resizeTimer );
			this.resizeTimer = window.setTimeout( $.proxy( this.onResize, this ), this.options.resizeRefreshRate );
		},
		/**
		 *  Fires when the window is resized and converts the instance between tab and accordion mode
		 */
		onResize: function( initial ) {

			if ( this.isDesktop() ) {

				// If its not the initial call move the tab contents back in to the container
				if ( !initial ) {
					this.tabContents.appendTo( this.container );
				}

			} else {

				this.tabContents.each( function() {

					$( this ).appendTo( $( this ).data( pluginName + '.tab' ).parent() );

				} );
			}
		},
		/**
		 *  Returns whether the window width matches the breakpoint
		 */
		isDesktop: function() {

			if ( $.isFunction( this.options.breakPoint ) ) {
				this._isAccordion = !this.options.breakPoint.call( this );
			} else {
				this._isAccordion = ( window.innerWidth < this.options.breakPoint );
			}

			return !this._isAccordion;
		}

	};

	$.fn[pluginName] = function() {

		var args = arguments;

		return this.each( function() {

			var plugin = $( this ).data( pluginName + '.plugin' );

			if ( !plugin ) {

				plugin = new Plugin( this, args[0] );

				$( this ).data( pluginName + '.plugin', plugin );
			}

			if ( typeof args[0] === 'string' && args[0].charAt( 0 ) !== '_' && $.isFunction( plugin[args[0]] ) ) {
				plugin[args[0]].apply( plugin, [ ].slice.call( args, 1 ) );
			}
		} );
	};

	$.fn[pluginName].defaults = {
		activeClass: 'tabs-active', // css class added to the active tab
		breakPoint: 991, // The breakpoint at which accordion mode is activated. Functions must return a boolean (int|function)
		closeOtherTabs: false, // Close other tabs when opening one in accordion mode
		contentSelector: '.tabs-content',
		duration: 200, // Duration of transitions
		pushState: false, // push tab events to window.history()
		resizeRefreshRate: 100,
		tabSelector: '.tabs a'
	};

} )( jQuery, window, document );
