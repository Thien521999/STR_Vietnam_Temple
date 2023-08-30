import { Dropzone } from './components/Dropzone';
import { Seo } from './components/Seo';

export default function Home() {
  const dataSeo = {
    meta_title: 'STR VietNam Temple',
    meta_description: 'Description',
    og_type: 'website',
    og_title: process.env.NEXT_PUBLIC_HOST_URL || 'https://str-vietnam-temple.vercel.app/',
    og_description: 'Description',
    og_image: 'https://res.cloudinary.com/dmj3asaf3/image/upload/v1648962369/cld-sample.jpg',
    // og_site_name: '',
    twitter_card: 'summary_large_image',
    twitter_title: 'STR VietNam Temple',
    twitter_description: 'Description',
    twitter_image: 'https://res.cloudinary.com/dmj3asaf3/image/upload/v1648962369/cld-sample.jpg',
    // twitter_site: '',
  };
  return (
    <>
      <Seo data={dataSeo} />
      <section className="py-24">
        <div className="container">
          <h1 className="text-3xl font-bold">STR Vietnam Temple</h1>
          <Dropzone className="mt-10 border border-neutral-200 p-16" />
        </div>
      </section>
    </>
  );
}
