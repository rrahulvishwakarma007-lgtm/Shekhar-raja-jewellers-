<?php
/**
 * Single Product Template
 * 
 * @package Shekhar_Raja_Jewellers
 */

get_header();

while (have_posts()) : the_post();
    $categories = get_the_terms(get_the_ID(), 'product_category');
    $category_name = $categories ? $categories[0]->name : 'Jewellery';
    $tag = get_post_meta(get_the_ID(), 'product_tag', true) ?: 'Premium';
    $price = get_post_meta(get_the_ID(), 'price', true);
?>

<!-- Product Detail -->
<section class="product-detail">
    <div class="container">
        <div class="product-grid">
            <!-- Product Image -->
            <div class="product-image-section">
                <div class="main-image">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('full'); ?>
                    <?php endif; ?>
                    <span class="product-tag"><?php echo esc_html($tag); ?></span>
                </div>
            </div>
            
            <!-- Product Info -->
            <div class="product-info-section">
                <span class="product-category"><?php echo esc_html($category_name); ?></span>
                <h1 class="product-title"><?php the_title(); ?></h1>
                <div class="title-line"></div>
                <div class="product-description">
                    <?php the_content(); ?>
                </div>
                
                <!-- Trust Badges -->
                <div class="trust-badges">
                    <div class="badge">
                        <span class="badge-icon">Shield</span>
                        <div>
                            <span class="badge-label">Certified</span>
                            <span class="badge-value">BIS Hallmark</span>
                        </div>
                    </div>
                    <div class="badge">
                        <span class="badge-icon">Award</span>
                        <div>
                            <span class="badge-label">Guaranteed</span>
                            <span class="badge-value">Pure Gold</span>
                        </div>
                    </div>
                </div>
                
                <?php if ($price) : ?>
                <div class="product-price">
                    <span class="price-label">Starting from</span>
                    <span class="price-value"><?php echo esc_html($price); ?></span>
                </div>
                <?php endif; ?>
                
                <!-- WhatsApp Button -->
                <a href="<?php echo esc_url(srj_whatsapp_link("Hello! I'm interested in " . get_the_title() . " (" . $category_name . "). Please share more details.")); ?>" target="_blank" class="whatsapp-btn-large">
                    <span class="btn-icon">MessageCircle</span>
                    <span>Enquire on WhatsApp</span>
                </a>
                <p class="helper-text">Sparkles Get personalized assistance & best prices</p>
            </div>
        </div>
    </div>
</section>

<!-- Related Products -->
<section class="related-products">
    <div class="container">
        <h2 class="section-title">You May Also Like</h2>
        <div class="products-grid">
            <?php
            $related = new WP_Query(array(
                'post_type'      => 'products',
                'posts_per_page' => 4,
                'post__not_in'   => array(get_the_ID()),
                'tax_query'      => array(
                    array(
                        'taxonomy' => 'product_category',
                        'field'    => 'slug',
                        'terms'    => $categories ? $categories[0]->slug : array(),
                    ),
                ),
            ));
            
            if ($related->have_posts()) :
                while ($related->have_posts()) : $related->the_post();
            ?>
            <div class="product-card">
                <div class="product-image">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('medium'); ?>
                    <?php endif; ?>
                </div>
                <div class="product-content">
                    <h3 class="product-title"><?php the_title(); ?></h3>
                    <a href="<?php the_permalink(); ?>" class="card-link">View Details</a>
                </div>
            </div>
            <?php
                endwhile;
                wp_reset_postdata();
            endif;
            ?>
        </div>
    </div>
</section>

<?php endwhile; ?>

<?php get_footer(); ?>
