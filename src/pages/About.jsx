
import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { ShieldCheck, Truck, Headphones } from 'lucide-react'


const About = () => {
return (
<div className="px-4 md:px-16">


{/* ===== Header ===== */}
<div className="text-2xl text-center pt-10 border-t">
<Title text1={'ABOUT'} text2={'US'} />
<p className="mt-4 text-gray-500 max-w-2xl mx-auto">
We are passionate about delivering high‑quality products and a smooth shopping experience for everyone.
</p>
</div>


{/* ===== About Section ===== */}
<div className="my-16 flex flex-col md:flex-row items-center gap-14">
<img
className="w-full md:max-w-[420px] rounded-2xl shadow-md"
src={assets.about_img}
alt="About us"
/>


<div className="flex flex-col gap-6 md:w-2/4 text-gray-600 leading-relaxed">
<p>
Forever was born from a passion for innovation and a desire to redefine online shopping.
We focus on quality, simplicity, and customer satisfaction in everything we do.
</p>
<p>
Our products are carefully curated to meet modern lifestyles while keeping prices fair
and accessible for everyone.
</p>


<div className="bg-gray-50 border-l-4 border-black px-6 py-4 rounded-xl">
<b className="text-gray-800 block mb-1">Our Mission</b>
<p>
To create a trusted platform where customers can shop confidently,
knowing they receive value, quality, and excellent support.
</p>
</div>
</div>
</div>


{/* ===== Why Choose Us ===== */}
<div className="text-xl py-6 text-center">
<Title text1={'WHY'} text2={'CHOOSE US'} />
</div>


<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">


<div className="border rounded-2xl p-8 flex flex-col gap-4 hover:shadow-lg transition">
<ShieldCheck className="w-8 h-8" />
<b>Quality Assurance</b>
<p className="text-gray-600 text-sm">
Every product is carefully inspected to meet strict quality standards before reaching you.
</p>
</div>


<div className="border rounded-2xl p-8 flex flex-col gap-4 hover:shadow-lg transition">
<Truck className="w-8 h-8" />
<b>Fast & Convenient</b>
<p className="text-gray-600 text-sm">
Smooth ordering, quick delivery, and hassle‑free returns for a seamless experience.
</p>
</div>


<div className="border rounded-2xl p-8 flex flex-col gap-4 hover:shadow-lg transition">
<Headphones className="w-8 h-8" />
<b>Exceptional Support</b>
<p className="text-gray-600 text-sm">
Our support team is always ready to help you anytime you need assistance.
</p>
</div>


</div>


<NewsletterBox />
</div>
)
}


export default About