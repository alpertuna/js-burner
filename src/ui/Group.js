/**
 * js/./Group.js
 * Author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 22.04.2016
 */

'use strict';

define(['../core/Utils', './Element'], function(Utils, Element){
    return Element.extend({
        'init': function(vertical){
            this.super();
            this.addClass(vertical ? 'jb-v-group' : 'jb-group');
        },

        'setDisabled': function(value){
            Utils.each(this.get('children'), function(child){
                child.setDisabled(value);
            });

            return this.ref
        },
        'setTheme': function(value){
            Utils.each(this.get('children'), function(child){
                child.setTheme(value);
            });

            return this.ref
        }
    });
});