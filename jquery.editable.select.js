/** 
 * @description This plugin allows you to make a select box editable like a text box while keeping it's select-option features
 * @description no stylesheets or images are required to run the plugin
 *
 * @version 0.0.1
 * @author Martin Mende
 * @license Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0)
 * @license For comercial use please contact me: martin.mende(at)aristech.de
 * 
 * @requires jQuery 1.9+
 *
 * @class editableSelect
 * @memberOf jQuery.fn
 *
 * @example
 *
 * var selectBox = $("select").editableSelect();
 * selectBox.addOption("I am dynamically added");
 */

(function($) {

    $.fn.editableSelect = function() {
        var instanceVar;

        this.each(function() {
            var originalSelect = $(this);
            //check if element is a select
            if (originalSelect[0].tagName.toUpperCase() === "SELECT") {
                //wrap the original select
                originalSelect.wrap($("<div/>"));
                var wrapper = originalSelect.parent();
                wrapper.css({ display: "inline-block" });
                //place an input which will represent the editable select
                var inputSelect = $("<input/>").insertBefore(originalSelect);
                //get and remove the original id
                var objID = originalSelect.attr("id");
                originalSelect.removeAttr("id");
                //add the attributes from the original select
                inputSelect.attr({
                    alt: originalSelect.attr("alt"),
                    title: originalSelect.attr("title"),
                    class: originalSelect.attr("class"),
                    name: originalSelect.attr("name"),
                    disabled: originalSelect.attr("disabled"),
                    tabindex: originalSelect.attr("tabindex"),
                    id: objID
                });
                //get the editable css properties from the select
                var rightPadding = 15;
                inputSelect.css({
                    width: originalSelect.width() - rightPadding,
                    height: originalSelect.height(),
                    fontFamily: originalSelect.css("fontFamily"),
                    fontSize: originalSelect.css("fontSize"),
                    background: originalSelect.css("background"),
                    paddingRight: rightPadding
                });
                inputSelect.val(originalSelect.val());
                //add the triangle at the right
                var triangle = $("<div/>").css({
                    height: 0,
                    width: 0,
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderTop: "7px solid #999",
                    position: "relative",
                    top: -(inputSelect.height() / 2) - 5,
                    left: inputSelect.width() + rightPadding - 10,
                    marginBottom: "-7px",
                    pointerEvents: "none"
                }).insertAfter(inputSelect);
                //create the selectable list that will appear when the input gets focus
                var selectList = $("<ol/>").css({
                    display: "none",
                    listStyleType: "none",
                    width: inputSelect.outerWidth() - 2,
                    padding: 0,
                    margin: 0,
                    border: "solid 1px #ccc",
                    fontFamily: inputSelect.css("fontFamily"),
                    fontSize: inputSelect.css("fontSize"),
                    background: "#fff",
                    position: "absolute",
                    zIndex: 1000000
                }).insertAfter(triangle);
                //add options
                originalSelect.children().each(function(index, value) {
                    prepareOption($(value).text(), wrapper);
                });
                //bind the focus handler
                inputSelect.focus(function() {
                    selectList.fadeIn(100, function() {
                        clickEvent();
                    });
                }).blur(function() {
                    //selectList.fadeOut(100);
                }).keyup(function(e) {
                    if (e.which == 13) inputSelect.trigger("blur");
                });
                //hide original element
                originalSelect.css({ visibility: "hidden", display: "none" });

                //save this instance to return it
                instanceVar = inputSelect
            } else {
                //not a select
                return false;
            }
        }); //-end each

        /** public methods **/

        /**
         * Adds an option to the editable select
         * @param {String} value - the options value
         * @returns {void}
         */
        instanceVar.addOption = function(value) {
            prepareOption(value, instanceVar.parent());
        };

        /**
         * Removes a specific option from the editable select
         * @param {String, Number} value - the value or the index to delete
         * @returns {void}
         */
        instanceVar.removeOption = function(value) {
            switch (typeof(value)) {
                case "number":
                    instanceVar.parent().children("ol").children(":nth(" + value + ")").remove();
                    break;
                case "string":
                    instanceVar.parent().children("ol").children().each(function(index, optionValue) {
                        if ($(optionValue).text() == value) {
                            $(optionValue).remove();
                        }
                    });
                    break;
            }
        };

        /**
         * Resets the select to it's original
         * @returns {void}
         */
        instanceVar.restoreSelect = function() {
            var originalSelect = instanceVar.parent().children("select");
            var objID = instanceVar.attr("id");
            instanceVar.parent().before(originalSelect);
            instanceVar.parent().remove();
            originalSelect.css({ visibility: "visible", display: "inline-block" });
            originalSelect.attr({ id: objID });
        };

        //return the instance
        return instanceVar;
    };

    /** private methods **/

    function prepareOption(value, wrapper) {
        var selectOption = $("<li>" + value + "</li>").appendTo(wrapper.children("ol"));
        var inputSelect = wrapper.children("input");
        selectOption.css({
            padding: "3px",
            textAlign: "left",
            cursor: "pointer"
        })
        //bind click on this option
        // selectOption.click(function(){
        // 	inputSelect.val(selectOption.text());
        // 	inputSelect.trigger("change");
        // });	
    };

    function clickEvent() {
    	$("li").hover(function()
    	{
    		$(this).css("background","#eee");
    	},function(){
    		$(this).css("background","#fff");;
    	});
        $("li").bind("click", function() {
            $(this).closest("div").find("input").val($(this).text());
            $(this).closest("ol").fadeOut(100);
        })
    }
}(jQuery));
