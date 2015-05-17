# shTranslate 

An AngularJS module that supports internationalization. The module provides both a service and a directive to handle translation. It also supports loading translation files lazily, actively, or manually. 

## Usage

Clone the GitHub repo:

```sh
    git clone https://github.com/suhdev/shTranslate.git
```

Add the module to your module's dependencies, and set the configuration. 
Refer to the [module documentation](http://suhdev.github.io/docs/shTranslate) for examples and detailed functionality.  

```javascript
    angular.module('MyModule',['shTranslate'])
    	.config(['I18NLangProvider',function(IP){
    		IP.addRepository({
    			'en-US':{
    				'key1':{
						'key2':{
							'key3':'translation Z',
							'key4':'translation V',
							'key5':'translation M'
						}
						'key10':{

						}
    				}
    			},
    			'ar-SA':'/translation/ar-sa.json'
    		});
    		IP.setLocale('ar-SA');
    		IP.setFallbackLocale('en-US');
    	}])
    	.controller('TestCtrl',['I18NLang',function(IL){
    		var label = IL.format('key1.key2.key3');
    		console.log(label);
    		//prints "Translation Z"
    	}]);
```

```html
	<div sh-translation="key1.key2.key3,key1.key2.key5" ng-bind="i18n.key1_key2_key3" ng-attr-title="{{i18n.key1_key2_key5}}">
	</div>
```
If GitHub repo was used then: 

```javascript
    var Songkick = require("PATH TO YOUR INSTALLATION");
```

Create an instance of SongKick using the factory method passing your API key:

```javascript
    var songKick = SongKick.create("<YOUR API KEY>");

    songkick.getEventDetails("EVENT_ID","DATA_TYPE");

```

#### The returned results 

SongKick responses have the following structure: 

```json
	{
		"resultsPage":{
			"results":{

			}
		}
	}
```

The module returns the 'resultsPage' skipping the outer wrapper object for convenience. See below:

```json
	{
		"results":{

		}
	}
```

For more details documentation, have a look at the [API's reference](http://suhdev.github.io/docs/songkick-wrapper)

You can request an API key at songkick's [website](http://www.songkick.com/api_key_requests/new).

Feel free to add/change/use the module in anyway you want. :D
### Copyright
Copyright (c) 2015 Suhail Abood