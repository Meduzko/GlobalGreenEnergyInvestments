/**
 * Validation JS component.
 * User: Kramarenko Konstantin
 * Date: 10/2/13
 * Time: 5:08 PM
 *
 *
 * CONFIGURATION (data-jscomp-config):
 *
 * - ignoreHiddenFields {Boolean} Skip validation of hidden or not visible fields (default: true)
 *
 *
 * @Description:
 * Will add validation on form. Component events: init, validationSuccess, validationFail;
 * @required - Field attribute 'name'
 *
 *
 * COMP_EVENTS: formSubmitValidationStart, validationPass, validationFail
 *
 *
 * @required - Data attribute 'data-validate' must be 'validate' for form that should have clien side validation.
 * @required - Field that need to be validated must contains data attribute: 'data-validator-<validator_name>'
 * @required - Message for validated field must be in attribute: 'data-validator-<validator_name>-msg'
 * @required - Data attribute 'data-backend-validator-msg' - Back end validation message
 *
 * List of validation rules you can find here - http://jqueryvalidation.org/documentation/
 *
 *
 * Example in .erb:
 *
 *    <%= form_for @passenger, :html => {:'data-jscomp' => 'app/modules/ldc_validator'}, :url => some_url do |p| %>
 *        <%= form.text_field :email,
 *                              :'data-validator-group' => 'groupName',
 *                              :'data-validator-required' => I18n.t(:error_required_email),
 *                              :'data-validator-email' => 'true',
 *                              :'data-validator-email-msg' => I18n.t(:error_wrong_email),
 *                              :'data-backend-validator-msg' => @u.errors[:email], %>
 *    <% end %>
 *
 */

