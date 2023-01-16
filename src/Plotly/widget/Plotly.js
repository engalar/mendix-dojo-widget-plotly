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
        containerId: "",
        nf: "",

        // Internal
        _objectChangeHandler: null,
        contextObj: null,

        postCreate: function () {
            mx.logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            mx.logger.debug(this.id + ".update");
            this.contextObj = obj;
            this.fireNanoflow().then(callback, callback);
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

        fireNanoflow: async function () {
            await new Promise((resolve, reject) => {

                this.mxcontext.trackObject.set(this.containerId, this.id);
                mx.data.callNanoflow({
                    nanoflow: this.nf,
                    origin: this.mxform,
                    context: this.mxcontext,
                    callback: function (result) {
                        resolve(result)
                    },
                    error: function (error) {
                        reject(error)
                    }
                });


            });
        },

    });
});
