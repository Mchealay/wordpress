<?php
/*
Plugin Name: Custom Form to DB
Description: Saves form submissions to custom database table
Version: 1.0
*/

// Create table on plugin activation
register_activation_hook(__FILE__, 'custom_form_create_table');

function custom_form_create_table() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'custom_form_submissions';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        name varchar(100) NOT NULL,
        email varchar(100) NOT NULL,
        message text NOT NULL,
        submission_date datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}








// Add shortcode for the form
add_shortcode('custom_data_form', 'custom_form_shortcode');

function custom_form_shortcode() {
    ob_start(); // Start output buffering
    ?>
    <div class="custom-form-container">
        <?php if (isset($_GET['success'])) : ?>
            <div class="success-message">Thank you for your submission!</div>
        <?php endif; ?>
        
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <input type="hidden" name="action" value="process_custom_form">
            
            <div class="form-group">
                <label for="name">Name:</label>
                <input type="text" name="name" id="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" name="email" id="email" required>
            </div>
            
            <div class="form-group">
                <label for="message">Message:</label>
                <textarea name="message" id="message" required></textarea>
            </div>
            
            <?php wp_nonce_field('custom_form_nonce', 'custom_form_nonce'); ?>
            <input type="submit" value="Submit">
        </form>
    </div>
    <?php
    return ob_get_clean(); // Return the buffered content
}





// Handle form submission
add_action('admin_post_nopriv_process_custom_form', 'handle_custom_form_submission');
add_action('admin_post_process_custom_form', 'handle_custom_form_submission');

function handle_custom_form_submission() {
    // Verify nonce
    if (!isset($_POST['custom_form_nonce']) || !wp_verify_nonce($_POST['custom_form_nonce'], 'custom_form_nonce')) {
        wp_die('Security check failed');
    }
    
    // Sanitize inputs
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $message = sanitize_textarea_field($_POST['message']);
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        wp_die('Please fill all required fields.');
    }
    
    // Insert into database
    global $wpdb;
    $table_name = $wpdb->prefix . 'custom_form_submissions';
    
    $inserted = $wpdb->insert(
        $table_name,
        array(
            'name' => $name,
            'email' => $email,
            'message' => $message,
            'submission_date' => current_time('mysql')
        ),
        array('%s', '%s', '%s', '%s')
    );
    
    // Redirect with success/failure
    if ($inserted) {
        wp_redirect(add_query_arg('success', '1', wp_get_referer()));
    } else {
        wp_redirect(add_query_arg('error', '1', wp_get_referer()));
    }
    exit;
}








.custom-form-container {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.success-message {
    color: green;
    margin-bottom: 15px;
    padding: 10px;
    background-color: #f0fff0;
    border: 1px solid green;
    border-radius: 4px;
}




echo do_shortcode('[custom_data_form]');