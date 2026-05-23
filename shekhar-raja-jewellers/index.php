<?php
/**
 * Main Template File
 */
get_header();
?>

<!-- Hero Slider Section -->
<section class="hero-slider">
    <div class="hero-slides">
        <?php
        $slides = array(
            array(
                'image'   => 'https://images.pexels.com/photos/2697598/pexels-photo-2697598.jpeg?auto=compress&cs=tinysrgb&w=1920',
                'eyebrow' => 'Exquisite Collection',
                'title'   => 'Diamond Rings',
                'tagline' => 'Where brilliance meets eternity',
            ),
            array(
                'image'   => 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=1920',
                'eyebrow' => 'Bridal Heritage',
                'title'   => 'Bridal Necklaces',
                'tagline' => 'For your most precious moments',
            ),
            array(
                'image'   => 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=1920',
                'eyebrow' => 'Timeless Beauty',
                'title'   => 'Gold Earrings',
                'tagline' => 'Elegance in every detail',
            ),
            array(
                'image'   => 'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg?auto=compress&cs=tinysrgb&w=1920',
                'eyebrow' => 'Traditional Art',
                'title'   => 'Gold Bangles',
                'tagline' => 'Heritage reimagined',
            ),
        );
        
        foreach ($slides as $index => $slide) : ?>
        <div class="hero-slide <?php echo $index === 0 ? 'active' : ''; ?>" style="background-image: url('<?php echo $slide['image']; ?>');">
            <div class="hero-overlay"></div>
            <div class="hero-content container">
                <span class="hero-eyebrow"><?php echo $slide['eyebrow']; ?></span>
                <h1 class="hero-title font-cormorant"><?php echo $slide['title']; ?></h1>
                <p class="hero-tagline font-cormorant italic">"<?php echo $slide['tagline']; ?>"</p>
                <div class="hero-buttons">
                    <a href="<?php echo get_post_type_archive_link('products'); ?>" class="btn btn-primary">
                        Explore Collection
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                    <a href="<?php echo srj_get_whatsapp_link('Hello! I would like to enquire about your products.'); ?>" target="_blank" class="btn btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        Enquire Now
                    </a>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
    
    <!-- Slider Navigation -->
    <div class="hero-nav">
        <button class="hero-prev" aria-label="Previous slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button class="hero-next" aria-label="Next slide">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
    </div>
    
    <!-- Slider Dots -->
    <div class="hero-dots">
        <?php foreach ($slides as $index => $slide) : ?>
        <button class="hero-dot <?php echo $index === 0 ? 'active' : ''; ?>" data-index="<?php echo $index; ?>"></button>
        <?php endforeach; ?>
    </div>
</section>

<!-- Categories Section -->
<section class="categories-section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">EXPLORE</span>
            <h2 class="section-title font-cormorant">Shop by Category</h2>
        </div>
        
        <div class="categories-grid">
            <?php
            $categories = get_terms(array(
                'taxonomy'   => 'product_category',
                'hide_empty' => false,
            ));
            
            if ($categories && !is_wp_error($categories)) :
                foreach ($categories as $category) :
                    $image = get_term_meta($category->term_id, 'category_image', true);
            ?>
            <a href="<?php echo get_term_link($category); ?>" class="category-item">
                <div class="category-image">
                    <img src="<?php echo $image ? $image : 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=400'; ?>" alt="<?php echo $category->name; ?>">
                </div>
                <span class="category-name font-cinzel"><?php echo $category->name; ?></span>
            </a>
            <?php
                endforeach;
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Featured Products Section -->
<section class="featured-section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">FEATURED</span>
            <h2 class="section-title font-cormorant">Featured Collections</h2>
        </div>
        
        <div class="featured-grid">
            <?php
            $featured_products = get_posts(array(
                'post_type'      => 'products',
                'posts_per_page' => 4,
                'meta_key'       => '_product_featured',
                'meta_value'     => '1',
            ));
            
            if ($featured_products) :
                foreach ($featured_products as $index => $product) :
                    $image = get_the_post_thumbnail_url($product->ID, 'large');
                    $tag = get_post_meta($product->ID, '_product_tag', true);
                    $terms = get_the_terms($product->ID, 'product_category');
                    $category = $terms ? $terms[0]->name : '';
            ?>
            <div class="featured-card <?php echo $index === 0 ? 'featured-large' : ''; ?>">
                <div class="featured-image">
                    <img src="<?php echo $image ? $image : 'https://images.pexels.com/photos/1413420/pexels-photo-1413420.jpeg?auto=compress&cs=tinysrgb&w=800'; ?>" alt="<?php echo $product->post_title; ?>">
                    <?php if ($tag) : ?>
                    <span class="product-tag"><?php echo $tag; ?></span>
                    <?php endif; ?>
                </div>
                <div class="featured-content">
                    <?php if ($category) : ?>
                    <span class="product-category font-cinzel"><?php echo strtoupper($category); ?></span>
                    <?php endif; ?>
                    <h3 class="product-title font-cormorant"><?php echo $product->post_title; ?></h3>
                    <a href="<?php echo get_permalink($product->ID); ?>" class="product-link">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </a>
                </div>
            </div>
            <?php
                endforeach;
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Gold Rates Section -->
<section class="gold-rates-section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">LIVE RATES</span>
            <h2 class="section-title font-cormorant">Today's Gold Rates</h2>
        </div>
        
        <?php echo do_shortcode('[gold_rates]'); ?>
        
        <div class="gold-offer">
            <h3 class="font-cormorant">Flat 9% Off Making Charges</h3>
            <p>On all 22KT Gold Jewellery</p>
        </div>
    </div>
</section>

<!-- Trust Section -->
<section class="trust-section">
    <div class="container">
        <div class="trust-grid">
            <div class="trust-item">
                <span class="trust-icon">✓</span>
                <h4 class="font-cormorant">Hallmark Certified</h4>
                <p>BIS Hallmark on all gold jewellery</p>
            </div>
            <div class="trust-item">
                <span class="trust-icon">♦</span>
                <h4 class="font-cormorant">Bridal Specialist</h4>
                <p>35+ years of bridal expertise</p>
            </div>
            <div class="trust-item">
                <span class="trust-icon">⬡</span>
                <h4 class="font-cormorant">Two Showrooms</h4>
                <p>Conveniently located in Jabalpur</p>
            </div>
            <div class="trust-item">
                <span class="trust-icon">◈</span>
                <h4 class="font-cormorant">WA Support</h4>
                <p>Instant WhatsApp assistance</p>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
