/**
 * @ngdoc overview
 * @id module:shTranslate  
 * @name shTranslate
 * @module shTranslate
 * @description 
 * #shTranslate 
 * Provides a set of general tools [Suhail](http://www.suhailabood.me)
 */
angular.module('shTranslate',[]);   
/**
 * @ngdoc directive
 * @name shTranslate.directive:shTranslation 
 * @description 
 * Imports the required translations into the i18n object of the scope. See the example below
<example module="Suhail">
<file name="index.html">
  <div class="container" >
    <div ng-bind="i18n.kick_boxing" suh-lang-group="kick.throw" sh-translation="kick.boxing" ng-attr-title="{{i18n.kick_boxing}}" ng-attr-cx="{{i18n.kick_throw}}">
    </div>
    <div ng-controller="TestCtrl as ctrl" >
      <button ng-click="ctrl.switchLanguage()">Switch</button>
    </div> 
  </div>
</file>
<file name="script.js">
  angular.module('Suhail',['shTranslate'])
      .config(['I18NLangProvider',function (IP) {
        IP.setLocale("en-GB");
        IP.setFallbackLocale("en-GB");
        IP.addRepository({
          "en-GB":"/translation_en.json",
          "ar-SA":"/translation_ar.json"
        });
      }]);
    angular.module('Suhail')
      .controller('TestCtrl', ['$scope','I18NLang', function ($S,LANG) {
        var langs = ['en-GB','ar-SA'];
        this.switchLanguage = function(){
          langs.push(langs.shift());
          LANG.setLocale(langs[0]);
        };
      }])
</file>
</example>
 */
angular.module('shTranslate')
	.directive('shTranslation', ['I18NLang','$compile','$parse',function (lang,$CC,$PP) {
		return {
			restrict: 'A',
			link: function postLink($S, $E, $A) {
				var matches = [],
					locale = $A['shTranslationLocale'],
					keys = $A['shTranslation'].split(','),
					m;
				$S.i18n = $S.i18n || {};

				for(var key in $A){
					m = key.match(/shTranslation([A-Z].*)/);
					if (m && m.length > 1){
						keys.push($A[key]);
					}
				}

				for(var i=0;i<keys.length;i++){
					(function(k){
						Object.defineProperty($S.i18n,k.replace(/\./g,'_'),{
							get:function(){
								return lang.format(k);
							}
						});
					})(keys[i])
				}

			}
		};
	}])
/**
 * @ngdoc object
 * @name shTranslate.provider:I18NLangProvider 
 * @description 
 * A translation provider which makes it easier to bootstrap the locales repositories and 
 * setting both the default locale and the fallback locale. 
 */
