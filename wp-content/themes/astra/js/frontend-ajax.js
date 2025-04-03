jQuery(document).ready(function($) {
    $('#submit-form').on('click', function(e) {
        e.preventDefault();
        
        // Show loading indicator
        $('#submit-form').prop('disabled', true).text('Processing...');
        
        // Collect form data
        var formData = {
            action: 'my_frontend_insert',
            security: frontend_ajax.nonce,
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };
        
        // Make AJAX request
        $.ajax({
            url: frontend_ajax.ajaxurl,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    // Clear form on success
                    $('#your-form')[0].reset();
                    
                    // Show success message
                    $('#form-response').html(
                        '<div class="alert alert-success">' + 
                        response.data.message + ' ID: ' + response.data.insert_id + 
                        '</div>'
                    );
                } else {
                    // Show error message
                    $('#form-response').html(
                        '<div class="alert alert-danger">' + 
                        response.data + 
                        '</div>'
                    );
                }
            },
            error: function(xhr, status, error) {
                $('#form-response').html(
                    '<div class="alert alert-danger">Request failed: ' + 
                    error + 
                    '</div>'
                );
            },
            complete: function() {
                // Reset button state
                $('#submit-form').prop('disabled', false).text('Submit');
                
                // Hide message after 5 seconds
                setTimeout(function() {
                    $('#form-response').empty();
                }, 5000);
            }
        });
    });
});