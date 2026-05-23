<?php
/**
 * Shekhar Raja Jewellers Theme Functions
 */

// Theme Setup
function srj_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'shekhar-raja-jewellers'),
        'footer'  => __('Footer Menu', 'shekhar-raja-jewellers'),
    ));
}
add_action('after_setup_theme', 'srj_theme_setup');

// Enqueue Styles and Scripts
function srj_enqueue_assets() {
    // Google Fonts
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Raleway:wght@300;400;500;600;700&display=swap', array(), null);
    
    // Main Stylesheet
    wp_enqueue_style('srj-style', get_stylesheet_uri(), array(), '1.0.0');
    
    // Custom CSS
    wp_enqueue_style('srj-custom', get_template_directory_uri() . '/assets/css/custom.css', array(), '1.0.0');
    
    // jQuery
    wp_enqueue_script('jquery');
    
    // Custom Scripts
    wp_enqueue_script('srj-main', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), '1.0.0', true);
    
    // Localize script
    wp_localize_script('srj-main', 'srj_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('srj_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'srj_enqueue_assets');

// Custom Post Type: Products
function srj_register_products_cpt() {
    $labels = array(
        'name'               => __('Products', 'shekhar-raja-jewellers'),
        'singular_name'      => __('Product', 'shekhar-raja-jewellers'),
        'menu_name'          => __('Products', 'shekhar-raja-jewellers'),
        'add_new'            => __('Add New', 'shekhar-raja-jewellers'),
        'add_new_item'       => __('Add New Product', 'shekhar-raja-jewellers'),
        'edit_item'          => __('Edit Product', 'shekhar-raja-jewellers'),
        'new_item'           => __('New Product', 'shekhar-raja-jewellers'),
        'view_item'          => __('View Product', 'shekhar-raja-jewellers'),
        'search_items'       => __('Search Products', 'shekhar-raja-jewellers'),
        'not_found'          => __('No products found', 'shekhar-raja-jewellers'),
        'not_found_in_trash' => __('No products found in trash', 'shekhar-raja-jewellers'),
    );
    
    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'products'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-products',
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest'       => true,
    );
    
    register_post_type('products', $args);
}
add_action('init', 'srj_register_products_cpt');

// Custom Taxonomy: Product Category
function srj_register_product_category() {
    $labels = array(
        'name'              => __('Categories', 'shekhar-raja-jewellers'),
        'singular_name'     => __('Category', 'shekhar-raja-jewellers'),
        'search_items'      => __('Search Categories', 'shekhar-raja-jewellers'),
        'all_items'         => __('All Categories', 'shekhar-raja-jewellers'),
        'edit_item'         => __('Edit Category', 'shekhar-raja-jewellers'),
        'update_item'       => __('Update Category', 'shekhar-raja-jewellers'),
        'add_new_item'      => __('Add New Category', 'shekhar-raja-jewellers'),
        'new_item_name'     => __('New Category Name', 'shekhar-raja-jewellers'),
        'menu_name'         => __('Categories', 'shekhar-raja-jewellers'),
    );
    
    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'product-category'),
        'show_in_rest'      => true,
    );
    
    register_taxonomy('product_category', array('products'), $args);
}
add_action('init', 'srj_register_product_category');

// Custom Post Type: Gold Rates
function srj_register_gold_rates_cpt() {
    $labels = array(
        'name'          => __('Gold Rates', 'shekhar-raja-jewellers'),
        'singular_name' => __('Gold Rate', 'shekhar-raja-jewellers'),
        'menu_name'     => __('Gold Rates', 'shekhar-raja-jewellers'),
    );
    
    $args = array(
        'labels'             => $labels,
        'public'             => false,
        'publicly_queryable' => false,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => false,
        'capability_type'    => 'post',
        'has_archive'        => false,
        'hierarchical'       => false,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-chart-line',
        'supports'           => array('title'),
    );
    
    register_post_type('gold_rates', $args);
}
add_action('init', 'srj_register_gold_rates_cpt');

