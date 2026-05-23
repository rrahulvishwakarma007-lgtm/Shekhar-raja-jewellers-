<?php
/**
 * Products Archive Template
 */
get_header();
?>

<section class="collections-hero" style="background: linear-gradient(135deg, #1a0f05, #2a1a0a); padding: 120px 0 60px; text-align: center;">
    <div class="container">
        <h1 class="page-title font-cormorant" style="color: white; font-size: 48px;">Our Collections</h1>
        <p style="color: rgba(255,255,255,0.7); margin-top: 16px;">Discover masterpieces crafted with passion</p>
    </div>
</section>

<section class="products-section" style="padding: 60px 0; background: #faf7f2;">
    <div class="container">
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
            <?php
            if (have_posts()) :
                while (have_posts()) : the_post();
                    $image = get_the_post_thumbnail_url(get_the_ID(), 'large');
                    $terms = get_the_terms(get_the_ID(), 'product_category');
                    $category = $terms ? $terms[0]->name : '';
            ?>
            <article style="background: white; border-radius: 16px; overflow: hidden;">
                <div style="height: 280px; overflow: hidden;">
                    <img src="<?php echo $image; ?>" alt="<?php the_title(); ?>" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="padding: 20px;">
                    <?php if ($category) : ?>
                    <span style="font-family: 'Cinzel', serif; font-size: 11px; letter-spacing: 0.15em; color: #b8862a; text-transform: uppercase;"><?php echo $category; ?></span>
                    <?php endif; ?>
                    <h3 style="font-family: 'Cormorant Garamond', serif; font-size: 20px; margin: 8px 0;"><?php the_title(); ?></h3>
                    <a href="<?php the_permalink(); ?>" style="color: #b8862a; font-size: 14px;">View Details →</a>
                </div>
            </article>
            <?php
                endwhile;
            endif;
            ?>
        </div>
    </div>
</section>

<?php get_footer(); ?>
