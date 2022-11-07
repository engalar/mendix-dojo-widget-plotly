define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dojo/dom-style",
    "dojo/dom-attr",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/html",
    "dijit/layout/LinkPane"
], function (
    declare,
    _WidgetBase,
    domStyle,
    domAttr,
    domConstruct,
    lang,
    html,
    LinkPane
) {
    "use strict";

    return declare("Plotly.widget.Plotly", [_WidgetBase], {
        // Set in Modeler
        jsaction: "",

        // Internal
        _objectChangeHandler: null,
        contextObj: null,

        postCreate: function () {
            mx.logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            mx.logger.debug(this.id + ".update");
            this.contextObj = obj;
            this.fireNanoflow(this.contextObj, this.domNode, 'update').then(() => this._executeCallback(callback, "update"), () => this._executeCallback(callback, "update"));
        },

        _handleError: function (error) {
            mx.logger.debug(this.id + "._handleError");
            domConstruct.place(
                '<div class="alert alert-danger">Error while evaluating javascript input: ' +
                error +
                "</div>",
                this.domNode,
                "only"
            );
        },

        fireNanoflow: async function (obj, container, stage) {
            await new Promise((resolve, reject) => {
                dojoDynamicRequire([`${mx.appUrl}jsactions.js`], n => {
                    const i = n[this.jsaction.replace(".", "$")];
                    if (!i) reject();
                    i().then(k => k(obj, container, stage).then(resolve), reject)
                });
            });
        },

        _executeCallback: function (cb, from) {
            mx.logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});
