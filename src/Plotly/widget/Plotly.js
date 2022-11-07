const { executeNanoflow } = require("@jeltemx/mendix-react-widget-utils");

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
        mountNF: "",
        unmountNF: "",
        updateNF: "",

        // Internal
        _objectChangeHandler: null,
        contextObj: null,

        postCreate: function () {
            mx.logger.debug(this.id + ".postCreate");

            if (this.mountNF.nanoflow) {
                this.fireNanoflow(this.mountNF);
            }
        },

        update: function (obj, callback) {
            mx.logger.debug(this.id + ".update");
            this.contextObj = obj;
            if (this.updateNF.nanoflow) {
                this.fireNanoflow(this.updateNF).then(() => this._executeCallback(callback, "update"), () => this._executeCallback(callback, "update"));
            } else {
                this._executeCallback(callback, "update");
            }
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

        fireNanoflow: async function (flow) {
            /*             dojoDynamicRequire([`${mx.appUrl}jsactions.js`], n=>{
                                    const i = n['DataAnalysisV2$RenderPie'.replace(".", "$")];
               i().then(k=>console.log(k))
                                    
                                }); */
            await executeNanoflow(flow, this.mxcontext, this.mxform);
        },

        _executeCallback: function (cb, from) {
            mx.logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});
