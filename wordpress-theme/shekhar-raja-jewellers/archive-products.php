<?php
/**
 * Products Archive Template
 * 
 * @package Shekhar_Raja_Jewellers
 */

get_header();
?>

<!-- Page Header -->
<section class="page-header">
    <div class="container">
        <nav class="breadcrumb">
            <a href="<?php echo esc_url(home_url('/')); ?>">Home</a>
            <span>/</span>
            <span>Collections</span>
        </nav>
        <div class="header-decoration">
            <span class="deco-line"></span>
            <span class="deco-icon">Sparkles</span>
            <span class="deco-line"></span>
        </div>
        <h1 class="page-title">Our Collections</h1>
        <p class="page-subtitle">Discover masterpieces crafted with passion, where every piece tells a story of heritage and elegance</p>
        
        <!-- Stats -->
        <div class="page-stats">
            <div class="stat-item">
                <span class="stat-number">500+</span>
                <span class="stat-label">DESIGNS</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-number">22KT</span>
                <span class="stat-label">GOLD</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
                <span class="stat-number">BIS</span>
                <span class="stat-label">HALLMARK</span>
            </div>
        </div>
    </div>
</section>

<!-- Filter Tabs -->
<section class="filter-section">
    <div class="container">
        <div class="filter-tabs">
            <button class="filter-tab active" data-filter="all">All</button>
            <?php
            $categories = get_terms(array(
                'taxonomy'   => 'product_category',
                'hide_empty' => true,
            ));
            
            foreach ($categories as $cat) :
            ?>
            <button class="filter-tab" data-filter="<?php echo esc_attr($cat->slug); ?>">
                <?php echo esc_html($cat->name); ?>
            </button>
            <?php endforeach; ?>
        </div>
        <p class="results-count"><span class="count">0</span> pieces found</p>
    </div>
</section>

<!-- Products Grid -->
<section class="products-archive">
    <div class="container">
        <div class="products-grid">
            <?php if (have_posts()) : ?>
                <?php while (have_posts()) : the_post(); 
                    $categories = get_the_terms(get_the_ID(), 'product_category');
                    $category_name = $categories ? $categories[0]->name : 'Jewellery';
                    $category_slug = $categories ? $categories[0]->slug : 'jewellery';
                    $tag = get_post_meta(get_the_ID(), 'product_tag', true) ?: 'Premium';
                    $featured = get_post_meta(get_the_ID(), 'featured', true);
                ?>
                <div class="product-card" data-category="<?php echo esc_attr($category_slug); ?>">
                    <div class="product-image">
                        <?php if (has_post_thumbnail()) : ?>
                            <?php the_post_thumbnail('large'); ?>
                        <?php endif; ?>
                        <div class="product-overlay"></div>
                        <?php if ($featured) : ?>
                        <span class="featured-badge">★ FEATURED</span>
                        <?php endif; ?>
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
                <?php endwhile; ?>
            <?php else : ?>
                <p class="no-products">No products found.</p>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="container">
        <span class="cta-icon">Sparkles</span>
        <h2 class="cta-title">Can't Find What You're Looking For?</h2>
        <p class="cta-subtitle">We offer custom jewellery design services. Let us create your dream piece.</p>
        <a href="<?php echo esc_url(srj_whatsapp_link('Hello! I would like to enquire about custom jewellery design.')); ?>" target="_blank" class="btn-primary">
            Enquire Now ArrowRight
        </a>
    </div>
</section>

<?php
get_footer();
