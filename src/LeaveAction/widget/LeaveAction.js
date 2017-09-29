/*global logger*/
/*
    LeaveAction
    ========================

    @file      : LeaveAction.js
    @version   : 1.1.0
    @author    : Jelle Dekker
    @date      : 2017/09/29
    @copyright : Bizzomate 2017
    @license   : Apache 2

    Documentation
    ========================
    Describe your widget here.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
  "dojo/_base/declare",
  "mxui/widget/_WidgetBase",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/query",
  "dojo/on"
], function (declare, _WidgetBase, dojoLang, dojoArray, dojoQuery, dojoOn) {
  "use strict";

  // Declare widget's prototype.
  return declare("LeaveAction.widget.LeaveAction", [_WidgetBase], {
    // Parameters configured in the Modeler.
    mfToExecute: "",
    warningOnPageClose: "",
    executionMode: "",
    cssSelector: "",

    // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
    _contextObj: null,
    _handles: null,
    _active: false,

    // dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
    constructor: function () {
      // Uncomment the following line to enable debug messages
      //logger.level(logger.DEBUG);
      logger.debug(this.id + ".constructor");
      this._handles = [];
    },

    // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
    postCreate: function () {
      logger.debug(this.id + ".postCreate");

      if (this.readOnly || this.get("disabled") || this.readonly) {
        this._readOnly = true;
      }
    },


    // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
    update: function (obj, callback) {
      logger.debug(this.id + ".update");

      this._contextObj = obj;
      this._setupEvents();
      this._executeCallback(callback, ".update");
    },

    // mxui.widget._WidgetBase.uninitialize is called when the widget is destroyed. Implement to do special tear-down work.
    uninitialize: function () {
      logger.debug(this.id + ".uninitialize");

      if (this._active) {
        this._execMf(this.mfToExecute, this._contextObj.getGuid());
      }
      dojoArray.forEach(this._handles, function (handle, i) {
        handle.remove();
      });
      this._active = false;
      // Clean up listeners, helper objects, etc. There is no need to remove listeners added with this.connect / this.subscribe / this.own.
    },

    // Attach events to HTML dom elements
    _setupEvents: function () {
      logger.debug(this.id + "._setupEvents");

      this.connect(this.mxform, "onNavigation", function () {
        if (this.executionMode == 'exclude'){
          if (this.cssSelector && this.cssSelector.trim().length > 0) {
            dojoQuery(this.cssSelector).forEach(dojoLang.hitch(this, function (node) {
              this._handles.push(dojoOn(node, "click", dojoLang.hitch(this, this._onExclude)));
            }));
          }
          this._active = true;
        } else if (this.executionMode == 'include'){
          if (this.cssSelector && this.cssSelector.trim().length > 0) {
            dojoQuery(this.cssSelector).forEach(dojoLang.hitch(this, function (node) {
              this._handles.push(dojoOn(node, "click", dojoLang.hitch(this, this._onInclude)));
            }));
          }
        }
        this._handles.push(dojoOn(window, "beforeunload", dojoLang.hitch(this, this._onClose)));
      });
    },

    _onClose: function (event) {
      logger.debug(this.id + "._onClose");
      if (this.executionMode == 'include'){
        this._active = true;
      }
      if (this.warningOnPageClose && this._active) {
        event.preventDefault();
      }
      this.uninitialize();
    },

    _onExclude: function (event) {
      logger.debug(this.id + "._onExclude");
      this._active = false;
    },

    _onInclude: function (event) {
      logger.debug(this.id + "._onExclude");
      this._active = true;
    },

    _execMf: function (mf, guid, cb) {
      logger.debug(this.id + "._execMf");
      if (mf && guid) {
        mx.ui.action(mf, {
          params: {
            applyto: "selection",
            guids: [guid]
          },
          callback: dojoLang.hitch(this, function (objs) {
            if (cb && typeof cb === "function") {
              cb(objs);
            }
          }),
          error: function (error) {
            mx.ui.error("Error executing microflow " + mf + " : " + error.message);
            console.error(this.id + "._execMf", error);
          }
        }, this);
      }
    },

    _executeCallback: function (cb, from) {
      logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
      if (cb && typeof cb === "function") {
        cb();
      }
    }
  });
});

require(["LeaveAction/widget/LeaveAction"]);
