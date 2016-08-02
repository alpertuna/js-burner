/**
 * js/./Tip.js
 * Author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 23.04.2016
 */

'use strict';

define(['../core/Utils', './Document', './Element', './Group'], function(Utils, Document, Element, Group){
    var shownPopup;

    function targetClickedInClickMode(e){
        if(this.hasClass('jb-hidden')){
            this.show();
            this.putHideHandler(e);
        }else
            this.hide();
    }

    return Element.extend({
        'init': function(){
            this.super();
            this.addClass('jb-popup');
            this.hide();
            this.set('window', Element.new(window));
            this.on('show', this.adjustPosition);

            //Document.new().add(this);
        },

        'placed': false,
        'adjustPosition': function(){
            if(!this.get('placed')){
                this.get('target').add(this);
                this.set('placed', true);
            }

            var direction = this.get('direction');
            var align = this.get('align');

            switch(align){
                //case 'BOTTOM':this.addClass('jb-popup-bottom');break;
                case 'RIGHT':this.addClass('jb-popup-align-right');break;
            }

            var targetRect = this.get('targetDom').getBoundingClientRect();
            var targetRectTop = this.get('targetDom').offsetTop;
            var targetRectLeft = this.get('targetDom').offsetLeft;
            var thisRect = this.getDom().getBoundingClientRect();
            var top, left;

            if(direction == 'BOTTOM'){
                if(targetRect.top + targetRect.height + thisRect.height > window.innerHeight){
                    if(targetRect.top - thisRect.height >= 0){
                        direction = 'TOP';
                    }else if(targetRect.left + targetRect.width + thisRect.width <= window.innerWidth){
                        direction = 'RIGHT';

                        if(window.innerHeight - targetRect.top > thisRect.height){
                            align = 'TOP';
                        }else if(window.innerHeight - thisRect.height < 0)
                            align = 'PAGE_TOP';
                        else
                            align = 'PAGE_BOTTOM';
                    }
                }
            }

            switch(direction){
                case 'TOP':
                    top = targetRectTop - thisRect.height;
                    break;
                case 'BOTTOM':
                    top = targetRectTop + targetRect.height;
                    break;
                case 'LEFT':
                    left = targetRectLeft - thisRect.width;
                    break;
                case 'RIGHT':
                    left = targetRectLeft + targetRect.width;
                    break;
            }
            this.removeClass('jb-popup-align-top jb-popup-align-bottom jb-popup-align-left jb-popup-align-right');
            switch(align){
                case 'CENTER':
                    if(Utils.isSet(left))
                        top = targetRectTop + (targetRect.height - thisRect.height)/2;
                    else
                        left = targetRectLeft + (targetRect.width - thisRect.width)/2;
                break;
                case 'LEFT':
                    left = targetRectLeft;
                    this.addClass('jb-popup-align-left');
                    break;
                case 'RIGHT':
                    left = targetRectLeft + targetRect.width - thisRect.width;
                    this.addClass('jb-popup-align-right');
                    break;
                case 'TOP':
                    top = targetRectTop;
                    this.addClass('jb-popup-align-top');
                    break;
                case 'BOTTOM':
                    top = targetRectTop + targetRect.height - thisRect.height;
                    this.addClass('jb-popup-align-bottom');
                    break;
                case 'PAGE_TOP':
                    toap = targetRectTop - targetRect.top;
                    break;
                case 'PAGE_BOTTOM':
                    top = targetRectTop - targetRect.top + window.innerHeight - thisRect.height;
                    break;
            }

            this.setStyle({
                'top': top,
                'left': left
            });
        },
        'putHideHandler': function(e){
            this.get('window').getDom().addEventListener('click', this.hide);
            e.stopPropagation();
        },
        'removeHideHandler': function(e){
            this.get('window').getDom().removeEventListener('click', this.hide);
        },

        'closeOtherPopup': function(){
            if(shownPopup && shownPopup !== this) shownPopup.hide();
            shownPopup = this;
        },

        /**
         * Directions: TOP, BOTTOM, RIGHT, LEFT
         * Aligns: CENTER, TOP, BOTTOM, RIGHT, LEFT
         */
        'direction': 'TOP',
        'align': 'CENTER',
        'setDirection': function(direction, align){
            if(Utils.isUnset(align)) align = 'CENTER';

            this.set('direction', direction);
            this.set('align', align);

            return this.ref;
        },

        'bound': false,
        //FOCUS, HOVER, CLICK, NONE
        'bind': function(element, trigger){
            //TODO Error
            if(this.get('bound')) throw 'Popup is already bound.';
            this.set('bound', true);
            //TODO error
            if(!element.hasClass('jb-com-container'))
                throw 'To bind popup, component has to have container.';

            var component = element.getComponent();

            if(Utils.isUnset(trigger)) trigger = 'FOCUS';

            this.set('target', element);
            this.set('targetComponent', component);
            this.set('targetDom', element.getDom());
            this.set('trigger', trigger);

            if(trigger == 'NONE') return this;

            switch(trigger){
                /*case 'FOCUS':
                    component.on('focus', this.show);
                    component.on('blur', this.hide);
                    break;
                case 'HOVER':
                    component.on('mouseover', this.show);
                    component.on('mouseout', this.hide);
                    break;*/
                case 'CLICK':
                    this.on('show', this.closeOtherPopup);
                    this.on('hide', function(){shownPopup = null});

                    element.on('click', targetClickedInClickMode.bind(this));

                    this.on('hide', this.removeHideHandler);
                    this.getDom().addEventListener('click', function(e){e.stopPropagation()});
                    break;
            }

            return this.ref;
        }
    });
});