define(["jquery", "jquery.validate"], function ($) {

    'use strict';

    return {

        /**
         * Private variables
         */
        _externalValidatorsCount: 0,
        _validExternalValidatorsCount: 0,

        /**
         * Private default submit form handler
         * @param form
         */
        _submitFormHandler: function (form) {
            form.submit();
        },

        /**
         * Private validation pass handler
         */
        _validationPassHandler: function() {
            compSupport.triggerCompEvent(this.formSelector, "validationPass", [this]);
            this.submitForm();
        },

        /**
         * Private validation fail handler
         */
        _validationFaillHandler: function() {
            compSupport.triggerCompEvent(this.formSelector, "validationFail", [this]);
        },

        /**
         * List of validators
         */
        validatorsList: ['required', 'email', 'phone', 'minlength', 'maxlength', 'max-digits-value', 'creditcard', 'selectcheck', 'phonenumber', 'expiration', 'equalTo', 'equal-to-text', 'date-format-usa', 'exact-match', 'todays-date-usa', 'digits', 'number', 'postal-code-payment-method-format', 'require-from-group'],
        backEndMsg: {},
        formSelector: "",
        validator: undefined,

        /**
         * Method that loop on each field of form and create configuration object.
         * This object will be passed as a parametr for validation component.
         * @param domId - Form Id that will be validate.
         * @returns object - contains rules and messages for validation component.
         */
        getConfiguration: function (domId) {
            var configuration = {
                rules: {},
                messages: {},
                groups: {}
            };
            var backEndConfiguration = {
                messages: {}
            };

            var that = this;
            $("#" + domId + ' :input').each(function () {
                var cfg = that.getFieldConfiguration(this),
                    backEndMsgCfg = that.getBackEndErrorMessages(this, backEndConfiguration),
                    fieldName = $(this).attr('name');

                if (cfg) {
                    configuration.rules[fieldName] = cfg.rules;
                    configuration.messages[fieldName] = cfg.messages;
                }

                if (backEndMsgCfg) {
                    that.backEndMsg = backEndMsgCfg;
                }
            });

            // Groups
            $("#" + domId + " *[data-validator-group]").each(function (){
                var group = $(this).attr("data-validator-group");
                var val = configuration.groups[group] || "";
                configuration.groups[group] = val + " " + $(this).attr("name");
            });
            return configuration;
        },

        /**
         * Method that get validator from validatorsList and create configuration object.
         * @param field - each field of form.
         * @returns object - if need to validate field. False - if no need to validate field.
         */
        getFieldConfiguration: function (field) {
            var configuration = false;
            $.each(this.validatorsList, function (i, validatorName) {

                var validationRule = $(field).attr('data-validator-' + validatorName),
                    validationMsg = $(field).attr('data-validator-' + validatorName + '-msg');

                // if validator message not presented as short definition
                // use validator rule value as a message and set rule value as true
                if (validationRule !== undefined && validationMsg == undefined) {
                    validationMsg = validationRule;
                    validationRule = true;
                }

                if (validationRule !== undefined && validationMsg !== undefined) {
                    if (configuration == false) {
                        configuration = {
                            rules: {},
                            messages: {}
                        };
                    }
                    if (validationRule == "true") {
                        validationRule = true;
                    }
                    configuration.rules[validatorName] = validationRule;
                    configuration.messages[validatorName] = validationMsg;
                }

            });
            return configuration;
        },

        /**
         * Method that search back-end validation error messages on each field.
         * @param field - each field of form.
         * @param configuration - empty object
         * @returns object - contains back-end validation errors if they are exists.
         */
        getBackEndErrorMessages: function (field, configuration) {

            var validationBackEndMsg = $(field).attr('data-backend-validator-msg'),
                fieldName = $(field).attr('name');

            if (validationBackEndMsg) {
                configuration.messages[fieldName] = validationBackEndMsg;
            }
            return configuration;
        },

        /**
         * Run validator on each form that need to be validated.
         * Show back-end validation messages if they are exists.
         * @param domId - Form Id
         * @param compConfig - Configuration from attribute data-jscomp-config
         */
        init: function (domId, compConfig) {

            var thisComp = this;
            this.domId = domId;
            this.disambigTrigger = true;
            this.formSelector = "#" + domId;

            var config = this.getConfiguration(domId);

            // Skip validation of hidden or not visible fields (default is true)
            if (compConfig.ignoreHiddenFields === false) {
                config.ignore = [];
            }

            // Submit valid form only when we dont have any external validators
            config.submitHandler = function (form) {
                if (thisComp._externalValidatorsCount == 0 && thisComp.disambigTrigger === true) {
                    thisComp._validationPassHandler();
                }
            };

            config.invalidHandler = function (event, validator) {
                thisComp._validationFaillHandler();
            };

            // Trigger validation start event on form submit
            $(this.formSelector).submit(function(event){
                compSupport.triggerCompEvent(thisComp.formSelector, "formSubmitValidationStart", [thisComp]);
            });

            // Initialize JQuery validation plugin
            this.validator = $(this.formSelector).validate(config);

            // Show backend validation messages
            if (this.backEndMsg.messages) {
                this.validator.showErrors(this.backEndMsg.messages);
            }


            setTimeout(function () {
                thisComp.checkIfPrefilledAreValid();
            }, 100);

        },

        checkIfPrefilledAreValid: function () {
            var thisComp = this;
            $(thisComp.formSelector).find('input[type="text"], input[type="email"], input[type="password"]').each(function () {
                if ($(this).val()){
                    thisComp.validator.element($(this));
                }
            });
        },

        /**
         * Submit form or call custom submit form handler without any validation
         */
        submitForm: function() {
            this._submitFormHandler(this.getForm());
        },

        /**
         * Change default submit form handler. Submit handler function will get HTML form object as first parameter.
         * @param submitFormHandlerFn
         */
        setSubmitFormHandler: function(submitFormHandlerFn) {
            this._submitFormHandler = submitFormHandlerFn;
        },

        /**
         * Returns form HTML object
         * @returns {HTMLElement} HTML Form object
         */
        getForm: function() {
            return document.getElementById(this.domId);
        },

        /**
         * Add additional async validator function.
         * Additional validator function will be called on form submit only if form is valid.
         *
         * Additional validator function will be called with two parameters: this component object and context(this);
         * If async validation passed  you need to call asyncValidatorPass() function only one time.
         * If async validation fail  you need to call asyncValidatorFail() function.
         * If you have errors you can show them using showError() function.
         *
         * @param validatorFunction
         */

        addAsyncValidator: function(validatorFunction, functionCallContext) {
            var thisValidatorComp = this;
            // reset valid counter
            if (thisValidatorComp._externalValidatorsCount == 0) {
                // add new async validator handler
                $(this.formSelector).submit(function() {
                    thisValidatorComp._validExternalValidatorsCount = 0;
                });
            }
            thisValidatorComp._externalValidatorsCount++;
            $(this.formSelector).submit(function(event) {
                event.preventDefault();
                validatorFunction.call(functionCallContext, thisValidatorComp);
            });
        },

        /**
         * External sync validation is completed and passed.
         * If all external validations was passed form will be submitted.
         * Please notice that this function should bee called only once for each external async validator.
         */
        asyncValidatorPass: function(){
            this._validExternalValidatorsCount ++;
            if (this._validExternalValidatorsCount == this._externalValidatorsCount && this.isValid()) {
                this._validationPassHandler();
            }
        },

        /**
         * External sync validation is fail.
         */
        asyncValidatorFail: function(){
            this._validExternalValidatorsCount = 0;
            this._validationFaillHandler();
        },

        /**
         * Show custom error message for specific filed
         * @param filedName
         * @param errorMessage
         */
        showError: function (filedName, errorMessage){
            var errorCfg = [];
            errorCfg[filedName] = errorMessage;
            this.validator.showErrors(errorCfg);
            this._validationFaillHandler();
        },

        /**
         * Resets the controlled form
         */
        clearErrors: function() {
            this.validator.resetForm();
            $(this.formSelector + " :input").removeClass('error valid');
        },

        /**
         * Validate the form and return boolean true if form is valid (not including external validators)
         * @returns {boolean} true if form is valid
         */
        isValid: function () {
            return $(this.formSelector).valid();
        }
    };
});
