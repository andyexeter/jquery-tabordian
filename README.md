# jquery-tabordian v0.9.3

jquery-tabordian is a jQuery tabs plugin which transforms into an accordion at a given breakpoint

### 1. Getting Started
Include the jquery.tabordian.js file and optional jquery.tabordian.css

```html
<link rel="stylesheet" href="jquery.tabordian.css" type="text/css" />
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> // Only needed if jQuery isn't already loaded on the site
<script src="path/to/jquery.tabordian.js"></script>
```

### 2. Markup

```html
<div class="tabs-container">
	<ul class="tabs">
		<li><a href="#tab-1">Tab One <i class="glyphicon glyphicon-chevron-right hidden-desk pull-right"></i></a></li>
		<li><a href="#tab-2">Tab Two <i class="glyphicon glyphicon-chevron-right hidden-desk pull-right"></i></a></li>
		<li><a href="#tab-3">Tab Three <i class="glyphicon glyphicon-chevron-right hidden-desk pull-right"></i></a></li>
	</ul>
	<div class="tabs-content-container">
		<div id="tab-1" class="tabs-content">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed molestie eros. Nam eget egestas urna. Curabitur nulla nisi, viverra vel bibendum vitae, fermentum vitae turpis. Duis vestibulum nisl a augue mollis, vitae imperdiet mi lacinia. Maecenas auctor dolor pellentesque sem facilisis venenatis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras in sodales metus, vitae aliquet nibh. Maecenas porta facilisis orci vel blandit. Sed ut volutpat felis. Aliquam iaculis in felis id dictum. Mauris auctor ipsum id euismod sagittis. Cras ligula augue, tempus in vestibulum et, tincidunt vel mauris. Donec luctus dui sodales velit tempor tempor. Nullam auctor ut metus in vestibulum. Integer efficitur semper nulla ac venenatis. Aliquam interdum iaculis ante ut sagittis.</p>
		</div>
		<div id="tab-2" class="tabs-content">
			<p>Bonjour tout le monde</p>
		</div>
		<div id="tab-3" class="tabs-content">
			<p>Halló Heimur</p>
		</div>
	</div>
</div>
```

### 3. Initialising a plugin instance

The plugin can be initialised without passing any options:

```js
$('.tabs-container').tabs();
```

Alternatively, you can pass through an object with any of the following options to override the defaults:

### 4. Options

| Option            | Type              | Description                                                                                                                                   | Default                   |
| ----------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| activeClass       | `string`          | CSS class added to the active tab                                                                                                             | 'tabs-active'             |
| breakPoint        | `number/function` | The breakpoint in pixels at which accordion mode is activated.  Functions must return a boolean indicating if the breakpoint has been reached | 991                       |
| closeOtherTabs    | `boolean`         | Close other tabs when opening one in accordion mode                                                                                           | false                     |
| containerSelector | `string`          | Selector for the tab contents container                                                                                                       | '.tabs-content-container' |
| contentSelector   | `string`          | Selector for the tab contents sections                                                                                                        | '.tabs-content'           |
| duration          | `number`          | The duration in milliseconds of tab open/close transitions                                                                                    | 200                       |
| fadeIn            | `boolean`         | Whether to use fadeIn for tab transitions                                                                                                     | true                      |
| pushState         | `boolean`         | Whether to push tab changes to window.history() Falls back to location.hash if the history API is unsupported                                 | false                     |
| resizeRefreshRate | `number/boolean`  | The rate in milliseconds to check if the breakPoint has been reached.  Set to false to ignore resize events                                   | 100                       |
| tabsSelector      | `string`          | Selector for the actual tabs within the element                                                                                               | '.tabs a'                 |

```js
$('.tabs-container').tabs({
	activeClass: 'my-active-tab-class',
	duration: 500,
	pushState: true
});
```

License
------------
[The MIT License (MIT)](http://opensource.org/licenses/mit-license.php)