angular.module('shTranslate')
	.provider('I18NLang', [function () { 

		var repositories = {},
			locale = 'en-US',
			lazy = true,
			db = {},
			fallbackLocale = 'en-US';

		function checkLocale(loc){
			if (!angular.isString(loc)){
				throw new Error("Locale should be a string")
			}else if (!(/[a-z]{2}-[A-Z]{2}/.test(loc))){
				throw new Error("Locale should be an ISO-compliant string i.e. en-GB");
			}
		}

		function checkRepositoryUrl(url){
			if (!angular.isString(url)){
				throw new Error("The provided URL isn't a string");
			}
		}

		

		/**
		 * @ngdoc method
		 * @name shTranslate.I18NLangProvider#addRepository
		 * @param {string|obj} loc either the location of the repository or an object 
		 * literal with the keys being the locales and the values the URLs of the 
		 * translation files. If the provided values are object literals, then these 
		 * values will be used as translation databases for their locales. 
		 * @param {string|object} url the location of the translation repository. If an 
		 * object literal is provided, the object will be used as a translation database
		 * for the provided locale
		 * @methodOf shTranslate.provider:I18NLangProvider
		 * @description 
		 * Adds a translation repository or a set of translation repositories to the service.
		 * Note that the actual request to load the translation library will not be sent at
		 * this stage. 
		 * @example
		 * ```javascript
		 	//adding a single repository 
		 	angular.module('TestMod',['shTranslate'])
		 		.config(['I18LangProvider',function(IP){
		 			//add a single repository 
				 	IP.addRepository('en-US','/translate/translation_en.json');
				 	//adding multpile repositories 
				 	IP.addRepository({
				 		'ar-SA':'/translate/translation_ar.json',
						'en-US':'/translate/translation_en.json'
				 	});
				 	//adding repositories manually
				 	IP.addRepository({
						'it-IT':{
							'home':{
								'navigation':{
									'about-us':'About Us'
								}
							}
						}
				 	});
		 		}]);
		 	```
		 */
		this.addRepository = function(loc,url){
			if (angular.isObject(loc)){
				for(var key in loc){
					if (angular.isObject(loc[key])){
						db[key] = loc[key];
					}else {
						repositories[key] = loc[key];
					}
				}
			}else {
				checkLocale(loc);
				if (angular.isObject(url)){
					db[loc] = url;
				}else {
					checkRepositoryUrl(url);
					repositories[loc] = url; 
				}
			}
		};

		/**
		 * @ngdoc method
		 * @name shTranslate.I18NLangProvider#setLocale
		 * @param {string} loc the locale to set it as the default locale
		 * @methodOf shTranslate.provider:I18NLangProvider
		 * @description
		 * Sets the default locale of the application. 
		 * By default the locale is set to 'en-US'.  
		 * @example
		 * ```javascript
		 	//adding a single repository 
		 	angular.module('TestMod',['shTranslate'])
		 		.config(['I18LangProvider',function(IP){
		 			//add a single repository 
				 	IP.addRepository('en-US','/translate/translation_en.json');
				 	//adding multpile repositories 
				 	IP.addRepository({
				 		'ar-SA':'/translate/translation_ar.json',
						'en-US':'/translate/translation_en.json'
				 	});
				 	//now set the default locale 
				 	IP.setLocale('en-US');
		 		}]);
			
		 ```
		 */
		this.setLocale = function(loc){
			checkLocale(loc);
			locale = loc;
		};

		/**
		 * @ngdoc method
		 * @name shTranslate.I18NLangProvider#setFallbackLocale
		 * @param {string} loc the locale to set it as the fallback locale
		 * @methodOf shTranslate.provider:I18NLangProvider
		 * @description
		 * Sets the fallback locale of the application. 
		 * By default the fallback locale is set to 'en-US'. 
		 * The fallback locale is used when a translation key couldn't be found
		 * in the current active locale. 
		 * @example
		 * ```javascript
		 	//adding a single repository 
		 	angular.module('TestMod',['shTranslate'])
		 		.config(['I18LangProvider',function(IP){
		 			//add a single repository 
				 	IP.addRepository('en-US','/translate/translation_en.json');
				 	//adding multpile repositories 
				 	IP.addRepository({
				 		'ar-SA':'/translate/translation_ar.json',
						'en-US':'/translate/translation_en.json'
				 	});
				 	//now set the default locale 
				 	IP.setLocale('ar-SA');
				 	//now set the fallback locale
				 	IP.setFallbackLocale('en-US')

		 		}]);
			
		 ```
		 */
		this.setFallbackLocale = function(loc){
			checkLocale(loc);
			fallbackLocale = loc;
		};

		/**
		 * @ngdoc method
		 * @name shTranslate.I18NLangProvider#setLoadLazily
		 * @methodOf shTranslate.provider:I18NLangProvider
		 * @param {boolean} e either true or false, true to load translation repositories lazily
		 * i.e. only when they're needed, false to load them as soon as the translation service is initialized.
		 * @description 
		 * Sets whether the translation repositories should be loaded lazily (when needed) or 
		 * loaded upon the initialization of the translation service. By default only the default i.e. (set to true) 
		 * locale and the fallback locale (if available) are loaded upon initialization, 
		 * all other repositories are loaded when the locale is changed to that specific locale. 
		 */
		this.setLoadLazily = function(e){
			lazy = e; 
		};

		/**
		 * @ngdoc service
		 * @name shTranslate.I18NLang
		 * @description
		 * Provides an object to create network resources
		 * 
		 */
		this.$get = ['$http','$q',function($H,$Q) {
			var cache = {},
				def = $Q.defer(),
				fallbackLoaded = false,
				mainLoaded = false;

			function getAt(obj,keyPath){
				var path = keyPath.split('.'),
					o = obj,
					k = null;
				while((o && (k = path.shift()))){
					o = o[k]; 
				}
				return o;
			}

			function hashCode(code){
			  var hash = 0, i, chr, len;
			  if (code.length == 0) return hash;
			  for (i = 0, len = code.length; i < len; i++) {
			    chr   = code.charCodeAt(i);
			    hash  = ((hash << 5) - hash) + chr;
			    hash |= 0; // Convert to 32bit integer
			  }
			  return hash;
			}

			function loadLocale(loc,url){
				return $H.get(url)
					.success(function(e){
						db[loc] = e;
					});
			}
			function main(){
				var url;
				if (!db[locale]){
					url = repositories[locale];
					if (url){
						loadLocale(locale,url)
						.then(function(){
							mainLoaded = true;
							def.resolve();
						});
					}
				}
				if (!db[fallbackLocale]){
					url = repositories[fallbackLocale];
					if (url && (url != repositories[locale])){
						loadLocale(fallbackLocale,url)
							.then(function(){
								fallbackLoaded = true;
							});
					}
				}
			}

			var o = {
				/**
				 * @ngdoc method
				 * @name shTranslate.I18NLang#ready
				 * @description returns a promise that is resolved when the default locale is loaded. 
				 * This is only if the translation repositories are loaded lazily. In case the repositories
				 * are actively loaded. The promise will be resolved. 
				 * @methodOf shTranslate.I18NLang
				 * @returns {object} q promise 
				 */
				ready:function(){
					return def.promise;
				},

				/**
				 * @ngdoc method
				 * @name shTranslate.I18NLang#isLocaleLoaded
				 * @methodOf shTranslate.I18NLang
				 * @returns {boolean} true when locale is loaded, false otherwise. 
				 * @description
				 * Return true when the default locale is loaded, false otherwsie. 
				 */
				isLocaleLoaded:function(){
					return mainLoaded;
				},

				/**
				 * @ngdoc method
				 * @name shTranslate.I18NLang#isFallbackLocaleLoaded
				 * @methodOf shTranslate.I18NLang
				 * @returns {boolean} true when locale is loaded, false otherwise. 
				 * @description
				 * Return true when the fallback locale is loaded, false otherwsie. 
				 */
				isFallbackLocaleLoaded:function(){
					return fallbackLoaded;
				},

				/**
				 * @ngdoc method
				 * @name shTranslate.I18NLang#setLocale
				 * @methodOf shTranslate.I18NLang
				 * @param {string} loc the locale to set as the default. 
				 * @description
				 * Sets the default locale 
				 */
				setLocale:function(loc){
					locale = loc;
					loadLocale(loc,repositories[loc]);
				},

				/**
				 * @ngdoc method
				 * @name shTranslate.I18NLang#format
				 * @methodOf shTranslate.I18NLang
				 * @param {string} key the item key in the repository. 
				 * The key can be a "dot" separated path i.e. 'nav.items.home'. See the example below.
				 * @param {array|object} [replacements] either an array of the placeholders values, in such case 
				 * the placeholders must use '?' to indicate a replacable item. This can also be an object literal
				 * with the keys being the placeholders in the text, and values are the values to use as replacements.
				 * See the example below 
				 * @param {string} [locale] the locale to use, if not provided, the default locale is used. 
				 * @description
				 * Retrieves an item from a translation repository given its key and placeholders replacements (if any). 
				 * @example
				 Assuming the following translation repository 
				 ```json
				 	{
						"navigation":{
							"items":{
								"home":"This is just a ?. This is ?",
								"contactus":"This is another :desc using :type",
								"about":"About Us",
								"back":"Back",
								"lang":"Switch language"
							}
						}
				 	}
				 ```

				 ```javascript
					angular.module('TestApp',['shTranslate'])
						.config(['I18LangProvider',function(IP){
						 	//adding multpile repositories 
						 	IP.addRepository({
								'en-US':'/translate/translation_en.json'
						 	});
						 	//now set the default locale 
						 	IP.setLocale('en-US');
						 	//now set the fallback locale
						 	IP.setFallbackLocale('en-US')
				 		}]);
				 	angular.module('TestApp')
				 		.controller('TestCtrl',['$scope','I18NLang',function($S,LL){
							var label = LL.format('navigation.items.about'); 
							console.log(label);
							//prints 'About Us'
							label = LL.format('navigation.items.home',['Test','silly']);
							console.log(label)
							//prints 'This is just a test. This is silly'
							label = LL.format('navigation.items.contactus',{
								desc:'example',
								type:'object literals'
							});
							console.log(label);
							//prints 'This is another example using object literals'
				 	}]);
				 ```
				 */
				format:function(key,replacements,l){
					var loc = l || locale,
						hashKey = (replacements)?(loc+key+JSON.stringify(replacements)):(loc+key),
						code = hashCode(hashKey),
						currentDb = loc?db[loc]:(db[locale]?db[locale]:(db[fallbackLocale]?db[fallbackLocale]:null)),
						item = getAt(currentDb,key);

					if (cache[""+code]){
						return cache[""+code];
					}
					if (item){
						if (!angular.isDefined(replacements)){
							cache[""+code] = item;
							return item;
						}
						if (angular.isArray(replacements)){
							if (cache[""+code]){
								return cache[""+code];
							}
							for(var i=0,l=replacements.length;i<l;i++){
								item = item.replace("?",replacements[i]);
							}
						}else if (angular.isObject(replacements)){
							for(var key in replacements){
								item = item.replace(new RegExp(":"+key,"ig"),getAt(replacements,key));
							}
						}
						cache[""+code] = item;
					}
					return item;
				},
				get:function(){
					var loc,key,replacements;
					switch(arguments.length){
						case 0:
							throw new Error("No parameters passed to translate method");
							break;
						case 1:
							if (angular.isObject(arguments[0])){
								loc = arguments[0].locale;
								key = arguments[0].key,
								replacements = arguments[0].replacements || {};
							}else{
								key = arguments[0];
							}
							break;
						case 2:
							key = arguments[0];
							replacements = arguments[1];
							break;
						case 3:
							loc = arguments[0];
							key = arguments[1];
							replacements = arguments[2];
							break;
					}
					var t = {
						translate:function(){
							return o.format(key,replacements,loc||locale);
						}
					};

					Object.defineProperty(t,'value',{
						get:function(){
							return this.translate();
						}
					});
					return t;
				}
			};

			main();

			Object.defineProperty(o,'LOCALE',{
				get:function(){
					return locale;
				}
			});
			return o;
		}];
	}])