<?php
/**
 * Header Template
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
                <span class="font-cinzel"><?php echo get_theme_mod('srj_established', '1987'); ?></span>
                <span class="separator">|</span>
                <span>Jabalpur, Madhya Pradesh</span>
            </div>
            <div class="top-bar-right">
                <a href="tel:<?php echo get_theme_mod('srj_phone', '+91 83779 11745'); ?>">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <?php echo get_theme_mod('srj_phone', '+91 83779 11745'); ?>
                </a>
                <span class="separator">|</span>
                <a href="<?php echo srj_get_whatsapp_link(); ?>" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    WhatsApp
                </a>
            </div>
        </div>
    </div>
</div>

<!-- Main Header -->
<header class="main-header">
    <div class="container">
        <div class="header-content">
            <!-- Logo -->
            <div class="site-logo">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo home_url('/'); ?>">
                        <span class="logo-text font-cormorant">Shekhar Raja</span>
                        <span class="logo-subtitle font-cinzel">JEWELLERS</span>
                    </a>
                <?php endif; ?>
            </div>
            
            <!-- Navigation -->
            <nav class="main-nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'menu_class'     => 'nav-menu',
                    'container'      => false,
                    'walker'         => new SRJ_Nav_Walker(),
                ));
                ?>
            </nav>
            
            <!-- Header Actions -->
            <div class="header-actions">
                <a href="<?php echo srj_get_whatsapp_link(); ?>" target="_blank" class="btn btn-whatsapp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                    <span>Enquire</span>
                </a>
                
                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" aria-label="Toggle Menu">
                    <span class="hamburger"></span>
                </button>
            </div>
        </div>
    </div>
</header>

<!-- Mobile Navigation -->
<nav class="mobile-nav">
    <div class="mobile-nav-content">
        <?php
        wp_nav_menu(array(
            'theme_location' => 'primary',
            'menu_class'     => 'mobile-menu',
            'container'      => false,
        ));
        ?>
        <a href="<?php echo srj_get_whatsapp_link(); ?>" target="_blank" class="btn btn-whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            Chat on WhatsApp
        </a>
    </div>
</nav>

<!-- Gold Ticker -->
<div class="gold-ticker">
    <div class="ticker-content">
        <span>BIS HALLMARK</span>
        <span class="separator">◆</span>
        <span>TRUSTED SINCE <?php echo get_theme_mod('srj_established', '1987'); ?></span>
        <span class="separator">◆</span>
        <span>22K GOLD</span>
        <span class="separator">◆</span>
        <span>DIAMOND JEWELLERY</span>
        <span class="separator">◆</span>
        <span>WHATSAPP ENQUIRY</span>
        <span class="separator">◆</span>
        <span>BIS HALLMARK</span>
        <span class="separator">◆</span>
        <span>TRUSTED SINCE <?php echo get_theme_mod('srj_established', '1987'); ?></span>
        <span class="separator">◆</span>
        <span>22K GOLD</span>
        <span class="separator">◆</span>
        <span>DIAMOND JEWELLERY</span>
        <span class="separator">◆</span>
        <span>WHATSAPP ENQUIRY</span>
    </div>
</div>
