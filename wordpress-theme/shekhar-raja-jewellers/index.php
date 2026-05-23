<?php
/**
 * Homepage Template
 * 
 * @package Shekhar_Raja_Jewellers
 */

get_header();
?>

<!-- Hero Slider -->
<section class="hero-slider">
    <div class="slider-container">
        <?php
        $hero_slides = array(
            array(
                'image' => SRJ_THEME_URI . '/assets/images/hero-1.jpg',
                'eyebrow' => 'Exquisite Collection',
                'title' => 'Diamond',
                'title_accent' => 'Rings',
                'subtitle' => 'Celebrate your eternal bond with our handcrafted diamond masterpieces',
                'tagline' => 'Where brilliance meets eternity',
            ),
            array(
                'image' => SRJ_THEME_URI . '/assets/images/hero-2.jpg',
                'eyebrow' => 'Bridal Heritage',
                'title' => 'Bridal',
                'title_accent' => 'Necklaces',
                'subtitle' => 'Make your special day unforgettable with our exquisite bridal collections',
                'tagline' => 'For your most precious moments',
            ),
            array(
                'image' => SRJ_THEME_URI . '/assets/images/hero-3.jpg',
                'eyebrow' => 'Timeless Beauty',
                'title' => 'Gold',
                'title_accent' => 'Earrings',
                'subtitle' => 'Elegant designs that complement every occasion with timeless grace',
                'tagline' => 'Elegance in every detail',
            ),
            array(
                'image' => SRJ_THEME_URI . '/assets/images/hero-4.jpg',
                'eyebrow' => 'Traditional Art',
                'title' => 'Gold',
                'title_accent' => 'Bangles',
                'subtitle' => 'Traditional craftsmanship meets contemporary design excellence',
                'tagline' => 'Heritage reimagined',
            ),
        );
        
        foreach ($hero_slides as $index => $slide) :
        ?>
        <div class="slide <?php echo $index === 0 ? 'active' : ''; ?>" data-index="<?php echo $index; ?>">
            <div class="slide-overlay"></div>
            <img src="<?php echo esc_url($slide['image']); ?>" alt="<?php echo esc_attr($slide['title']); ?>" class="slide-image">
            <div class="slide-content">
                <span class="slide-eyebrow"><?php echo esc_html($slide['eyebrow']); ?></span>
                <h1 class="slide-title">
                    <?php echo esc_html($slide['title']); ?>
                    <span class="title-accent"><?php echo esc_html($slide['title_accent']); ?></span>
                </h1>
                <div class="title-line"></div>
                <p class="slide-subtitle"><?php echo esc_html($slide['subtitle']); ?></p>
                <p class="slide-tagline">"<?php echo esc_html($slide['tagline']); ?>"</p>
                <div class="slide-cta">
                    <a href="<?php echo esc_url(home_url('/products/')); ?>" class="btn-primary">Explore Collection</a>
                    <a href="<?php echo esc_url(srj_whatsapp_link()); ?>" target="_blank" class="btn-secondary">Enquire Now</a>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
        
        <!-- Slider Navigation -->
        <button class="slider-arrow prev" aria-label="Previous Slide">ChevronLeft</button>
        <button class="slider-arrow next" aria-label="Next Slide">ChevronRight</button>
        
        <!-- Slider Indicators -->
        <div class="slider-indicators">
            <?php foreach ($hero_slides as $index => $slide) : ?>
            <button class="indicator <?php echo $index === 0 ? 'active' : ''; ?>" data-index="<?php echo $index; ?>">
                <span class="indicator-bar"></span>
                <span class="indicator-number"><?php echo str_pad($index + 1, 2, '0', STR_PAD_LEFT); ?></span>
            </button>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Categories Section -->
<section class="categories-section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">Diamond EXPLORE</span>
            <h2 class="section-title">Shop by Category</h2>
            <p class="section-subtitle">Discover our curated collections, each piece a masterpiece of craftsmanship</p>
        </div>
        
        <div class="categories-grid">
            <?php
            $categories = array(
                'Bridal', 'Festive', 'Dailywear', 'Necklaces',
                'Earrings', 'Bangles', 'Rings', 'Pendants',
                'Diamond', 'Chains', 'Antique', 'Temple'
            );
            
            foreach ($categories as $index => $cat) :
                $term = get_term_by('name', $cat, 'product_category');
                $image = SRJ_THEME_URI . '/assets/images/cat-' . strtolower(str_replace(' ', '-', $cat)) . '.jpg';
            ?>
            <div class="category-item" style="animation-delay: <?php echo $index * 0.08; ?>s">
                <div class="category-circle">
                    <img src="<?php echo esc_url($image); ?>" alt="<?php echo esc_attr($cat); ?>">
                    <div class="category-shine"></div>
                </div>
                <span class="category-name"><?php echo esc_html($cat); ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Featured Collections -->
