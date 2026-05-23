<?php
/**
 * Single Product Template
 */
get_header();

while (have_posts()) : the_post();
    $image = get_the_post_thumbnail_url(get_the_ID(), 'full');
    $terms = get_the_terms(get_the_ID(), 'product_category');
    $category = $terms ? $terms[0]->name : '';
?>

<section style="padding: 120px 0 60px; background: #faf7f2;">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
            <div>
                <img src="<?php echo $image; ?>" alt="<?php the_title(); ?>" style="width: 100%; border-radius: 20px;">
            </div>
            <div>
                <?php if ($category) : ?>
                <span style="font-family: 'Cinzel', serif; font-size: 12px; letter-spacing: 0.2em; color: #b8862a; text-transform: uppercase;"><?php echo $category; ?></span>
                <?php endif; ?>
                <h1 style="font-family: 'Cormorant Garamond', serif; font-size: 42px; color: #3a2e1e; margin: 16px 0;"><?php the_title(); ?></h1>
                <div style="color: #9a8060; line-height: 1.8;"><?php the_content(); ?></div>
                
                <div style="margin-top: 32px; padding: 24px 0; border-top: 1px solid rgba(184,134,42,0.2); border-bottom: 1px solid rgba(184,134,42,0.2); display: flex; gap: 24px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #b8862a;">✓</span>
                        <span>BIS Hallmark</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #b8862a;">✓</span>
                        <span>100% Authentic</span>
                    </div>
                </div>
                
                <a href="<?php echo srj_get_whatsapp_link('Hello! I\'m interested in ' . get_the_title() . '. Please share details.'); ?>" target="_blank" class="btn btn-whatsapp" style="margin-top: 32px; display: inline-flex;">
                    Enquire on WhatsApp
                </a>
            </div>
        </div>
    </div>
</section>

<?php
endwhile;
get_footer();
?>
