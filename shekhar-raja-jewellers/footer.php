<?php
/**
 * Footer Template
 */
?>

<!-- WhatsApp FAB -->
<a href="<?php echo srj_get_whatsapp_link(); ?>" target="_blank" class="whatsapp-fab" aria-label="Chat on WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
</a>

<!-- Footer -->
<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Brand -->
            <div class="footer-brand">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <div class="footer-logo">
                        <span class="font-cormorant">Shekhar Raja</span>
                        <span class="font-cinzel">JEWELLERS</span>
                    </div>
                <?php endif; ?>
                <p class="footer-tagline font-cormorant italic">"<?php echo get_theme_mod('srj_tagline', 'Crafting Elegance, Ensuring Excellence'); ?>"</p>
                <p class="footer-info">Est. <?php echo get_theme_mod('srj_established', '1987'); ?> • Jabalpur, Madhya Pradesh</p>
                
                <!-- Social Links -->
                <div class="social-links">
                    <?php if (get_theme_mod('srj_instagram')) : ?>
                    <a href="<?php echo get_theme_mod('srj_instagram'); ?>" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                    <?php endif; ?>
                    <?php if (get_theme_mod('srj_facebook')) : ?>
                    <a href="<?php echo get_theme_mod('srj_facebook'); ?>" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <?php endif; ?>
                    <?php if (get_theme_mod('srj_youtube')) : ?>
                    <a href="<?php echo get_theme_mod('srj_youtube'); ?>" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                    </a>
                    <?php endif; ?>
                </div>
            </div>
            
            <!-- Quick Links -->
            <div class="footer-links">
                <h4 class="font-cinzel">QUICK LINKS</h4>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'menu_class'     => 'footer-menu',
                    'container'      => false,
                    'depth'          => 1,
                ));
                ?>
            </div>
            
            <!-- Other Links -->
            <div class="footer-links">
                <h4 class="font-cinzel">OTHER LINKS</h4>
                <ul class="footer-menu">
                    <li><a href="<?php echo get_permalink(get_page_by_path('about')); ?>">About Us</a></li>
                    <li><a href="<?php echo get_permalink(get_page_by_path('contact')); ?>">Contact</a></li>
                    <li><a href="<?php echo get_permalink(get_page_by_path('app')); ?>">Download App</a></li>
                </ul>
            </div>
            
            <!-- Contact -->
            <div class="footer-contact">
                <h4 class="font-cinzel">CONTACT US</h4>
                <ul class="contact-list">
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span><?php echo get_theme_mod('srj_address', 'Dixitpura Rd, Sarafa, Uprainganj, Jabalpur, Madhya Pradesh 482002'); ?></span>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <a href="tel:<?php echo get_theme_mod('srj_phone', '+91 83779 11745'); ?>"><?php echo get_theme_mod('srj_phone', '+91 83779 11745'); ?></a>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        <a href="<?php echo srj_get_whatsapp_link(); ?>" target="_blank">WhatsApp Enquiry</a>
                    </li>
                    <li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        <span>Mon-Sat: 12:00 PM - 09:00 PM</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <p>© <?php echo date('Y'); ?> Shekhar Raja Jewellers. All rights reserved.</p>
            <p>BIS Hallmark Certified Jeweller</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
