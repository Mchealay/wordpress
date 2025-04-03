<?php
/*
Plugin Name: Data Insert Shortcode
Description: Creates a database table and provides a shortcode to insert data
Version: 1.0
Author: Your Name
*/

// Create the database table on plugin activation
register_activation_hook(__FILE__, 'create_data_table');

function create_data_table() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'custom_data';
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        column1 varchar(100) NOT NULL,
        column2 varchar(100) NOT NULL,
        date_added datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        PRIMARY KEY  (id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
    
    // Optional: Add version option to handle future updates
    add_option('custom_data_table_version', '1.0');
}

// Shortcode implementation
function insert_data_shortcode($atts) {
    // Shortcode attributes
    $atts = shortcode_atts(array(
        'param1' => '',
        'param2' => ''
    ), $atts);
    
    // Only proceed if form is submitted
    if (isset($_POST['submit_data'])) {
        global $wpdb;
        
        // Verify nonce for security
        if (!isset($_POST['_wpnonce']) || !wp_verify_nonce($_POST['_wpnonce'], 'insert_data_action')) {
            return '<div class="error">Security check failed.</div>';
        }
        
        $table_name = $wpdb->prefix . 'custom_data';
        
        // Sanitize input data
        $data = array(
            'column1' => sanitize_text_field($_POST['field1']),
            'column2' => sanitize_text_field($_POST['field2']),
            'date_added' => current_time('mysql')
        );
        
        // Insert data
        $result = $wpdb->insert($table_name, $data);
        
        // Display success/error message
        if ($result) {
            return '<div class="success">Data inserted successfully!</div>';
        } else {
            return '<div class="error">Error inserting data: ' . $wpdb->last_error . '</div>';
        }
    }
    
    // Display form
    ob_start(); ?>
    <form method="post" action="">
        <?php wp_nonce_field('insert_data_action'); ?>
        <p>
            <label for="field1">Field 1:</label>
            <input type="text" id="field1" name="field1" placeholder="Field 1" required>
        </p>
        <p>
            <label for="field2">Field 2:</label>
            <input type="text" id="field2" name="field2" placeholder="Field 2" required>
        </p>
        <p>
            <input type="submit" name="submit_data" value="Submit">
        </p>
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('insert_data', 'insert_data_shortcode');

// Optional: Add some basic CSS
function insert_data_styles() {
    echo '<style>
        .success { color: green; margin: 10px 0; padding: 10px; background: #e6ffe6; border: 1px solid green; }
        .error { color: red; margin: 10px 0; padding: 10px; background: #ffebeb; border: 1px solid red; }
        form p { margin-bottom: 15px; }
        label { display: inline-block; width: 80px; }
    </style>';
}
add_action('wp_head', 'insert_data_styles');