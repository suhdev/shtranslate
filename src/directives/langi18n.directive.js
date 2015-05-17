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