<section class="featured-section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">Crown FEATURED</span>
            <h2 class="section-title">Featured Collections</h2>
            <p class="section-subtitle">Handpicked masterpieces that define luxury and elegance</p>
        </div>
        
        <div class="featured-grid">
            <?php
            $featured_products = new WP_Query(array(
                'post_type'      => 'products',
                'posts_per_page' => 3,
                'meta_key'       => 'featured',
                'meta_value'     => '1',
            ));
            
            if ($featured_products->have_posts()) :
                $index = 0;
                while ($featured_products->have_posts()) : $featured_products->the_post();
                    $categories = get_the_terms(get_the_ID(), 'product_category');
                    $category_name = $categories ? $categories[0]->name : 'Jewellery';
            ?>
            <div class="featured-card <?php echo $index === 0 ? 'featured-large' : ''; ?>">
                <div class="card-image">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('large'); ?>
                    <?php endif; ?>
                    <div class="card-shimmer"></div>
                    <?php if ($index === 0) : ?>
                    <span class="featured-badge">★ FEATURED</span>
                    <?php endif; ?>
                </div>
                <div class="card-content">
                    <span class="card-category"><?php echo esc_html($category_name); ?></span>
                    <h3 class="card-title"><?php the_title(); ?></h3>
                    <a href="<?php the_permalink(); ?>" class="card-link">View Details ArrowRight</a>
                </div>
            </div>
            <?php
                $index++;
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</section>

<!-- Products Catalogue -->
<section class="products-section">
    <div class="container">
        <div class="section-header">
            <span class="section-eyebrow">Diamond EXQUISITE CRAFTSMANSHIP</span>
            <h2 class="section-title">Our Collection</h2>
            <p class="section-subtitle">Each piece tells a story of heritage, crafted with passion and precision</p>
        </div>
        
        <div class="products-grid">
            <?php
            $products = new WP_Query(array(
                'post_type'      => 'products',
                'posts_per_page' => 8,
            ));
            
            if ($products->have_posts()) :
                while ($products->have_posts()) : $products->the_post();
                    $categories = get_the_terms(get_the_ID(), 'product_category');
                    $category_name = $categories ? $categories[0]->name : 'Jewellery';
                    $tag = get_post_meta(get_the_ID(), 'product_tag', true) ?: 'Premium';
            ?>
            <div class="product-card">
                <div class="product-image">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('medium_large'); ?>
                    <?php endif; ?>
                    <div class="product-overlay"></div>
                    <span class="product-tag"><?php echo esc_html($tag); ?></span>
                    <div class="product-quick-view">View Details ArrowRight</div>
                </div>
                <div class="product-content">
                    <span class="product-category"><?php echo esc_html($category_name); ?></span>
                    <h3 class="product-title"><?php the_title(); ?></h3>
                    <p class="product-excerpt"><?php echo wp_trim_words(get_the_excerpt(), 15); ?></p>
                    <div class="product-line"></div>
                </div>
            </div>
            <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
        
        <div class="products-cta">
            <a href="<?php echo esc_url(home_url('/products/')); ?>" class="btn-primary">View All Collection ArrowRight</a>
        </div>
    </div>
</section>

<!-- Trust Strip -->
<section class="trust-section">
    <div class="container">
        <div class="trust-grid">
            <div class="trust-item">
                <div class="trust-icon">Check</div>
                <h3 class="trust-title">Hallmark Certified</h3>
                <p class="trust-desc">BIS Hallmark on all gold jewellery</p>
            </div>
            <div class="trust-item">
                <div class="trust-icon">Diamond</div>
                <h3 class="trust-title">Bridal Specialist</h3>
                <p class="trust-desc">35+ years of bridal expertise</p>
            </div>
            <div class="trust-item">
                <div class="trust-icon">Hexagon</div>
                <h3 class="trust-title">Two Showrooms</h3>
                <p class="trust-desc">Conveniently located in Jabalpur</p>
            </div>
            <div class="trust-item">
                <div class="trust-icon">MessageCircle</div>
                <h3 class="trust-title">WA Support</h3>
                <p class="trust-desc">Instant WhatsApp assistance</p>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