// Add Meta Boxes for Gold Rates
function srj_gold_rates_metabox() {
    add_meta_box(
        'srj_gold_rate_details',
        __('Gold Rate Details', 'shekhar-raja-jewellers'),
        'srj_gold_rate_metabox_callback',
        'gold_rates',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'srj_gold_rates_metabox');

function srj_gold_rate_metabox_callback($post) {
    wp_nonce_field('srj_gold_rate_nonce', 'srj_gold_rate_nonce');
    
    $rate_24k = get_post_meta($post->ID, '_rate_24k', true);
    $rate_date = get_post_meta($post->ID, '_rate_date', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="rate_24k"><?php _e('24K Rate (per gram)', 'shekhar-raja-jewellers'); ?></label></th>
            <td>
                <input type="number" id="rate_24k" name="rate_24k" value="<?php echo esc_attr($rate_24k); ?>" class="regular-text">
                <p class="description">Enter the 24K gold rate in INR. Other rates will be auto-calculated.</p>
            </td>
        </tr>
        <tr>
            <th><label for="rate_date"><?php _e('Date', 'shekhar-raja-jewellers'); ?></label></th>
            <td>
                <input type="date" id="rate_date" name="rate_date" value="<?php echo esc_attr($rate_date); ?>" class="regular-text">
            </td>
        </tr>
    </table>
    <?php
}

function srj_save_gold_rate_meta($post_id) {
    if (!isset($_POST['srj_gold_rate_nonce']) || !wp_verify_nonce($_POST['srj_gold_rate_nonce'], 'srj_gold_rate_nonce')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['rate_24k'])) {
        update_post_meta($post_id, '_rate_24k', sanitize_text_field($_POST['rate_24k']));
    }
    
    if (isset($_POST['rate_date'])) {
        update_post_meta($post_id, '_rate_date', sanitize_text_field($_POST['rate_date']));
    }
}
add_action('save_post_gold_rates', 'srj_save_gold_rate_meta');

// Add Meta Boxes for Products
function srj_products_metabox() {
    add_meta_box(
        'srj_product_details',
        __('Product Details', 'shekhar-raja-jewellers'),
        'srj_product_metabox_callback',
        'products',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'srj_products_metabox');

function srj_product_metabox_callback($post) {
    wp_nonce_field('srj_product_nonce', 'srj_product_nonce');
    
    $product_tag = get_post_meta($post->ID, '_product_tag', true);
    $product_featured = get_post_meta($post->ID, '_product_featured', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="product_tag"><?php _e('Product Tag', 'shekhar-raja-jewellers'); ?></label></th>
            <td>
                <select id="product_tag" name="product_tag">
                    <option value="" <?php selected($product_tag, ''); ?>>Select Tag</option>
                    <option value="Bestseller" <?php selected($product_tag, 'Bestseller'); ?>>Bestseller</option>
                    <option value="Premium" <?php selected($product_tag, 'Premium'); ?>>Premium</option>
                    <option value="Heritage" <?php selected($product_tag, 'Heritage'); ?>>Heritage</option>
                    <option value="Classic" <?php selected($product_tag, 'Classic'); ?>>Classic</option>
                    <option value="Exclusive" <?php selected($product_tag, 'Exclusive'); ?>>Exclusive</option>
                    <option value="Traditional" <?php selected($product_tag, 'Traditional'); ?>>Traditional</option>
                    <option value="Limited" <?php selected($product_tag, 'Limited'); ?>>Limited</option>
                    <option value="Trending" <?php selected($product_tag, 'Trending'); ?>>Trending</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="product_featured"><?php _e('Featured Product', 'shekhar-raja-jewellers'); ?></label></th>
            <td>
                <input type="checkbox" id="product_featured" name="product_featured" value="1" <?php checked($product_featured, '1'); ?>>
                <span>Mark as featured product</span>
            </td>
        </tr>
    </table>
    <?php
}

function srj_save_product_meta($post_id) {
    if (!isset($_POST['srj_product_nonce']) || !wp_verify_nonce($_POST['srj_product_nonce'], 'srj_product_nonce')) {
        return;
    }
    
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    if (isset($_POST['product_tag'])) {
        update_post_meta($post_id, '_product_tag', sanitize_text_field($_POST['product_tag']));
    }
    
    $featured = isset($_POST['product_featured']) ? '1' : '';
    update_post_meta($post_id, '_product_featured', $featured);
}
add_action('save_post_products', 'srj_save_product_meta');

// Theme Customizer
function srj_customize_register($wp_customize) {
    // Company Info Section
    $wp_customize->add_section('srj_company_info', array(
        'title'    => __('Company Information', 'shekhar-raja-jewellers'),
        'priority' => 30,
    ));
    
    // Phone Number
    $wp_customize->add_setting('srj_phone', array(
        'default'           => '+91 83779 11745',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('srj_phone', array(
        'label'   => __('Phone Number', 'shekhar-raja-jewellers'),
        'section' => 'srj_company_info',
        'type'    => 'text',
    ));
    
    // WhatsApp Number
    $wp_customize->add_setting('srj_whatsapp', array(
        'default'           => '918377911745',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('srj_whatsapp', array(
        'label'       => __('WhatsApp Number', 'shekhar-raja-jewellers'),
        'description' => __('Without + sign, e.g., 918377911745', 'shekhar-raja-jewellers'),
        'section'     => 'srj_company_info',
        'type'        => 'text',
    ));
    
    // Address
    $wp_customize->add_setting('srj_address', array(
        'default'           => 'Dixitpura Rd, Sarafa, Uprainganj, Jabalpur, Madhya Pradesh 482002',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('srj_address', array(
        'label'   => __('Address', 'shekhar-raja-jewellers'),
        'section' => 'srj_company_info',
        'type'    => 'textarea',
    ));
    
    // Tagline
    $wp_customize->add_setting('srj_tagline', array(
        'default'           => 'Crafting Elegance, Ensuring Excellence',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('srj_tagline', array(
        'label'   => __('Tagline', 'shekhar-raja-jewellers'),
        'section' => 'srj_company_info',
        'type'    => 'text',
    ));
    
    // Established Year
    $wp_customize->add_setting('srj_established', array(
        'default'           => '1987',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('srj_established', array(
        'label'   => __('Established Year', 'shekhar-raja-jewellers'),
        'section' => 'srj_company_info',
        'type'    => 'text',
    ));
    
    // Social Media Section
    $wp_customize->add_section('srj_social', array(
        'title'    => __('Social Media Links', 'shekhar-raja-jewellers'),
        'priority' => 35,
    ));
    
    // Instagram
    $wp_customize->add_setting('srj_instagram', array(
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('srj_instagram', array(
        'label'   => __('Instagram URL', 'shekhar-raja-jewellers'),
        'section' => 'srj_social',
        'type'    => 'url',
    ));
    
    // Facebook
    $wp_customize->add_setting('srj_facebook', array(
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('srj_facebook', array(
        'label'   => __('Facebook URL', 'shekhar-raja-jewellers'),
        'section' => 'srj_social',
        'type'    => 'url',
    ));
    
    // YouTube
    $wp_customize->add_setting('srj_youtube', array(
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control('srj_youtube', array(
        'label'   => __('YouTube URL', 'shekhar-raja-jewellers'),
        'section' => 'srj_social',
        'type'    => 'url',
    ));
}
add_action('customize_register', 'srj_customize_register');

// Helper Functions
function srj_get_whatsapp_link($message = '') {
    $whatsapp = get_theme_mod('srj_whatsapp', '918377911745');
    $url = 'https://wa.me/' . $whatsapp;
    if ($message) {
        $url .= '?text=' . urlencode($message);
    }
    return $url;
}

function srj_get_gold_rates() {
    $latest_rate = get_posts(array(
        'post_type'      => 'gold_rates',
        'posts_per_page' => 1,
        'orderby'        => 'meta_value',
        'meta_key'       => '_rate_date',
        'order'          => 'DESC',
    ));
    
    if (empty($latest_rate)) {
        return null;
    }
    
    $rate_24k = get_post_meta($latest_rate[0]->ID, '_rate_24k', true);
    
    return array(
        '24k' => $rate_24k,
        '22k' => round($rate_24k * 0.916),
        '20k' => round($rate_24k * 0.833),
        '18k' => round($rate_24k * 0.75),
        '14k' => round($rate_24k * 0.583),
    );
}

// AJAX Handler for WhatsApp Enquiry
function srj_whatsapp_enquiry() {
    check_ajax_referer('srj_nonce', 'nonce');
    
    $name = sanitize_text_field($_POST['name']);
    $phone = sanitize_text_field($_POST['phone']);
    $interest = sanitize_text_field($_POST['interest']);
    $message = sanitize_textarea_field($_POST['message']);
    
    $whatsapp_message = "Hello! I'm {$name}.\n\nInterest: {$interest}\nPhone: {$phone}\n\nMessage: {$message}";
    
    $whatsapp_link = srj_get_whatsapp_link($whatsapp_message);
    
    wp_send_json_success(array('link' => $whatsapp_link));
}
add_action('wp_ajax_srj_whatsapp_enquiry', 'srj_whatsapp_enquiry');
add_action('wp_ajax_nopriv_srj_whatsapp_enquiry', 'srj_whatsapp_enquiry');

// Widget Areas
function srj_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget Area', 'shekhar-raja-jewellers'),
        'id'            => 'footer-widgets',
        'description'   => __('Add widgets for the footer area', 'shekhar-raja-jewellers'),
        'before_widget' => '<div class="footer-widget">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'srj_widgets_init');

// Custom Walker for Navigation
class SRJ_Nav_Walker extends Walker_Nav_Menu {
    function start_el(&$output, $item, $depth = 0, $args = null, $id = 0) {
        $classes = empty($item->classes) ? array() : (array) $item->classes;
        $classes[] = 'menu-item-' . $item->ID;
        
        $class_names = join(' ', apply_filters('nav_menu_css_class', array_filter($classes), $item, $args));
        $class_names = $class_names ? ' class="' . esc_attr($class_names) . '"' : '';
        
        $output .= '<li' . $class_names . '>';
        
        $attributes  = !empty($item->attr_title) ? ' title="' . esc_attr($item->attr_title) . '"' : '';
        $attributes .= !empty($item->target) ? ' target="' . esc_attr($item->target) . '"' : '';
        $attributes .= !empty($item->xfn) ? ' rel="' . esc_attr($item->xfn) . '"' : '';
        $attributes .= !empty($item->url) ? ' href="' . esc_attr($item->url) . '"' : '';
        
        $item_output = $args->before;
        $item_output .= '<a' . $attributes . ' class="nav-link">';
        $item_output .= $args->link_before . apply_filters('the_title', $item->title, $item->ID) . $args->link_after;
        $item_output .= '</a>';
        $item_output .= $args->after;
        
        $output .= apply_filters('walker_nav_menu_start_el', $item_output, $item, $depth, $args);
    }
}

// Shortcode: WhatsApp Button
function srj_whatsapp_button_shortcode($atts) {
    $atts = shortcode_atts(array(
        'text'    => 'Enquire Now',
        'message' => 'Hello! I would like to enquire about your products.',
        'class'   => 'btn btn-whatsapp',
    ), $atts);
    
    $link = srj_get_whatsapp_link($atts['message']);
    
    return '<a href="' . esc_url($link) . '" target="_blank" rel="noopener" class="' . esc_attr($atts['class']) . '">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        ' . esc_html($atts['text']) . '
    </a>';
}
add_shortcode('whatsapp_button', 'srj_whatsapp_button_shortcode');

// Shortcode: Gold Rates
function srj_gold_rates_shortcode() {
    $rates = srj_get_gold_rates();
    
    if (!$rates) {
        return '<p>Gold rates not available.</p>';
    }
    
    ob_start();
    ?>
    <div class="gold-rates-grid">
        <div class="gold-rate-card featured">
            <span class="rate-label">24K</span>
            <span class="rate-value">₹<?php echo number_format($rates['24k']); ?></span>
            <span class="rate-unit">per gram</span>
        </div>
        <div class="gold-rate-card">
            <span class="rate-label">22K</span>
            <span class="rate-value">₹<?php echo number_format($rates['22k']); ?></span>
            <span class="rate-unit">per gram</span>
        </div>
        <div class="gold-rate-card">
            <span class="rate-label">20K</span>
            <span class="rate-value">₹<?php echo number_format($rates['20k']); ?></span>
            <span class="rate-unit">per gram</span>
        </div>
        <div class="gold-rate-card">
            <span class="rate-label">18K</span>
            <span class="rate-value">₹<?php echo number_format($rates['18k']); ?></span>
            <span class="rate-unit">per gram</span>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('gold_rates', 'srj_gold_rates_shortcode');

// Disable Gutenberg for custom post types
function srj_disable_gutenberg($use_block_editor, $post_type) {
    if (in_array($post_type, array('gold_rates'))) {
        return false;
    }
    return $use_block_editor;
}
add_filter('use_block_editor_for_post_type', 'srj_disable_gutenberg', 10, 2);
