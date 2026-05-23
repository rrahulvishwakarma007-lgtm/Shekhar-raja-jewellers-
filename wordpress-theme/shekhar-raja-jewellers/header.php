<?php
/**
 * Header Template
 * 
 * @package Shekhar_Raja_Jewellers
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Top Bar -->
<div class="top-bar">
    <div class="container">
        <div class="top-bar-content">
            <div class="top-bar-left">
                <span class="est-badge">Crown Icon EST. <?php echo esc_html(get_theme_mod('srj_established', '1987')); ?></span>
                <span class="separator">|</span>
                <span class="location">Jabalpur, MP</span>
            </div>
            <div class="top-bar-center">
                <span class="tagline">"<?php echo esc_html(get_theme_mod('srj_tagline', 'Crafting Elegance, Ensuring Excellence')); ?>"</span>
            </div>
            <div class="top-bar-right">
                <a href="tel:<?php echo esc_attr(get_theme_mod('srj_whatsapp', '+918377911745')); ?>" class="top-link">
                    <span class="icon">Phone</span>
                    <span><?php echo esc_html(get_theme_mod('srj_whatsapp', '+91 83779 11745')); ?></span>
                </a>
                <span class="separator">|</span>
                <a href="<?php echo esc_url(srj_whatsapp_link()); ?>" target="_blank" class="top-link whatsapp">
                    <span class="icon">MessageCircle</span>
                    <span>WhatsApp</span>
                </a>
            </div>
        </div>
    </div>
    <div class="gold-line"></div>
</div>

<!-- Main Header -->
<header class="main-header">
    <div class="header-gold-line"></div>
    <div class="container">
        <div class="header-content">
            <!-- Logo -->
            <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <img src="<?php echo esc_url(SRJ_THEME_URI . '/assets/images/logo.png'); ?>" alt="Shekhar Raja Jewellers" class="logo-img">
                <?php endif; ?>
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="desktop-nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'nav-menu',
                    'fallback_cb'    => 'srj_default_menu',
                ));
                ?>
            </nav>
            
            <!-- Header Actions -->
            <div class="header-actions">
                <a href="<?php echo esc_url(srj_whatsapp_link()); ?>" target="_blank" class="whatsapp-btn">
                    <span class="icon">MessageCircle</span>
                    <span>Enquire</span>
                </a>
                <button class="mobile-menu-toggle" aria-label="Toggle Menu">
                    <span class="hamburger"></span>
                </button>
            </div>
        </div>
    </div>
    <div class="header-bottom-line"></div>
</header>

<!-- Gold Ticker -->
<div class="gold-ticker">
    <div class="ticker-content">
        <div class="ticker-scroll">
            <span class="ticker-item">BIS HALLMARK</span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">TRUSTED SINCE <?php echo esc_html(get_theme_mod('srj_established', '1987')); ?></span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">22K GOLD</span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">DIAMOND JEWELLERY</span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">WHATSAPP ENQUIRY</span>
            <span class="ticker-separator">◆</span>
            <!-- Duplicate for seamless scroll -->
            <span class="ticker-item">BIS HALLMARK</span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">TRUSTED SINCE <?php echo esc_html(get_theme_mod('srj_established', '1987')); ?></span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">22K GOLD</span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">DIAMOND JEWELLERY</span>
            <span class="ticker-separator">◆</span>
            <span class="ticker-item">WHATSAPP ENQUIRY</span>
            <span class="ticker-separator">◆</span>
        </div>
    </div>
</div>

<!-- Mobile Menu -->
<div class="mobile-menu">
    <div class="mobile-menu-header">
        <?php if (has_custom_logo()) : ?>
            <?php the_custom_logo(); ?>
        <?php else : ?>
            <img src="<?php echo esc_url(SRJ_THEME_URI . '/assets/images/logo.png'); ?>" alt="Shekhar Raja Jewellers" class="logo-img">
        <?php endif; ?>
    </div>
    <nav class="mobile-nav">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'container'      => false,
            'menu_class'     => 'mobile-nav-menu',
            'fallback_cb'    => 'srj_default_menu',
        ));
        ?>
    </nav>
    <div class="mobile-menu-footer">
        <a href="<?php echo esc_url(srj_whatsapp_link()); ?>" target="_blank" class="whatsapp-btn-full">
            <span class="icon">MessageCircle</span>
            <span>Chat on WhatsApp</span>
        </a>
        <p class="established">Est. <?php echo esc_html(get_theme_mod('srj_established', '1987')); ?> • Jabalpur, Madhya Pradesh</p>
    </div>
</div>

<div class="mobile-menu-overlay"></div>

<?php
/**
 * Default Menu Fallback
 */
function srj_default_menu() {
    $pages = array(
        'Home' => home_url('/'),
        'Collections' => home_url('/products/'),
        'Bridal' => home_url('/product-category/bridal/'),
        'Gold Rates' => home_url('/gold-rates/'),
        'About' => home_url('/about/'),
        'Contact' => home_url('/contact/'),
    );
    
    echo '<ul class="nav-menu">';
    foreach ($pages as $title => $url) {
        echo '<li><a href="' . esc_url($url) . '">' . esc_html($title) . '</a></li>';
    }
    echo '</ul>';
}
?>
