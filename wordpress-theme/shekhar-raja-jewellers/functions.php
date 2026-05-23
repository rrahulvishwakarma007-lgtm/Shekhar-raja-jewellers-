<?php
/**
 * Shekhar Raja Jewellers Theme Functions
 * 
 * @package Shekhar_Raja_Jewellers
 * @version 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

// Theme Constants
define('SRJ_THEME_VERSION', '1.0.0');
define('SRJ_THEME_DIR', get_template_directory());
define('SRJ_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
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
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'shekhar-raja-jewellers'),
        'footer'  => __('Footer Menu', 'shekhar-raja-jewellers'),
    ));
    
    // Load text domain
    load_theme_textdomain('shekhar-raja-jewellers', SRJ_THEME_DIR . '/languages');
}
add_action('after_setup_theme', 'srj_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function srj_enqueue_assets() {
    // Google Fonts
    wp_enqueue_style(
        'srj-google-fonts',
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Raleway:wght@300;400;500;600;700&display=swap',
        array(),
        null
    );
    
    // Main Stylesheet
    wp_enqueue_style(
        'srj-style',
        get_stylesheet_uri(),
        array(),
        SRJ_THEME_VERSION
    );
    
    // Custom CSS
    wp_enqueue_style(
        'srj-custom',
        SRJ_THEME_URI . '/assets/css/custom.css',
        array('srj-style'),
        SRJ_THEME_VERSION
    );
    
    // Main JavaScript
    wp_enqueue_script(
        'srj-main',
        SRJ_THEME_URI . '/assets/js/main.js',
        array('jquery'),
        SRJ_THEME_VERSION,
        true
    );
    
    // Localize script
    wp_localize_script('srj-main', 'srjData', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('srj_nonce'),
        'whatsapp' => '+918377911745',
    ));
}
add_action('wp_enqueue_scripts', 'srj_enqueue_assets');

/**
 * Register Custom Post Type: Products
 */
function srj_register_products_cpt() {
    $labels = array(
        'name'               => _x('Products', 'post type general name', 'shekhar-raja-jewellers'),
        'singular_name'      => _x('Product', 'post type singular name', 'shekhar-raja-jewellers'),
        'menu_name'          => _x('Products', 'admin menu', 'shekhar-raja-jewellers'),
        'add_new'            => _x('Add New', 'product', 'shekhar-raja-jewellers'),
        'add_new_item'       => __('Add New Product', 'shekhar-raja-jewellers'),
        'edit_item'          => __('Edit Product', 'shekhar-raja-jewellers'),
        'new_item'           => __('New Product', 'shekhar-raja-jewellers'),
        'view_item'          => __('View Product', 'shekhar-raja-jewellers'),
        'search_items'       => __('Search Products', 'shekhar-raja-jewellers'),
        'not_found'          => __('No products found', 'shekhar-raja-jewellers'),
        'not_found_in_trash' => __('No products found in Trash', 'shekhar-raja-jewellers'),
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
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
        'show_in_rest'       => true,
    );
    
    register_post_type('products', $args);
}
add_action('init', 'srj_register_products_cpt');

/**
 * Register Custom Taxonomy: Product Category
 */
function srj_register_product_taxonomy() {
    $labels = array(
        'name'              => _x('Categories', 'taxonomy general name', 'shekhar-raja-jewellers'),
        'singular_name'     => _x('Category', 'taxonomy singular name', 'shekhar-raja-jewellers'),
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
add_action('init', 'srj_register_product_taxonomy');

/**
 * Register Widget Areas
 */
function srj_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget 1', 'shekhar-raja-jewellers'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area 1', 'shekhar-raja-jewellers'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
    
    register_sidebar(array(
        'name'          => __('Footer Widget 2', 'shekhar-raja-jewellers'),
        'id'            => 'footer-2',
        'description'   => __('Footer widget area 2', 'shekhar-raja-jewellers'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'srj_widgets_init');

/**
 * Theme Customizer
 */
function srj_customize_register($wp_customize) {
    // Company Info Section
    $wp_customize->add_section('srj_company_info', array(
        'title'    => __('Company Information', 'shekhar-raja-jewellers'),
        'priority' => 30,
    ));
    
    // WhatsApp Number
    $wp_customize->add_setting('srj_whatsapp', array(
        'default'           => '+918377911745',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('srj_whatsapp', array(
        'label'   => __('WhatsApp Number', 'shekhar-raja-jewellers'),
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
    
    // Gold Rates Section
    $wp_customize->add_section('srj_gold_rates', array(
        'title'    => __('Gold Rates', 'shekhar-raja-jewellers'),
        'priority' => 35,
    ));
    
    // 24K Rate
    $wp_customize->add_setting('srj_rate_24k', array(
        'default'           => '6800',
        'sanitize_callback' => 'absint',
    ));
    $wp_customize->add_control('srj_rate_24k', array(
        'label'   => __('24K Gold Rate (per gram)', 'shekhar-raja-jewellers'),
        'section' => 'srj_gold_rates',
        'type'    => 'number',
    ));
}
add_action('customize_register', 'srj_customize_register');

/**
 * Helper: Get WhatsApp Link
 */
function srj_whatsapp_link($message = '') {
    $number = get_theme_mod('srj_whatsapp', '+918377911745');
    $number = preg_replace('/[^0-9]/', '', $number);
    $url = 'https://wa.me/' . $number;
    if ($message) {
        $url .= '?text=' . urlencode($message);
    }
    return $url;
}

/**
 * Helper: Calculate Gold Rate by Purity
 */
function srj_calculate_gold_rate($purity) {
    $rate_24k = get_theme_mod('srj_rate_24k', 6800);
    $ratios = array(
        '24K' => 1.0,
        '22K' => 0.916,
        '20K' => 0.833,
        '18K' => 0.75,
        '14K' => 0.583,
    );
    
    if (isset($ratios[$purity])) {
        return round($rate_24k * $ratios[$purity]);
    }
    return 0;
}

/**
 * AJAX: Update Gold Rate
 */
function srj_update_gold_rate() {
    check_ajax_referer('srj_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized');
    }
    
    $rate = isset($_POST['rate']) ? absint($_POST['rate']) : 0;
    
    if ($rate > 0) {
        set_theme_mod('srj_rate_24k', $rate);
        wp_send_json_success(array('rate' => $rate));
    }
    
    wp_send_json_error('Invalid rate');
}
add_action('wp_ajax_srj_update_gold_rate', 'srj_update_gold_rate');

/**
 * Add Theme Meta Tags
 */
function srj_meta_tags() {
    ?>
    <meta name="description" content="Shekhar Raja Jewellers - Est. 1987 Jabalpur. BIS Hallmark 22K gold, diamond & bridal jewellery." />
    <meta name="theme-color" content="#b8862a" />
    <meta property="og:title" content="Shekhar Raja Jewellers | 22K Gold & Diamond Jewellery | Jabalpur" />
    <meta property="og:description" content="Est. 1987 Jabalpur. BIS Hallmark 22K gold, diamond & bridal jewellery." />
    <meta property="og:type" content="website" />
    <?php
}
add_action('wp_head', 'srj_meta_tags');
