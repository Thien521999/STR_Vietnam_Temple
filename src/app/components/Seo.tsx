// libs
import Head from 'next/head';
// models
import { seoTag } from '@/models/home';

export interface ISeoProps {
  data: seoTag | undefined;
}

export const Seo = ({ data }: ISeoProps) => {
  return (
    <Head>
      <title>{data?.meta_title}</title>
      <meta name="title" content={data?.meta_title} />
      <meta name="description" content={data?.meta_description} />

      <meta property="og:type" content={data && data['og_type']} />
      <meta property="og:title" content={data && data['og_title']} />
      <meta property="og:description" content={data && data['og_description']} />
      <meta property="og:image" content={data && data['og_image']} />
      {/* <meta property="og:site_name" content={data && data['og_site_name']} /> */}
      <meta property="og:image" content="https://metatags.io/images/meta-tags.png" />

      <meta property="twitter:card" content={data && data['twitter_card']} />
      <meta property="twitter:title" content={data && data['twitter_title']} />
      <meta property="twitter:description" content={data && data['twitter_description']} />
      <meta property="twitter:image" content={data && data['twitter_image']} />
      {/* <meta property="twitter:site" content={data && data['twitter_site']} /> */}
      <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
    </Head>
  );
};
