/*!
 * Draggable 3.3.4
 * https://greensock.com
 * 
 * @license Copyright 2023, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).window=e.window||{})}(this,function(e){"use strict";function _assertThisInitialized(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function _inheritsLoose(e,t){e.prototype=Object.create(t.prototype),(e.prototype.constructor=e).__proto__=t}var t,i,n,r,o,s,a,l,c=function(){return t||"undefined"!=typeof window&&(t=window.gsap)},u={},h=function(){function Draggable(e,i){n||Draggable.register(t)||console.warn("Please gsap.registerPlugin(Draggable)"),this.vars=i=i||{},this.target=e,this._preventDefault=!0,this._onPress=i.onPress,this._onDragStart=i.onDragStart,this._onDrag=i.onDrag,this._onRelease=i.onRelease,this.init()}var e=Draggable.prototype;return e.init=function(){this.enable()},e.kill=function(){return this.disable(),this},e.enable=function(e){return this._enabled=!0,this},e.disable=function(){return this._enabled=!1,this},Draggable.register=function(e){return t=e,!0},Draggable.create=function(e,t){return new Draggable(e,t)},Draggable}();h.version="3.3.4",e.Draggable=h,e.default=h,Object.defineProperty(e,"__esModule",{value:!0})});