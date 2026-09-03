// backend/src/models/Blog.ts
import { query, isDatabaseConnected } from '../config/database';

export interface BlogPostEntity {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author: string;
  category: string;
  seo_title?: string;
  meta_description?: string;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export const mockBlogPosts: BlogPostEntity[] = [
  {
    id: 'post_001',
    title: 'How to Rig the Sony FX3 for Solo Run-and-Gun Cinema Commercials',
    slug: 'sony-fx3-solo-cinema-rig-guide',
    excerpt: 'Step-by-step masterclass on optimizing the FX3 with V-mount power distribution, wireless video transmitters, and custom S-Cinetone exposure profiles.',
    content: `## The Solo Filmmaker's Powerhouse\n\nThe Sony FX3 has fundamentally altered the indie and commercial filmmaking landscape. In this guide, we break down our exact rental rig configuration used by DP teams across Bengaluru, Chennai, and Coimbatore.\n\n### 1. Power Distribution: V-Mount vs Internal NP-FZ100\nWhile internal batteries give 90 minutes of 4K recording, adding an FXLION 98Wh Nano Two V-Mount battery via D-Tap to USB-C PD gives 6+ hours of uninterrupted rolling and powers your on-camera monitor simultaneously.\n\n### 2. Monitoring & Focus Pulling\nPairing the FX3 with the Atomos Shinobi 7 or Hollyland Mars 4K transmitter turns any smartphone or dedicated director monitor into an ultra-low latency wireless video feed.\n\n### 3. S-Log3 vs S-Cinetone Workflow\nFor quick turnaround corporate gigs, S-Cinetone delivers rich skin tones with zero grading turnaround. For maximum dynamic range (15+ stops), roll S-Log3 at Base ISO 800 or 12,800.`,
    featured_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&auto=format&fit=crop&q=80',
    author: 'Vikram Sundaram (Head of Camera Operations)',
    category: 'Cinematography & Lighting Guides',
    seo_title: 'Sony FX3 Cinema Rigging Guide | FlexGear Filmmaker Hub',
    meta_description: 'Discover how to build the ultimate Sony FX3 cinema camera rig for solo commercials, weddings, and documentary filmmaking.',
    published: true,
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'post_002',
    title: 'Top 5 Cinema Lenses Every Cinematographer Should Rent in 2026',
    slug: 'top-5-cinema-lenses-2026',
    excerpt: 'An optical comparison between full-frame cine primes, fast zooms, and modern anamorphic glass for digital sensors.',
    content: `## Choosing the Glass That Defines Your Look\n\nCamera sensors provide data, but lenses provide character, flare, micro-contrast, and texture. Here are the top 5 cine lens sets in our vault:\n\n1. **Sony FE 24-70mm f/2.8 GM II** — The versatile workhorse for dynamic gimbal shoots.\n2. **Canon RF 50mm f/1.2L USM** — Unreal shallow depth of field and creaminess.\n3. **Sigma Cine High-Speed Primes (T1.5)** — Razor sharp wide open with 95mm front diameters.\n4. **Atlas Orion Anamorphic Series** — 2x squeeze ratio with vintage streak flares.\n5. **Cooke SP3 Full Frame Primes** — Classic "Cooke Look" warm rendering on modern mirrorless mounts.`,
    featured_image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1200&auto=format&fit=crop&q=80',
    author: 'Aarav Nair (Technical Director)',
    category: 'Gear Reviews & Shoot Tests',
    seo_title: 'Top 5 Cinema Lenses to Rent in 2026 | FlexGear',
    meta_description: 'Compare the best cinema lenses for rental in South India. Explore Sony GM, Sigma Cine, and Cooke full frame primes.',
    published: true,
    published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: 'post_003',
    title: 'Lighting On Location: How to Master Aputure 600d Pro & Diffusers',
    slug: 'location-lighting-aputure-600d-guide',
    excerpt: 'Learn how to shape daylight, punch through soft silks, and simulate sunbeams through window frames with high-power COB LEDs.',
    content: `## Power and Control in High-End Commercials\n\nThe Aputure 600d Pro is the undisputed champion of mobile high-output daylight lighting. With 98,500 lux output, you can effortlessly match bright ambient daylight or create powerful key light sources.\n\n### Essential Modifiers\n- **Light Dome 150** for massive, soft beauty lighting.\n- **F10 Fresnel** for cutting long-throw beam angles through scrims.\n- **Sidus Link App** for instantaneous multi-light dimming from video village.`,
    featured_image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=1200&auto=format&fit=crop&q=80',
    author: 'Rhea Sharma (Gaffer & Lighting Designer)',
    category: 'Production & Lighting Setups',
    seo_title: 'Aputure 600d Pro Location Lighting Guide | FlexGear',
    meta_description: 'Master daylight matching, softbox diffusion, and Sidus Link wireless control on film sets with FlexGear.',
    published: true,
    published_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 12).toISOString(),
  },
];

export class BlogModel {
  static async getAll(): Promise<BlogPostEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<BlogPostEntity>('SELECT * FROM blog_posts WHERE published = TRUE ORDER BY published_at DESC');
      return res.rows;
    }
    return mockBlogPosts.filter((p) => p.published);
  }

  static async findBySlug(slug: string): Promise<BlogPostEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<BlogPostEntity>('SELECT * FROM blog_posts WHERE slug = $1', [slug]);
      return res.rows[0] || null;
    }
    return mockBlogPosts.find((p) => p.slug === slug) || null;
  }

  static async create(data: Partial<BlogPostEntity>): Promise<BlogPostEntity> {
    const newPost: BlogPostEntity = {
      id: data.id || `post_${Date.now()}`,
      title: data.title || 'Untitled Blog Post',
      slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : `post-${Date.now()}`),
      content: data.content || '',
      excerpt: data.excerpt || '',
      featured_image: data.featured_image || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200',
      author: data.author || 'FlexGear Editorial Team',
      category: data.category || 'Industry Insights',
      seo_title: data.seo_title || data.title,
      meta_description: data.meta_description || data.excerpt,
      published: data.published !== undefined ? data.published : true,
      published_at: data.published_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isDatabaseConnected()) {
      const res = await query<BlogPostEntity>(
        `INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author, category, seo_title, meta_description, published, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          newPost.title,
          newPost.slug,
          newPost.content,
          newPost.excerpt,
          newPost.featured_image,
          newPost.author,
          newPost.category,
          newPost.seo_title,
          newPost.meta_description,
          newPost.published,
          newPost.published_at,
        ]
      );
      return res.rows[0];
    }
    mockBlogPosts.unshift(newPost);
    return newPost;
  }
}
