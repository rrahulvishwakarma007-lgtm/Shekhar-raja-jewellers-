<?php
/**
 * Footer Template
 * 
 * @package Shekhar_Raja_Jewellers
 */
?>

<!-- WhatsApp FAB -->
<a href="<?php echo esc_url(srj_whatsapp_link()); ?>" target="_blank" class="whatsapp-fab">
    <span class="fab-icon">MessageCircle</span>
    <span class="fab-badge">1</span>
</a>

<!-- Footer -->
<footer class="main-footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Brand Column -->
            <div class="footer-brand">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <img src="<?php echo esc_url(SRJ_THEME_URI . '/assets/images/logo.png'); ?>" alt="Shekhar Raja Jewellers" class="footer-logo">
                <?php endif; ?>
                <p class="footer-tagline">"<?php echo esc_html(get_theme_mod('srj_tagline', 'Crafting Elegance, Ensuring Excellence')); ?>"</p>
                <p class="footer-established">Est. <?php echo esc_html(get_theme_mod('srj_established', '1987')); ?> • Jabalpur, Madhya Pradesh</p>
                <div class="footer-social">
                    <a href="#" class="social-link">Instagram</a>
                    <a href="#" class="social-link">Facebook</a>
                    <a href="#" class="social-link">YouTube</a>
                </div>
            </div>
            
            <!-- Quick Links -->
            <div class="footer-links">
                <h4 class="footer-title">QUICK LINKS</h4>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'menu_class'     => 'footer-menu',
                    'fallback_cb'    => false,
                ));
                ?>
            </div>
            
            <!-- Other Links -->
            <div class="footer-links">
                <h4 class="footer-title">OTHER LINKS</h4>
                <ul class="footer-menu">
                    <li><a href="<?php echo esc_url(home_url('/about/')); ?>">About Us</a></li>
                    <li><a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a></li>
                    <li><a href="<?php echo esc_url(home_url('/app/')); ?>">Download App</a></li>
                </ul>
            </div>
            
            <!-- Contact Info -->
            <div class="footer-contact">
                <h4 class="footer-title">CONTACT US</h4>
                <div class="contact-item">
                    <span class="contact-icon">MapPin</span>
                    <p>Dixitpura Rd, Sarafa, Uprainganj,<br>Jabalpur, Madhya Pradesh 482002</p>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">Phone</span>
                    <a href="tel:<?php echo esc_attr(get_theme_mod('srj_whatsapp', '+918377911745')); ?>">
                        <?php echo esc_html(get_theme_mod('srj_whatsapp', '+91 83779 11745')); ?>
                    </a>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">MessageCircle</span>
                    <a href="<?php echo esc_url(srj_whatsapp_link()); ?>" target="_blank">WhatsApp Enquiry</a>
                </div>
                <div class="contact-item">
                    <span class="contact-icon">Clock</span>
                    <p>12:00 PM - 09:00 PM</p>
                </div>
            </div>
        </div>
        
        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> Shekhar Raja Jewellers. All rights reserved.</p>
            <p>BIS Hallmark Certified Jeweller</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
