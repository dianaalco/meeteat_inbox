$(document).ready(function(){

                // Validate
                // http://bassistance.de/jquery-plugins/jquery-plugin-validation/
                 //http://docs.jquery.com/Plugins/Validation/
                // http://docs.jquery.com/Plugins/Validation/validate#toptions
    jQuery(function($){
        $('#sign-up-form').validate({
            rules: {
                name: {
                    required: true
                },
                lastname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    minlength: 6,
                    required: true
                },                      
            },
            messages: {
                name: "Introduce tu nombre",
                lastname: "Introduce tu apellido",
                email: "Introduce tu email",
                password: {
                    required: "Introduce contraseña",
                    minlength: "Tu contraseña debe tener un mínimo de 6 caracteres"
                }                      
            },
            success: function(element) {
                element.text('Success').addClass('valid')
            }
        });
    });
});